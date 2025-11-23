import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { postT } from '../../lib/api';
import { Source } from '../../types';
import { Globe, FileText, Trash2, Upload, Loader2, Link as LinkIcon, CheckCircle2, XCircle, Clock, Database } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export const KnowledgeBase: React.FC<{ botId: string }> = ({ botId }) => {
  const queryClient = useQueryClient();
  const [urlInput, setUrlInput] = useState('');
  const [activeMode, setActiveMode] = useState<'url' | 'file' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { data: sources, isLoading } = useQuery<Source[]>({
    queryKey: ['sources', botId],
    queryFn: () => api.get(`/ingest/${botId}`),
    refetchInterval: (query) => {
        const data = query.state.data as Source[] | undefined;
        if (data?.some(s => s.status === 'processing' || s.status === 'pending')) {
            return 3000;
        }
        return false;
    }
  });

  const addUrlMutation = useMutation({
    mutationFn: (url: string) => postT<Source>('/ingest/url', { bot_id: botId, url, type: 'single' }),
    onSuccess: (created: Source) => {
      queryClient.setQueryData<Source[] | undefined>(['sources', botId], (prev) => {
        const list = prev ?? [];
        return [...list, created];
      });
      setUrlInput('');
      setActiveMode(null);
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('f', file);
      return api.post(`/ingest/file?bot_id=${botId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources', botId] });
      setActiveMode(null);
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: (sourceId: string) => api.delete(`/ingest/${sourceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources', botId] });
    },
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) addUrlMutation.mutate(urlInput);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileMutation.mutate(e.target.files[0]);
    }
  };

  const getStatusIcon = (status: Source['status']) => {
    switch (status) {
      case 'ready': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'processing': return <Loader2 size={16} className="text-yellow-500 animate-spin" />;
      case 'pending': return <Clock size={16} className="text-slate-400" />;
      case 'error': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getStatusLabel = (status: Source['status']) => {
    const labels: Record<string, string> = {
      ready: 'Hazır',
      processing: 'İşleniyor',
      pending: 'Sırada',
      error: 'Hata'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* URL Card */}
        <div 
          className={cn(
            "group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer bg-white",
            activeMode === 'url' 
              ? "border-rose-500 ring-4 ring-rose-500/10 shadow-xl scale-[1.02]" 
              : "border-slate-200 hover:border-rose-200 hover:shadow-lg hover:scale-[1.01]"
          )}
          onClick={() => setActiveMode('url')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-32 h-32 text-rose-500 transform rotate-12 translate-x-8 -translate-y-8" />
          </div>
          
          <div className="p-6 md:p-8 relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Globe size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Web Sitesi Ekle</h3>
            <p className="text-slate-500 mb-4 md:mb-6">Herhangi bir web sayfasının içeriğini botunuza öğretin.</p>
            
            {activeMode === 'url' ? (
              <form onSubmit={handleUrlSubmit} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2" onClick={e => e.stopPropagation()}>
                <Input 
                  placeholder="https://ornek.com" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-white border-slate-200 focus-visible:ring-rose-500"
                  autoFocus
                />
                <Button type="submit" disabled={addUrlMutation.isPending} className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20">
                  {addUrlMutation.isPending ? <Loader2 className="animate-spin" /> : "Ekle"}
                </Button>
              </form>
            ) : (
              <div className="text-rose-600 font-medium flex items-center text-sm group-hover:translate-x-1 transition-transform">
                Başlamak için tıklayın <span className="ml-1">→</span>
              </div>
            )}
          </div>
        </div>

        {/* File Upload Card */}
        <div 
          className={cn(
            "group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer bg-white",
            activeMode === 'file' || isDragging
              ? "border-purple-500 ring-4 ring-purple-500/10 shadow-xl scale-[1.02]" 
              : "border-slate-200 hover:border-purple-200 hover:shadow-lg hover:scale-[1.01]"
          )}
          onClick={() => setActiveMode('file')}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              uploadFileMutation.mutate(e.dataTransfer.files[0]);
            }
          }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-32 h-32 text-purple-500 transform -rotate-12 translate-x-8 -translate-y-8" />
          </div>
          
          <div className="p-6 md:p-8 relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Upload size={28} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">Dosya Yükle</h3>
            <p className="text-slate-500 mb-6">
              {isDragging ? "Dosyayı buraya bırakın!" : "PDF, Word veya Metin belgelerinizi yükleyerek eğitin."}
            </p>
            
            <div className="relative">
               <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.docx,.md"
                  onClick={(e) => e.stopPropagation()}
                />
               <div className="text-rose-600 font-medium flex items-center text-sm group-hover:translate-x-1 transition-transform">
                  {isDragging ? "Bırakın yüklesin" : "Başlamak için tıklayın"} <span className="ml-1">→</span>
               </div>
            </div>
            
            {uploadFileMutation.isPending && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-30 rounded-3xl">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-purple-600 h-8 w-8" />
                  <span className="text-sm font-medium text-purple-900">Dosya yükleniyor...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Eğitim Verileri</h2>
          <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            {sources?.length || 0} Kaynak
          </span>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
             ))}
           </div>
        ) : sources && sources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((source) => (
              <div 
                key={source.id} 
                className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    source.source_type === 'url' ? "bg-rose-50 text-rose-600" : "bg-purple-50 text-purple-600"
                  )}>
                    {source.source_type === 'url' ? <Globe size={18} /> : <FileText size={18} />}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                    source.status === 'ready' ? "bg-green-50 text-green-700 border-green-200" :
                    source.status === 'processing' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                    source.status === 'error' ? "bg-red-50 text-red-700 border-red-200" :
                    "bg-slate-50 text-slate-700 border-slate-200"
                  )}>
                    {getStatusIcon(source.status)}
                    {getStatusLabel(source.status)}
                  </div>
                </div>

                <div className="space-y-1 relative z-10">
                  <h4 className="font-semibold text-slate-900 truncate" title={source.source_name}>
                    {source.source_name}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono truncate opacity-70">
                    ID: {source.id.slice(0, 8)}...
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const ok = window.confirm('Bu kaynağı silmek istediğinizden emin misiniz?');
                      if (!ok) return;
                      setDeletingId(source.id);
                      deleteSourceMutation.mutate(source.id, {
                        onSettled: () => setDeletingId(null),
                      });
                    }}
                    disabled={deletingId === source.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                  >
                    {deletingId === source.id ? (
                      <>
                        <Loader2 size={14} className="mr-1.5 animate-spin" />
                        Siliniyor...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} className="mr-1.5" />
                        Sil
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 md:py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Henüz kaynak eklenmemiş</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Botunuzu eğitmek için yukarıdaki kartları kullanarak web siteleri veya belgeler ekleyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
