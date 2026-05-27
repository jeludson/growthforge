import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  type: String,
  severity: { type: String, enum: ['Critical', 'Medium', 'Low'], default: 'Medium' },
  message: String,
  url: String,
});

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    websiteUrl: { type: String, required: true },
    businessCategory: String,
    location: String,
    websiteScore: { type: Number, default: 0 },
    seoScore: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },
    leadPotential: { type: Number, default: 0 },
    audit: {
      issues: [issueSchema],
      brokenLinks: { type: Number, default: 0 },
      missingTitles: { type: Number, default: 0 },
      missingMeta: { type: Number, default: 0 },
      missingH1: { type: Boolean, default: false },
      imageIssues: { type: Number, default: 0 },
      mobileIssues: { type: Number, default: 0 },
    },
    seo: {
      metaTags: { type: Number, default: 0 },
      headings: { type: Number, default: 0 },
      keywords: { type: Number, default: 0 },
      images: { type: Number, default: 0 },
      performance: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      recommendations: [String],
    },
    performance: {
      fcp: Number,
      lcp: Number,
      tti: Number,
      warnings: [String],
    },
    competitors: [
      {
        url: String,
        seoScore: Number,
        speedScore: Number,
        trafficEstimate: Number,
        blogFrequency: String,
        socialActivity: String,
      },
    ],
    aiInsights: {
      criticalIssues: [String],
      growthOpportunities: [String],
      websiteSuggestions: [String],
      marketingIdeas: [String],
      leadGenerationAdvice: [String],
    },
    analytics: {
      seoTrend: [{ month: String, score: Number }],
      trafficEstimate: [{ month: String, visitors: Number }],
      growthMetrics: [{ label: String, value: Number }],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
