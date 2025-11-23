import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Bot, AppearanceConfig } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Save, Loader2, CheckCircle2, Palette, Code, Type, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const defaultAppearance: AppearanceConfig = {
  primary_color: '#E11D48',
  background_color: '#FFFFFF',
  chat_bubble_user: '#E11D48',
  chat_bubble_user_text: '#FFFFFF',
  chat_bubble_bot: '#F1F5F9',
  chat_bubble_bot_text: '#1F2937',
  font_family: 'Inter',
  logo_url: undefined,
  launcher_icon: 'message-circle',
  position: 'bottom-right',
  auto_open: false,
};

export const BotAppearance: React.FC<{ bot: Bot }> = ({ bot }) => {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<AppearanceConfig>(defaultAppearance);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string>('');
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (bot.appearance_config) {
      setConfig(bot.appearance_config);
    }
  }, [bot.appearance_config]);

  // Auto-open chat when config.auto_open is true
  useEffect(() => {
    setIsPreviewOpen(config.auto_open);
  }, [config.auto_open]);

  // Dynamically load Google Fonts
  useEffect(() => {
    // Remove existing font link if any
    const existingLink = document.getElementById('preview-font-link');
    if (existingLink) {
      existingLink.remove();
    }

    // Add Google Font link
    const link = document.createElement('link');
    link.id = 'preview-font-link';
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${config.font_family.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      const linkToRemove = document.getElementById('preview-font-link');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [config.font_family]);

  const updateBotMutation = useMutation({
    mutationFn: (data: { appearance_config: AppearanceConfig }) =>
      api.patch(`/bots/${bot.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bot', bot.id] });
      setIsSaved(true);
      setError('');
      setTimeout(() => setIsSaved(false), 2000);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || 'Görünüm ayarları kaydedilemedi';
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotMutation.mutate({ appearance_config: config });
  };

  const embedCode = `<script 
  src="${window.location.origin}/widget.js" 
  data-bot-id="${bot.id}"
  defer>
</script>`;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-700">
                  <Palette size={20} />
                </div>
                <div>
                  <CardTitle>Görünüm Özelleştirme</CardTitle>
                  <CardDescription>
                    Marka kimliğinizi yansıtan bir chatbot tasarlayın
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Accordion type="multiple" defaultValue={[]} className="space-y-2">
                {/* Colors Section */}
                <AccordionItem value="colors" className="border border-slate-200 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Palette size={16} className="text-rose-500" />
                      <span className="font-semibold">Renkler</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primary_color">Ana Renk</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primary_color"
                            type="color"
                            value={config.primary_color}
                            onChange={(e) =>
                              setConfig({ ...config, primary_color: e.target.value })
                            }
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={config.primary_color}
                            onChange={(e) =>
                              setConfig({ ...config, primary_color: e.target.value })
                            }
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="background_color">Arka Plan</Label>
                        <div className="flex gap-2">
                          <Input
                            id="background_color"
                            type="color"
                            value={config.background_color}
                            onChange={(e) =>
                              setConfig({ ...config, background_color: e.target.value })
                            }
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={config.background_color}
                            onChange={(e) =>
                              setConfig({ ...config, background_color: e.target.value })
                            }
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>

                      {/* Genel text rengi kaldırıldı */}
                    </div>

                    <div className="h-px bg-slate-100 my-4" />
                    <h4 className="text-xs font-semibold text-slate-700 mb-3">Mesaj Balonları</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="chat_bubble_user">Kullanıcı Arka Plan</Label>
                        <div className="flex gap-2">
                          <Input
                            id="chat_bubble_user"
                            type="color"
                            value={config.chat_bubble_user}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_user: e.target.value })
                            }
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={config.chat_bubble_user}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_user: e.target.value })
                            }
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chat_bubble_user_text">Kullanıcı Text</Label>
                        <div className="flex gap-2">
                          <Input
                            id="chat_bubble_user_text"
                            type="color"
                            value={config.chat_bubble_user_text}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_user_text: e.target.value })
                            }
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={config.chat_bubble_user_text}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_user_text: e.target.value })
                            }
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chat_bubble_bot">Bot Arka Plan</Label>
                        <div className="flex gap-2">
                          <Input
                            id="chat_bubble_bot"
                            type="color"
                            value={config.chat_bubble_bot}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_bot: e.target.value })
                            }
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={config.chat_bubble_bot}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_bot: e.target.value })
                            }
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chat_bubble_bot_text">Bot Text</Label>
                        <div className="flex gap-2">
                          <Input
                            id="chat_bubble_bot_text"
                            type="color"
                            value={config.chat_bubble_bot_text}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_bot_text: e.target.value })
                            }
                            className="h-10 w-20 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={config.chat_bubble_bot_text}
                            onChange={(e) =>
                              setConfig({ ...config, chat_bubble_bot_text: e.target.value })
                            }
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Typography Section */}
                <AccordionItem value="typography" className="border border-slate-200 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Type size={16} className="text-rose-500" />
                      <span className="font-semibold">Yazı Tipi</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="font_family">Font Ailesi</Label>
                      <select
                        id="font_family"
                        value={config.font_family}
                        onChange={(e) => setConfig({ ...config, font_family: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Position & Behavior Section */}
                <AccordionItem value="position" className="border border-slate-200 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-rose-500" />
                      <span className="font-semibold">Konum & Davranış</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Widget Pozisyonu</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setConfig({ ...config, position: 'bottom-right' })}
                          className={cn(
                            'flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium',
                            config.position === 'bottom-right'
                              ? 'border-rose-500 bg-rose-50 text-rose-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          )}
                        >
                          Sağ Alt
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfig({ ...config, position: 'bottom-left' })}
                          className={cn(
                            'flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium',
                            config.position === 'bottom-left'
                              ? 'border-rose-500 bg-rose-50 text-rose-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          )}
                        >
                          Sol Alt
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="auto_open"
                        checked={config.auto_open}
                        onChange={(e) => setConfig({ ...config, auto_open: e.target.checked })}
                        className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
                      />
                      <Label htmlFor="auto_open" className="cursor-pointer">
                        Sayfa açıldığında otomatik aç
                      </Label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {error && (
                <div className="p-4 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium border border-rose-200">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={updateBotMutation.isPending}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {updateBotMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : isSaved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Kaydedildi
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Kaydet
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmbedCode(!showEmbedCode)}
                  className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50"
                >
                  <Code className="mr-2 h-4 w-4" />
                  {showEmbedCode ? 'Kodu Gizle' : 'Siteme Ekle'}
                </Button>
              </div>

              {showEmbedCode && (
                <div className="p-4 bg-slate-900 rounded-lg">
                  <p className="text-slate-300 text-xs mb-2">
                    Bu kodu sitenizin &lt;/body&gt; etiketinden hemen önce ekleyin:
                  </p>
                  <pre className="text-green-400 font-mono text-xs overflow-x-auto">
                    {embedCode}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode);
                    }}
                  >
                    Kopyala
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-lg sticky top-4">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base">Canlı Önizleme</CardTitle>
              <CardDescription className="text-xs">
                Widget'ınızın websitenizdeki görünümü
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {/* Mock website preview */}
              <div className="h-[420px] md:h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                {/* Mock website content */}
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-white/60 rounded w-3/4" />
                  <div className="h-4 bg-white/40 rounded w-full" />
                  <div className="h-4 bg-white/40 rounded w-5/6" />
                  <div className="h-32 bg-white/60 rounded mt-6" />
                </div>

                {/* Widget Preview */}
                <div
                  className={cn(
                    'absolute bottom-6 flex items-end gap-3',
                    config.position === 'bottom-right' ? 'right-6 flex-row' : 'left-6 flex-row-reverse'
                  )}
                >
                  {/* Chat Window (if open) */}
                  {isPreviewOpen && (
                    <div
                      className="w-72 md:w-80 h-72 md:h-80 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4"
                      style={{
                        backgroundColor: config.background_color,
                        fontFamily: `'${config.font_family}', sans-serif`,
                      }}
                    >
                      {/* Header */}
                      <div
                        className="p-4 text-white"
                        style={{ 
                          backgroundColor: config.primary_color,
                        }}
                      >
                        <h3 
                          className="font-bold" 
                          style={{ fontFamily: `'${config.font_family}', sans-serif` }}
                        >
                          {bot.name}
                        </h3>
                        <p 
                          className="text-xs opacity-90" 
                          style={{ fontFamily: `'${config.font_family}', sans-serif` }}
                        >
                          Online
                        </p>
                      </div>

                      {/* Messages */}
                      <div className="p-4 space-y-3 h-40 md:h-48 overflow-y-auto">
                        {/* Bot message */}
                        <div className="flex gap-2">
                          <div
                            className="px-4 py-2 rounded-2xl text-sm max-w-[80%]"
                            style={{ 
                              backgroundColor: config.chat_bubble_bot,
                              color: config.chat_bubble_bot_text,
                              fontFamily: `'${config.font_family}', sans-serif`,
                            }}
                          >
                            {bot.welcome_message || 'Merhaba! Size nasıl yardımcı olabilirim?'}
                          </div>
                        </div>

                        {/* User message */}
                        <div className="flex gap-2 justify-end">
                          <div
                            className="px-4 py-2 rounded-2xl text-sm max-w-[80%]"
                            style={{ 
                              backgroundColor: config.chat_bubble_user,
                              color: config.chat_bubble_user_text,
                              fontFamily: `'${config.font_family}', sans-serif`,
                            }}
                          >
                            Merhaba, bilgi almak istiyorum
                          </div>
                        </div>
                      </div>

                      {/* Input */}
                      <div 
                        className="p-4 border-t" 
                        style={{ 
                          backgroundColor: config.background_color,
                          borderTopColor: '#1F293720'
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Mesajınızı yazın..."
                          className="w-full px-4 py-2.5 rounded-full text-sm focus:outline-none"
                          style={{ 
                            fontFamily: `'${config.font_family}', sans-serif`,
                            backgroundColor: config.background_color,
                            color: '#1F2937',
                            border: '1px solid #1F293733',
                          }}
                          disabled
                        />
                      </div>
                    </div>
                  )}

                  {/* Launcher Button */}
                  <button
                    onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                    className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: config.primary_color }}
                    title={isPreviewOpen ? "Sohbeti Kapat" : "Sohbeti Aç"}
                  >
                    {isPreviewOpen ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
