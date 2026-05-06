const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../../middleware/auth');
const {
    upsertPlan,
    getPerformanceStats,
    getTeamPerformance,
    getFunnelReport,
    getUserPerformanceDetails
} = require('./performanceController');

router.use(protect);

// User and Admin access
router.get('/stats', getPerformanceStats);
router.get('/funnel-report', getFunnelReport);
router.get('/user-details', getUserPerformanceDetails);

// Admin only routes
router.post('/plans', requireRole('admin'), upsertPlan);
router.get('/team', requireRole('admin'), getTeamPerformance);

module.exports = router;
