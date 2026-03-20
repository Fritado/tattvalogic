const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'responded', 'deleted'],
        default: 'new'
    }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
