import Message from '../models/Message.js';
import Report from '../models/Report.js';
import { chatWithAI } from '../services/aiService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, reportId } = req.body;
    const report = reportId
      ? await Report.findOne({ _id: reportId, user: req.user._id })
      : await Report.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    const history = await Message.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const historyFormatted = history.reverse().map((m) => ({ role: m.role, content: m.content }));

    await Message.create({ user: req.user._id, role: 'user', content: message, reportId: report?._id });
    const reply = await chatWithAI(message, report, historyFormatted);
    const assistantMsg = await Message.create({ user: req.user._id, role: 'assistant', content: reply, reportId: report?._id });

    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('ai:message', { role: 'assistant', content: reply });

    res.json({ success: true, message: assistantMsg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMessages = async (req, res) => {
  const messages = await Message.find({ user: req.user._id }).sort({ createdAt: 1 }).limit(50);
  res.json({ success: true, messages });
};
