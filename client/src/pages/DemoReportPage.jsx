import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import ScoreCircle from '../components/ui/ScoreCircle';
import { SeverityBadge } from '../components/ui/ProgressBar';
import { demoReport } from '../data/demoReport';
import { Globe, Search, Gauge, Target } from 'lucide-react';

export default function DemoReportPage() {
  const r = demoReport;
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 text-sm"><ArrowLeft size={16} /> Back</Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Zap size={20} /></div>
          <div>
            <h1 className="text-2xl font-bold">Demo Growth Report</h1>
            <p className="text-slate-400 text-sm">{r.websiteUrl} · {r.businessCategory} · {r.location}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Website Score" value={r.websiteScore} icon={Globe} color="indigo" />
          <StatCard title="SEO Score" value={r.seoScore} icon={Search} color="emerald" />
          <StatCard title="Performance" value={r.performanceScore} icon={Gauge} color="amber" />
          <StatCard title="Lead Potential" value={r.leadPotential} icon={Target} color="rose" />
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-premium flex justify-center"><ScoreCircle score={r.seoScore} label="SEO Score" /></div>
          <div className="card-premium">
            <h3 className="font-semibold mb-4">Audit Issues</h3>
            <div className="space-y-3">{r.audit.issues.map((issue, i) => (
              <div key={i} className="flex items-start justify-between gap-2 p-3 rounded-xl bg-background/50">
                <p className="text-sm text-slate-300">{issue.message}</p>
                <SeverityBadge severity={issue.severity} />
              </div>
            ))}</div>
          </div>
        </div>
        <div className="card-premium mb-8">
          <h3 className="font-semibold mb-4">AI Recommendations</h3>
          {Object.entries(r.aiInsights).map(([key, items]) => (
            <div key={key} className="mb-4">
              <p className="text-sm text-accent font-medium capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
              <ul className="space-y-1">{items.map((item, i) => <li key={i} className="text-sm text-slate-400">• {item}</li>)}</ul>
            </div>
          ))}
        </div>
        <Link to="/signup" className="btn-primary inline-block">Start Your Free Analysis</Link>
      </div>
    </div>
  );
}
