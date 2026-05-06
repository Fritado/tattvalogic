const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Optimizes an uploaded image:
 * 1. Resizes to a max width (default 1200px)
 * 2. Compresses with WebP format (default quality 80)
 * 3. Removes original and keeps optimized version
 */
exports.optimizeImage = async (file) => {
    try {
        const { path: filePath, destination, filename } = file;
        const name = path.parse(filename).name;
        const optimizedName = `${name}.webp`;
        const optimizedPath = path.join(destination, optimizedName);

        await sharp(filePath)
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(optimizedPath);

        // Remove the original file if it's not already webp
        if (path.extname(filename).toLowerCase() !== '.webp') {
            fs.unlinkSync(filePath);
        }

        return optimizedName;
    } catch (error) {
        console.error('Image optimization failed:', error);
        return file.filename; // Fallback to original
    }
};
