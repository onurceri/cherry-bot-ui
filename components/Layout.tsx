import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Settings, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
      "group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
      isActive
        ? "bg-gradient-to-r from-rose-500/10 to-purple-500/10 text-rose-700 shadow-sm"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    );

  return (
    <div className="min-h-screen bg-slate-50/30 flex font-sans text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-full md:w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 flex-col z-30 shadow-xl shadow-slate-200/20">
        <div className="p-6 pb-6">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.webp" alt="CherryBot" className="w-8 h-8 object-contain drop-shadow-md" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">CherryBot</h1>
              <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Çalışma Alanı</p>
            </div>
          </Link>
        </div>

        <div className="px-6 mb-4">
           <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Platform
          </div>
          <NavLink to="/dashboard" className={navItemClass}>
            {({ isActive }) => (
              <>
                <div className={cn("p-1.5 rounded-lg transition-colors", isActive ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm")}>
                   <LayoutDashboard size={18} />
                </div>
                <span>Botlarım</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-rose-500 animate-in slide-in-from-left-1" />}
              </>
            )}
          </NavLink>
          
          <div className="px-4 mt-8 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Hesap
          </div>
          <NavLink to="/profile" className={navItemClass}>
            {({ isActive }) => (
              <>
                <div className={cn("p-1.5 rounded-lg transition-colors", isActive ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm")}>
                   <User size={18} />
                </div>
                <span>Profil</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-rose-500 animate-in slide-in-from-left-1" />}
              </>
            )}
          </NavLink>
          <NavLink to="/settings" className={navItemClass}>
            {({ isActive }) => (
              <>
                <div className={cn("p-1.5 rounded-lg transition-colors", isActive ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm")}>
                   <Settings size={18} />
                </div>
                <span>Ayarlar</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-rose-500 animate-in slide-in-from-left-1" />}
              </>
            )}
          </NavLink>
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-slate-50 border border-slate-100">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 gap-3 group"
          >
            <div className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-red-200 group-hover:bg-red-50 transition-colors">
               <LogOut size={16} />
            </div>
            <span className="font-medium">Çıkış Yap</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:ml-72 relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
           <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-rose-200/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-md">
                <img src="/logo.webp" alt="CherryBot" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-base font-bold text-slate-900">CherryBot</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="text-slate-600">
              <Menu size={24} />
            </Button>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <Outlet />
        </div>
      </main>

      {/* Mobile menu as Dialog */}
      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden border-none bg-white/95 backdrop-blur-xl">
          <DialogHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <img src="/logo.webp" alt="CherryBot" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold">CherryBot</DialogTitle>
                    <DialogDescription className="text-xs">Mobil Menü</DialogDescription>
                  </div>
               </div>
               {/* Close button is handled by Dialog primitive usually, but we can add custom if needed */}
            </div>
          </DialogHeader>
          <nav className="p-4 space-y-2">
            <NavLink to="/dashboard" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              {({ isActive }) => (
                <>
                  <LayoutDashboard size={20} className={isActive ? "text-rose-600" : "text-slate-400"} />
                  <span className="text-base">Botlarım</span>
                </>
              )}
            </NavLink>
            <NavLink to="/profile" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              {({ isActive }) => (
                <>
                  <User size={20} className={isActive ? "text-rose-600" : "text-slate-400"} />
                  <span className="text-base">Profil</span>
                </>
              )}
            </NavLink>
            <NavLink to="/settings" className={navItemClass} onClick={() => setMobileMenuOpen(false)}>
              {({ isActive }) => (
                <>
                  <Settings size={20} className={isActive ? "text-rose-600" : "text-slate-400"} />
                  <span className="text-base">Ayarlar</span>
                </>
              )}
            </NavLink>
            
            <div className="my-4 px-4">
               <div className="h-px bg-slate-100"></div>
            </div>

            <Button
              variant="ghost"
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 gap-3 px-4 py-6"
            >
              <LogOut size={20} />
              <span className="text-base font-medium">Çıkış Yap</span>
            </Button>
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
};
