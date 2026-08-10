import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  FolderTree,
  Users,
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const isSuperadmin = user?.role === 'superadmin';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Books', path: '/books', icon: BookOpen },
    { name: 'Semesters', path: '/semesters', icon: FolderTree },
    { name: 'Users', path: '/users', icon: Users },
  ];

  if (isSuperadmin) {
    navItems.push({ name: 'Admins', path: '/admins', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-slate-950/70 backdrop-blur-sm md:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-slate-900 border-r border-slate-800/80 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-rose-600/30">
            B
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base leading-tight">BCA Resource</h1>
            <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => toggleSidebar(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.image ? `https://api.kodeburner.com${user.image}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-rose-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <NavLink
              to="/profile"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <User size={14} /> Profile
            </NavLink>
            <button
              onClick={logout}
              className="flex items-center justify-center p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
