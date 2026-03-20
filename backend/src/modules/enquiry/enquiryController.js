const Enquiry = require('../../models/Enquiry');

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private
exports.getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort('-createdAt');
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide name, email and message' });
        }
        const enquiry = await Enquiry.create(req.body);
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
