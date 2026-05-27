import { motion } from 'framer-motion';

export function Skeleton({ className = '' }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`bg-slate-700/50 rounded-xl ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-premium space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
