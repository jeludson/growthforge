import { motion } from 'framer-motion';
import { Globe, Search, Gauge, Target, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import SeoTrendChart from '../../charts/SeoTrendChart';
import TrafficChart from '../../charts/TrafficChart';
import CompetitorChart from '../../charts/CompetitorChart';
import GrowthChart from '../../charts/GrowthChart';
import api from '../../services/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const { report, fetchReport, user } = useAuth();
  const [rescanning, setRescanning] = useState(false);

  const handleRescan = async () => {
    setRescanning(true);
    try {
      await api.post('/reports/rescan');
      await fetchReport();
    } catch (e) {
      alert(e.response?.data?.message || 'Rescan failed');
    }
    setRescanning(false);
  };

  if (!report) {
    return (
      <div className="card-premium text-center py-16">
        <h2 className="text-xl font-bold mb-2">No report yet</h2>
        <p className="text-slate-400 mb-6">Complete onboarding to generate your first AI report</p>
        <Link to="/onboarding" className="btn-primary inline-block">Start Onboarding</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</motion.h1>
          <p className="text-slate-400 text-sm mt-1">{report.websiteUrl} · Last scanned {new Date(report.updatedAt || report.createdAt).toLocaleDateString()}</p>
        </div>
        <button onClick={handleRescan} disabled={rescanning} className="btn-secondary flex items-center gap-2 text-sm !py-2">
          <RefreshCw size={16} className={rescanning ? 'animate-spin' : ''} /> {rescanning ? 'Scanning...' : 'Rescan Website'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Website Score" value={report.websiteScore} icon={Globe} color="indigo" trend={5} delay={0} />
        <StatCard title="SEO Score" value={report.seoScore} icon={Search} color="emerald" trend={8} delay={0.1} />
        <StatCard title="Performance" value={report.performanceScore} icon={Gauge} color="amber" trend={3} delay={0.2} />
        <StatCard title="Lead Potential" value={report.leadPotential} icon={Target} color="rose" trend={12} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-premium">
          <h3 className="font-semibold mb-4">SEO Trend</h3>
          <SeoTrendChart data={report.analytics?.seoTrend} />
        </div>
        <div className="card-premium">
          <h3 className="font-semibold mb-4">Traffic Estimate</h3>
          <TrafficChart data={report.analytics?.trafficEstimate} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-premium">
          <h3 className="font-semibold mb-4">Competitor Comparison</h3>
          <CompetitorChart
            competitors={report.competitors || []}
            userScores={{ seo: report.seoScore, speed: report.performanceScore, traffic: report.analytics?.trafficEstimate?.[5]?.visitors }}
          />
        </div>
        <div className="card-premium">
          <h3 className="font-semibold mb-4">Growth Analytics</h3>
          <GrowthChart data={report.analytics?.growthMetrics} />
        </div>
      </div>
    </div>
  );
}
