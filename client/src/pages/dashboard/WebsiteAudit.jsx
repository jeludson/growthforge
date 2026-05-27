import { motion } from 'framer-motion';
import { AlertTriangle, Link2, Image, Smartphone, Type } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProgressBar, { SeverityBadge } from '../../components/ui/ProgressBar';

const issueIcons = { link: Link2, image: Image, mobile: Smartphone, title: Type, meta: Type, heading: Type, performance: AlertTriangle };

export default function WebsiteAudit() {
  const { report } = useAuth();
  if (!report) return <Empty />;

  const issues = report.audit?.issues || [];
  const critical = issues.filter((i) => i.severity === 'Critical').length;
  const medium = issues.filter((i) => i.severity === 'Medium').length;
  const low = issues.filter((i) => i.severity === 'Low').length;
  const total = issues.length || 1;
  const healthScore = Math.max(0, 100 - critical * 15 - medium * 8 - low * 3);

  const checks = [
    { label: 'Broken Links', value: report.audit?.brokenLinks || 0, max: 10, icon: Link2 },
    { label: 'Missing Titles', value: report.audit?.missingTitles || 0, max: 5, icon: Type },
    { label: 'Missing Meta', value: report.audit?.missingMeta || 0, max: 5, icon: Type },
    { label: 'Image Issues', value: report.audit?.imageIssues || 0, max: 10, icon: Image },
    { label: 'Mobile Issues', value: report.audit?.mobileIssues || 0, max: 5, icon: Smartphone },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Website Audit</h1>
      <p className="text-slate-400 text-sm">Scanning {report.websiteUrl}</p>

      <div className="grid sm:grid-cols-4 gap-4">
        {[{ l: 'Critical', c: critical, color: 'bg-red-500' }, { l: 'Medium', c: medium, color: 'bg-amber-500' }, { l: 'Low', c: low, color: 'bg-emerald-500' }, { l: 'Health Score', c: healthScore, color: 'bg-accent', suffix: '/100' }].map((s) => (
          <div key={s.l} className="card-premium text-center">
            <p className="text-3xl font-bold">{s.c}{s.suffix || ''}</p>
            <p className="text-sm text-slate-400 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="card-premium">
        <h3 className="font-semibold mb-4">Audit Progress</h3>
        <ProgressBar value={healthScore} label="Overall Website Health" color="bg-accent" size="lg" />
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <c.icon size={18} className="text-slate-500" />
              <div className="flex-1">
                <ProgressBar value={Math.max(0, 100 - c.value * 20)} label={c.label} color={c.value > 0 ? 'bg-amber-500' : 'bg-emerald-500'} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium">
        <h3 className="font-semibold mb-4">All Issues ({issues.length})</h3>
        <div className="space-y-3">
          {issues.map((issue, i) => {
            const Icon = issueIcons[issue.type] || AlertTriangle;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors">
                <Icon size={20} className="text-slate-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{issue.message}</p>
                  <p className="text-xs text-slate-500 mt-1 capitalize">{issue.type} issue</p>
                </div>
                <SeverityBadge severity={issue.severity} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {report.audit?.missingH1 && (
        <div className="card-premium border-red-500/30 bg-red-500/5">
          <p className="text-red-400 font-medium">⚠ Missing H1 tag detected — add one primary heading per page</p>
        </div>
      )}
    </div>
  );
}

function Empty() {
  return <div className="card-premium text-center py-12 text-slate-400">Generate a report from onboarding first.</div>;
}
