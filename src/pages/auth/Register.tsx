import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Kayıt başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-rose-200/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-md border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1 text-center pb-8 pt-8">
          <div className="flex justify-center mb-6">
            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
               <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-white">
                 <img src="/logo.webp" alt="Logo" className="w-10 h-10 object-contain drop-shadow-md" />
               </div>
               <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                 <Sparkles size={10} />
                 YENİ
               </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Hesap Oluştur</CardTitle>
          <CardDescription className="text-slate-500 text-base">
            AI chatbotlarınızı bugün oluşturmaya başlayın
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
              <Label htmlFor="password" className="text-slate-700 font-medium ml-1">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="Güçlü bir şifre oluşturun"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus-visible:ring-rose-500/20 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium ml-1">Şifreyi Onayla</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white focus-visible:ring-rose-500/20 transition-all rounded-xl"
              />
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
                  Hesap oluşturuluyor...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Hesap Oluştur <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 pt-6 pb-8 bg-slate-50/50 rounded-b-xl">
          <div className="text-sm text-slate-500 font-medium">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-rose-600 font-bold hover:text-rose-700 hover:underline transition-colors">
              Giriş Yapın
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
