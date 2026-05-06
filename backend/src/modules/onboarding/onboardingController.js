const Document = require('../../models/Document');
const Employee = require('../../models/Employee');

// @desc    Upload onboarding document (with Multer)
// @route   POST /api/onboarding/upload
// @access  Private
exports.uploadOnboardingDocument = async (req, res) => {
    try {
        const { type, employeeId } = req.body;
        const empId = req.query.empId || 'general';
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const document = await Document.create({
            employee: employeeId,
            type,
            url: `/uploads/${empId}/${req.file.filename}`,
            name: req.file.originalname,
            status: 'Pending'
        });

        res.status(201).json(document);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Upload onboarding document (JSON version)
// @route   POST /api/onboarding/documents
// @access  Private
exports.uploadDocument = async (req, res) => {
    try {
        const { type, url, name, employeeId } = req.body;
        const document = await Document.create({
            employee: employeeId,
            type,
            url,
            name: name || `${type} document`
        });
        res.status(201).json(document);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all documents for an employee
// @route   GET /api/onboarding/documents/:employeeId
// @access  Private/Admin
exports.getEmployeeDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ employee: req.params.employeeId });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject document
// @route   PUT /api/onboarding/documents/:id/status
// @access  Private/Admin
exports.updateDocumentStatus = async (req, res) => {
    try {
        const { status, comments } = req.body;
        const document = await Document.findByIdAndUpdate(
            req.params.id, 
            { status, comments }, 
            { new: true }
        );
        if (!document) return res.status(404).json({ message: 'Document not found' });
        res.json(document);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update onboarding stage
// @route   PUT /api/onboarding/stage/:employeeId
// @access  Private/Admin
exports.updateOnboardingStage = async (req, res) => {
    try {
        const { stage } = req.body;
        const employee = await Employee.findByIdAndUpdate(
            req.params.employeeId,
            { onboardingStage: stage },
            { new: true }
        );
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a document
// @route   DELETE /api/onboarding/documents/:id
// @access  Private/Admin
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload / replace employee profile photo
// @route   POST /api/onboarding/photo/:employeeId
// @access  Private/Admin
exports.uploadPhoto = async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    try {
        if (!req.file) return res.status(400).json({ message: 'No photo uploaded.' });

        const photoUrl = `/uploads/${req.query.empId || 'general'}/photos/${req.file.filename}`;

        // Delete old photo if present
        const existing = await Employee.findById(req.params.employeeId);
        if (existing?.photoUrl) {
            const oldPath = path.join(process.cwd(), 'public', existing.photoUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const employee = await Employee.findByIdAndUpdate(
            req.params.employeeId,
            { photoUrl },
            { new: true }
        );
        if (!employee) return res.status(404).json({ message: 'Employee not found.' });

        res.json({ photoUrl, employee });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

