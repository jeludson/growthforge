import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20',
  emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
  rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/20',
};

export default function StatCard({ title, value, suffix = '', icon: Icon, trend, color = 'indigo', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`card-premium bg-gradient-to-br ${colorMap[color]} border hover:shadow-glow transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">
            {value}
            {suffix && <span className="text-lg text-slate-400 font-normal">{suffix}</span>}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-white/5">
            <Icon className="text-accent" size={22} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
