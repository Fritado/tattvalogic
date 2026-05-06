const mongoose = require('mongoose');

const onboardingTokenSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Create a TTL index to automatically delete expired tokens (optional, but good practice)
// onboardingTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OnboardingToken', onboardingTokenSchema);
