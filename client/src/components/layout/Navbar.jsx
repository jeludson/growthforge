import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick, darkMode, setDarkMode }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState('');

  const notifications = [
    { id: 1, text: 'SEO score improved by 5 points', time: '2h ago' },
    { id: 2, text: 'New lead added to CRM', time: '5h ago' },
    { id: 3, text: 'Weekly report ready to download', time: '1d ago' },
  ];

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
          <Menu size={22} />
        </button>
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dashboard..."
            className="w-full bg-background/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="p-2.5 rounded-xl hover:bg-white/5 relative"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <AnimatePresence>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 card-premium !p-0 overflow-hidden shadow-xl z-50"
                >
                  <div className="p-4 border-b border-white/10 font-semibold text-sm">Notifications</div>
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-white/5 border-b border-white/5 text-sm">
                      <p>{n.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
