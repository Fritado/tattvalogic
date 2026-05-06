const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Photo upload middleware — images only, 2MB max.
 * Saves to: public/uploads/<empId>/photos/<prefix>-<empId>.<ext>
 * Naming: first 3 chars of full name + employeeId (e.g. rah-LTE001.jpg)
 */
const photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const empId = req.query.empId || req.params.empId || 'general';
            const dir = path.join(process.cwd(), 'public/uploads', empId, 'photos');
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        } catch (err) {
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        // name prefix: first 3 letters of fullName query param, fallback to 'emp'
        const rawName = (req.query.name || 'emp').replace(/[^a-zA-Z]/g, '').toLowerCase();
        const prefix = rawName.substring(0, 3) || 'emp';
        const empId = (req.query.empId || req.params.empId || 'gen').toLowerCase();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${prefix}-${empId}${ext}`);
    }
});

const photoUpload = multer({
    storage: photoStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: function (req, file, cb) {
        const allowed = /jpeg|jpg|png/;
        const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = /image\/(jpeg|jpg|png)/.test(file.mimetype);
        if (extOk && mimeOk) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG and PNG images are allowed for photographs.'));
        }
    }
});

module.exports = photoUpload;
