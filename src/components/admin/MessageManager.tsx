'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle, Trash, X, Eye, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
};

export default function MessageManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setMessages(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Delete this message?')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      fetchMessages();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Inbox Messages</h2>
        <div className="text-sm text-[#A1A1A1]">
          {messages.filter(m => !m.is_read).length} unread
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#3ECF8E]" /></div>
      ) : (
        <div className="grid gap-3">
          {messages.length === 0 && (
            <p className="text-[#666666] text-center py-8">Your inbox is empty.</p>
          )}

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex justify-between items-center p-4 bg-[#111111] border rounded-lg transition-colors cursor-pointer ${msg.is_read ? 'border-[#2E2E2E]' : 'border-[#3ECF8E50] bg-[#3ECF8E]/5'}`}
              onClick={() => {
                setViewingMessage(msg);
                if (!msg.is_read) markAsRead(msg.id);
              }}
            >
              <div className="flex items-center gap-4 truncate">
                <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center ${msg.is_read ? 'bg-[#1A1A1A] text-[#666666]' : 'bg-[#3ECF8E]/20 text-[#3ECF8E]'}`}>
                  <Mail size={18} />
                </div>
                
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${msg.is_read ? 'text-[#EDEDED]' : 'text-white font-bold'}`}>{msg.name}</h3>
                    <span className="text-xs text-[#A1A1A1]">&lt;{msg.email}&gt;</span>
                  </div>
                  <p className="text-sm text-[#666666] truncate max-w-md mt-0.5">{msg.message}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                <span className="text-xs text-[#A1A1A1]">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                  className="p-1.5 rounded-lg text-[#666666] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setViewingMessage(null)}>
          <div className="bg-[#111111] border border-[#2E2E2E] rounded-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-[#2E2E2E]">
              <div>
                <h3 className="text-lg font-bold">{viewingMessage.name}</h3>
                <a href={`mailto:${viewingMessage.email}`} className="text-sm text-[#3ECF8E] hover:underline">
                  {viewingMessage.email}
                </a>
              </div>
              <button onClick={() => setViewingMessage(null)} className="text-[#666666] hover:text-[#EDEDED]"><X size={20}/></button>
            </div>
            <div className="p-6">
              <p className="text-xs text-[#666666] mb-4">Received on {new Date(viewingMessage.created_at).toLocaleString()}</p>
              <div className="text-[#EDEDED] whitespace-pre-wrap bg-[#0A0A0A] p-4 rounded-lg border border-[#2E2E2E]">
                {viewingMessage.message}
              </div>
            </div>
            <div className="p-6 border-t border-[#2E2E2E] flex justify-end">
              <button onClick={() => setViewingMessage(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
