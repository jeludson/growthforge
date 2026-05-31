import { analyzeCompetitor } from '../services/websiteScanner.js';
import { store } from '../store.js';

export const getCompetitors = async (req, res) => {
  const userCompetitors = store.competitors.filter(c => c.userId === req.user.id);
  res.json({ success: true, competitors: userCompetitors });
};

export const addCompetitor = async (req, res) => {
  try {
    const data = await analyzeCompetitor(req.body.url);
    const existing = store.competitors.find(c => c.userId === req.user.id && c.url === req.body.url);
    if (existing) {
      Object.assign(existing, { name: req.body.name || '', ...data });
      res.status(200).json({ success: true, competitor: existing });
    } else {
      const competitor = {
        id: store.competitorIdCounter++,
        userId: req.user.id,
        url: req.body.url,
        name: req.body.name || '',
        ...data,
        createdAt: new Date()
      };
      store.competitors.push(competitor);
      res.status(201).json({ success: true, competitor });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCompetitor = async (req, res) => {
  const index = store.competitors.findIndex(c => c.id === parseInt(req.params.id) && c.userId === req.user.id);
  if (index !== -1) {
    store.competitors.splice(index, 1);
  }
  res.json({ success: true });
};
