import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, Bot, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl shadow-slate-200/50">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Bot className="w-7 h-7" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Hesap Oluştur</CardTitle>
          <CardDescription>
            AI chatbotlarınızı bugün oluşturmaya başlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="isim@ornek.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-rose-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifre oluşturun"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-rose-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifreyi Onayla</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Şifrenizi onaylayın"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-rose-500/20"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Hesap oluşturuluyor...
                </>
              ) : (
                "Hesap Oluştur"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 pt-6">
          <div className="text-sm text-slate-500">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-rose-600 font-semibold hover:underline">
              Giriş Yap
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
