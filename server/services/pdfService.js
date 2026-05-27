import PDFDocument from 'pdfkit';

export const generateReportPDF = (report, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const primary = '#6366f1';
    const dark = '#0f172a';
    const card = '#1e293b';

    doc.rect(0, 0, doc.page.width, 120).fill(dark);
    doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('GrowthForge AI', 50, 40);
    doc.fontSize(12).font('Helvetica').fillColor('#94a3b8').text('Analyze. Improve. Grow.', 50, 75);
    doc.fillColor(primary).fontSize(14).text('Website Growth Report', 50, 95);

    doc.fillColor('#000000').fontSize(11);
    let y = 140;

    const section = (title) => {
      y += 15;
      doc.fillColor(card).rect(50, y, doc.page.width - 100, 28).fill();
      doc.fillColor('#ffffff').fontSize(13).font('Helvetica-Bold').text(title, 60, y + 8);
      y += 38;
      doc.fillColor('#334155').font('Helvetica');
    };

    doc.fontSize(11).fillColor('#475569');
    doc.text(`Business: ${user?.name || 'N/A'}`, 50, y);
    y += 16;
    doc.text(`Website: ${report.websiteUrl}`, 50, y);
    y += 16;
    doc.text(`Category: ${report.businessCategory || 'N/A'} | Location: ${report.location || 'N/A'}`, 50, y);
    y += 16;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 50, y);
    y += 25;

    section('Audit Scores');
    doc.fillColor('#000000').fontSize(11);
    doc.text(`Website Score: ${report.websiteScore}/100`, 60, y); y += 18;
    doc.text(`SEO Score: ${report.seoScore}/100`, 60, y); y += 18;
    doc.text(`Performance Score: ${report.performanceScore}/100`, 60, y); y += 18;
    doc.text(`Lead Potential: ${report.leadPotential}/100`, 60, y); y += 25;

    section('Critical Issues');
    const issues = report.audit?.issues?.filter((i) => i.severity === 'Critical').slice(0, 8) || [];
    issues.forEach((issue) => {
      doc.text(`• ${issue.message}`, 60, y, { width: doc.page.width - 120 });
      y += 16;
    });
    if (!issues.length) { doc.text('No critical issues detected.', 60, y); y += 18; }

    if (y > 650) { doc.addPage(); y = 50; }

    section('AI Recommendations');
    const ai = report.aiInsights || {};
    ['criticalIssues', 'growthOpportunities', 'websiteSuggestions', 'marketingIdeas', 'leadGenerationAdvice'].forEach((key) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
      doc.font('Helvetica-Bold').text(label + ':', 60, y); y += 16;
      doc.font('Helvetica');
      (ai[key] || []).slice(0, 4).forEach((item) => {
        doc.text(`• ${item}`, 65, y, { width: doc.page.width - 130 });
        y += 14;
      });
      y += 8;
      if (y > 700) { doc.addPage(); y = 50; }
    });

    section('Competitor Comparison');
    (report.competitors || []).forEach((c) => {
      doc.text(`${c.url} — SEO: ${c.seoScore} | Speed: ${c.speedScore} | Traffic est: ${c.trafficEstimate}`, 60, y, { width: doc.page.width - 120 });
      y += 18;
    });

    y += 20;
    doc.fillColor(primary).fontSize(10).text('© GrowthForge AI — Confidential Growth Report', 50, doc.page.height - 50, { align: 'center', width: doc.page.width - 100 });

    doc.end();
  });
};
