import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Bot } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-3xl">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
          <CardDescription>Chatbotunuzun nasıl davranacağını ve etkileşim kuracağını yapılandırın.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Adı</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="system_instruction">Sistem Talimatı</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                AI kişiliğini ve kurallarını tanımlayın.
              </p>
              <Textarea
                id="system_instruction"
                className="min-h-[150px] font-mono text-sm"
                placeholder="Örn: Sen yardımsever bir destek asistanısın. Sadece sağlanan bağlama göre soruları cevaplarsın."
                value={formData.system_instruction}
                onChange={(e) => setFormData({...formData, system_instruction: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome_message">Karşılama Mesajı</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                Kullanıcının göreceği ilk mesaj.
              </p>
              <Input 
                id="welcome_message"
                value={formData.welcome_message}
                onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
                placeholder="Merhaba! Size nasıl yardımcı olabilirim?"
              />
            </div>

            {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center">
             {isSaved && (
                <span className="flex items-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ayarlar başarıyla kaydedildi!
                </span>
             )}
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={updateBotMutation.isPending}
            className="min-w-[140px]"
          >
            {updateBotMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Değişiklikleri Kaydet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
