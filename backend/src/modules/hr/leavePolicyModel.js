const mongoose = require('mongoose');

const leavePolicySchema = new mongoose.Schema({
  year: { type: Number, required: true },
  bereavementLeave: { type: Number, default: 5 },
  sickLeave: { type: Number, default: 8 },
  privilegeLeave: { type: Number, default: 15 },
  applicableFor: { type: [String], default: ["All"] }, // ["All", "Department Name", etc.]
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('LeavePolicy', leavePolicySchema);
