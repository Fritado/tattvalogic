const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientDesignation: {
        type: String,
        trim: true
    },
    companyName: {
        type: String,
        trim: true
    },
    testimonialText: {
        type: String,
        required: true
    },
    clientImage: {
        type: String, // URL to image
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for reordering
testimonialSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
