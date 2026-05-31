import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/ui/AnimatedBackground';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('🔐 Registering user:', { name, email });
    try {
      await register(name, email, password);
      console.log('✅ Registration successful!');
      navigate('/onboarding');
    } catch (err) {
      console.error('❌ Registration failed:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await googleLogin({ googleId: 'demo_' + Date.now(), email: email || `user${Date.now()}@gmail.com`, name: name || 'Google User', avatar: '' });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative p-6">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md card-premium">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Zap size={20} /></div>
          <span className="font-bold text-xl">GrowthForge <span className="text-accent">AI</span></span>
        </Link>
        <h1 className="text-2xl font-bold text-center mb-2">Start growing today</h1>
        <p className="text-slate-400 text-center text-sm mb-8">Create your free account in seconds</p>
        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" placeholder="Your name" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@business.com" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10" placeholder="Min 6 characters" minLength={6} required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-xs"><span className="px-2 bg-card text-slate-500">or</span></div>
        </div>
        <button onClick={handleGoogle} className="w-full btn-secondary flex items-center justify-center gap-2">Google Sign-In</button>
        <p className="text-center text-sm text-slate-400 mt-6">Have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link></p>
      </motion.div>
    </div>
  );
}
