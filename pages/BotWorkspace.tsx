import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Bot } from '../types';
import { KnowledgeBase } from '../components/bot/KnowledgeBase';
import { Playground } from '../components/bot/Playground';
import { BotSettings } from '../components/bot/Settings';

export const BotWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'kb' | 'playground' | 'settings'>('kb');

  const { data: bot, isLoading, error } = useQuery<Bot>({
    queryKey: ['bot', id],
    queryFn: () => api.get(`/bots/${id}`),
    enabled: !!id
  });

  if (isLoading) return <div className="p-12 text-center text-slate-400">Loading bot details...</div>;
  if (error || !bot) return <div className="p-12 text-center text-red-500">Bot not found or error loading.</div>;

  return (
    <div>
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-slate-900">{bot.name}</h1>
         <div className="text-sm text-slate-500 mt-1">ID: {bot.id}</div>
      </div>

      {/* Tabs Header */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('kb')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'kb'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'playground'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Playground
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'kb' && <KnowledgeBase botId={bot.id} />}
        {activeTab === 'playground' && <Playground bot={bot} />}
        {activeTab === 'settings' && <BotSettings bot={bot} />}
      </div>
    </div>
  );
};
