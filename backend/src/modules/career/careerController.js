const Career = require('../../models/Career');
const Application = require('../../models/Application');

// @desc    Get all jobs
// @route   GET /api/careers
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Career.find({ isPublished: true }).sort('-createdAt');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs for admin
// @route   GET /api/careers/admin
// @access  Private
exports.getAdminJobs = async (req, res) => {
    try {
        const jobs = await Career.find().sort('-createdAt');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create job
// @route   POST /api/careers
// @access  Private
exports.createJob = async (req, res) => {
    try {
        const job = await Career.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/careers/:id
// @access  Private
exports.updateJob = async (req, res) => {
    try {
        const job = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/careers/:id
// @access  Private
exports.deleteJob = async (req, res) => {
    try {
        const job = await Career.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /api/careers/applications
// @access  Private
exports.getApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate('careerId').sort('-createdAt');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get application by ID
// @route   GET /api/careers/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('careerId');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/careers/applications/:id/status
// @access  Private
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Add note to application
// @route   POST /api/careers/applications/:id/notes
// @access  Private
exports.addApplicationNote = async (req, res) => {
    try {
        const { message } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        
        application.notes.push({ message });
        await application.save();
        
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Submit application
// @route   POST /api/careers/apply
// @access  Public
exports.submitApplication = async (req, res) => {
    try {
        const { careerId, applicantName, applicantEmail, applicantPhone, source } = req.body;

        if (!careerId || !applicantName || !applicantEmail || !applicantPhone) {
            return res.status(400).json({ message: 'Please provide all required applicant details' });
        }

        // Verify job exists
        const job = await Career.findById(careerId);
        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }
        
        let resumeLink = req.body.resumeLink; // Manual link if provided
        if (req.file) {
            const baseUrl = process.env.BASE_URL || 'http://localhost:4001';
            resumeLink = `${baseUrl}/uploads/${req.file.filename}`;
        }

        const application = await Application.create({
            careerId,
            applicantName,
            applicantEmail,
            applicantPhone,
            source,
            resumeLink
        });
        
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
