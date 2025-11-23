import React, { useEffect, useState } from 'react';
import { getUser } from '../lib/api';
import { User } from '../types';
import { Mail, Calendar, CreditCard, User as UserIcon, Loader2, Shield, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
        <span className="text-slate-500 font-medium">Profil bilgileri yükleniyor...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
        <Shield size={24} />
        <span className="font-medium">{error || 'Kullanıcı bulunamadı'}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative mb-12">
        <div className="h-48 rounded-3xl bg-gradient-to-r from-rose-400 via-purple-500 to-blue-500 shadow-lg"></div>
        <div className="absolute -bottom-10 left-10 flex items-end gap-6">
           <div className="p-1.5 bg-white rounded-full shadow-xl">
             <Avatar className="w-32 h-32 border-4 border-white bg-slate-100">
               <AvatarFallback className="text-4xl font-bold bg-slate-100 text-slate-400">
                 {user.email.charAt(0).toUpperCase()}
               </AvatarFallback>
             </Avatar>
           </div>
           <div className="mb-3">
             <h1 className="text-3xl font-bold text-slate-900 drop-shadow-sm bg-white/80 backdrop-blur-sm px-4 py-1 rounded-xl inline-block mb-1">
               {user.email.split('@')[0]}
             </h1>
             <div className="flex items-center gap-2">
               <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                 {user.plan_type} Plan
               </span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 pt-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <UserIcon className="w-5 h-5" />
              </div>
              Temel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-posta Adresi</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{user.email}</span>
              </div>
            </div>
            

          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              Üyelik Detayları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mevcut Plan</label>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 capitalize">{user.plan_type}</div>
                    <div className="text-xs text-slate-500">Aktif Üyelik</div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-white rounded-md text-xs font-bold text-purple-600 shadow-sm border border-purple-100">
                  PRO
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kayıt Tarihi</label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {new Date(user.created_at).toLocaleDateString('tr-TR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
