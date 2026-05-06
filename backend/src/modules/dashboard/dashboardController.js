const User = require('../../models/User');
const Enquiry = require('../../models/Enquiry');
const Application = require('../../models/Application');
const Employee = require('../../models/Employee');
const Blog = require('../../models/Blog');
const Lead = require('../../models/Lead');
const Activity = require('../../models/Activity');
const LeaveRequest = require('../hr/leaveRequestModel');
const { getHierarchyUserIds } = require('../../utils/hierarchy');

// @desc    Get custom dashboard stats based on role & permissions
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const user = req.user;
        const role = user.role;
        const permissions = user.permissions || {};

        let ownershipFilter = {};

        // Determine ownership filter
        if (role === 'admin') {
            // Admin sees all
            ownershipFilter = {};
        } else if (role === 'manager') {
            // Manager sees own + reportees
            const teamIds = await getHierarchyUserIds(user._id);
            ownershipFilter = {
                $or: [
                    { assignedTo: user._id },
                    { assignedTo: { $in: teamIds } }
                ]
            };
        } else {
            // Specialist/Employee sees only own
            ownershipFilter = { assignedTo: user._id };
        }

        const stats = {
            widgets: []
        };

        // Enquiries (Leads)
        if (role === 'admin' || permissions?.leads?.view) {
            const filter = role === 'admin' ? {} : ownershipFilter;
            const totalLeads = await Enquiry.countDocuments(filter);
            const newLeads = await Enquiry.countDocuments({ ...filter, status: 'new' });
            
            stats.widgets.push({
                id: 'leads',
                title: 'Enquiries Pipeline',
                type: 'stat-cards',
                data: [
                    { label: 'Total Enquiries', value: totalLeads },
                    { label: 'New Enquiries', value: newLeads }
                ]
            });
        }

        // Applications (Candidate Pipeline)
        if (role === 'admin' || permissions?.onboarding?.view) {
            const filter = role === 'admin' ? {} : ownershipFilter;
            const totalApps = await Application.countDocuments(filter);
            const pendingApps = await Application.countDocuments({ ...filter, status: 'Applied' });

            stats.widgets.push({
                id: 'applications',
                title: 'Candidate Pipeline',
                type: 'stat-cards',
                data: [
                    { label: 'Total Applications', value: totalApps },
                    { label: 'Pending Review', value: pendingApps }
                ]
            });
        }

        // Employees
        if (role === 'admin' || permissions?.employees?.view) {
            // Employees are generally global visibility if permitted
            const totalEmployees = await Employee.countDocuments();
            
            stats.widgets.push({
                id: 'employees',
                title: 'Employees',
                type: 'stat-cards',
                data: [
                    { label: 'Total Headcount', value: totalEmployees }
                ]
            });
        }

        // Blogs
        if (role === 'admin' || permissions?.settings?.view) {
            const totalBlogs = await Blog.countDocuments();
            stats.widgets.push({
                id: 'blogs',
                title: 'Content Resources',
                type: 'stat-cards',
                data: [
                    { label: 'Published Blogs', value: totalBlogs }
                ]
            });
        }

        // Dashboard specific quick stats
        if (role === 'manager') {
            const teamIds = await getHierarchyUserIds(user._id);
            stats.widgets.push({
                id: 'team-overview',
                title: 'Team Overview',
                type: 'stat-cards',
                data: [
                    { label: 'Direct/Indirect Reportees', value: teamIds.length }
                ]
            });
        }

        // Performance (Monthly Plan vs Achievement) for Marketing team
        if (user.department === 'Marketing & Sales') {
            const MonthlyPlan = require('../../models/MonthlyPlan');
            const Lead = require('../../models/Lead');
            const now = new Date();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const year = now.getFullYear().toString();

            const plan = await MonthlyPlan.findOne({ user: user._id, month, year });
            
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

            // Calculate Funnel Data for this month's cohort
            const cohortLeads = await Lead.find({
                $or: [{ leadOwner: user._id }, { assignedTo: user._id }],
                createdAt: { $gte: startDate, $lte: endDate }
            });

            const funnelOrder = {
                'New Lead': 1, 'Contacted': 2, 'Qualification': 3, 
                'Proposal Sent': 4, 'Negotiation': 4, 'Won': 5, 'Lost': 5
            };

            const funnelStages = [
                { id: 'new', label: 'New Leads', minLevel: 1 },
                { id: 'contacted', label: 'Contacted', minLevel: 2 },
                { id: 'qualified', label: 'Qualified', minLevel: 3 },
                { id: 'proposal', label: 'Proposals', minLevel: 4 },
                { id: 'won', label: 'Won', minLevel: 5 }
            ];

            const funnel = funnelStages.map(stage => {
                const count = cohortLeads.filter(l => {
                    const level = funnelOrder[l.status] || 1;
                    if (stage.id === 'won') return l.status === 'Won';
                    return level >= stage.minLevel;
                }).length;
                return { ...stage, count };
            });

            const leadsCount = cohortLeads.length;
            const wonLeads = cohortLeads.filter(l => l.status === 'Won');
            const lostCount = cohortLeads.filter(l => l.status === 'Lost').length;

            stats.performance = {
                monthName: now.toLocaleString('default', { month: 'long' }),
                year,
                targets: plan?.targets || { leads: 0, conversions: 0, revenue: 0 },
                achievements: {
                    leads: leadsCount,
                    conversions: wonLeads.length,
                    revenue: wonLeads.reduce((sum, l) => sum + (l.finalClosedValue || l.dealValue || 0), 0)
                },
                funnel,
                lostCount,
                stats: {
                    leadToContacted: funnel[0].count > 0 ? (funnel[1].count / funnel[0].count) * 100 : 0,
                    contactedToQualified: funnel[1].count > 0 ? (funnel[2].count / funnel[1].count) * 100 : 0,
                    qualifiedToWon: funnel[2].count > 0 ? (funnel[4].count / funnel[2].count) * 100 : 0,
                    overallConversion: funnel[0].count > 0 ? (funnel[4].count / funnel[0].count) * 100 : 0
                },
                leads: cohortLeads
            };
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get operational summary (Admin/HR focus)
// @route   GET /api/dashboard/summary
exports.getOperationalSummary = async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // 1. Core Metrics
        const totalEmployees = await User.countDocuments({ role: { $ne: 'admin' }, isActive: true });
        const totalLeads = await Lead.countDocuments({ isDeleted: { $ne: true } });
        const openLeads = await Lead.countDocuments({ 
            isDeleted: { $ne: true }, 
            status: { $nin: ['Won', 'Lost'] } 
        });

        // 2. HR Metrics
        const leavesAppliedToday = await LeaveRequest.countDocuments({
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });
        const pendingLeaveApprovals = await LeaveRequest.countDocuments({ status: 'Pending' });
        const employeesOnLeaveToday = await LeaveRequest.countDocuments({
            status: 'Approved',
            fromDate: { $lte: todayEnd },
            toDate: { $gte: todayStart }
        });

        res.json({
            core: {
                totalEmployees,
                totalLeads,
                openLeads
            },
            hr: {
                leavesAppliedToday,
                pendingLeaveApprovals,
                employeesOnLeaveToday
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
exports.getRecentActivities = async (req, res) => {
    try {
        const crmActivities = await Activity.find()
            .populate('leadId', 'companyName leadId')
            .populate('performedBy', 'email')
            .sort('-createdAt')
            .limit(10);

        const hrActivities = await LeaveRequest.find()
            .populate('userId', 'email')
            .sort('-createdAt')
            .limit(10);

        // Merge and sort
        const merged = [
            ...crmActivities.map(a => ({
                id: a._id,
                type: 'CRM',
                title: a.type,
                description: `${a.performedBy?.email || 'System'} ${a.notes} for ${a.leadId?.companyName || 'Lead'}`,
                timestamp: a.createdAt
            })),
            ...hrActivities.map(a => ({
                id: a._id,
                type: 'HR',
                title: 'Leave Request',
                description: `${a.userId?.email || 'Employee'} applied for ${a.leaveType}`,
                status: a.status,
                timestamp: a.createdAt
            }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 15);

        res.json(merged);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get critical alerts
// @route   GET /api/dashboard/alerts
exports.getPendingAlerts = async (req, res) => {
    try {
        const unassignedLeads = await Lead.countDocuments({ assignedTo: null, isDeleted: { $ne: true } });
        const pendingLeaves = await LeaveRequest.countDocuments({ status: 'Pending' });

        const alerts = [];
        if (unassignedLeads > 0) {
            alerts.push({
                type: 'warning',
                message: `${unassignedLeads} leads are currently unassigned and need attention.`,
                action: '/admin-dashboard/crm?assignment=unassigned'
            });
        }
        if (pendingLeaves > 0) {
            alerts.push({
                type: 'info',
                message: `${pendingLeaves} leave requests are pending approval.`,
                action: '/admin-dashboard/hr/leaves'
            });
        }

        res.json(alerts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
