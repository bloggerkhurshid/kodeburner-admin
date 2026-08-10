import React, { useState, useEffect } from 'react';
import { userService } from '../services/entityServices';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/Pagination';
import { Users, Search, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const fetchUsers = () => {
    setLoading(true);
    userService.getAll({ page, limit: 10, search, course: courseFilter })
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
          setPagination(res.pagination);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, courseFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await userService.delete(id);
      if (res.success) {
        toast.success('User deleted successfully.');
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Registered Users</h1>
        <p className="text-sm text-slate-400">View and manage registered student accounts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, username, city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
        >
          <option value="">All Courses</option>
          <option value="BCA">BCA</option>
          <option value="MCA">MCA</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No registered users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Email Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.image ? `https://api.kodeburner.com${u.image}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-slate-100">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-indigo-400">@{u.username}</td>
                    <td className="p-4 text-slate-300">{u.city}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded-md text-xs font-semibold">
                        {u.course}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.email_verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <CheckCircle size={14} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                          <XCircle size={14} /> Pending OTP
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
    </div>
  );
};
