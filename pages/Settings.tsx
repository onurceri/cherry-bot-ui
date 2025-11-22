import React, { useEffect, useState } from 'react';
import { getUser, updateUser } from '../lib/api';
import { User } from '../types';
import { Settings as SettingsIcon, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ayarlar</h2>
        <p className="text-muted-foreground">Hesap tercihlerinizi ve ayarlarınızı yönetin.</p>
      </div>
      <Separator />

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : ''}>
          {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-green-600" />}
          <AlertTitle>{message.type === 'error' ? 'Hata' : 'Başarılı'}</AlertTitle>
          <AlertDescription>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 max-w-2xl">
        <form onSubmit={handleSave}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Hesap Ayarları
              </CardTitle>
              <CardDescription>İletişim bilgilerinizi güncelleyin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  E-posta Adresi
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Bu e-posta adresi giriş yapmak ve bildirimler için kullanılacaktır.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
              <Button type="submit" disabled={saving || email === user?.email}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!saving && <Save className="mr-2 h-4 w-4" />}
                Değişiklikleri Kaydet
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};
