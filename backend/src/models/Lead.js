const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadId: {
        type: String,
        unique: true
    },
    companyName: {
        type: String,
        required: false,
        trim: true
    },
    businessDomain: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    contacts: [{
        name: { type: String, required: false, trim: true },
        email: { type: String, required: false, trim: true, lowercase: true },
        mobile: { type: String, trim: true },
        designation: { type: String, trim: true }
    }],
    source: {
        type: String,
        enum: ['Website Enquiry', 'Manual', 'Referral', 'LinkedIn', 'Cold Outreach', 'Other'],
        default: 'Manual'
    },
    serviceInterest: {
        type: String,
        trim: true
    },
    leadType: {
        type: String,
        enum: ['Hot', 'Warm', 'Cold'],
        default: 'Warm'
    },
    leadOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    comments: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['New Lead', 'Contacted', 'Qualification', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'],
        default: 'New Lead'
    },
    dealValue: {
        type: Number,
        default: 0
    },
    expectedClosureDate: {
        type: Date
    },
    finalClosedValue: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Auto-generate leadId and handle source merging before saving
leadSchema.pre('save', async function(next) {
    if (!this.leadId) {
        // Generate a random 6 character alphanumeric string
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.leadId = `LD-${randomStr}`;
    }

    // Merge source to Service Interest if serviceInterest is empty
    if (!this.serviceInterest && this.source) {
        this.serviceInterest = this.source;
    }
    
    next();
});

module.exports = mongoose.model('Lead', leadSchema);
