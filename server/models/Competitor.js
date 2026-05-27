import mongoose from 'mongoose';

const competitorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    name: { type: String, default: '' },
    seoScore: { type: Number, default: 0 },
    speedScore: { type: Number, default: 0 },
    trafficEstimate: { type: Number, default: 0 },
    blogFrequency: { type: String, default: 'Unknown' },
    socialActivity: { type: String, default: 'Low' },
  },
  { timestamps: true }
);

export default mongoose.model('Competitor', competitorSchema);
