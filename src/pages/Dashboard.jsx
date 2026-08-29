import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/entityServices';
import { Users, FileText, BookOpen, FolderTree, ShieldCheck, Activity } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then((res) => {
        if (res.success) {
          setStats(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const counts = stats?.counts || { users: 0, notes: 0, books: 0, semesters: 0, admins: 0 };

  const cards = [
    { title: 'Total Users', count: counts.users, icon: Users, color: 'from-slate-800 to-slate-900 border-slate-800 text-rose-400' },
    { title: 'Total Notes', count: counts.notes, icon: FileText, color: 'from-slate-800 to-slate-900 border-slate-800 text-rose-400' },
    { title: 'Total Books', count: counts.books, icon: BookOpen, color: 'from-slate-800 to-slate-900 border-slate-800 text-rose-400' },
    { title: 'Semesters', count: counts.semesters, icon: FolderTree, color: 'from-slate-800 to-slate-900 border-slate-800 text-rose-400' },
    { title: 'Total Admins', count: counts.admins, icon: ShieldCheck, color: 'from-slate-800 to-slate-900 border-slate-800 text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard Overview</h1>
          <p className="text-sm text-slate-400">System metrics, AdMob controls, and academic resource activities</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all"
          >
            AdMob &amp; Push Alerts Config
          </a>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{c.title}</span>
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-100">{c.count}</p>
            </div>
          );
        })}
      </div>

      {/* Activity and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText size={18} className="text-rose-400" /> Recently Uploaded Notes
            </h3>
          </div>
          <div className="space-y-3">
            {stats?.recent_notes?.length > 0 ? (
              stats.recent_notes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{note.name}</p>
                    <span className="text-xs text-rose-400 font-medium">{note.semester?.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(note.created_at).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No recent notes uploaded.</p>
            )}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity size={18} className="text-rose-400" /> Audit Trail & Activity
            </h3>
          </div>
          <div className="space-y-3">
            {stats?.recent_activities?.length > 0 ? (
              stats.recent_activities.map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-slate-200">{act.admin_name || 'System'}</span>
                    <span>{new Date(act.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300">{act.action}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No system activities recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
