const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getOperationalSummary, 
    getRecentActivities, 
    getPendingAlerts 
} = require('./dashboardController');
const { protect } = require('../../middleware/auth');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/summary', getOperationalSummary);
router.get('/activities', getRecentActivities);
router.get('/alerts', getPendingAlerts);

module.exports = router;
