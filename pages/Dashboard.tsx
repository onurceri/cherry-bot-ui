import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Bot } from '../types';
import { Plus, MessageSquare, Loader2, ArrowRight, Trash2, MoreVertical, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: bots, isLoading } = useQuery<Bot[]>({
    queryKey: ['bots'],
    queryFn: () => api.get('/bots'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (botId: string) => {
      return api.delete(`/bots/${botId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
    },
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chatbotlarım</h1>
          <p className="text-slate-500 mt-1 font-medium">AI asistanlarınızı yönetin ve performanslarını izleyin.</p>
        </div>
        <Link to="/bot/new">
          <Button className="h-12 px-6 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/30 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus size={20} className="mr-2" />
            Yeni Bot Oluştur
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative">
             <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full animate-pulse"></div>
             <Loader2 className="w-10 h-10 animate-spin text-rose-500 relative z-10" />
          </div>
          <span className="text-slate-500 font-medium animate-pulse">Botlarınız yükleniyor...</span>
        </div>
      ) : bots && bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {bots.map((bot) => (
            <Card key={bot.id} className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm flex flex-col h-full overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="pb-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare size={24} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer rounded-lg"
                        onClick={() => deleteMutation.mutate(bot.id)}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <CardTitle className="text-xl font-bold text-slate-900 mb-1">{bot.name}</CardTitle>
                <div className="flex items-center gap-2 mb-3">
                   <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${bot.is_active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${bot.is_active ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {bot.is_active ? 'Aktif' : 'Pasif'}
                   </span>
                </div>
                <CardDescription className="line-clamp-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100/50 min-h-[3.5rem]">
                  {bot.system_instruction || "Sistem talimatı henüz ayarlanmadı."}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="pt-0 mt-auto flex flex-col gap-4 px-6 pb-6">
                <div className="w-full h-px bg-slate-100"></div>
                <div className="flex items-center justify-between w-full text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(bot.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity size={12} />
                    v1.0
                  </div>
                </div>
                
                <Link to={`/bot/${bot.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg shadow-rose-500/30 rounded-xl group-hover:translate-y-[-2px] transition-all duration-300">
                    Botu Yönet <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <MessageSquare size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Henüz chatbot oluşturulmadı</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Müşterilerinizle etkileşime geçmek ve işinizi büyütmek için ilk yapay zeka asistanınızı oluşturun.
          </p>
          <Link to="/bot/new">
            <Button className="h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xl shadow-rose-500/20 transition-all hover:scale-105">
              <Plus size={20} className="mr-2" />
              İlk Botunuzu Oluşturun
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
