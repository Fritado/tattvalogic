const express = require('express');
const router = express.Router();
const hrController = require('./hrController');
const { protect, requireRole } = require('../../middleware/auth');

router.use(protect);

router.get('/holidays', hrController.getHolidays);

// Admin/HR only for mutations
router.post('/holidays', requireRole('admin', 'hr'), hrController.createHoliday);
router.put('/holidays/:id', requireRole('admin', 'hr'), hrController.updateHoliday);
router.delete('/holidays/:id', requireRole('admin', 'hr'), hrController.deleteHoliday);

module.exports = router;
