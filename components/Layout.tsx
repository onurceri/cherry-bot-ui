import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, LayoutDashboard, User, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export const DashboardLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
      isActive
        ? "bg-slate-100 text-slate-900 shadow-sm"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    );

  return (
    <div className="min-h-screen bg-white flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-50/50 backdrop-blur-xl border-r border-slate-200 flex flex-col z-20">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/20">
              <img src="/logo.webp" alt="CherryBot" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">CherryBot</h1>
              <p className="text-xs text-slate-500 font-medium">Çalışma Alanı</p>
            </div>
          </div>
        </div>

        <div className="px-4 mb-2">
           <Separator className="bg-slate-200" />
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2">
          <div className="px-2 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Platform
          </div>
          <NavLink to="/dashboard" className={navItemClass}>
            <LayoutDashboard size={18} />
            Botlarım
          </NavLink>
          
          <div className="px-2 mt-6 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Hesap
          </div>
          <button className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left",
              "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}>
             <User size={18} />
             Profil
          </button>
           <button className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left",
              "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}>
             <Settings size={18} />
             Ayarlar
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50/80">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2"
          >
            <LogOut size={18} />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen bg-white">
        <div className="max-w-5xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
