import React, { useState, useRef, useEffect } from 'react';
import api from '../../lib/api';
import { Bot as BotType, ChatMessage } from '../../types';
import { Bot, Send, RefreshCw, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '../../lib/utils';

export const Playground: React.FC<{ bot: BotType }> = ({ bot }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && bot.welcome_message) {
      setMessages([{ role: 'assistant', content: bot.welcome_message }]);
    }
  }, [bot.welcome_message, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res: { response: string } = await api.post(
        '/chat',
        {
          bot_id: bot.id,
          message: userMsg.content,
          session_id: 'playground-session'
        },
        { skipAuthRedirect: true } as any
      );

      const aiMsg: ChatMessage = { role: 'assistant', content: res.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const is401 = error?.response?.status === 401;
      const msg = is401 ? 'Oturum süresi doldu veya yetkisiz erişim. Lütfen tekrar giriş yapın.' : 'Üzgünüm, buna yanıt verirken bir hatayla karşılaştım.';
      const errorMsg: ChatMessage = { role: 'assistant', content: msg };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col overflow-hidden border-slate-200 shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-100">
            <AvatarFallback className="bg-primary text-primary-foreground">
               <Bot size={18} />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold text-slate-800">{bot.name}</div>
            <div className="text-[10px] text-green-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span> Çevrimiçi
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMessages(bot.welcome_message ? [{role: 'assistant', content: bot.welcome_message}] : [])}
          className="text-slate-400 hover:text-slate-600"
          title="Sohbeti Sıfırla"
        >
          <RefreshCw size={16} />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex w-full", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn("flex gap-3 max-w-[85%] md:max-w-[75%]", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              <Avatar className="h-8 w-8 mt-1 border border-slate-100 shadow-sm">
                <AvatarFallback className={cn(
                  "text-xs font-bold",
                  msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-primary text-primary-foreground"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "p-3.5 text-sm leading-relaxed shadow-sm animate-in fade-in zoom-in-95 duration-200",
                msg.role === 'user' 
                  ? "bg-rose-600 text-white rounded-2xl rounded-tr-sm" 
                  : "bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm"
              )}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start w-full">
             <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 mt-1 border border-slate-100 shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={14} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <Input
            className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-rose-500/20"
            placeholder="Mesajınızı yazın..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            type="submit"
            size="icon"
            disabled={!input.trim() || isTyping}
            className={cn(
              "shrink-0 transition-all duration-200",
              input.trim() ? "bg-rose-600 hover:bg-rose-700" : "bg-slate-200 text-slate-400 hover:bg-slate-200"
            )}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </Card>
  );
};
