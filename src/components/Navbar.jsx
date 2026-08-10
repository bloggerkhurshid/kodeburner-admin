import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
          <h2 className="text-sm font-bold text-slate-100">{user?.name}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
