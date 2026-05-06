const OnboardingToken = require('../../models/OnboardingToken');
const Employee = require('../../models/Employee');
const Document = require('../../models/Document');
const sendEmail = require('../../utils/sendEmail');
const { onboardingCompletionAdminEmail } = require('../../utils/emailTemplates');

// @desc    Validate onboarding token and return employee data
// @route   GET /api/public-onboarding/validate/:token
// @access  Public
exports.validateToken = async (req, res) => {
    try {
        const { token } = req.params;

        const onboardingToken = await OnboardingToken.findOne({ token }).populate('employee');
        
        if (!onboardingToken) {
            return res.status(404).json({ message: 'Invalid or expired token.' });
        }

        if (onboardingToken.isUsed) {
            return res.status(400).json({ message: 'This onboarding link has already been used.' });
        }

        if (new Date() > onboardingToken.expiresAt) {
            return res.status(400).json({ message: 'This onboarding link has expired. Please contact admin.' });
        }

        res.json({
            valid: true,
            employee: onboardingToken.employee
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit onboarding data via token
// @route   PUT /api/public-onboarding/submit/:token
// @access  Public
exports.submitOnboarding = async (req, res) => {
    try {
        const { token } = req.params;
        const {
            personalDetails,
            professionalDetails,
            familyBackground,
            bankDetails,
            references,
            healthDetails,
            declaration,
            onboardingStatus
        } = req.body;

        const onboardingToken = await OnboardingToken.findOne({ token });
        
        if (!onboardingToken || onboardingToken.isUsed || new Date() > onboardingToken.expiresAt) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Build declaration with timestamp if accepted
        const declarationData = declaration ? {
            ...declaration,
            acceptedAt: declaration.accepted ? new Date() : undefined
        } : undefined;

        const employee = await Employee.findByIdAndUpdate(
            onboardingToken.employee,
            {
                personalDetails,
                religion: req.body.religion,
                workExperience: req.body.workExperience,
                familyBackground,
                bankDetails,
                references,
                ...(healthDetails && { healthDetails }),
                ...(declarationData && { declaration: declarationData }),
                onboardingStatus: onboardingStatus || 'In Progress',
                status: onboardingStatus === 'Completed' ? 'Active' : 'Onboarding'
            },
            { new: true }
        );

        // If submitted completely, mark token as used and notify admin
        if (onboardingStatus === 'Completed') {
            onboardingToken.isUsed = true;
            await onboardingToken.save();

            // Notify admin
            try {
                const baseUrl = process.env.BASE_URL || 'http://localhost:3005';
                const adminLink = `${baseUrl}/admin-dashboard/employees/${employee._id}/onboarding`;
                await sendEmail({
                    email: process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL,
                    subject: `🎉 Onboarding Completed – ${employee.fullName} (${employee.employeeId})`,
                    message: onboardingCompletionAdminEmail(employee.fullName, employee.employeeId, adminLink)
                });
                console.log(`📧 Admin notified about completed onboarding for ${employee.fullName}`);
            } catch (notifyErr) {
                console.error('⚠️  Failed to send admin notification email:', notifyErr.message);
            }
        }

        res.json({ message: 'Onboarding data saved successfully', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload documents via token
// @route   POST /api/public-onboarding/upload/:token
// @access  Public
exports.uploadDocument = async (req, res) => {
    try {
        const { token } = req.params;
        const { type } = req.body;

        const onboardingToken = await OnboardingToken.findOne({ token }).populate('employee');
        
        if (!onboardingToken || onboardingToken.isUsed || new Date() > onboardingToken.expiresAt) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const empId = onboardingToken.employee.employeeId;

        const document = await Document.create({
            employee: onboardingToken.employee._id,
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

// @desc    Get uploaded documents via token
// @route   GET /api/public-onboarding/documents/:token
// @access  Public
exports.getDocuments = async (req, res) => {
    try {
        const { token } = req.params;
        const onboardingToken = await OnboardingToken.findOne({ token });
        
        if (!onboardingToken || onboardingToken.isUsed || new Date() > onboardingToken.expiresAt) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const documents = await Document.find({ employee: onboardingToken.employee });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete document via token
// @route   DELETE /api/public-onboarding/documents/:id/:token
// @access  Public
exports.deleteDocument = async (req, res) => {
    try {
        const { token, id } = req.params;
        const onboardingToken = await OnboardingToken.findOne({ token });
        
        if (!onboardingToken || onboardingToken.isUsed || new Date() > onboardingToken.expiresAt) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const document = await Document.findById(id);
        if (!document) return res.status(404).json({ message: 'Document not found.' });

        if (document.employee.toString() !== onboardingToken.employee.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this document.' });
        }

        await Document.findByIdAndDelete(id);
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload / replace profile photo via token (candidate flow)
// @route   POST /api/public-onboarding/photo/:token
// @access  Public
exports.uploadPhoto = async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    try {
        const { token } = req.params;
        const onboardingToken = await OnboardingToken.findOne({ token }).populate('employee');

        if (!onboardingToken || onboardingToken.isUsed || new Date() > onboardingToken.expiresAt) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        if (!req.file) return res.status(400).json({ message: 'No photo uploaded.' });

        const empId = onboardingToken.employee.employeeId;
        const photoUrl = `/uploads/${empId}/photos/${req.file.filename}`;

        // Delete old photo if present
        if (onboardingToken.employee.photoUrl) {
            const oldPath = path.join(process.cwd(), 'public', onboardingToken.employee.photoUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const employee = await Employee.findByIdAndUpdate(
            onboardingToken.employee._id,
            { photoUrl },
            { new: true }
        );

        res.json({ photoUrl, employee });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

