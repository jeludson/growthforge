let leads = [];
let leadIdCounter = 1;

export const getLeads = async (req, res) => {
  const userLeads = leads.filter(l => l.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, leads: userLeads });
};

export const createLead = async (req, res) => {
  const lead = {
    id: leadIdCounter++,
    ...req.body,
    userId: req.user.id,
    createdAt: new Date()
  };
  leads.push(lead);
  res.status(201).json({ success: true, lead });
};

export const updateLead = async (req, res) => {
  const leadIndex = leads.findIndex(l => l.id === parseInt(req.params.id) && l.userId === req.user.id);
  if (leadIndex === -1) return res.status(404).json({ success: false, message: 'Lead not found' });
  leads[leadIndex] = { ...leads[leadIndex], ...req.body };
  res.json({ success: true, lead: leads[leadIndex] });
};

export const deleteLead = async (req, res) => {
  const leadIndex = leads.findIndex(l => l.id === parseInt(req.params.id) && l.userId === req.user.id);
  if (leadIndex === -1) return res.status(404).json({ success: false, message: 'Lead not found' });
  leads.splice(leadIndex, 1);
  res.json({ success: true, message: 'Lead deleted' });
};
