const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  isOptional: { type: Boolean, default: false },
  applicableFor: { type: [String], default: ["All"] }, // ["All", "Marketing", "Engineering", etc.]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-fetch day of week could be a virtual but we'll handle it on frontend or via helper
holidaySchema.index({ date: 1 });

module.exports = mongoose.model('Holiday', holidaySchema);
