import Report from '../models/Report.js';
import Competitor from '../models/Competitor.js';
import { scanWebsite, calculateSeoScores, calculatePerformance, analyzeCompetitor } from '../services/websiteScanner.js';
import { generateAIInsights } from '../services/aiService.js';
import { generateReportPDF } from '../services/pdfService.js';

const buildAnalytics = (seoScore, perfScore) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    seoTrend: months.map((month, i) => ({ month, score: Math.min(100, seoScore - 15 + i * 3 + Math.floor(Math.random() * 5)) })),
    trafficEstimate: months.map((month, i) => ({ month, visitors: Math.round(800 + i * 120 + seoScore * 8 + Math.random() * 200) })),
    growthMetrics: [
      { label: 'Organic Reach', value: seoScore },
      { label: 'Page Speed', value: perfScore },
      { label: 'Conversion Potential', value: Math.round((seoScore + perfScore) / 2) },
      { label: 'Content Health', value: Math.min(100, seoScore + 5) },
    ],
  };
};

export const generateReport = async (req, res) => {
  try {
    const { websiteUrl, businessCategory, location, competitors = [] } = req.body;
    const scan = await scanWebsite(websiteUrl);
    if (!scan.success) {
      return res.status(400).json({ success: false, message: scan.error });
    }

    const seo = calculateSeoScores(scan, scan.raw);
    const perf = calculatePerformance(scan, scan.raw);
    const websiteScore = Math.round((seo.score + perf.score) / 2 - scan.audit.issues.length * 2);
    const leadPotential = Math.min(100, Math.round(seo.score * 0.4 + perf.score * 0.3 + 25));

    const competitorData = [];
    for (const url of competitors.filter(Boolean).slice(0, 5)) {
      competitorData.push(await analyzeCompetitor(url));
      await Competitor.findOneAndUpdate(
        { user: req.user._id, url },
        { user: req.user._id, url, ...competitorData[competitorData.length - 1] },
        { upsert: true, new: true }
      );
    }

    const draft = {
      websiteUrl,
      businessCategory,
      location,
      seoScore: seo.score,
      performanceScore: perf.score,
      websiteScore: Math.max(0, websiteScore),
      leadPotential,
      audit: scan.audit,
      seo: { ...seo.breakdown, recommendations: seo.recommendations },
      performance: perf,
      competitors: competitorData,
    };

    const aiInsights = await generateAIInsights(draft);

    const report = await Report.create({
      user: req.user._id,
      ...draft,
      aiInsights,
      analytics: buildAnalytics(seo.score, perf.score),
    });

    req.user.websiteUrl = websiteUrl;
    req.user.businessCategory = businessCategory;
    req.user.location = location;
    req.user.competitors = competitors;
    req.user.onboardingComplete = true;
    await req.user.save();

    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReports = async (req, res) => {
  const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, reports });
};

export const getReport = async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  res.json({ success: true, report });
};

export const getLatestReport = async (req, res) => {
  const report = await Report.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, report });
};

export const downloadPDF = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    const buffer = await generateReportPDF(report, req.user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=growthforge-report-${report._id}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rescanWebsite = async (req, res) => {
  const latest = await Report.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  if (!latest) return res.status(404).json({ success: false, message: 'No report to rescan' });
  req.body = {
    websiteUrl: latest.websiteUrl,
    businessCategory: latest.businessCategory,
    location: latest.location,
    competitors: latest.competitors?.map((c) => c.url) || req.user.competitors,
  };
  return generateReport(req, res);
};
