const express = require('express');
const router = express.Router();
const { 
    getBlogs, 
    getAdminBlogs, 
    getBlogBySlug, 
    createBlog, 
    updateBlog, 
    deleteBlog 
} = require('./blogController');
const { protect } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for Blog Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `blog-${Date.now()}${path.extname(file.originalname)}`);
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

router.get('/', getBlogs);
router.get('/admin', protect, getAdminBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, upload.single('featuredImage'), createBlog);
router.put('/:id', protect, upload.single('featuredImage'), updateBlog);

// Dedicated route for Editor inline image uploads
router.post('/upload', protect, upload.single('image'), (req, res) => {
    if (req.file) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5001';
        res.json({
            url: `${baseUrl}/uploads/${req.file.filename}`
        });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

router.delete('/:id', protect, deleteBlog);

module.exports = router;
