const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const permissionFeature = {
    view:   { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit:   { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    personalEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    loginEnabled: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'specialist', 'employee'],
        default: 'admin'
    },
    department: {
        type: String,
        enum: ['Marketing & Sales', 'Engineering', 'Administration', 'Finance'],
        required: false
    },

    // One-to-one link to an Employee record
    employeeRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    },

    // Reporting manager (self-referential)
    reportingManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    // Feature-level permission matrix
    permissions: {
        dashboard:      { view: { type: Boolean, default: false } },
        leads:          permissionFeature,
        crm:            permissionFeature,
        employees:      permissionFeature,
        onboarding:     permissionFeature,
        reports:        { view: { type: Boolean, default: false } },
        settings:       { view: { type: Boolean, default: false }, edit: { type: Boolean, default: false } },
        userManagement: permissionFeature
    },

    isActive: { type: Boolean, default: true }

}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

