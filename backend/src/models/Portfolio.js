const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: [{
        type: String,
        trim: true
    }],
    projectUrl: {
        type: String,
        trim: true
    },
    caseStudyUrl: {
        type: String,
        trim: true
    },
    thumbnail: {
        type: String, // Main project image/logo
        required: true
    },
    gallery: [{
        type: String // Array of image URLs
    }],
    displayOrder: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    // SEO Fields
    metaTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Index for reordering
portfolioSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
