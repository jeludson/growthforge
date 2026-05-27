import { chatWithAI } from '../services/aiService.js';

let messages = [];
let messageIdCounter = 1;
let reports = [];

export const sendMessage = async (req, res) => {
  try {
    const { message, reportId } = req.body;
    const report = reportId
      ? reports.find(r => r.id === parseInt(reportId) && r.userId === req.user.id)
      : reports.filter(r => r.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    const history = messages.filter(m => m.userId === req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    const historyFormatted = history.reverse().map((m) => ({ role: m.role, content: m.content }));

    const userMsg = {
      id: messageIdCounter++,
      userId: req.user.id,
      role: 'user',
      content: message,
      reportId: report?.id,
      createdAt: new Date()
    };
    messages.push(userMsg);

    const reply = await chatWithAI(message, report, historyFormatted);
    const assistantMsg = {
      id: messageIdCounter++,
      userId: req.user.id,
      role: 'assistant',
      content: reply,
      reportId: report?.id,
      createdAt: new Date()
    };
    messages.push(assistantMsg);

    const io = req.app.get('io');
    if (io) io.to(req.user.id.toString()).emit('ai:message', { role: 'assistant', content: reply });

    res.json({ success: true, message: assistantMsg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMessages = async (req, res) => {
  const userMessages = messages.filter(m => m.userId === req.user.id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, 50);
  res.json({ success: true, messages: userMessages });
};
