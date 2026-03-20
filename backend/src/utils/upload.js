const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp|pdf|doc|docx/;
        const mimetypes = /image\/jpeg|image\/png|image\/webp|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;

        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = mimetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only images (jpeg, png, webp) and documents (pdf, doc, docx) are allowed!');
        }
    }
});

module.exports = upload;
