const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
};

/**
 * Restrict route to specific roles.
 * Usage: requireRole('admin', 'manager')
 */
exports.requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient role.' });
    }
    next();
};

/**
 * Restrict route to users with a specific feature permission.
 * Admin always passes. Usage: requirePermission('leads', 'edit')
 */
exports.requirePermission = (feature, action) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized.' });
    // Admin bypasses all permission checks
    if (req.user.role === 'admin') return next();
    // Implicitly grant full CRM access to Marketing & Sales department
    if (feature === 'crm' && req.user.department === 'Marketing & Sales') {
        return next();
    }

    const perm = req.user.permissions?.[feature]?.[action];
    if (!perm) {
        return res.status(403).json({ message: `Access denied: no ${action} permission on ${feature}.` });
    }
    next();
};

