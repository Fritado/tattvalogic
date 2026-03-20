const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    careerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
        required: true
    },
    applicantName: {
        type: String,
        required: true
    },
    applicantEmail: {
        type: String,
        required: true
    },
    applicantPhone: {
        type: String
    },
    source: {
        type: String,
        enum: ['Easy Apply', 'Screening Process'],
        default: 'Easy Apply'
    },
    resumeLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Screening', 'Interview Scheduled', 'Shortlisted', 'Selected', 'Rejected'],
        default: 'Applied'
    },
    notes: [
        {
            message: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
