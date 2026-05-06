const express = require('express');
const router = express.Router();
const { 
    getTestimonials, 
    getAdminTestimonials, 
    createTestimonial, 
    updateTestimonial, 
    deleteTestimonial,
    reorderTestimonials
} = require('./testimonialController');
const { protect } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `client-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

// Public route
router.get('/', getTestimonials);

// Admin routes
router.get('/admin', protect, getAdminTestimonials);
router.post('/', protect, upload.single('clientImage'), createTestimonial);
router.put('/reorder', protect, reorderTestimonials);
router.put('/:id', protect, upload.single('clientImage'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
