import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Building2, MapPin, Users, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const categories = ['Restaurant', 'Retail', 'Healthcare', 'Fitness', 'Professional Services', 'E-commerce', 'Real Estate', 'Other'];
const scanSteps = ['Scanning SEO...', 'Checking speed...', 'Analyzing competitors...', 'Generating AI insights...'];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [location, setLocation] = useState('');
  const [competitors, setCompetitors] = useState(['', '']);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);
  const { setReport, fetchReport } = useAuth();
  const navigate = useNavigate();

  const addCompetitor = () => setCompetitors([...competitors, '']);
  const updateCompetitor = (i, v) => {
    const c = [...competitors];
    c[i] = v;
    setCompetitors(c);
  };

  const runScan = async () => {
    setScanning(true);
    setScanProgress(0);
    for (let i = 0; i < scanSteps.length; i++) {
      setScanStep(i);
      setScanProgress((i + 1) * 25);
      await new Promise((r) => setTimeout(r, 1200));
    }
    try {
      const { data } = await api.post('/reports/generate', {
        websiteUrl,
        businessCategory,
        location,
        competitors: competitors.filter(Boolean),
      });
      setReport(data.report);
      await fetchReport();
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Scan failed. Check URL and try again.');
      setScanning(false);
    }
  };

  if (scanning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md w-full card-premium text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-2 border-accent border-t-transparent rounded-full mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-2">Analyzing your website</h2>
          <p className="text-accent text-sm mb-6">{scanSteps[scanStep]}</p>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div className="h-full bg-accent" animate={{ width: `${scanProgress}%` }} />
          </div>
          <p className="text-slate-500 text-xs mt-4">{scanProgress}% complete</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? 'bg-accent' : 'bg-slate-700'}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-premium">
              <Globe className="text-accent mb-4" size={28} />
              <h2 className="text-xl font-bold mb-2">What&apos;s your website URL?</h2>
              <p className="text-slate-400 text-sm mb-6">We&apos;ll scan and analyze your site</p>
              <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="input-field" placeholder="https://yourbusiness.com" />
              <button onClick={() => websiteUrl && setStep(2)} disabled={!websiteUrl} className="w-full btn-primary mt-6 disabled:opacity-50">Continue</button>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-premium">
              <Building2 className="text-accent mb-4" size={28} />
              <h2 className="text-xl font-bold mb-2">Business category</h2>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categories.map((c) => (
                  <button key={c} onClick={() => setBusinessCategory(c)} className={`p-3 rounded-xl text-sm border transition-all ${businessCategory === c ? 'border-accent bg-accent/20 text-white' : 'border-white/10 hover:border-white/20 text-slate-400'}`}>{c}</button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 btn-secondary">Back</button>
                <button onClick={() => businessCategory && setStep(3)} disabled={!businessCategory} className="flex-1 btn-primary disabled:opacity-50">Continue</button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-premium">
              <MapPin className="text-accent mb-4" size={28} />
              <h2 className="text-xl font-bold mb-2">Where are you located?</h2>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-field mt-4" placeholder="City, State or Country" />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 btn-secondary">Back</button>
                <button onClick={() => location && setStep(4)} disabled={!location} className="flex-1 btn-primary disabled:opacity-50">Continue</button>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card-premium">
              <Users className="text-accent mb-4" size={28} />
              <h2 className="text-xl font-bold mb-2">Competitor websites</h2>
              <p className="text-slate-400 text-sm mb-4">e.g. nike.com, adidas.com</p>
              {competitors.map((c, i) => (
                <input key={i} value={c} onChange={(e) => updateCompetitor(i, e.target.value)} className="input-field mb-2" placeholder={`Competitor ${i + 1} URL`} />
              ))}
              <button onClick={addCompetitor} className="text-sm text-accent hover:underline">+ Add another</button>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)} className="flex-1 btn-secondary">Back</button>
                <button onClick={runScan} className="flex-1 btn-primary flex items-center justify-center gap-2"><Sparkles size={16} /> Generate AI Report</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
