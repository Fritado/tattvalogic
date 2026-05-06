const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    personalEmail: {
        type: String,
        lowercase: true
    },
    phone: String,
    photoUrl: String,
    department: String,
    designation: String,
    religion: String,
    reportingManager: String,
    dateOfJoining: Date,
    employmentType: {
        type: String,
        enum: ['Full-time', 'Contract', 'Intern'],
        default: 'Full-time'
    },
    // Onboarding Data (Nested)
    personalDetails: {
        dob: Date,
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        currentAddress: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            country: { type: String, default: 'India' },
            pincode: String
        },
        permanentAddress: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            country: { type: String, default: 'India' },
            pincode: String
        },
        aadhaarNumber: String,
        panNumber: String
    },
    
    workExperience: [{
        organizationName: { type: String, required: true },
        designation: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
        isCurrent: { type: Boolean, default: false },
        jobResponsibilities: String,
        contactPersonName: String,
        contactPersonEmail: String,
        contactPersonPhone: String
    }],
    
    familyBackground: {
        fatherName: String,
        motherName: String,
        maritalStatus: {
            type: String,
            enum: ['Single', 'Married', 'Divorced', 'Widowed']
        },
        spouseName: String,
        emergencyContactName: String,
        emergencyContactNumber: String
    },
    
    bankDetails: {
        accountHolderName: String,
        bankName: String,
        accountNumber: String,
        ifscCode: String,
        bankAddress: String,
        accountType: {
            type: String,
            enum: ['Savings', 'Current']
        },
        mmid: String,
        vpa: String
    },
    
    references: [{
        name: String,
        company: String,
        contact: String
    }],

    healthDetails: {
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        height: Number,  // in cm
        weight: Number,  // in kg
        medicalNotes: String
    },

    declaration: {
        hasCriminalRecord: { type: Boolean, default: false },
        criminalDetails: String,
        accepted: { type: Boolean, default: false },
        acceptedAt: Date
    },

    status: {
        type: String,
        enum: ['Onboarding', 'Active', 'Inactive', 'Exit'],
        default: 'Onboarding'
    },
    onboardingStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    onboardingStage: {
        type: String,
        enum: [
            'Offer Accepted', 
            'Document Submission', 
            'Verification', 
            'Account Creation', 
            'Training / Induction', 
            'Completed'
        ],
        default: 'Offer Accepted'
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
