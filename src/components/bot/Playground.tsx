import React, { useState, useRef, useEffect } from 'react';
import api from '../../lib/api';
import { Bot as BotType, ChatMessage } from '../../types';
import { Bot, Send, RefreshCw, User, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '../../lib/utils';

const MAX_MESSAGE_CHARS = 1000;

export const Playground: React.FC<{ bot: BotType }> = ({ bot }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [hasReadySource, setHasReadySource] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && bot.welcome_message) {
      setMessages([{ role: 'assistant', content: bot.welcome_message }]);
    }
  }, [bot.welcome_message, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const sources: any[] = await api.get(`/ingest/${bot.id}`);
        const ready = Array.isArray(sources) && sources.some((s) => (s?.status || '') === 'ready');
        if (!mounted) return;
        setHasReadySource(!!ready);
        if (ready) {
          const items: string[] = await api.get(`/bots/${bot.id}/suggested-questions`);
          if (!mounted) return;
          const clean = Array.isArray(items) ? items.filter((x) => typeof x === 'string').slice(0, 3) : [];
          setSuggested(clean);
        }
      } catch {
        if (!mounted) return;
        setHasReadySource(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [bot.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (input.length > MAX_MESSAGE_CHARS) {
      const errorMsg: ChatMessage = { role: 'assistant', content: `Mesaj çok uzun. Maksimum ${MAX_MESSAGE_CHARS} karakter.` };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

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
      const is422 = error?.response?.status === 422;
      const is429 = error?.response?.status === 429;
      const msg = is401
        ? 'Oturum süresi doldu veya yetkisiz erişim. Lütfen tekrar giriş yapın.'
        : is422
          ? `Mesaj çok uzun. Maksimum ${MAX_MESSAGE_CHARS} karakter.`
          : is429
            ? 'Bu oturum için mesaj limitine ulaşıldı.'
          : 'Üzgünüm, buna yanıt verirken bir hatayla karşılaştım.';
      const errorMsg: ChatMessage = { role: 'assistant', content: msg };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-[520px] h-[calc(100vh-280px)] md:h-[calc(100vh-300px)] lg:h-[calc(100vh-320px)] flex flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/40 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-0"></div>
      
      {/* Chat Header */}
      <div className="p-3 md:p-4 md:px-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="relative">
             <Avatar className="h-10 w-10 border-2 border-white shadow-md ring-2 ring-slate-100">
               <AvatarFallback className="bg-gradient-to-br from-rose-500 to-purple-600 text-white">
                  <Bot size={20} />
               </AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              {bot.name}
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-600 font-bold uppercase tracking-wider">Bot</span>
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Zap size={10} className="text-yellow-500 fill-yellow-500" />
              Yanıtlamaya hazır
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMessages(bot.welcome_message ? [{role: 'assistant', content: bot.welcome_message}] : [])}
          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
          title="Sohbeti Sıfırla"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 bg-slate-50/30 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex w-full group", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn("flex gap-4 max-w-[85%] md:max-w-[75%]", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              <Avatar className={cn(
                "h-8 w-8 mt-1 border shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110",
                msg.role === 'user' ? "border-slate-200" : "border-rose-100"
              )}>
                <AvatarFallback className={cn(
                  "text-xs font-bold",
                  msg.role === 'user' ? "bg-white text-slate-600" : "bg-gradient-to-br from-rose-500 to-purple-600 text-white"
                )}>
                  {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                "p-4 text-sm leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 whitespace-pre-line relative",
                msg.role === 'user' 
                  ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm shadow-slate-100"
              )}>
                {renderMessageContent(msg.content)}
                <div className={cn(
                  "absolute top-0 w-3 h-3",
                  msg.role === 'user' 
                    ? "-right-1.5 bg-slate-900 [clip-path:polygon(0_0,0%_100%,100%_0)]" 
                    : "-left-1.5 bg-white border-l border-t border-slate-100 [clip-path:polygon(0_0,100%_0,100%_100%)]"
                )}></div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-2">
             <div className="flex gap-4 max-w-[85%]">
                <Avatar className="h-8 w-8 mt-1 border border-rose-100 shadow-sm shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-purple-600 text-white">
                    <Sparkles size={14} />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-100 relative z-20">
        {hasReadySource && suggested.length > 0 && (
          <div className="max-w-4xl mx-auto mb-3">
            <div className="flex flex-wrap gap-2 overflow-x-auto py-1 -mx-1 px-1">
              {suggested.map((q, i) => (
                <button
                  key={`sugg-${i}`}
                  type="button"
                  onClick={() => setInput(q)}
                  className="px-3 py-2 text-xs md:text-sm rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex items-center gap-3 max-w-4xl mx-auto">
          <div className="relative flex-1 group">
            <Input
              className="w-full bg-slate-50 border-slate-200 focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500 pl-4 pr-12 py-4 md:py-6 rounded-2xl transition-all shadow-sm group-hover:bg-white"
              placeholder="Bot ile sohbet edin..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={MAX_MESSAGE_CHARS}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              {input.length}/{MAX_MESSAGE_CHARS}
            </div>
          </div>
          <Button 
            type="submit"
            size="icon"
            disabled={!input.trim() || isTyping || input.length > MAX_MESSAGE_CHARS}
            className={cn(
              "h-12 w-12 rounded-xl shrink-0 transition-all duration-300 shadow-lg",
              input.trim() 
                ? "bg-gradient-to-br from-rose-500 to-purple-600 hover:shadow-rose-500/25 hover:scale-105" 
                : "bg-slate-100 text-slate-400 shadow-none"
            )}
          >
            <Send size={20} className={cn(input.trim() && "text-white")} />
          </Button>
        </form>
      </div>
    </div>
  );
};

function renderMessageContent(text: string) {
  const lines = text.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length > 0) {
      elements.push(
        <ul className="list-disc pl-5 space-y-1 my-2" key={`ul-${elements.length}`}>
          {list.map((item, idx) => (
            <li key={`li-${elements.length}-${idx}`}>{renderInlineBold(item)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const l = raw.trim();
    if (/^(\*|-)\s+/.test(l)) {
      list.push(l.replace(/^(\*|-)\s+/, ''));
      continue;
    }
    flushList();
    if (l.length === 0) {
      elements.push(<div className="h-3" key={`br-${elements.length}`} />);
    } else {
      elements.push(<p key={`p-${elements.length}`} className="mb-1">{renderInlineBold(raw)}</p>);
    }
  }
  flushList();
  return <>{elements}</>;
}

function renderInlineBold(s: string) {
  const parts = s.split(/\*\*([^*]+)\*\*/);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      out.push(<strong key={`b-${i}`} className="font-bold text-slate-900">{parts[i]}</strong>);
    } else {
      out.push(parts[i]);
    }
  }
  return <>{out}</>;
}
