import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Closed', 'Lost'],
      default: 'New',
    },
    notes: { type: String, default: '' },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Lead', leadSchema);
