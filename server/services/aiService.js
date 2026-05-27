import axios from 'axios';

const buildPrompt = (reportData) => `
You are an expert website growth consultant for local businesses.
Analyze this website audit data and return actionable insights.

Business: ${reportData.businessCategory || 'Local business'}
Location: ${reportData.location || 'Not specified'}
Website: ${reportData.websiteUrl}
SEO Score: ${reportData.seoScore}/100
Performance Score: ${reportData.performanceScore}/100
Website Score: ${reportData.websiteScore}/100
Issues found: ${reportData.audit?.issues?.length || 0}

Return JSON with exactly these keys (arrays of 3-5 strings each):
criticalIssues, growthOpportunities, websiteSuggestions, marketingIdeas, leadGenerationAdvice
Be specific and actionable for a ${reportData.businessCategory || 'local'} business.
`;

const fallbackInsights = (reportData) => {
  const cat = reportData.businessCategory || 'local business';
  const seo = reportData.seoScore || 50;
  const perf = reportData.performanceScore || 50;

  return {
    criticalIssues: [
      seo < 60 ? 'SEO score below industry average — fix meta tags and headings immediately' : 'Monitor Core Web Vitals monthly',
      perf < 60 ? 'Page speed hurting conversions — compress images and defer JS' : 'Keep performance audits on a quarterly schedule',
      (reportData.audit?.brokenLinks || 0) > 0 ? 'Broken links detected — fix to preserve crawl budget and trust' : 'Ensure contact forms load under 2s on mobile',
    ],
    growthOpportunities: [
      `Add location-based landing pages for ${reportData.location || 'your service area'}`,
      'Launch a weekly blog targeting long-tail local keywords',
      'Collect and display Google reviews prominently above the fold',
      'Set up Google Business Profile posts synced with site updates',
    ],
    websiteSuggestions: [
      'Add LocalBusiness schema markup with address and hours',
      'Place clear CTA buttons on every service page',
      'Use WebP images with lazy loading below the fold',
      'Create a dedicated /reviews page with structured data',
    ],
    marketingIdeas: [
      `Run geo-targeted ads for "${cat}" near ${reportData.location || 'your city'}`,
      'Partner with complementary local businesses for cross-promotion',
      'Email past customers with a seasonal offer and review request',
      'Share before/after case studies on Instagram and Facebook',
    ],
    leadGenerationAdvice: [
      'Add a free audit or quote calculator as a lead magnet',
      'Use exit-intent popup with 10% first-visit discount',
      'Follow up new leads within 24 hours via phone and email',
      'Track lead source in CRM and double down on top channels',
    ],
  };
};

export const generateAIInsights = async (reportData) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackInsights(reportData);

  try {
    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a website growth consultant. Respond only with valid JSON.' },
          { role: 'user', content: buildPrompt(reportData) },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      },
      {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );

    const content = data.choices[0]?.message?.content;
    return JSON.parse(content);
  } catch {
    return fallbackInsights(reportData);
  }
};

export const chatWithAI = async (message, reportContext, history = []) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const systemContext = reportContext
    ? `You are GrowthForge AI assistant. User's website: ${reportContext.websiteUrl}, SEO: ${reportContext.seoScore}, Performance: ${reportContext.performanceScore}, Category: ${reportContext.businessCategory}. Use their audit data to give specific advice.`
    : 'You are GrowthForge AI, an expert website growth consultant for local businesses.';

  if (!apiKey) {
    return `Based on your GrowthForge report, I'd recommend focusing on SEO (${reportContext?.seoScore || 'N/A'}/100) and performance first. For "${message}" — start with clear CTAs, local schema markup, and mobile speed under 3s. Enable OPENAI_API_KEY for deeper personalized answers.`;
  }

  try {
    const messages = [
      { role: 'system', content: systemContext },
      ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];
    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: 'gpt-4o-mini', messages, temperature: 0.8, max_tokens: 600 },
      { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 30000 }
    );
    return data.choices[0]?.message?.content || 'I could not generate a response. Please try again.';
  } catch {
    return `Great question about "${message.slice(0, 50)}...". Prioritize fixing critical audit issues, then add local SEO content and a strong lead capture form. Connect OPENAI_API_KEY for full AI responses.`;
  }
};
