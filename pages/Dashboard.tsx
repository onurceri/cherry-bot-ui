import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Bot } from '../types';
import { Plus, MessageSquare, PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBotName, setNewBotName] = useState('');

  const { data: bots, isLoading } = useQuery<Bot[]>({
    queryKey: ['bots'],
    queryFn: () => api.get('/bots'),
  });

  const createBotMutation = useMutation({
    mutationFn: (name: string) => api.post('/bots', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      setIsModalOpen(false);
      setNewBotName('');
    },
  });

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;
    createBotMutation.mutate(newBotName);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Chatbots</h1>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-blue-700">
          <PlusCircle size={18} /> Create New Bot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-slate-400">Loading bots...</div>
      ) : bots && bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${bot.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {bot.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{bot.name}</h3>
              <p className="text-sm text-slate-500 mb-6">Created on: {new Date(bot.created_at).toLocaleDateString()}</p>
              <Link to={`/bot/${bot.id}`}>
                <Button variant="secondary" className="w-full bg-slate-50">Manage</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
           <div className="bg-blue-50 p-4 rounded-full mb-4">
             <MessageSquare className="h-10 w-10 text-blue-600" />
           </div>
           <h3 className="text-xl font-semibold text-slate-900 mb-2">You have no chatbots yet</h3>
           <p className="text-slate-500 mb-6 max-w-sm">Get started by creating your first chatbot to engage with your customers.</p>
           <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-blue-700">
            <Plus size={18} /> Create New Bot
           </Button>
        </div>
      )}

      {/* Create Bot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Create New Bot</h2>
            <form onSubmit={handleCreateBot}>
              <Input
                label="Bot Name"
                placeholder="e.g. Sales Helper"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={createBotMutation.isPending}>Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
