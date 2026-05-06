const MonthlyPlan = require('../../models/MonthlyPlan');
const Lead = require('../../models/Lead');
const User = require('../../models/User');

const calculateAchievements = async (userId, month, year) => {
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    // Leads created or assigned to user in this period (excluding deleted)
    const leadsCount = await Lead.countDocuments({
        $or: [
            { leadOwner: userId },
            { assignedTo: userId }
        ],
        isDeleted: { $ne: true },
        createdAt: { $gte: startDate, $lte: endDate }
    });

    // Converted (Won) by user in this period
    // We use the last update to 'Won' within this period as the conversion trigger
    const wonLeads = await Lead.find({
        $or: [
            { leadOwner: userId },
            { assignedTo: userId }
        ],
        status: 'Won',
        isDeleted: { $ne: true },
        updatedAt: { $gte: startDate, $lte: endDate }
    });

    const conversionsCount = wonLeads.length;
    const revenueSum = wonLeads.reduce((sum, l) => sum + (l.finalClosedValue || l.dealValue || 0), 0);

    return {
        leads: leadsCount,
        conversions: conversionsCount,
        revenue: revenueSum
    };
};

// @desc    Upsert a monthly plan (Admin only)
// @route   POST /api/performance/plans
exports.upsertPlan = async (req, res) => {
    try {
        const { userId, month, year, targets } = req.body;
        
        const plan = await MonthlyPlan.findOneAndUpdate(
            { user: userId, month, year },
            { targets },
            { new: true, upsert: true }
        );

        res.status(200).json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get performance stats for a user
// @route   GET /api/performance/stats
exports.getPerformanceStats = async (req, res) => {
    try {
        const { month, year } = req.query;
        const userId = req.query.userId || req.user._id;

        // Security: Non-admins can only see their own stats
        if (req.user.role !== 'admin' && userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to performance data.' });
        }

        const plan = await MonthlyPlan.findOne({ user: userId, month, year });
        const achievements = await calculateAchievements(userId, month, year);

        res.json({
            plan: plan || { targets: { leads: 0, conversions: 0, revenue: 0 } },
            achievements
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get consolidated team performance (Admin only)
// @route   GET /api/performance/team
exports.getTeamPerformance = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        // 1. Get all Marketing users + Admins
        const users = await User.find({ 
            $or: [
                { department: 'Marketing & Sales' },
                { role: 'admin' }
            ],
            isActive: true 
        }).select('email employeeRef role');

        const teamStats = await Promise.all(users.map(async (user) => {
            const plan = await MonthlyPlan.findOne({ user: user._id, month, year });
            const achievements = await calculateAchievements(user._id, month, year);
            return {
                user,
                plan: plan || { targets: { leads: 0, conversions: 0, revenue: 0 } },
                achievements
            };
        }));

        // 2. Calculate global totals for the month (regardless of assignment)
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        const globalLeadsCount = await Lead.countDocuments({
            isDeleted: { $ne: true },
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const globalWonLeads = await Lead.find({
            status: 'Won',
            isDeleted: { $ne: true },
            updatedAt: { $gte: startDate, $lte: endDate }
        });

        const globalConversionsCount = globalWonLeads.length;
        const globalRevenueSum = globalWonLeads.reduce((sum, l) => sum + (l.finalClosedValue || l.dealValue || 0), 0);

        // 3. Calculate target totals
        const targetTotals = teamStats.reduce((acc, curr) => {
            acc.leads += curr.plan.targets.leads;
            acc.conversions += curr.plan.targets.conversions;
            acc.revenue += curr.plan.targets.revenue;
            return acc;
        }, { leads: 0, conversions: 0, revenue: 0 });

        res.json({ 
            totals: {
                targets: targetTotals,
                achievements: {
                    leads: globalLeadsCount,
                    conversions: globalConversionsCount,
                    revenue: globalRevenueSum
                }
            }, 
            individual: teamStats 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get monthly lead funnel report
// @route   GET /api/performance/funnel-report
exports.getFunnelReport = async (req, res) => {
    try {
        const { month, year } = req.query;
        const userId = req.query.userId || req.user._id;

        // Security: Non-admins can only see their own report
        if (req.user.role !== 'admin' && userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized access to funnel report.' });
        }

        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        // Fetch cohort: Leads created in this period
        const leads = await Lead.find({
            $or: [
                { leadOwner: userId },
                { assignedTo: userId }
            ],
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: -1 });

        // Define Funnel Hierarchy
        const funnelOrder = {
            'New Lead': 1,
            'Contacted': 2,
            'Qualification': 3,
            'Proposal Sent': 4,
            'Negotiation': 4,
            'Won': 5,
            'Lost': 5
        };

        const funnelStages = [
            { id: 'new', label: 'New Leads', minLevel: 1 },
            { id: 'contacted', label: 'Contacted', minLevel: 2 },
            { id: 'qualified', label: 'Qualified', minLevel: 3 },
            { id: 'proposal', label: 'Proposals', minLevel: 4 },
            { id: 'won', label: 'Won', minLevel: 5, targetStatus: 'Won' }
        ];

        // Calculate counts for each funnel stage
        const funnelData = funnelStages.map(stage => {
            const count = leads.filter(l => {
                const level = funnelOrder[l.status] || 1;
                if (stage.id === 'won') return l.status === 'Won';
                return level >= stage.minLevel;
            }).length;
            return { ...stage, count };
        });

        // Add 'Lost' as a separate metric
        const lostCount = leads.filter(l => l.status === 'Lost').length;

        // Calculate Conversion Rates
        const stats = {
            leadToContacted: funnelData[0].count > 0 ? (funnelData[1].count / funnelData[0].count) * 100 : 0,
            contactedToQualified: funnelData[1].count > 0 ? (funnelData[2].count / funnelData[1].count) * 100 : 0,
            qualifiedToWon: funnelData[2].count > 0 ? (funnelData[4].count / funnelData[2].count) * 100 : 0,
            overallConversion: funnelData[0].count > 0 ? (funnelData[4].count / funnelData[0].count) * 100 : 0
        };

        res.json({
            funnel: funnelData,
            lostCount,
            stats,
            leads // For drill-down table
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get detailed activity and task logs for a user (Admin only)
// @route   GET /api/performance/user-details
exports.getUserPerformanceDetails = async (req, res) => {
    try {
        const { userId, month, year } = req.query;
        
        if (req.user.role !== 'admin' && userId !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        const Activity = require('../../models/Activity');
        const Task = require('../../models/Task');

        // Fetch activities by this user
        const activities = await Activity.find({
            performedBy: userId,
            createdAt: { $gte: startDate, $lte: endDate }
        })
        .populate('leadId', 'companyName')
        .sort('-createdAt')
        .limit(50);

        // Fetch tasks assigned to this user
        const tasks = await Task.find({
            assignedTo: userId,
            createdAt: { $gte: startDate, $lte: endDate }
        })
        .populate('leadId', 'companyName')
        .sort('-createdAt');

        res.json({
            activities,
            tasks,
            activityCount: activities.length,
            taskCount: tasks.length,
            completedTasks: tasks.filter(t => t.status === 'Completed').length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
