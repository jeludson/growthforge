import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function CompetitorChart({ competitors = [], userScores = {} }) {
  const data = [
    { metric: 'SEO', you: userScores.seo || 70, ...Object.fromEntries(competitors.slice(0, 2).map((c, i) => [`c${i}`, c.seoScore])) },
    { metric: 'Speed', you: userScores.speed || 65, ...Object.fromEntries(competitors.slice(0, 2).map((c, i) => [`c${i}`, c.speedScore])) },
    { metric: 'Traffic', you: Math.min(100, (userScores.traffic || 5000) / 100), ...Object.fromEntries(competitors.slice(0, 2).map((c, i) => [`c${i}`, Math.min(100, c.trafficEstimate / 100)])) },
  ];

  const colors = ['#6366f1', '#f59e0b', '#10b981'];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#334155" />
        <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
        <Radar name="You" dataKey="you" stroke={colors[0]} fill={colors[0]} fillOpacity={0.3} />
        {competitors.slice(0, 2).map((c, i) => (
          <Radar key={c.url} name={c.url.replace(/^https?:\/\//, '').slice(0, 15)} dataKey={`c${i}`} stroke={colors[i + 1]} fill={colors[i + 1]} fillOpacity={0.2} />
        ))}
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
