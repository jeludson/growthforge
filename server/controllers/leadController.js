import Lead from '../models/Lead.js';

export const getLeads = async (req, res) => {
  const leads = await Lead.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, leads });
};

export const createLead = async (req, res) => {
  const lead = await Lead.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, lead });
};

export const updateLead = async (req, res) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, lead });
};

export const deleteLead = async (req, res) => {
  const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, message: 'Lead deleted' });
};
