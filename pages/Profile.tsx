import React, { useEffect, useState } from 'react';
import { getUser } from '../lib/api';
import { User } from '../types';
import { Mail, Calendar, CreditCard, User as UserIcon, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        {error || 'User not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profil</h2>
        <p className="text-muted-foreground">Kişisel bilgileriniz ve hesap detaylarınız.</p>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Temel Bilgiler
            </CardTitle>
            <CardDescription>Hesabınızın temel bilgileri.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">E-posta Adresi</label>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Kullanıcı ID</label>
              <div className="p-2 bg-slate-50 rounded-md border border-slate-100 font-mono text-xs text-slate-500 break-all">
                {user.id}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Üyelik Detayları
            </CardTitle>
            <CardDescription>Mevcut planınız ve üyelik durumu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Plan Tipi</label>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                  {user.plan_type}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Kayıt Tarihi</label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{new Date(user.created_at).toLocaleDateString('tr-TR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
