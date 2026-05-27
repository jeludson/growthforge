import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const statuses = ['New', 'Contacted', 'Interested', 'Closed', 'Lost'];
const statusColors = {
  New: 'bg-blue-500/20 text-blue-400',
  Contacted: 'bg-amber-500/20 text-amber-400',
  Interested: 'bg-purple-500/20 text-purple-400',
  Closed: 'bg-emerald-500/20 text-emerald-400',
  Lost: 'bg-red-500/20 text-red-400',
};

const emptyForm = { businessName: '', ownerName: '', phone: '', email: '', status: 'New', notes: '', followUpDate: '' };

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    const { data } = await api.get('/leads');
    setLeads(data.leads);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setShowModal(true); };
  const openEdit = (lead) => {
    setForm({ ...lead, followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : '' });
    setEditing(lead._id);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.businessName) return;
    if (editing) {
      await api.put(`/leads/${editing}`, form);
    } else {
      await api.post('/leads', form);
    }
    setShowModal(false);
    fetchLeads();
  };

  const remove = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`);
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lead Tracker</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 !py-2"><Plus size={16} /> Add Lead</button>
      </div>

      <div className="grid sm:grid-cols-5 gap-3">
        {statuses.map((s) => (
          <div key={s} className="card-premium !p-4 text-center">
            <p className="text-2xl font-bold">{leads.filter((l) => l.status === s).length}</p>
            <p className="text-xs text-slate-400 mt-1">{s}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-500">Loading leads...</div>
      ) : (
        <div className="card-premium overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-white/10">
                <th className="text-left py-3 px-2">Business</th>
                <th className="text-left py-3 px-2">Owner</th>
                <th className="text-left py-3 px-2">Contact</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Follow-up</th>
                <th className="text-right py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-2 font-medium">{lead.businessName}</td>
                  <td className="py-3 px-2">{lead.ownerName}</td>
                  <td className="py-3 px-2 text-slate-400">{lead.email}<br />{lead.phone}</td>
                  <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded-lg text-xs ${statusColors[lead.status]}`}>{lead.status}</span></td>
                  <td className="py-3 px-2 text-slate-400">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '—'}</td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => openEdit(lead)} className="p-1.5 hover:bg-white/10 rounded-lg"><Pencil size={14} /></button>
                    <button onClick={() => remove(lead._id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!leads.length && <p className="text-center text-slate-500 py-8">No leads yet. Add your first lead!</p>}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="card-premium w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">{editing ? 'Edit Lead' : 'New Lead'}</h3>
                <button onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                {['businessName', 'ownerName', 'phone', 'email'].map((f) => (
                  <input key={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="input-field" placeholder={f.replace(/([A-Z])/g, ' $1')} required={f === 'businessName'} />
                ))}
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} className="input-field" />
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={3} placeholder="Notes" />
              </div>
              <button onClick={save} className="w-full btn-primary mt-4">Save Lead</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
