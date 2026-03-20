const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });

            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
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
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
};
