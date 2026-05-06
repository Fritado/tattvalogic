const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  
  // Bereavement Leave
  bereavementAllocated: { type: Number, default: 5 },
  bereavementUsed: { type: Number, default: 0 },
  bereavementPending: { type: Number, default: 0 },

  // Sick Leave
  sickAllocated: { type: Number, default: 8 },
  sickUsed: { type: Number, default: 0 },
  sickPending: { type: Number, default: 0 },

  // Privilege Leave
  privilegeAllocated: { type: Number, default: 15 },
  privilegeUsed: { type: Number, default: 0 },
  privilegePending: { type: Number, default: 0 },

  // Optional Holiday
  optionalAllocated: { type: Number, default: 2 },
  optionalUsed: { type: Number, default: 0 },
  optionalPending: { type: Number, default: 0 }
}, { timestamps: true });

leaveBalanceSchema.index({ userId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
