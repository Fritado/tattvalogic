const express = require('express');
const router = express.Router();
const { 
    getJobs, 
    getAdminJobs, 
    createJob, 
    updateJob, 
    deleteJob,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    addApplicationNote,
    submitApplication
} = require('./careerController');
const { protect } = require('../../middleware/auth');

const upload = require('../../utils/upload');

router.get('/', getJobs);
router.get('/admin', protect, getAdminJobs);
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

// Application Management
router.get('/applications', protect, getApplications);
router.get('/applications/:id', protect, getApplicationById);
router.put('/applications/:id/status', protect, updateApplicationStatus);
router.post('/applications/:id/notes', protect, addApplicationNote);
router.post('/apply', upload.single('resume'), submitApplication);

module.exports = router;
