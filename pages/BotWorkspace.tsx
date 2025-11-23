import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Bot } from '../types';
import { KnowledgeBase } from '../components/bot/KnowledgeBase';
import { Playground } from '../components/bot/Playground';
import { BotSettings } from '../components/bot/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Loader2, Bot as BotIcon, AlertCircle, Database, MessageSquare, Settings, Sparkles, Palette } from 'lucide-react';
import { DashboardLayout } from '../components/Layout';
import { cn } from '../lib/utils';
import { BotAppearance } from '../components/bot/Appearance';

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
    <div className="min-h-screen bg-slate-50/50 -m-8 p-8">
      {/* Hero Section / Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/50 via-purple-100/30 to-blue-100/30 blur-3xl -z-10 rounded-3xl" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm">
          <div className="flex items-center gap-5">
             <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
               <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                 <BotIcon size={32} className="drop-shadow-md" />
               </div>
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                 <Sparkles size={10} className="text-white" />
               </div>
             </div>
             
             <div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                 {bot.name}
               </h1>
               <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium mt-1">
                 <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/50">
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList className="bg-white/60 backdrop-blur-md p-1.5 rounded-full border border-slate-200/60 shadow-lg shadow-slate-200/40 inline-flex">
            <TabsTrigger 
              value="knowledge" 
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Database size={16} />
              Bilgi Bankası
            </TabsTrigger>
            <TabsTrigger 
              value="playground" 
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Test Ortamı
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Palette size={16} />
              Görünüm
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Settings size={16} />
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
