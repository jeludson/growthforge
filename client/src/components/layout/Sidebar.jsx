import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Gauge,
  Users,
  UserPlus,
  Bot,
  FileText,
  Settings,
  Zap,
  Globe,
} from 'lucide-react';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/audit', icon: Globe, label: 'Website Audit' },
  { to: '/dashboard/seo', icon: Search, label: 'SEO' },
  { to: '/dashboard/performance', icon: Gauge, label: 'Performance' },
  { to: '/dashboard/competitors', icon: Users, label: 'Competitors' },
  { to: '/dashboard/leads', icon: UserPlus, label: 'Leads' },
  { to: '/dashboard/assistant', icon: Bot, label: 'AI Assistant' },
  { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 glass border-r border-white/10 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-white">GrowthForge</span>
              <span className="text-accent font-bold"> AI</span>
              <p className="text-[10px] text-slate-500">Analyze. Improve. Grow.</p>
            </div>
          </NavLink>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link, i) => (
            <motion.div key={link.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <NavLink
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <link.icon size={18} />
                <span className="text-sm font-medium">{link.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="card-premium !p-4 bg-accent/10 border-accent/20">
            <p className="text-xs text-slate-400">Pro Tip</p>
            <p className="text-sm text-white mt-1">Rescan weekly to track growth</p>
          </div>
        </div>
      </aside>
    </>
  );
}
