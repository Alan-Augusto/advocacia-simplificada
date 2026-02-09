"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { Lead, Message, LeadStatus } from '@/lib/types/database';
import { formatLeadCode } from '@/lib/utils/lead-code';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}

const statusOptions: Array<{ value: LeadStatus; label: string; color: string }> = [
  { value: 'em_andamento', label: 'Em Andamento', color: 'indigo' },
  { value: 'quente', label: 'Quente', color: 'emerald' },
  { value: 'frio', label: 'Frio', color: 'slate' },
  { value: 'contatado', label: 'Contatado', color: 'blue' },
  { value: 'fechado', label: 'Fechado', color: 'violet' },
  { value: 'perdido', label: 'Perdido', color: 'rose' },
];

export default function LeadDetail({ lead, onClose, onUpdate }: LeadDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [lead.id]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/leads/${lead.id}/messages`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setUpdatingStatus(true);
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-slate-900">{lead.name}</h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {formatLeadCode(lead.code)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <button
                onClick={() => copyToClipboard(lead.phone)}
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                title="Copiar telefone"
              >
                <Icon icon="solar:phone-linear" width="14" />
                {lead.phone}
              </button>
              <div className="flex items-center gap-1">
                <Icon icon="solar:case-linear" width="14" />
                <span className="line-clamp-1">{lead.service_title}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="solar:calendar-linear" width="14" />
                {formatDate(lead.created_at)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Icon icon="solar:close-circle-linear" width="20" />
          </button>
        </div>

        {/* Status Selector */}
        <div className="p-4 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Status do Lead</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={updatingStatus || lead.status === option.value}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  lead.status === option.value
                    ? `bg-${option.color}-100 text-${option.color}-700 border border-${option.color}-300`
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Histórico de Conversa</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon icon="solar:refresh-linear" width="28" className="text-indigo-600 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="solar:chat-line-linear" width="40" className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Nenhuma mensagem registrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.filter(m => m.role !== 'system').map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
