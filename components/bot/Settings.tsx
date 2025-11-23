import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Bot } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Save, Loader2, CheckCircle2, Settings as SettingsIcon, MessageSquare, Terminal } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BotSettings: React.FC<{ bot: Bot }> = ({ bot }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    system_instruction: '',
    welcome_message: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string>('');
  

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
      setError('');
      setTimeout(() => setIsSaved(false), 2000);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || 'Failed to save settings';
      setError(msg);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"></div>
        
        <CardHeader className="pb-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-700">
              <SettingsIcon size={20} />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">Bot Yapılandırması</CardTitle>
          </div>
          <CardDescription className="text-base ml-12">
            Chatbotunuzun kimliğini, davranış kurallarını ve ilk etkileşim mesajını buradan yönetebilirsiniz.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Identity Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Kimlik</h3>
                <p className="text-xs text-slate-500">Botunuzun görünen adı ve temel bilgileri.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Bot Adı</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="max-w-md bg-white focus-visible:ring-rose-500"
                    placeholder="Örnek: Müşteri Temsilcisi"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* Behavior Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Terminal size={14} className="text-purple-500" />
                  Davranış & Talimatlar
                </h3>
                <p className="text-xs text-slate-500">AI modelinin nasıl davranması gerektiğini belirleyen temel kurallar.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system_instruction" className="text-slate-700 font-medium">Sistem Talimatı (System Prompt)</Label>
                  <div className="relative">
                    <Textarea
                      id="system_instruction"
                      className="min-h-[200px] font-mono text-sm bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-purple-500 leading-relaxed p-4"
                      placeholder="Örnek: Sen yardımsever bir asistanısın. Kullanıcılara her zaman nazik ve açıklayıcı cevaplar vermelisin. Bilmediğin konularda spekülasyon yapma."
                      value={formData.system_instruction}
                      onChange={(e) => setFormData({...formData, system_instruction: e.target.value})}
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">
                      Markdown desteklenir
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* Interaction Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <MessageSquare size={14} className="text-rose-500" />
                  İlk Etkileşim
                </h3>
                <p className="text-xs text-slate-500">Kullanıcı sohbeti başlattığında görünecek ilk mesaj.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcome_message" className="text-slate-700 font-medium">Karşılama Mesajı</Label>
                  <Input 
                    id="welcome_message"
                    value={formData.welcome_message}
                    onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
                    placeholder="Merhaba! Size nasıl yardımcı olabilirim?"
                    className="bg-white focus-visible:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center animate-in fade-in slide-in-from-top-2 border border-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
                {error}
              </div>
            )}
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center border-t border-slate-100 px-8 py-6 bg-slate-50/80">
          <div className="flex items-center h-6">
             {isSaved && (
                <span className="flex items-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Değişiklikler kaydedildi
                </span>
             )}
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={updateBotMutation.isPending}
            className={cn(
              "min-w-[160px] shadow-lg transition-all duration-300",
              updateBotMutation.isPending ? "bg-slate-100 text-slate-400" : "bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/20 hover:-translate-y-0.5"
            )}
          >
            {updateBotMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
