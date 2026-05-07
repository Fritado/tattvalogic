const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Document = require('./src/models/Document');

const fixOrphanedDocuments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const documents = await Document.find({});
        console.log(`Found ${documents.length} documents in DB`);

        let movedCount = 0;
        let alreadyCorrectCount = 0;
        let notFoundCount = 0;

        const uploadRoot = path.join(__dirname, 'public/uploads');
        const generalDir = path.join(uploadRoot, 'general');

        for (const doc of documents) {
            // Document url is like: /uploads/LTE005/document-1778158152049.pdf
            const urlParts = doc.url.split('/');
            // urlParts: ["", "uploads", "LTE005", "document-1778158152049.pdf"]
            if (urlParts.length !== 4) continue;

            const empId = urlParts[2];
            const filename = urlParts[3];

            const expectedPath = path.join(uploadRoot, empId, filename);
            const orphanedPath = path.join(generalDir, filename);

            if (fs.existsSync(expectedPath)) {
                alreadyCorrectCount++;
            } else if (fs.existsSync(orphanedPath)) {
                // Move file
                const empDir = path.join(uploadRoot, empId);
                if (!fs.existsSync(empDir)) {
                    fs.mkdirSync(empDir, { recursive: true });
                }
                
                fs.renameSync(orphanedPath, expectedPath);
                console.log(`Moved ${filename} from general to ${empId}`);
                movedCount++;
            } else {
                notFoundCount++;
                console.log(`File missing entirely: ${filename}`);
            }
        }

        console.log('--- Migration Summary ---');
        console.log(`Already Correct: ${alreadyCorrectCount}`);
        console.log(`Moved: ${movedCount}`);
        console.log(`Missing: ${notFoundCount}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixOrphanedDocuments();
