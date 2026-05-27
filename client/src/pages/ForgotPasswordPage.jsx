import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import AnimatedBackground from '../components/ui/AnimatedBackground';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative p-6">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md card-premium">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Zap size={20} /></div>
          <span className="font-bold text-xl">GrowthForge AI</span>
        </div>
        {sent ? (
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">Check your email</h1>
            <p className="text-slate-400 text-sm mb-6">If an account exists for {email}, we sent reset instructions.</p>
            <Link to="/login" className="btn-primary inline-block">Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Forgot password?</h1>
            <p className="text-slate-400 text-center text-sm mb-8">Enter your email and we&apos;ll send a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@business.com" required />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          </>
        )}
        <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400 hover:text-white"><ArrowLeft size={14} /> Back to login</Link>
      </motion.div>
    </div>
  );
}
