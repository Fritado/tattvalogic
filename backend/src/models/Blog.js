const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
    excerpt: {
        type: String,
        trim: true
    },
    content: {
        type: String, // Rich text content (HTML or JSON)
        required: true
    },
    featuredImage: {
        type: String
    },
    author: {
        type: String,
        default: 'TattvaLogic Admin'
    },
    category: {
        type: String,
        required: true,
        default: 'Engineering'
    },
    tags: [{
        type: String
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    // SEO Fields
    seoTitle: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    focusKeywords: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
