import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BarChart3, Activity, Calendar, Zap, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeToday: 342,
    totalReports: 5832,
    revenue: 12450
  });

  const userGrowthData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    users: Math.floor(Math.random() * 50) + 80
  }));

  const activityData = [
    { name: 'Dashboard', users: 342, color: '#6366f1' },
    { name: 'Audit', users: 287, color: '#818cf8' },
    { name: 'SEO', users: 256, color: '#a5b4fc' },
    { name: 'Leads', users: 198, color: '#c7d2fe' },
    { name: 'AI', users: 176, color: '#e0e7ff' }
  ];

  const revenueData = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
    revenue: Math.floor(Math.random() * 3000) + 8000
  }));

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2026-05-20', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', joined: '2026-05-19', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joined: '2026-05-19', status: 'Inactive' },
    { id: 4, name: 'Emily Brown', email: 'emily@example.com', joined: '2026-05-18', status: 'Active' },
    { id: 5, name: 'Chris Wilson', email: 'chris@example.com', joined: '2026-05-18', status: 'Active' }
  ];

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'text-accent', icon: Users, change: '+12%' },
    { label: 'Active Today', value: stats.activeToday, color: 'text-green-400', icon: Activity, change: '+8%' },
    { label: 'Reports Generated', value: stats.totalReports.toLocaleString(), color: 'text-yellow-400', icon: FileText, change: '+24%' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, color: 'text-purple-400', icon: TrendingUp, change: '+18%' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Platform analytics and user management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-bg-card rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-700/50 rounded-xl">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change.startsWith('+') ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-bg-card rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-6">User Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-bg-card rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-6">Feature Usage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="users">
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-bg-card rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-6">Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-bg-card rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-semibold">Recent Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">User</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Joined</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, i) => (
                  <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-800/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-medium">{user.name}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">{user.email}</td>
                    <td className="py-4 px-6 text-gray-400">{user.joined}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
