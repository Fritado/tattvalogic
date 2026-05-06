const Employee = require('../../models/Employee');
const User = require('../../models/User');
const Counter = require('../../models/Counter');
const OnboardingToken = require('../../models/OnboardingToken');
const sendEmail = require('../../utils/sendEmail');
const { onboardingInviteEmail } = require('../../utils/emailTemplates');
const crypto = require('crypto');

// @desc    Get all employees with pagination and filters
// @route   GET /api/employees
// @access  Private/Admin
exports.getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, department, search } = req.query;
        const query = {};

        if (status) query.status = status;
        if (department) query.department = department;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Employee.countDocuments(query);
        const employees = await Employee.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        res.json({
            employees,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('user', 'email role');
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res) => {
    try {
        const { fullName, email, personalEmail, password, ...rest } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User with this official email already exists' });

        // 2. Generate Employee ID (LTE001 format)
        const counter = await Counter.findOneAndUpdate(
            { id: 'employeeId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const employeeId = `LTE${String(counter.seq).padStart(3, '0')}`;

        // 3. Create User account
        user = await User.create({
            email,
            personalEmail: personalEmail || null,
            password: password || 'Welcome@123', // Default password
            role: 'employee'
        });

        // 4. Create Employee record
        const employee = await Employee.create({
            employeeId,
            user: user._id,
            fullName,
            email,
            personalEmail: personalEmail || null,
            ...rest
        });

        // 4.5 Link User back to Employee (Bidirectional)
        user.employeeRef = employee._id;
        if (rest.department) user.department = rest.department;
        await user.save();

        // 5. Generate secure onboarding token (48 hours expiry)
        const tokenString = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

        await OnboardingToken.create({
            employee: employee._id,
            token: tokenString,
            expiresAt
        });

        // 6. Send branded onboarding email
        const baseUrl = process.env.BASE_URL || 'http://localhost:3005';
        const onboardingLink = `${baseUrl}/onboarding/start?token=${tokenString}`;
        const expiryDateStr = expiresAt.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }) + ' IST';

        try {
            const recipients = [employee.email];
            if (employee.personalEmail) recipients.push(employee.personalEmail);

            await sendEmail({
                email: recipients.join(', '),
                subject: 'Complete Your Onboarding – TattvaLogic',
                message: onboardingInviteEmail(fullName, onboardingLink, expiryDateStr)
            });
            console.log(`📧 Onboarding email dispatched to ${recipients.join(' and ')}`);
        } catch (emailErr) {
            console.error('⚠️  Failed to send onboarding email:', emailErr.message);
            // Employee record is still created — email failure is non-blocking
        }

        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
// @access  Private/Admin
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        // Delete associated user
        await User.findByIdAndDelete(employee.user);
        await Employee.findByIdAndDelete(req.params.id);

        res.json({ message: 'Employee and associated user account deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current employee profile
// @route   GET /api/employees/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const employee = await Employee.findOne({ user: req.user.id });
        if (!employee) return res.status(404).json({ message: 'Profile not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
