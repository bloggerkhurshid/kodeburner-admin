import React, { useState, useEffect } from 'react';
import { adminService } from '../services/entityServices';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/Pagination';
import { ShieldCheck, Plus, Search, Trash2, Mail, CheckCircle, Clock, Ban, X } from 'lucide-react';

export const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const fetchAdmins = () => {
    setLoading(true);
    adminService.getAll({ page, limit: 10, search })
      .then((res) => {
        if (res.success) {
          setAdmins(res.data);
          setPagination(res.pagination);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, [page, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role', role);
    if (imageFile) formData.append('image', imageFile);

    setSubmitting(true);
    try {
      const res = await adminService.create(formData);
      if (res.success) {
        toast.success('Admin invited successfully via email.');
        setModalOpen(false);
        fetchAdmins();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to invite admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (id) => {
    try {
      const res = await adminService.resendInvitation(id);
      if (res.success) toast.success(res.message);
    } catch (err) {
      toast.error(err.message || 'Failed to resend invitation.');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      const res = await adminService.deactivate(id);
      if (res.success) {
        toast.success(res.message);
        fetchAdmins();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      const res = await adminService.activate(id);
      if (res.success) {
        toast.success(res.message);
        fetchAdmins();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      const res = await adminService.delete(id);
      if (res.success) {
        toast.success(res.message);
        fetchAdmins();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Administrator Management</h1>
          <p className="text-sm text-slate-400">Superadmin controls for inviting and managing system administrators</p>
        </div>
        <button
          onClick={() => {
            setName('');
            setEmail('');
            setRole('admin');
            setImageFile(null);
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus size={18} /> Invite Admin
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading administrators...</div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No administrators found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Admin</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Invited Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={adm.image ? `https://api.kodeburner.com${adm.image}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={adm.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-slate-100">{adm.name}</p>
                          <p className="text-xs text-slate-400">{adm.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        adm.role === 'superadmin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {adm.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {adm.status === 'active' && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <CheckCircle size={14} /> Active
                        </span>
                      )}
                      {adm.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                          <Clock size={14} /> Pending Setup
                        </span>
                      )}
                      {adm.status === 'inactive' && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
                          <Ban size={14} /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(adm.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {adm.status === 'pending' && (
                          <button
                            onClick={() => handleResend(adm.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold rounded-lg flex items-center gap-1"
                            title="Resend Invitation Email"
                          >
                            <Mail size={14} /> Resend Link
                          </button>
                        )}
                        {adm.status === 'active' && (
                          <button
                            onClick={() => handleDeactivate(adm.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg"
                          >
                            Deactivate
                          </button>
                        )}
                        {adm.status === 'inactive' && (
                          <button
                            onClick={() => handleActivate(adm.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-lg"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(adm.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Invite New Administrator</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@bcanotes.com"
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Profile Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
