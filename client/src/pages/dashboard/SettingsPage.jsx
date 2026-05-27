import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Globe, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    websiteUrl: user?.websiteUrl || '',
    businessCategory: user?.businessCategory || '',
    location: user?.location || '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await api.put('/auth/profile', form);
    await refreshUser();
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="card-premium">
        <h3 className="font-semibold mb-6 flex items-center gap-2"><User size={18} className="text-accent" /> Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
            <input value={user?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
        </div>
      </div>

      <div className="card-premium">
        <h3 className="font-semibold mb-6 flex items-center gap-2"><Globe size={18} className="text-accent" /> Business</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Website URL</label>
            <input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className="input-field" placeholder="https://yoursite.com" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Category</label>
            <input value={form.businessCategory} onChange={(e) => setForm({ ...form, businessCategory: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
          </div>
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.98 }} onClick={save} disabled={loading} className="btn-primary flex items-center gap-2">
        <Save size={16} /> {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </motion.button>

      <div className="card-premium border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-400 mb-4">Sign out of your account</p>
        <button onClick={logout} className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm">Sign Out</button>
      </div>
    </div>
  );
}
