import { useAuth } from '../../context/AuthContext';
import ScoreCircle from '../../components/ui/ScoreCircle';
import ProgressBar from '../../components/ui/ProgressBar';
import { CheckCircle2 } from 'lucide-react';

const categories = [
  { key: 'metaTags', label: 'Meta Tags', max: 20 },
  { key: 'headings', label: 'Headings', max: 20 },
  { key: 'keywords', label: 'Keywords', max: 15 },
  { key: 'images', label: 'Images', max: 15 },
  { key: 'performance', label: 'Performance', max: 15 },
  { key: 'mobile', label: 'Mobile', max: 15 },
];

export default function SEOAnalyzer() {
  const { report } = useAuth();
  if (!report) return <div className="card-premium text-center py-12 text-slate-400">No report data</div>;

  const seo = report.seo || {};
  const recommendations = seo.recommendations || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">SEO Analyzer</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-premium flex flex-col items-center justify-center lg:col-span-1">
          <ScoreCircle score={report.seoScore} label="SEO Score" size={160} />
        </div>
        <div className="card-premium lg:col-span-2">
          <h3 className="font-semibold mb-6">Score Breakdown</h3>
          <div className="space-y-4">
            {categories.map((cat) => (
              <ProgressBar
                key={cat.key}
                value={seo[cat.key] || 0}
                max={cat.max}
                label={`${cat.label} (${seo[cat.key] || 0}/${cat.max})`}
                color={seo[cat.key] >= cat.max * 0.7 ? 'bg-emerald-500' : seo[cat.key] >= cat.max * 0.4 ? 'bg-amber-500' : 'bg-red-500'}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="card-premium">
        <h3 className="font-semibold mb-4">Recommendations</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background/50">
              <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
