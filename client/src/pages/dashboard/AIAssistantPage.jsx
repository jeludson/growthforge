import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const suggestions = [
  'How can I improve my website SEO?',
  'What are my critical issues?',
  'Give me marketing ideas for my business',
  'How can I generate more leads?',
];

export default function AIAssistantPage() {
  const { report } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/ai/messages').then(({ data }) => {
      if (data.messages?.length) setMessages(data.messages);
      else setMessages([{ role: 'assistant', content: `Hi! I've analyzed ${report?.websiteUrl || 'your website'}. Ask me anything about improving your growth strategy.` }]);
    }).catch(() => {
      setMessages([{ role: 'assistant', content: 'Hi! I am your GrowthForge AI consultant. How can I help you grow today?' }]);
    });
  }, [report?.websiteUrl]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: msg, reportId: report?._id });
      setMessages((m) => [...m, { role: 'assistant', content: data.message.content }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bot className="text-accent" /> AI Assistant</h1>
        <p className="text-slate-400 text-sm mt-1">Powered by your audit data and growth insights</p>
      </div>

      {report && (
        <div className="grid grid-cols-4 gap-3">
          {[{ l: 'SEO', v: report.seoScore }, { l: 'Performance', v: report.performanceScore }, { l: 'Website', v: report.websiteScore }, { l: 'Leads', v: report.leadPotential }].map((s) => (
            <div key={s.l} className="card-premium !p-3 text-center">
              <p className="text-lg font-bold text-accent">{s.v}</p>
              <p className="text-xs text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card-premium flex-1 flex flex-col min-h-0 !p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-white/5 text-slate-200'}`}>
                {msg.role === 'assistant' && <Bot size={14} className="inline mr-2 text-accent" />}
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && <div className="flex gap-1"><motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity }} className="w-2 h-2 bg-accent rounded-full" /><motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-accent rounded-full" /><motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-accent rounded-full" /></div>}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-accent/20 text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                <Sparkles size={10} /> {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask about your website growth..." className="input-field flex-1" />
            <button onClick={() => send()} disabled={loading} className="btn-primary !px-4"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
