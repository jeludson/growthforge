import { analyzeCompetitor } from '../services/websiteScanner.js';

let competitors = [];
let competitorIdCounter = 1;

export const getCompetitors = async (req, res) => {
  const userCompetitors = competitors.filter(c => c.userId === req.user.id);
  res.json({ success: true, competitors: userCompetitors });
};

export const addCompetitor = async (req, res) => {
  try {
    const data = await analyzeCompetitor(req.body.url);
    const existing = competitors.find(c => c.userId === req.user.id && c.url === req.body.url);
    if (existing) {
      Object.assign(existing, { name: req.body.name || '', ...data });
      res.status(200).json({ success: true, competitor: existing });
    } else {
      const competitor = {
        id: competitorIdCounter++,
        userId: req.user.id,
        url: req.body.url,
        name: req.body.name || '',
        ...data,
        createdAt: new Date()
      };
      competitors.push(competitor);
      res.status(201).json({ success: true, competitor });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCompetitor = async (req, res) => {
  const index = competitors.findIndex(c => c.id === parseInt(req.params.id) && c.userId === req.user.id);
  if (index !== -1) {
    competitors.splice(index, 1);
  }
  res.json({ success: true });
};
