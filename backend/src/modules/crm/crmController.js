const Lead = require('../../models/Lead');
const Activity = require('../../models/Activity');
const Task = require('../../models/Task');
const { getHierarchyUserIds } = require('../../utils/hierarchy');

const getOwnershipFilter = async (user) => {
    const baseFilter = { isDeleted: { $ne: true } };
    if (user.role === 'admin') return baseFilter;
    
    return {
        ...baseFilter,
        $or: [
            { leadOwner: user._id },
            { assignedTo: user._id }
        ]
    };
};

// @desc    Get all leads (with RBAC filtering)
// @route   GET /api/crm/leads
exports.getLeads = async (req, res) => {
    try {
        const { source, assignment } = req.query;
        let filter = await getOwnershipFilter(req.user);

        // Apply additional filters if provided
        if (source) {
            filter.source = source;
        }

        if (assignment === 'unassigned') {
            filter.assignedTo = null;
        } else if (assignment === 'assigned') {
            filter.assignedTo = { $ne: null };
        }

        const leads = await Lead.find(filter)
            .populate('assignedTo', 'email employeeRef role')
            .populate('leadOwner', 'email employeeRef role')
            .sort('-createdAt');
            
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAssignableUsers = async (req, res) => {
    try {
        const User = require('../../models/User'); 
        // Find users from Marketing & Sales department or admins
        const users = await User.find({
            isActive: true,
            $or: [
                { role: 'admin' },
                { department: 'Marketing & Sales' }
            ]
        }).select('email role employeeRef');
        
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a new lead
// @route   POST /api/crm/leads
exports.createLead = async (req, res) => {
    try {
        const { contacts, assignedTo } = req.body;
        if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
            return res.status(400).json({ message: 'At least one contact is required.' });
        }

        // Minimal validation for lead creation: at least one contact field must be present
        const c = contacts[0];
        if (!c.name && !c.email && !c.mobile) {
            return res.status(400).json({ message: 'Minimal lead info required: Name, Email OR Phone.' });
        }

        const lead = new Lead(req.body);
        
        // Default company name to contact name if missing
        if (!lead.companyName && lead.contacts?.[0]?.name) {
            lead.companyName = lead.contacts[0].name;
        }

        // Enforce Lead Ownership (Creator = Owner)
        lead.leadOwner = req.user._id;
        
        // Conditional Assignment Validation
        if (req.user.department !== 'Marketing & Sales' && lead.source !== 'Website Enquiry') {
            if (!assignedTo) {
                return res.status(400).json({ message: 'Please assign this lead to a Marketing team member for follow-up.' });
            }
            lead.assignedTo = assignedTo;
        } else {
            // For Marketing users or website enquiries, use provided assignment or null
            lead.assignedTo = assignedTo || (req.user.department === 'Marketing & Sales' ? req.user._id : null);
        }

        await lead.save();

        // Create initial creation activity
        await Activity.create({
            leadId: lead._id,
            type: 'Note',
            notes: 'Lead imported/created in the CRM',
            performedBy: req.user._id
        });

        res.status(201).json(lead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get single lead detail with activities & tasks
// @route   GET /api/crm/leads/:id
exports.getLeadById = async (req, res) => {
    try {
        const filter = await getOwnershipFilter(req.user);
        filter._id = req.params.id;

        const lead = await Lead.findOne(filter)
            .populate('assignedTo', 'email employeeRef role')
            .populate('leadOwner', 'email employeeRef role');
        if (!lead) return res.status(404).json({ message: 'Lead not found or unauthorized' });

        const activities = await Activity.find({ leadId: lead._id }).populate('performedBy', 'email').sort('-createdAt');
        const tasks = await Task.find({ leadId: lead._id }).sort('dueDate');

        res.json({ lead, activities, tasks });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update lead pipeline status
// @route   PATCH /api/crm/leads/:id/status
exports.updateLeadStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const filter = await getOwnershipFilter(req.user);
        filter._id = req.params.id;

        const lead = await Lead.findOne(filter);
        if (!lead) return res.status(404).json({ message: 'Lead not found or unauthorized' });

        const oldStatus = lead.status;
        lead.status = status;
        
        // Auto-set closure fields if Won
        if (status === 'Won' && oldStatus !== 'Won') {
            lead.finalClosedValue = lead.dealValue;
        }

        await lead.save();

        // Log status change activity
        if (oldStatus !== status) {
            await Activity.create({
                leadId: lead._id,
                type: 'Status Change',
                notes: `Status changed from '${oldStatus}' to '${status}'`,
                performedBy: req.user._id
            });
        }

        res.json(lead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update lead data
// @route   PUT /api/crm/leads/:id
exports.updateLead = async (req, res) => {
    try {
        const filter = await getOwnershipFilter(req.user);
        filter._id = req.params.id;

        const lead = await Lead.findOne(filter);
        if (!lead) {
            console.log(`Edit failed: Lead ${req.params.id} not found or unauthorized for user ${req.user.email}`);
            return res.status(404).json({ message: 'Lead not found or unauthorized' });
        }

        const { contacts, leadOwner } = req.body;
        
        // Only validate contacts if they are being updated
        if (contacts && Array.isArray(contacts) && contacts.length > 0) {
            const c = contacts[0];
            if (!c.name && !c.email && !c.mobile) {
                return res.status(400).json({ message: 'Contact must have at least Name, Email or Phone.' });
            }
        }

        // Protect Lead Owner field for non-admins
        if (req.body.leadOwner === "") {
            delete req.body.leadOwner;
        }
        
        if (req.user.role !== 'admin' && req.body.leadOwner && lead.leadOwner && req.body.leadOwner.toString() !== lead.leadOwner.toString()) {
            delete req.body.leadOwner;
        }

        const updatedLead = await Lead.findOneAndUpdate(
            { _id: req.params.id }, // Use simple ID filter here since we already verified ownership above
            { $set: req.body },
            { new: true, runValidators: true }
        );

        // Log edit activity
        await Activity.create({
            leadId: lead._id,
            type: 'Note',
            notes: 'Lead details were updated',
            performedBy: req.user._id
        });

        res.json(updatedLead);
    } catch (err) {
        console.error('UpdateLead Error:', err);
        res.status(400).json({ message: err.message });
    }
};

// @desc    Add an activity to a lead
// @route   POST /api/crm/leads/:id/activities
exports.addActivity = async (req, res) => {
    try {
        const filter = await getOwnershipFilter(req.user);
        filter._id = req.params.id;

        const lead = await Lead.findOne(filter);
        if (!lead) return res.status(404).json({ message: 'Lead not found or unauthorized' });

        const { type, notes, nextFollowUpDate } = req.body;

        const activity = await Activity.create({
            leadId: lead._id,
            type,
            notes,
            nextFollowUpDate,
            performedBy: req.user._id
        });

        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Soft delete a lead (Admin only)
// @route   DELETE /api/crm/leads/:id
exports.deleteLead = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only administrators can delete leads.' });
        }

        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        lead.isDeleted = true;
        lead.deletedAt = new Date();
        lead.deletedBy = req.user._id;
        await lead.save();

        // Log deletion activity
        await Activity.create({
            leadId: lead._id,
            type: 'Note',
            notes: `Lead was deleted by ${req.user.email}`,
            performedBy: req.user._id
        });

        res.json({ message: 'Lead deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
