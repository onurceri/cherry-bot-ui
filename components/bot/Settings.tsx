import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Bot } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save } from 'lucide-react';

export const BotSettings: React.FC<{ bot: Bot }> = ({ bot }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    system_instruction: '',
    welcome_message: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name,
        system_instruction: bot.system_instruction || '',
        welcome_message: bot.welcome_message || ''
      });
    }
  }, [bot]);

  const updateBotMutation = useMutation({
    mutationFn: (data: typeof formData) => api.patch(`/bots/${bot.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot', bot.id] });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotMutation.mutate(formData);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">General Settings</h2>
        <p className="text-sm text-slate-500">Configure how your chatbot behaves and interacts.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-slate-200">
        <Input 
          label="Bot Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">System Instruction</label>
          <p className="text-xs text-slate-500 mb-2">Define the persona and rules for your AI.</p>
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. You are a helpful support assistant. You only answer questions based on the provided context."
            value={formData.system_instruction}
            onChange={(e) => setFormData({...formData, system_instruction: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Welcome Message</label>
          <p className="text-xs text-slate-500 mb-2">The first message the user sees.</p>
          <Input 
            value={formData.welcome_message}
            onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
            placeholder="Hi! How can I help you today?"
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <Button type="submit" className="bg-blue-700" isLoading={updateBotMutation.isPending}>
            <Save size={18} className="mr-2" /> Save Changes
          </Button>
          {isSaved && <span className="text-green-600 text-sm font-medium animate-fade-in">Settings saved successfully!</span>}
        </div>
      </form>
    </div>
  );
};
