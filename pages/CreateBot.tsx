import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

export const CreateBot: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  const createBotMutation = useMutation({
    mutationFn: async (botName: string) => {
      return api.post('/bots', { name: botName });
    },
    onSuccess: (created: any) => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      const id = created?.id;
      if (id) {
        navigate(`/bot/${id}`);
      } else {
        navigate('/dashboard');
      }
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBotMutation.mutate(name);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Yeni Bot Oluştur</h1>
        <Link to="/dashboard" className="inline-flex items-center text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} className="mr-2" />
          Geri Dön
        </Link>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Bot Adı</CardTitle>
          <CardDescription>Başlamak için botunuza bir isim verin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bot-name">Bot Adı</Label>
              <Input
                id="bot-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Müşteri Destek Botu"
              />
            </div>
            <Button type="submit" disabled={createBotMutation.isPending} className="w-full">
              {createBotMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                'Bot Oluştur'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

