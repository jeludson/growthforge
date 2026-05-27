import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrafficChart({ data = [] }) {
  const chartData = data.length ? data : [
    { month: 'Jan', visitors: 1200 }, { month: 'Feb', visitors: 1450 }, { month: 'Mar', visitors: 1680 },
    { month: 'Apr', visitors: 1920 }, { month: 'May', visitors: 2100 }, { month: 'Jun', visitors: 2450 },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
        />
        <Bar dataKey="visitors" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
