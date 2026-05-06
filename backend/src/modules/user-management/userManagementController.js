const User = require('../../models/User');
const Employee = require('../../models/Employee');
const bcrypt = require('bcryptjs');
const sendEmail = require('../../utils/sendEmail');

// @desc    Get all portal users
// @route   GET /api/users
// @access  Admin
exports.getUsers = async (req, res) => {
    try {
        const { role, search, active } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (active !== undefined) filter.isActive = active === 'true';
        if (search) filter.email = { $regex: search, $options: 'i' };

        const users = await User.find(filter)
            .select('-password')
            .populate('employeeRef', 'fullName employeeId photoUrl designation department')
            .populate('reportingManager', 'email role employeeRef')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('employeeRef', 'fullName employeeId photoUrl designation department email')
            .populate('reportingManager', 'email role');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a portal user
// @route   POST /api/users
// @access  Admin
exports.createUser = async (req, res) => {
    try {
        const { email, personalEmail, password, role, department, employeeRef, reportingManager, permissions, sendInvite, loginEnabled } = req.body;

        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

        // Domain Validation (Optional but recommended)
        const domain = email.split('@')[1];
        if (domain !== 'tattvalogic.com') {
            // We can make this a warning or a strict requirement
            // return res.status(400).json({ message: 'Official email must belong to @tattvalogic.com domain.' });
        }

        // Check email unique
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'A user with this email already exists.' });

        // Check employee not already linked
        if (employeeRef) {
            const alreadyLinked = await User.findOne({ employeeRef });
            if (alreadyLinked) return res.status(400).json({ message: 'This employee is already linked to another user account.' });
        }

        // Validate reporting manager exists and check for circular loop
        if (reportingManager) {
            const mgr = await User.findById(reportingManager);
            if (!mgr) return res.status(400).json({ message: 'Reporting manager not found.' });
        }

        const user = await User.create({
            email, 
            personalEmail: personalEmail || null,
            password, 
            role: role || 'specialist',
            department: department || null,
            employeeRef: employeeRef || null,
            reportingManager: reportingManager || null,
            permissions: permissions || {},
            isActive: true,
            loginEnabled: loginEnabled !== undefined ? loginEnabled : true
        });

        // Optionally send invite email
        if (sendInvite) {
            try {
                const baseUrl = process.env.BASE_URL || 'http://localhost:3005';
                await sendEmail({
                    email,
                    subject: 'Your TattvaLogic Portal Account',
                    message: `
                        <h2>Welcome to TattvaLogic Portal</h2>
                        <p>Your account has been created. Login at:</p>
                        <p><a href="${baseUrl}/portal">${baseUrl}/portal</a></p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Password:</strong> ${password}</p>
                        <p>Please change your password after first login.</p>
                    `
                });
            } catch (emailErr) {
                console.warn('Failed to send invite email:', emailErr.message);
            }
        }

        const populated = await User.findById(user._id)
            .select('-password')
            .populate('employeeRef', 'fullName employeeId photoUrl')
            .populate('reportingManager', 'email role');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update user (permissions, role, manager)
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = async (req, res) => {
    try {
        const { role, department, permissions, reportingManager, isActive, loginEnabled, employeeRef, email, personalEmail, password } = req.body;

        // Circular hierarchy check
        if (reportingManager) {
            if (reportingManager === req.params.id) {
                return res.status(400).json({ message: 'A user cannot be their own reporting manager.' });
            }
            // Walk up the chain to detect loops
            let current = await User.findById(reportingManager);
            const visited = new Set([req.params.id]);
            while (current && current.reportingManager) {
                if (visited.has(current.reportingManager.toString())) {
                    return res.status(400).json({ message: 'Circular reporting hierarchy detected.' });
                }
                visited.add(current._id.toString());
                current = await User.findById(current.reportingManager);
            }
        }

        const updateData = {};
        if (email !== undefined) updateData.email = email;
        if (personalEmail !== undefined) updateData.personalEmail = personalEmail;
        if (role !== undefined) updateData.role = role;
        if (department !== undefined) updateData.department = department;
        if (permissions !== undefined) updateData.permissions = permissions;
        if (reportingManager !== undefined) updateData.reportingManager = reportingManager || null;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (loginEnabled !== undefined) updateData.loginEnabled = loginEnabled;
        if (employeeRef !== undefined) updateData.employeeRef = employeeRef || null;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .select('-password')
            .populate('employeeRef', 'fullName employeeId photoUrl')
            .populate('reportingManager', 'email role');

        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
    try {
        // Prevent deleting self
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account.' });
        }

        // Check if user is a reporting manager for anyone
        const isManager = await User.findOne({ reportingManager: req.params.id });
        if (isManager) {
            return res.status(400).json({ message: 'Cannot delete this user because they are a reporting manager for other employees. Please reassign their reportees first.' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        
        res.json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get full reporting hierarchy as nested tree
// @route   GET /api/users/hierarchy
// @access  Admin
exports.getHierarchy = async (req, res) => {
    try {
        const users = await User.find({ isActive: true })
            .select('-password')
            .populate('employeeRef', 'fullName employeeId photoUrl designation department');

        // Build tree
        const userMap = {};
        users.forEach(u => { userMap[u._id.toString()] = { ...u.toObject(), children: [] }; });

        const roots = [];
        users.forEach(u => {
            if (u.reportingManager && userMap[u.reportingManager.toString()]) {
                userMap[u.reportingManager.toString()].children.push(userMap[u._id.toString()]);
            } else {
                roots.push(userMap[u._id.toString()]);
            }
        });

        res.json(roots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get direct reportees for logged-in manager
// @route   GET /api/users/my-team
// @access  Manager+
exports.getMyTeam = async (req, res) => {
    try {
        // Admin sees all
        const filter = req.user.role === 'admin'
            ? { isActive: true }
            : { reportingManager: req.user._id, isActive: true };

        const team = await User.find(filter)
            .select('-password')
            .populate('employeeRef', 'fullName employeeId photoUrl designation department');

        res.json(team);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all unlinked employees (for user creation dropdown)
// @route   GET /api/users/available-employees
// @access  Admin
exports.getAvailableEmployees = async (req, res) => {
    try {
        // Find all employees already linked to a user
        const linked = await User.find({ employeeRef: { $ne: null } }).select('employeeRef');
        const linkedIds = linked.map(u => u.employeeRef?.toString()).filter(Boolean);

        const employees = await Employee.find({ _id: { $nin: linkedIds } })
            .select('fullName employeeId designation department photoUrl')
            .sort({ fullName: 1 });

        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
