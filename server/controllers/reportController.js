import { scanWebsite, calculateSeoScores, calculatePerformance, analyzeCompetitor } from '../services/websiteScanner.js';
import { generateAIInsights } from '../services/aiService.js';
import { generateReportPDF } from '../services/pdfService.js';
import { store } from '../store.js';

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
    const { websiteUrl, businessCategory, location, competitors: compUrls = [] } = req.body;
    const scan = await scanWebsite(websiteUrl);
    if (!scan.success) {
      return res.status(400).json({ success: false, message: scan.error });
    }

    const seo = calculateSeoScores(scan, scan.raw);
    const perf = calculatePerformance(scan, scan.raw);
    const websiteScore = Math.round((seo.score + perf.score) / 2 - scan.audit.issues.length * 2);
    const leadPotential = Math.min(100, Math.round(seo.score * 0.4 + perf.score * 0.3 + 25));

    const competitorData = [];
    for (const url of compUrls.filter(Boolean).slice(0, 5)) {
      const comp = await analyzeCompetitor(url);
      competitorData.push(comp);
      const existing = store.competitors.find(c => c.userId === req.user.id && c.url === url);
      if (existing) {
        Object.assign(existing, comp);
      } else {
        store.competitors.push({ id: store.competitorIdCounter++, ...comp, url, userId: req.user.id, createdAt: new Date() });
      }
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

    const report = {
      id: store.reportIdCounter++,
      userId: req.user.id,
      ...draft,
      aiInsights,
      analytics: buildAnalytics(seo.score, perf.score),
      createdAt: new Date()
    };
    store.reports.push(report);

    res.status(201).json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReports = async (req, res) => {
  const userReports = store.reports.filter(r => r.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, reports: userReports });
};

export const getReport = async (req, res) => {
  const report = store.reports.find(r => r.id === parseInt(req.params.id) && r.userId === req.user.id);
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  res.json({ success: true, report });
};

export const getLatestReport = async (req, res) => {
  const userReports = store.reports.filter(r => r.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const report = userReports[0] || null;
  res.json({ success: true, report });
};

export const downloadPDF = async (req, res) => {
  try {
    const report = store.reports.find(r => r.id === parseInt(req.params.id) && r.userId === req.user.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    const buffer = await generateReportPDF(report, req.user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=growthforge-report-${report.id}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rescanWebsite = async (req, res) => {
  const userReports = store.reports.filter(r => r.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latest = userReports[0];
  if (!latest) return res.status(404).json({ success: false, message: 'No report to rescan' });
  req.body = {
    websiteUrl: latest.websiteUrl,
    businessCategory: latest.businessCategory,
    location: latest.location,
    competitors: latest.competitors?.map((c) => c.url) || [],
  };
  return generateReport(req, res);
};
