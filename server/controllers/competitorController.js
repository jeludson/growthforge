import Competitor from '../models/Competitor.js';
import { analyzeCompetitor } from '../services/websiteScanner.js';

export const getCompetitors = async (req, res) => {
  const competitors = await Competitor.find({ user: req.user._id });
  res.json({ success: true, competitors });
};

export const addCompetitor = async (req, res) => {
  try {
    const data = await analyzeCompetitor(req.body.url);
    const competitor = await Competitor.findOneAndUpdate(
      { user: req.user._id, url: req.body.url },
      { user: req.user._id, name: req.body.name || '', ...data },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, competitor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCompetitor = async (req, res) => {
  await Competitor.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ success: true });
};
