const express = require('express');
const router = express.Router();
const { 
    getTeam, 
    getAdminTeam, 
    createMember, 
    updateMember, 
    deleteMember 
} = require('./teamController');
const { protect } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for Team Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `team-${Date.now()}${path.extname(file.originalname)}`);
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

router.get('/', getTeam);
router.get('/admin', protect, getAdminTeam);
router.post('/', protect, upload.single('image'), createMember);
router.put('/:id', protect, upload.single('image'), updateMember);
router.delete('/:id', protect, deleteMember);

module.exports = router;
