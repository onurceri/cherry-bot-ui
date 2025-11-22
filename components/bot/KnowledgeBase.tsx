import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Source } from '../../types';
import { Globe, FileText, Trash2, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const KnowledgeBase: React.FC<{ botId: string }> = ({ botId }) => {
  const queryClient = useQueryClient();
  const [urlInput, setUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(true);

  // Poll only if some sources are processing
  const { data: sources, isLoading } = useQuery<Source[]>({
    queryKey: ['sources', botId],
    queryFn: () => api.get(`/ingest/${botId}`),
    refetchInterval: (query) => {
        // query.state.data is the actual data because of the query definition, but TypeScript might need the `data` property from the query object if passed directly.
        // Actually, in v5, it passes the query object. 
        // Let's use standard interval logic:
        const data = query.state.data as Source[] | undefined;
        if (data?.some(s => s.status === 'processing' || s.status === 'pending')) {
            return 3000;
        }
        return false;
    }
  });

  const addUrlMutation = useMutation({
    mutationFn: (url: string) => api.post('/ingest/url', { bot_id: botId, url, type: 'single' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources', botId] });
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
      ready: 'bg-green-100 text-green-700',
      processing: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-slate-100 text-slate-700',
      error: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Add Data Source</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Import URL Card */}
          <div 
            onClick={() => setIsUrlMode(true)}
            className={`cursor-pointer p-6 rounded-xl border transition-all ${isUrlMode ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-blue-300'}`}
          >
             <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Globe size={24} />
                </div>
                <h3 className="font-semibold text-slate-900">Import Website URL</h3>
                <p className="text-sm text-slate-500 mt-1">Fetch data directly from a live website.</p>
             </div>
             {isUrlMode && (
               <form onSubmit={handleUrlSubmit} className="mt-4 flex gap-2">
                 <Input 
                    placeholder="https://example.com" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="bg-white"
                 />
                 <Button type="submit" isLoading={addUrlMutation.isPending}>Fetch</Button>
               </form>
             )}
          </div>

          {/* Upload File Card */}
          <div 
             className={`cursor-pointer p-6 rounded-xl border transition-all bg-white hover:border-blue-300 border-slate-200 relative`}
          >
             <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                  <Upload size={24} />
                </div>
                <h3 className="font-semibold text-slate-900">Upload File</h3>
                <p className="text-sm text-slate-500 mt-1">Upload documents like PDFs, DOCX, or TXT.</p>
                
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.docx,.md"
                />
             </div>
             {uploadFileMutation.isPending && (
               <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                 <Loader2 className="animate-spin text-blue-600" />
               </div>
             )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Current Sources</h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
           {isLoading ? (
             <div className="p-8 text-center text-slate-500">Loading sources...</div>
           ) : sources && sources.length > 0 ? (
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sources.map(source => (
                    <tr key={source.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        {source.source_type === 'url' ? <Globe className="text-slate-400" size={18} /> : <FileText className="text-slate-400" size={18} />}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 truncate max-w-[200px]">{source.source_name}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(source.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteSourceMutation.mutate(source.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           ) : (
             <div className="p-12 text-center text-slate-500">
               No data sources added yet.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
