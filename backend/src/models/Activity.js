const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    type: {
        type: String,
        enum: ['Call', 'Email', 'Meeting', 'Demo', 'WhatsApp', 'Note', 'Status Change', 'Other'],
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nextFollowUpDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
