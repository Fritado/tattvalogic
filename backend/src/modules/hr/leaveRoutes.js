const express = require('express');
const router = express.Router();
const leaveController = require('./leaveController');
const { protect, requireRole } = require('../../middleware/auth');

router.use(protect);

router.post('/apply', leaveController.applyLeave);
router.get('/my-requests', leaveController.getMyRequests);
router.put('/withdraw/:id', leaveController.withdrawLeave);
router.get('/balance', leaveController.getLeaveBalance);

// Admin/HR only
router.get('/admin/all', requireRole('admin', 'hr'), leaveController.getAllRequests);
router.put('/approve/:id', requireRole('admin', 'hr'), leaveController.approveLeave);
router.put('/reject/:id', requireRole('admin', 'hr'), leaveController.rejectLeave);
router.post('/policy', requireRole('admin', 'hr'), leaveController.upsertPolicy);

module.exports = router;
