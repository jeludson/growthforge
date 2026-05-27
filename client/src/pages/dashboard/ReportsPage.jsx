import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ReportsPage() {
  const { report, fetchReport } = useAuth();
  const [reports, setReports] = useState([]);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    api.get('/reports').then(({ data }) => setReports(data.reports || []));
  }, []);

  const downloadPDF = async (id) => {
    setDownloading(id);
    try {
      const { data } = await api.get(`/reports/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `growthforge-report-${id}.pdf`;
      a.click();
    } catch {
      alert('PDF download failed');
    }
    setDownloading(null);
  };

  const ai = report?.aiInsights || {};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      {report && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium border-accent/30">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-accent" size={20} />
                <h3 className="font-semibold">Latest Growth Report</h3>
              </div>
              <p className="text-sm text-slate-400">{report.websiteUrl}</p>
              <p className="text-xs text-slate-500 mt-1">Generated {new Date(report.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => downloadPDF(report._id)} disabled={downloading} className="btn-primary flex items-center gap-2 !py-2 self-start">
              <Download size={16} /> {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
          <div className="grid sm:grid-cols-4 gap-4 mt-6">
            {[{ l: 'Website', v: report.websiteScore }, { l: 'SEO', v: report.seoScore }, { l: 'Performance', v: report.performanceScore }, { l: 'Leads', v: report.leadPotential }].map((s) => (
              <div key={s.l} className="bg-background/50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-accent">{s.v}</p>
                <p className="text-xs text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="card-premium">
        <h3 className="font-semibold mb-4">Report Preview — AI Growth Strategy</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(ai).map(([key, items]) => (
            <div key={key}>
              <p className="text-sm font-medium text-accent capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</p>
              <ul className="space-y-1">{(items || []).map((item, i) => <li key={i} className="text-sm text-slate-400">• {item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium">
        <h3 className="font-semibold mb-4">Report History</h3>
        {reports.length ? (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors">
                <div>
                  <p className="font-medium text-sm">{r.websiteUrl}</p>
                  <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()} · Score: {r.websiteScore}</p>
                </div>
                <button onClick={() => downloadPDF(r._id)} className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1">
                  <Download size={14} /> PDF
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">No previous reports</p>
        )}
      </div>
    </div>
  );
}
