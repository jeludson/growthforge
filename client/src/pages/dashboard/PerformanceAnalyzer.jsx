import { useAuth } from '../../context/AuthContext';
import ScoreCircle from '../../components/ui/ScoreCircle';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle } from 'lucide-react';

export default function PerformanceAnalyzer() {
  const { report } = useAuth();
  if (!report) return <div className="card-premium text-center py-12 text-slate-400">No report data</div>;

  const perf = report.performance || {};
  const metrics = [
    { name: 'FCP', value: perf.fcp || 1.8, unit: 's', good: 1.8 },
    { name: 'LCP', value: perf.lcp || 2.4, unit: 's', good: 2.5 },
    { name: 'TTI', value: perf.tti || 3.2, unit: 's', good: 3.8 },
  ];

  const chartData = metrics.map((m) => ({ name: m.name, seconds: m.value, target: m.good }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Performance Analyzer</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-premium flex justify-center">
          <ScoreCircle score={report.performanceScore} label="Performance Score" color="#10b981" />
        </div>
        <div className="card-premium lg:col-span-2">
          <h3 className="font-semibold mb-4">Core Web Vitals</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {metrics.map((m) => (
              <div key={m.name} className="text-center p-4 rounded-xl bg-background/50">
                <p className="text-xs text-slate-500">{m.name}</p>
                <p className={`text-2xl font-bold mt-1 ${m.value <= m.good ? 'text-emerald-400' : 'text-amber-400'}`}>{m.value}{m.unit}</p>
                <p className="text-xs text-slate-600 mt-1">Target &lt;{m.good}s</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
              <Bar dataKey="seconds" fill="#6366f1" radius={[6, 6, 0, 0]} name="Your site" />
              <Bar dataKey="target" fill="#334155" radius={[6, 6, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card-premium">
        <h3 className="font-semibold mb-4">Warnings</h3>
        <div className="space-y-3">
          {(perf.warnings || []).map((w, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle size={18} className="text-amber-400" />
              <p className="text-sm text-amber-200">{w}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
