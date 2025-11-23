import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft, Bot, Sparkles, Wand2 } from 'lucide-react';

export const CreateBot: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  const createBotMutation = useMutation({
    mutationFn: async (botName: string) => {
      return api.post('/bots', { name: botName });
    },
    onSuccess: (created: any) => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      const id = created?.id;
      if (id) {
        navigate(`/bot/${id}`);
      } else {
        navigate('/dashboard');
      }
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBotMutation.mutate(name);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Yeni Bot Oluştur</h1>
           <p className="text-slate-500 mt-1">Saniyeler içinde yeni bir AI asistanı yaratın.</p>
        </div>
        <Link to="/dashboard">
          <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
            <ArrowLeft size={18} className="mr-2" />
            Geri Dön
          </Button>
        </Link>
      </div>

      <Card className="border-white/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 overflow-hidden rounded-3xl relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"></div>
        
        <CardHeader className="pt-8 pb-6 px-8 border-b border-slate-100/50">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center text-rose-600 mb-4 shadow-sm border border-rose-100">
            <Bot size={28} />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Bot Kimliği</CardTitle>
          <CardDescription className="text-base text-slate-500">
            Botunuza akılda kalıcı bir isim vererek başlayın. Daha sonra tüm ayarları özelleştirebilirsiniz.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="bot-name" className="text-base font-semibold text-slate-700">Bot Adı</Label>
              <div className="relative group">
                <Input
                  id="bot-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örnek: Müşteri Destek Asistanı"
                  className="h-14 text-lg px-5 bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-rose-500/20 rounded-xl transition-all shadow-sm group-hover:bg-white"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors">
                  <Sparkles size={20} />
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Bu isim kullanıcılarınız tarafından görülecektir.
              </p>
            </div>

            <div className="pt-4">
               <Button 
                 type="submit" 
                 disabled={createBotMutation.isPending || !name.trim()} 
                 className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white shadow-xl shadow-rose-500/20 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
               >
                 {createBotMutation.isPending ? (
                   <>
                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                     Sihir Yapılıyor...
                   </>
                 ) : (
                   <span className="flex items-center gap-2">
                     <Wand2 size={20} />
                     Botu Oluştur
                   </span>
                 )}
               </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-6 flex justify-center">
           <p className="text-xs text-slate-400 font-medium text-center max-w-xs">
             Devam ederek Hizmet Şartlarımızı ve Gizlilik Politikamızı kabul etmiş olursunuz.
           </p>
        </CardFooter>
      </Card>
    </div>
  );
};
