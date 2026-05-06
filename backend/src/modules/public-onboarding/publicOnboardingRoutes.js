const express = require('express');
const router = express.Router();
const { 
    validateToken,
    submitOnboarding,
    uploadDocument,
    getDocuments,
    deleteDocument,
    uploadPhoto
} = require('./publicOnboardingController');
const upload = require('../../utils/upload');
const photoUpload = require('../../utils/uploadPhoto');

// Public routes relying on secure token
router.get('/validate/:token', validateToken);
router.put('/submit/:token', submitOnboarding);
router.post('/upload/:token', upload.single('document'), uploadDocument);
router.get('/documents/:token', getDocuments);
router.delete('/documents/:id/:token', deleteDocument);

// Photo upload (public / candidate flow)
router.post('/photo/:token', photoUpload.single('photo'), uploadPhoto);

module.exports = router;
