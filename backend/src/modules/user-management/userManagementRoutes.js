const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getHierarchy,
    getMyTeam,
    getAvailableEmployees
} = require('./userManagementController');
const { protect, requireRole } = require('../../middleware/auth');

// All routes require authentication
router.use(protect);

// Admin-only routes
router.get('/', requireRole('admin'), getUsers);
router.post('/', requireRole('admin'), createUser);
router.get('/hierarchy', requireRole('admin', 'manager'), getHierarchy);
router.get('/available-employees', requireRole('admin'), getAvailableEmployees);
router.get('/my-team', getMyTeam);
router.get('/:id', requireRole('admin'), getUserById);
router.put('/:id', requireRole('admin'), updateUser);
router.delete('/:id', requireRole('admin'), deleteUser);

module.exports = router;
