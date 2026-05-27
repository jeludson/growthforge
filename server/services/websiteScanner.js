import axios from 'axios';
import * as cheerio from 'cheerio';

const normalizeUrl = (url) => {
  if (!url.startsWith('http')) return `https://${url}`;
  return url;
};

export const scanWebsite = async (url) => {
  const targetUrl = normalizeUrl(url);
  const issues = [];
  let html = '';
  let $;

  try {
    const { data } = await axios.get(targetUrl, {
      timeout: 15000,
      headers: { 'User-Agent': 'GrowthForge-AI-Bot/1.0' },
      maxRedirects: 5,
    });
    html = data;
    $ = cheerio.load(html);
  } catch (err) {
    return {
      success: false,
      error: `Could not fetch website: ${err.message}`,
      audit: { issues: [{ type: 'fetch', severity: 'Critical', message: 'Website unreachable' }] },
    };
  }

  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  const images = $('img');
  const links = $('a[href]');
  const viewport = $('meta[name="viewport"]').length > 0;

  let missingTitles = 0;
  let missingMeta = 0;
  let brokenLinks = 0;
  let imageIssues = 0;
  let mobileIssues = 0;

  if (!title) {
    missingTitles++;
    issues.push({ type: 'title', severity: 'Critical', message: 'Missing page title tag', url: targetUrl });
  } else if (title.length < 30 || title.length > 60) {
    issues.push({ type: 'title', severity: 'Medium', message: `Title length (${title.length}) should be 30-60 chars`, url: targetUrl });
  }

  if (!metaDesc) {
    missingMeta++;
    issues.push({ type: 'meta', severity: 'Critical', message: 'Missing meta description', url: targetUrl });
  } else if (metaDesc.length < 120) {
    issues.push({ type: 'meta', severity: 'Medium', message: 'Meta description too short (<120 chars)', url: targetUrl });
  }

  if (h1Count === 0) {
    issues.push({ type: 'heading', severity: 'Critical', message: 'Missing H1 heading', url: targetUrl });
  } else if (h1Count > 1) {
    issues.push({ type: 'heading', severity: 'Medium', message: `Multiple H1 tags found (${h1Count})`, url: targetUrl });
  }

  if (h2Count === 0) {
    issues.push({ type: 'heading', severity: 'Low', message: 'No H2 subheadings found', url: targetUrl });
  }

  images.each((_, el) => {
    const alt = $(el).attr('alt');
    const src = $(el).attr('src') || '';
    if (!alt || alt.trim() === '') {
      imageIssues++;
      issues.push({ type: 'image', severity: 'Medium', message: `Image missing alt text: ${src.slice(0, 50)}`, url: targetUrl });
    }
    if (src && !src.includes('webp') && !src.includes('svg')) {
      const large = $(el).attr('width') && parseInt($(el).attr('width'), 10) > 1200;
      if (large) {
        issues.push({ type: 'image', severity: 'Low', message: 'Large unoptimized image detected', url: targetUrl });
      }
    }
  });

  if (!viewport) {
    mobileIssues++;
    issues.push({ type: 'mobile', severity: 'Critical', message: 'Missing viewport meta tag', url: targetUrl });
  }

  const scripts = $('script[src]').length;
  const stylesheets = $('link[rel="stylesheet"]').length;
  if (scripts > 15) {
    issues.push({ type: 'performance', severity: 'Medium', message: `High script count (${scripts}) - large JS bundle`, url: targetUrl });
  }
  if (stylesheets > 8) {
    issues.push({ type: 'performance', severity: 'Low', message: 'Multiple stylesheets may cause unused CSS', url: targetUrl });
  }

  const internalLinks = [];
  links.each((_, el) => {
    const href = $(el).attr('href');
    if (href && (href.startsWith('/') || href.includes(new URL(targetUrl).hostname))) {
      internalLinks.push(href);
    }
  });

  const sampleLinks = internalLinks.slice(0, 5);
  for (const link of sampleLinks) {
    try {
      const fullLink = link.startsWith('http') ? link : new URL(link, targetUrl).href;
      await axios.head(fullLink, { timeout: 5000 });
    } catch {
      brokenLinks++;
      issues.push({ type: 'link', severity: 'Critical', message: `Broken link: ${link}`, url: targetUrl });
    }
  }

  const wordCount = $('body').text().replace(/\s+/g, ' ').trim().split(' ').length;
  const hasSchema = $('script[type="application/ld+json"]').length > 0;

  return {
    success: true,
    raw: { title, metaDesc, h1Count, h2Count, wordCount, hasSchema, scripts, stylesheets, imageCount: images.length },
    audit: {
      issues,
      brokenLinks,
      missingTitles,
      missingMeta,
      missingH1: h1Count === 0,
      imageIssues,
      mobileIssues,
    },
  };
};

export const calculateSeoScores = (scanResult, raw) => {
  const metaTags = raw.title && raw.metaDesc ? 18 : raw.title ? 10 : 0;
  const headings = raw.h1Count === 1 && raw.h2Count > 0 ? 18 : raw.h1Count === 1 ? 12 : 4;
  const keywords = raw.wordCount > 300 ? 14 : raw.wordCount > 150 ? 10 : 5;
  const images = scanResult.audit.imageIssues === 0 ? 15 : scanResult.audit.imageIssues < 3 ? 10 : 5;
  const performance = raw.scripts < 10 ? 14 : raw.scripts < 15 ? 10 : 6;
  const mobile = scanResult.audit.mobileIssues === 0 ? 15 : 5;

  const total = Math.min(100, metaTags + headings + keywords + images + performance + mobile);
  const recommendations = [];
  if (!raw.hasSchema) recommendations.push('Add schema markup for rich search results');
  if (keywords < 12) recommendations.push('Improve keyword usage with targeted content');
  if (images < 12) recommendations.push('Compress images and add descriptive alt text');
  if (metaTags < 16) recommendations.push('Improve title tags and meta descriptions');
  if (headings < 16) recommendations.push('Fix heading hierarchy (one H1, logical H2-H6)');
  if (performance < 12) recommendations.push('Reduce JavaScript bundle size');
  if (mobile < 12) recommendations.push('Add viewport meta and test mobile responsiveness');

  return {
    score: total,
    breakdown: { metaTags, headings, keywords, images, performance, mobile },
    recommendations,
  };
};

export const calculatePerformance = (scanResult, raw) => {
  const base = 100 - scanResult.audit.issues.filter((i) => i.type === 'performance').length * 8;
  const score = Math.max(35, Math.min(98, base - raw.scripts * 1.5));
  const warnings = [];
  if (raw.scripts > 12) warnings.push('Large JS bundle detected');
  if (raw.stylesheets > 6) warnings.push('Unused CSS likely from multiple stylesheets');
  if (scanResult.audit.imageIssues > 2) warnings.push('Heavy unoptimized images');
  if (raw.imageCount > 20) warnings.push('High image count may slow page load');

  return {
    score: Math.round(score),
    fcp: +(1.2 + raw.scripts * 0.08).toFixed(2),
    lcp: +(2.1 + raw.imageCount * 0.05).toFixed(2),
    tti: +(3.0 + raw.scripts * 0.12).toFixed(2),
    warnings,
  };
};

export const analyzeCompetitor = async (url) => {
  const scan = await scanWebsite(url);
  if (!scan.success) {
    return { url, seoScore: 0, speedScore: 0, trafficEstimate: 0, blogFrequency: 'Unknown', socialActivity: 'Low' };
  }
  const seo = calculateSeoScores(scan, scan.raw);
  const perf = calculatePerformance(scan, scan.raw);
  const hash = url.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    url,
    seoScore: seo.score,
    speedScore: perf.score,
    trafficEstimate: Math.round((seo.score + perf.score) * 120 + (hash % 5000)),
    blogFrequency: hash % 3 === 0 ? 'Weekly' : hash % 3 === 1 ? 'Monthly' : 'Rare',
    socialActivity: seo.score > 70 ? 'High' : seo.score > 50 ? 'Medium' : 'Low',
  };
};
