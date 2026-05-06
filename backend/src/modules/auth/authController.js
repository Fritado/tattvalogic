const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('employeeRef', 'fullName employeeId photoUrl');
        
        if (!user) {
            // Check if they tried logging in with personal email
            const personalUser = await User.findOne({ personalEmail: email });
            if (personalUser) {
                return res.status(401).json({ message: 'Please use your official email ID to access the portal.' });
            }
            return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }

        if (user && (await user.comparePassword(password))) {
            if (user.isActive === false || user.loginEnabled === false) {
                return res.status(401).json({ message: 'Your portal access is disabled. Contact an administrator.' });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                department: user.department,
                permissions: user.permissions,
                employeeRef: user.employeeRef,
                reportingManager: user.reportingManager,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate('employeeRef', 'fullName employeeId photoUrl')
        .populate('reportingManager', 'email role');
    res.json(user);
};

