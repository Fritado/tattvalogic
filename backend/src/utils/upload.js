const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const empId = req.query.empId || 'general';
            const uploadRoot = path.join(process.cwd(), 'public/uploads');
            const dir = path.join(uploadRoot, empId);
            
            // Ensure uploads root exists
            if (!fs.existsSync(uploadRoot)) {
                fs.mkdirSync(uploadRoot, { recursive: true });
            }

            // Create employee directory if it doesn't exist
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            cb(null, dir);
        } catch (err) {
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp|pdf|doc|docx|txt/;
        const mimetypes = /image\/jpeg|image\/png|image\/webp|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document|text\/plain/;

        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Only images, PDFs, and Word documents are allowed!'));
        }
    }
});

module.exports = upload;
