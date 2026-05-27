import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SeoTrendChart({ data = [] }) {
  const chartData = data.length ? data : [
    { month: 'Jan', score: 45 }, { month: 'Feb', score: 52 }, { month: 'Mar', score: 58 },
    { month: 'Apr', score: 61 }, { month: 'May', score: 68 }, { month: 'Jun', score: 72 },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="seoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Area type="monotone" dataKey="score" stroke="#6366f1" fill="url(#seoGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
