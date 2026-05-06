const mongoose = require('mongoose');

const monthlyPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String, // "01" - "12"
        required: true
    },
    year: {
        type: String, // "2026"
        required: true
    },
    targets: {
        leads: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Ensure unique plan per user per month/year
monthlyPlanSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyPlan', monthlyPlanSchema);
