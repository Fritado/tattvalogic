const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
        default: 'Full-time'
    },
    experience: {
        type: String
    },
    ctc: {
        type: String
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    description: {
        type: String,
        required: true
    },
    skills: [String],
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
