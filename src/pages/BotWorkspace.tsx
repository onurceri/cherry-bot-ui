import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Bot } from '../types';
import { KnowledgeBase } from '@/components/bot/KnowledgeBase';
import { Playground } from '@/components/bot/Playground';
import { BotSettings } from '@/components/bot/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Bot as BotIcon, AlertCircle, Database, MessageSquare, Settings, Sparkles, Palette } from 'lucide-react';
import { DashboardLayout } from '@/components/Layout';
import { BotAppearance } from '@/components/bot/Appearance';

export const BotWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('knowledge');

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
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-rose-500 relative z-10" />
          </div>
          <span className="mt-4 text-muted-foreground font-medium animate-pulse">Bot deneyimi hazırlanıyor...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !bot) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-muted-foreground">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-100">
             <AlertCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Bot Bulunamadı</h3>
          <p className="text-muted-foreground max-w-md text-center">Aradığınız bot silinmiş veya hiç var olmamış olabilir. Lütfen dashboard'a dönüp tekrar deneyin.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="bg-slate-50/50">
      {/* Hero Section / Header */}
      <div className="relative mb-4 md:mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-purple-100/30 to-blue-100/30 blur-3xl -z-10 rounded-3xl" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 bg-white/40 backdrop-blur-xl p-3 md:p-4 rounded-3xl border border-white/50 shadow-sm">
          <div className="flex items-center gap-5">
             <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
               <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xl ring-1 md:ring-2 ring-white">
                 <BotIcon className="w-5 h-5 md:w-7 md:h-7 drop-shadow-md" />
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                 <Sparkles className="w-2.5 h-2.5 text-white" />
               </div>
             </div>
             
             <div>
               <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                 {bot.name}
               </h1>
               <div className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs text-muted-foreground font-medium mt-0.5">
                 <span className="flex items-center gap-1.5 bg-slate-100/80 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg border border-slate-200/50">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   Aktif
                 </span>
                 <span className="font-mono text-xs opacity-60 select-all">ID: {bot.id}</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
             {/* Future actions can go here */}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="flex justify-center">
          <TabsList className="bg-white/60 backdrop-blur-md p-1 rounded-full border border-slate-200/60 shadow-lg shadow-slate-200/40 inline-flex">
            <TabsTrigger 
              value="knowledge" 
              className="rounded-full px-3 py-1.5 md:px-5 md:py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Database className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Bilgi Bankası
            </TabsTrigger>
            <TabsTrigger 
              value="playground" 
              className="rounded-full px-3 py-1.5 md:px-5 md:py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Test Ortamı
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="rounded-full px-3 py-1.5 md:px-5 md:py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Palette className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Görünüm
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-full px-3 py-1.5 md:px-5 md:py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Ayarlar
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          <TabsContent value="knowledge" className="mt-0 focus-visible:outline-none">
            <KnowledgeBase botId={bot.id} />
          </TabsContent>
          <TabsContent value="playground" className="mt-0 focus-visible:outline-none">
            <Playground bot={bot} />
          </TabsContent>
          <TabsContent value="appearance" className="mt-0 focus-visible:outline-none">
            <BotAppearance bot={bot} />
          </TabsContent>
          <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
            <BotSettings bot={bot} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
