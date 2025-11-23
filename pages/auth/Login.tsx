import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { AuthResponse } from '../../types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);
      const response = await api.post('/auth/login', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }) as unknown as AuthResponse;
      
      const { access_token, refresh_token } = response;
      if (access_token && refresh_token) {
        login(access_token, refresh_token);
        navigate('/dashboard');
      } else {
        setError('Giriş başarısız: Token alınamadı');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Geçersiz e-posta veya şifre');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-rose-200/30 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-md border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1 text-center pb-8 pt-8">
          <div className="flex justify-center mb-6">
            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
               <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-white">
                 <img src="/logo.webp" alt="Logo" className="w-10 h-10 object-contain drop-shadow-md" />
               </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Tekrar Hoşgeldiniz</CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Çalışma alanınıza erişmek için giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium ml-1">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="isim@ornek.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus-visible:ring-rose-500/20 transition-all rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700 font-medium ml-1">Şifre</Label>
                <a href="#" className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline">Şifremi unuttum?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10 bg-slate-50/50 border-slate-200 focus:bg-white focus-visible:ring-rose-500/20 transition-all rounded-xl"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 text-sm text-red-600 bg-red-50/80 backdrop-blur-sm rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/30 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Giriş Yap <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 pt-6 pb-8 bg-slate-50/50 rounded-b-xl">
          <div className="text-sm text-slate-500 font-medium">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-rose-600 font-bold hover:text-rose-700 hover:underline transition-colors">
              Hemen Kayıt Olun
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <div className="absolute bottom-4 text-center text-xs text-slate-400 font-medium">
        &copy; 2024 CherryBot AI. Tüm hakları saklıdır.
      </div>
    </div>
  );
};
