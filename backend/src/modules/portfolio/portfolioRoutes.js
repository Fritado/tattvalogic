const express = require('express');
const router = express.Router();
const { 
    getPortfolios, 
    getAdminPortfolios, 
    createPortfolio, 
    updatePortfolio, 
    deletePortfolio,
    reorderPortfolio
} = require('./portfolioController');
const { protect } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for Portfolio Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `portfolio-${Date.now()}${path.extname(file.originalname)}`);
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
router.get('/', getPortfolios);

// Admin routes
router.get('/admin', protect, getAdminPortfolios);
router.post('/', protect, upload.single('thumbnail'), createPortfolio);
router.put('/reorder', protect, reorderPortfolio);
router.put('/:id', protect, upload.single('thumbnail'), updatePortfolio);
router.delete('/:id', protect, deletePortfolio);

module.exports = router;
