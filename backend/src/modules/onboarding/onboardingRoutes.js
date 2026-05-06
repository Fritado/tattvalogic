const express = require('express');
const router = express.Router();
const { 
    uploadDocument, 
    getEmployeeDocuments, 
    updateDocumentStatus, 
    updateOnboardingStage,
    deleteDocument,
    uploadPhoto
} = require('./onboardingController');
const { protect } = require('../../middleware/auth');
const upload = require('../../utils/upload');
const photoUpload = require('../../utils/uploadPhoto');

router.post('/upload', protect, upload.single('document'), require('./onboardingController').uploadOnboardingDocument);
router.post('/documents', protect, uploadDocument);
router.get('/documents/:employeeId', protect, getEmployeeDocuments);
router.put('/documents/:id/status', protect, updateDocumentStatus);
router.delete('/documents/:id', protect, deleteDocument);
router.put('/stage/:employeeId', protect, updateOnboardingStage);

// Photo upload (admin)
router.post('/photo/:employeeId', protect, photoUpload.single('photo'), uploadPhoto);

module.exports = router;

