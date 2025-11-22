import React, { useState } from 'react';
// Fixed Link import
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogOut, LayoutDashboard, User, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export const DashboardLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-full md:w-64 bg-slate-50/50 backdrop-blur-xl border-r border-slate-200 flex-col z-20">
        <div className="p-6 pb-4">
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/20">
              <img src="/logo.webp" alt="CherryBot" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">CherryBot</h1>
              <p className="text-xs text-slate-500 font-medium">Çalışma Alanı</p>
            </div>
          </Link>
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
          <NavLink to="/profile" className={navItemClass}>
             <User size={18} />
             Profil
          </NavLink>
          <NavLink to="/settings" className={navItemClass}>
             <Settings size={18} />
             Ayarlar
          </NavLink>
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
      <main className="flex-1 min-h-screen bg-white md:ml-64">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <img src="/logo.webp" alt="CherryBot" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-sm font-semibold">CherryBot</span>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setMobileMenuOpen(true)} className="gap-2">
              Menü
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>

      {/* Mobile menu as Dialog */}
      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Menü</DialogTitle>
            <DialogDescription>
              Navigasyon ve hesap işlemlerine buradan ulaşabilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <nav className="space-y-2">
            <NavLink to="/dashboard" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard size={18} />
              Botlarım
            </NavLink>
            <NavLink to="/profile" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <User size={18} />
              Profil
            </NavLink>
            <NavLink to="/settings" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              <Settings size={18} />
              Ayarlar
            </NavLink>
            <Separator className="bg-slate-200" />
            <Button
              variant="ghost"
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2"
            >
              <LogOut size={18} />
              Çıkış Yap
            </Button>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
};
