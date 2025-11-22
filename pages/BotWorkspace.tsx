import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Bot } from '../types';
import { KnowledgeBase } from '../components/bot/KnowledgeBase';
import { Playground } from '../components/bot/Playground';
import { BotSettings } from '../components/bot/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Loader2, Bot as BotIcon, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/Layout';

export const BotWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: bot, isLoading, error } = useQuery<Bot | undefined>({
    queryKey: ['bot', id],
    queryFn: async () => {
      const bots: Bot[] = await api.get('/bots');
      return bots.find(b => b.id === id);
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-500">Bot detayları yükleniyor...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !bot) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-slate-500">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
             <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Bot bulunamadı</h3>
          <p>Bot verileri yüklenirken bir hata oluştu veya bot mevcut değil.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60">
         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
           <BotIcon size={24} />
         </div>
         <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{bot.name}</h1>
           <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
             <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">ID: {bot.id}</span>
           </div>
         </div>
      </div>

      <Tabs defaultValue="knowledge" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 bg-slate-100/80 p-1">
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Bilgi Bankası
          </TabsTrigger>
          <TabsTrigger value="playground" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Test Ortamı
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Ayarlar
          </TabsTrigger>
        </TabsList>
        
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <TabsContent value="knowledge" className="mt-0">
            <KnowledgeBase botId={bot.id} />
          </TabsContent>
          <TabsContent value="playground" className="mt-0">
            <Playground bot={bot} />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <BotSettings bot={bot} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
