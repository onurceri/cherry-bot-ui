import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Bot } from '../types';
import { Plus, MessageSquare, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { DashboardLayout } from '../components/Layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBotName, setNewBotName] = useState('');

  const { data: bots, isLoading } = useQuery<Bot[]>({
    queryKey: ['bots'],
    queryFn: () => api.get('/bots'),
  });

  const createBotMutation = useMutation({
    mutationFn: (name: string) => api.post('/bots', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      setIsCreateOpen(false);
      setNewBotName('');
    },
  });

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;
    createBotMutation.mutate(newBotName);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chatbotlarım</h1>
          <p className="text-slate-500 mt-1">AI asistanlarınızı yönetin ve izleyin.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="shadow-lg transition-all hover:scale-[1.02]">
              <Plus size={18} className="mr-2" />
              Yeni Bot Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Yeni Bot Oluştur</DialogTitle>
              <DialogDescription>
                Başlamak için yeni chatbotunuza bir isim verin.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBot} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bot Adı</Label>
                <Input
                  id="name"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="Örn: Müşteri Destek Botu"
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createBotMutation.isPending}>
                  {createBotMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    "Bot Oluştur"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-500">Botlar yükleniyor...</span>
        </div>
      ) : bots && bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <Card key={bot.id} className="group hover:shadow-md transition-all duration-200 border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                    <MessageSquare size={20} />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${bot.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {bot.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <CardTitle className="mt-4 text-lg">{bot.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {bot.system_instruction || "Sistem talimatı ayarlanmadı."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-400 font-medium">
                  Oluşturulma: {new Date(bot.created_at).toLocaleDateString('tr-TR')}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link to={`/bot/${bot.id}`} className="w-full">
                  <Button variant="outline" className="w-full group-hover:border-slate-300 group-hover:bg-slate-50">
                    Botu Yönet <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Henüz chatbot oluşturulmadı</h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            Müşterilerinizle etkileşime geçmek için ilk chatbotunuzu oluşturarak başlayın.
          </p>
          <Button 
            variant="link" 
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 text-primary"
          >
            Şimdi bir tane oluşturun
          </Button>
        </div>
      )}
    </div>
  );
};
