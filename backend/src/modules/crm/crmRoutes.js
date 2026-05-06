const express = require('express');
const router = express.Router();
const { protect, requirePermission } = require('../../middleware/auth');
const {
    getLeads,
    createLead,
    getLeadById,
    updateLead,
    deleteLead,
    updateLeadStatus,
    addActivity,
    getAssignableUsers
} = require('./crmController');

// All CRM routes require authentication and CRM view permissions
router.use(protect);
router.use(requirePermission('crm', 'view'));

// Users Route (for dropdowns)
router.get('/users', getAssignableUsers);

// Lead Routes
router.route('/leads')
    .get(getLeads)
    .post(createLead);

router.route('/leads/:id')
    .get(getLeadById)
    .put(updateLead)
    .delete(deleteLead);

router.route('/leads/:id/status')
    .patch(updateLeadStatus);

router.route('/leads/:id/activities')
    .post(addActivity);

module.exports = router;
