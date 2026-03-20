const express = require('express');
const router = express.Router();
const { 
    getEnquiries, 
    createEnquiry, 
    updateEnquiryStatus, 
    deleteEnquiry 
} = require('./enquiryController');
const { protect } = require('../../middleware/auth');

router.get('/', protect, getEnquiries);
router.post('/', createEnquiry);
router.put('/:id', protect, updateEnquiryStatus);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
