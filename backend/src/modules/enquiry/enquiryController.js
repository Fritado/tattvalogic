const Enquiry = require('../../models/Enquiry');

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private
exports.getEnquiries = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Enquiry.countDocuments(query);
        
        const enquiries = await Enquiry.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        res.json({
            enquiries,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
    try {
        const { name, email, message, phone } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide name, email and message' });
        }
        
        const enquiry = await Enquiry.create(req.body);

        // Auto-capture into CRM Lead Pipeline
        const Lead = require('../../models/Lead');
        const User = require('../../models/User');
        const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL || 'support@tattvalogic.com' });

        await Lead.create({
            companyName: name, // Use person's name as company name if not provided
            contacts: [{
                name,
                email,
                mobile: phone || ''
            }],
            source: 'Website Enquiry',
            serviceInterest: 'Website Enquiry',
            comments: message,
            status: 'New Lead',
            assignedTo: null, // Default to Not Assigned
            leadOwner: adminUser?._id || null
        });

        res.status(201).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private
exports.updateEnquiryStatus = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private
exports.deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.json({ message: 'Enquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
