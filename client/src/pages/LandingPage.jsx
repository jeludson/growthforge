import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, BarChart3, Target, Shield, Check, Star, ChevronDown } from 'lucide-react';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const features = [
  { icon: BarChart3, title: 'AI Website Audit', desc: 'Scan for broken links, missing meta tags, and mobile issues in seconds.' },
  { icon: Target, title: 'Competitor Intelligence', desc: 'Compare SEO, speed, and traffic against top competitors side-by-side.' },
  { icon: Shield, title: 'Lead CRM Built-In', desc: 'Track prospects from New to Closed with follow-up reminders.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Bakery Owner', text: 'GrowthForge found issues our developer missed. Traffic up 40% in 3 months.', stars: 5 },
  { name: 'Marcus Rivera', role: 'Dental Clinic', text: 'The AI recommendations are incredibly specific. Best investment for our practice.', stars: 5 },
  { name: 'Emily Watson', role: 'Fitness Studio', text: 'Competitor analysis alone paid for itself. We finally understand our market.', stars: 5 },
];

const plans = [
  { name: 'Starter', price: 29, features: ['1 Website', 'Monthly Audits', 'Basic AI Insights', '5 Leads'] },
  { name: 'Growth', price: 79, popular: true, features: ['3 Websites', 'Weekly Audits', 'Full AI Engine', 'Unlimited Leads', 'PDF Reports'] },
  { name: 'Agency', price: 199, features: ['Unlimited Sites', 'Daily Audits', 'White-label Reports', 'API Access', 'Priority Support'] },
];

const faqs = [
  { q: 'How long does a website scan take?', a: 'Most scans complete in 30-60 seconds depending on site size.' },
  { q: 'Do I need technical knowledge?', a: 'No. GrowthForge translates technical issues into plain-language action items.' },
  { q: 'Can I analyze competitor websites?', a: 'Yes. Add up to 5 competitor URLs during onboarding for side-by-side comparison.' },
  { q: 'Is my data secure?', a: 'All data is encrypted and stored securely. We never share your business information.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center"><Zap size={18} /></div>
          <span className="font-bold text-lg">GrowthForge <span className="text-accent">AI</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white px-4 py-2">Log in</Link>
          <Link to="/signup" className="btn-primary text-sm !py-2.5 !px-5">Get Started</Link>
        </div>
      </nav>

      <section className="relative z-10 px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-accent mb-6">Analyze. Improve. Grow.</span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Stop Losing Customers Because of a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Weak Website</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            GrowthForge AI scans your website and gives AI-powered growth insights in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg">Analyze Website</Link>
            <Link to="/demo-report" className="btn-secondary text-lg">View Demo Report</Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 card-premium max-w-4xl mx-auto overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
            <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500/80" /><span className="w-3 h-3 rounded-full bg-amber-500/80" /><span className="w-3 h-3 rounded-full bg-emerald-500/80" /></div>
            <span className="text-xs text-slate-500 ml-2">dashboard.growthforge.ai</span>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ l: 'Website Score', v: 78 }, { l: 'SEO Score', v: 72 }, { l: 'Performance', v: 85 }, { l: 'Lead Potential', v: 68 }].map((s) => (
              <div key={s.l} className="bg-background/50 rounded-xl p-4 text-left">
                <p className="text-xs text-slate-500">{s.l}</p>
                <p className="text-2xl font-bold text-accent mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-12">
          <ChevronDown className="mx-auto text-slate-600" />
        </motion.div>
      </section>

      <section id="features" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Everything You Need to Grow</h2>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">One platform for audits, SEO, competitors, leads, and AI-powered strategy.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium glass-hover">
              <f.icon className="text-accent mb-4" size={28} />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="demo" className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <div className="card-premium">
          <h2 className="text-2xl font-bold mb-6">Demo Dashboard Preview</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="h-40 bg-background/50 rounded-xl flex items-center justify-center text-slate-500 text-sm">SEO Trend Chart</div>
            <div className="h-40 bg-background/50 rounded-xl flex items-center justify-center text-slate-500 text-sm">Traffic Graph</div>
            <div className="h-40 bg-background/50 rounded-xl flex items-center justify-center text-slate-500 text-sm">Competitor Radar</div>
          </div>
          <Link to="/demo-report" className="inline-block mt-6 text-accent hover:underline text-sm font-medium">View full demo report →</Link>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Loved by Local Businesses</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium">
              <div className="flex gap-1 mb-3">{[...Array(t.stars)].map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400" />)}</div>
              <p className="text-slate-300 text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-slate-500">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`card-premium relative ${p.popular ? 'border-accent ring-2 ring-accent/30' : ''}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent text-xs font-bold rounded-full">Popular</span>}
              <h3 className="font-bold text-xl">{p.name}</h3>
              <p className="mt-4"><span className="text-4xl font-bold">${p.price}</span><span className="text-slate-500">/mo</span></p>
              <ul className="mt-6 space-y-3">{p.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-slate-300"><Check size={14} className="text-accent" />{f}</li>)}</ul>
              <Link to="/signup" className={`block text-center mt-8 py-3 rounded-xl font-semibold transition-all ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>Start Free Trial</Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="relative z-10 px-6 py-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="card-premium group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">{f.q}<ChevronDown className="group-open:rotate-180 transition-transform" size={18} /></summary>
              <p className="mt-3 text-slate-400 text-sm">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2"><Zap size={18} className="text-accent" /><span className="font-bold">GrowthForge AI</span></div>
          <p className="text-sm text-slate-500">© 2026 GrowthForge AI. Analyze. Improve. Grow.</p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <a href="#features">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
