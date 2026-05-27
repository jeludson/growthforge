import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GrowthChart({ data = [] }) {
  const chartData = data.length ? data : [
    { label: 'Week 1', value: 42 }, { label: 'Week 2', value: 48 }, { label: 'Week 3', value: 55 },
    { label: 'Week 4', value: 62 }, { label: 'Week 5', value: 68 }, { label: 'Week 6', value: 74 },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
