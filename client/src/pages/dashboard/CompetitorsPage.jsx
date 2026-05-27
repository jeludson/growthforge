import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ui/ProgressBar';
import CompetitorChart from '../../charts/CompetitorChart';
import api from '../../services/api';

export default function CompetitorsPage() {
  const { report } = useAuth();
  const [newUrl, setNewUrl] = useState('');
  const [competitors, setCompetitors] = useState(report?.competitors || []);

  const addCompetitor = async () => {
    if (!newUrl) return;
    try {
      const { data } = await api.post('/competitors', { url: newUrl });
      setCompetitors((c) => [...c, data.competitor]);
      setNewUrl('');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to add');
    }
  };

  const display = competitors.length ? competitors : report?.competitors || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Competitor Analyzer</h1>
        <div className="flex gap-2">
          <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="input-field !py-2 text-sm w-48" placeholder="competitor.com" />
          <button onClick={addCompetitor} className="btn-primary !py-2 flex items-center gap-1"><Plus size={16} /> Add</button>
        </div>
      </div>

      {display.length > 0 && (
        <div className="card-premium">
          <CompetitorChart competitors={display} userScores={{ seo: report?.seoScore, speed: report?.performanceScore }} />
        </div>
      )}

      <div className="card-premium overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-white/10">
              <th className="text-left py-3 px-2">Website</th>
              <th className="text-left py-3 px-2">SEO</th>
              <th className="text-left py-3 px-2">Speed</th>
              <th className="text-left py-3 px-2">Traffic Est.</th>
              <th className="text-left py-3 px-2">Blog</th>
              <th className="text-left py-3 px-2">Social</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 bg-accent/5">
              <td className="py-4 px-2 font-medium text-accent">You ({report?.websiteUrl?.replace(/^https?:\/\//, '').slice(0, 20)})</td>
              <td className="py-4 px-2">{report?.seoScore}</td>
              <td className="py-4 px-2">{report?.performanceScore}</td>
              <td className="py-4 px-2">—</td>
              <td className="py-4 px-2">—</td>
              <td className="py-4 px-2">—</td>
            </tr>
            {display.map((c, i) => (
              <motion.tr key={c.url || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-2">{c.url}</td>
                <td className="py-4 px-2">
                  <div className="w-24"><ProgressBar value={c.seoScore} color="bg-accent" size="sm" /></div>
                  <span className="text-xs text-slate-500">{c.seoScore}</span>
                </td>
                <td className="py-4 px-2">
                  <div className="w-24"><ProgressBar value={c.speedScore} color="bg-emerald-500" size="sm" /></div>
                  <span className="text-xs text-slate-500">{c.speedScore}</span>
                </td>
                <td className="py-4 px-2">{c.trafficEstimate?.toLocaleString()}</td>
                <td className="py-4 px-2">{c.blogFrequency}</td>
                <td className="py-4 px-2"><span className={`px-2 py-0.5 rounded text-xs ${c.socialActivity === 'High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{c.socialActivity}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
