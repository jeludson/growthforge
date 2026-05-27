import { motion } from 'framer-motion';

const severityColors = {
  Critical: 'bg-red-500',
  Medium: 'bg-amber-500',
  Low: 'bg-emerald-500',
};

export default function ProgressBar({ value, max = 100, label, color = 'bg-accent', size = 'md' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const h = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-slate-400">{label}</span>
          <span className="text-white font-medium">{pct}%</span>
        </div>
      )}
      <div className={`w-full ${h} bg-slate-700/50 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`${h} ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

export function SeverityBadge({ severity }) {
  const colors = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${colors[severity] || colors.Medium}`}>
      {severity}
    </span>
  );
}

export { severityColors };
