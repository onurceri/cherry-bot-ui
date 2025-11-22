import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { postT } from '../../lib/api';
import { Source } from '../../types';
import { Globe, FileText, Trash2, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '../../lib/utils';

export const KnowledgeBase: React.FC<{ botId: string }> = ({ botId }) => {
  const queryClient = useQueryClient();
  const [urlInput, setUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(true);

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
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: (sourceId: string) => api.delete(`/ingest/${sourceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources', botId] });
    },
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) addUrlMutation.mutate(urlInput);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileMutation.mutate(e.target.files[0]);
    }
  };

  const getStatusBadge = (status: Source['status']) => {
    const styles = {
      ready: 'bg-green-100 text-green-700 border-green-200',
      processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      pending: 'bg-slate-100 text-slate-700 border-slate-200',
      error: 'bg-red-100 text-red-700 border-red-200',
    };
    
    const statusLabels: Record<string, string> = {
      ready: 'Hazır',
      processing: 'İşleniyor',
      pending: 'Beklemede',
      error: 'Hata'
    };

    return (
      <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium capitalize border", styles[status])}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import URL Card */}
        <Card 
          onClick={() => setIsUrlMode(true)}
          className={cn(
            "cursor-pointer transition-all duration-200 border-2",
            isUrlMode ? "border-primary ring-1 ring-primary/20 shadow-md" : "border-slate-200 hover:border-slate-300"
          )}
        >
          <CardHeader>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-2">
              <Globe size={20} />
            </div>
            <CardTitle className="text-lg">Web Sitesi URL'si İçe Aktar</CardTitle>
            <CardDescription>Canlı bir web sitesinden veri çekin.</CardDescription>
          </CardHeader>
          <CardContent>
            {isUrlMode && (
              <form onSubmit={handleUrlSubmit} className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                <Input 
                  placeholder="https://ornek.com" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="bg-white"
                />
                <Button type="submit" disabled={addUrlMutation.isPending}>
                  {addUrlMutation.isPending ? <Loader2 className="animate-spin" /> : "Getir"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Upload File Card */}
        <Card className="cursor-pointer transition-all duration-200 border-2 border-slate-200 hover:border-slate-300 relative overflow-hidden group">
          <CardHeader>
            <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center mb-2">
              <Upload size={20} />
            </div>
            <CardTitle className="text-lg">Dosya Yükle</CardTitle>
            <CardDescription>PDF, DOCX veya TXT gibi belgeler yükleyin.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-sm text-slate-400 group-hover:text-primary transition-colors font-medium">
               Gözatmak için tıklayın veya dosyayı buraya sürükleyin
             </div>
             <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileUpload}
                accept=".pdf,.txt,.docx,.md"
              />
          </CardContent>
          {uploadFileMutation.isPending && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
                <span className="text-sm font-medium text-slate-600">Yükleniyor...</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Mevcut Kaynaklar</h2>
        <div className="rounded-md border bg-white">
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Tür</TableHead>
                  <TableHead>İsim</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                   <TableRow>
                     <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                       Kaynaklar yükleniyor...
                     </TableCell>
                   </TableRow>
                ) : sources && sources.length > 0 ? (
                  sources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>
                        {source.source_type === 'url' ? <Globe className="text-slate-400" size={16} /> : <FileText className="text-slate-400" size={16} />}
                      </TableCell>
                      <TableCell className="font-medium text-slate-700 max-w-[300px] truncate">
                        {source.source_name}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(source.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSourceMutation.mutate(source.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      Henüz veri kaynağı eklenmedi. Başlamak için bir URL veya dosya ekleyin.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
           </Table>
        </div>
      </div>
    </div>
  );
};
