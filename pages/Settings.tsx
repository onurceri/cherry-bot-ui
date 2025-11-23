import React, { useEffect, useState } from 'react';
import { getUser, updateUser } from '../lib/api';
import { User } from '../types';
import { Settings as SettingsIcon, Save, Loader2, AlertCircle, CheckCircle2, Mail, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';

export const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        setEmail(userData.email);
      } catch (err) {
        console.error('Failed to fetch user settings:', err);
        setMessage({ type: 'error', text: 'Kullanıcı bilgileri yüklenemedi.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const updatedUser = await updateUser({ email });
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Ayarlar başarıyla güncellendi.' });
    } catch (err) {
      console.error('Failed to update settings:', err);
      setMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
        <span className="text-slate-500 font-medium">Ayarlar yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-700">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Hesap Ayarları</h2>
          <p className="text-slate-500 font-medium">Hesap tercihlerinizi ve kişisel bilgilerinizi yönetin.</p>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={`rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : ''}`}>
          {message.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5 text-green-600" />}
          <AlertTitle className="font-bold ml-2">{message.type === 'error' ? 'Hata' : 'Başarılı'}</AlertTitle>
          <AlertDescription className="ml-2 font-medium opacity-90">
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8">
        <form onSubmit={handleSave}>
          <Card className="border-slate-200 shadow-lg shadow-slate-200/40 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <Mail className="w-5 h-5 text-rose-500" />
                İletişim Bilgileri
              </CardTitle>
              <CardDescription className="text-slate-500">
                Giriş yapmak ve bildirim almak için kullandığınız e-posta adresi.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-rose-500/20 rounded-xl transition-all pl-11"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
                <p className="text-xs text-slate-400 font-medium ml-1 flex items-center gap-1.5">
                  <Shield size={12} />
                  E-posta adresiniz gizli tutulur ve asla 3. taraflarla paylaşılmaz.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 bg-slate-50/30 px-8 py-6 flex justify-end">
              <Button 
                type="submit" 
                disabled={saving || email === user?.email}
                className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Future Settings Section Placeholder */}
        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-not-allowed relative">
           <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[1px] flex items-center justify-center">
             <span className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">Çok Yakında</span>
           </div>
           <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <Bell className="w-5 h-5 text-purple-500" />
                Bildirim Tercihleri
              </CardTitle>
              <CardDescription>
                Hangi konularda bildirim almak istediğinizi seçin.
              </CardDescription>
           </CardHeader>
           <CardContent className="p-8">
             <div className="h-20 bg-slate-50 rounded-xl border border-dashed border-slate-200"></div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};
