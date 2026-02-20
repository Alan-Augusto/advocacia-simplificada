"use client";

import { useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { Icon } from '@iconify/react';
import type { Lead, Message, LeadStatus } from '@/lib/types/database';
import { formatLeadCode } from '@/lib/utils/lead-code';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}

const statusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'quente', label: 'Quente' },
  { value: 'frio', label: 'Frio' },
  { value: 'contatado', label: 'Contatado' },
  { value: 'fechado', label: 'Fechado' },
  { value: 'perdido', label: 'Perdido' },
];

const statusColorMap: Record<LeadStatus, { active: string; base: string }> = {
  em_andamento: {
    active: 'bg-indigo-100 text-indigo-700 border border-indigo-300',
    base: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200',
  },
  quente: {
    active: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
    base: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200',
  },
  frio: {
    active: 'bg-slate-200 text-slate-700 border border-slate-400',
    base: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200',
  },
  contatado: {
    active: 'bg-blue-100 text-blue-700 border border-blue-300',
    base: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200',
  },
  fechado: {
    active: 'bg-violet-100 text-violet-700 border border-violet-300',
    base: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200',
  },
  perdido: {
    active: 'bg-rose-100 text-rose-700 border border-rose-300',
    base: 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200',
  },
};

export default function LeadDetail({ lead, onClose, onUpdate }: LeadDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erro ao atualizar status do lead.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete lead');
      setShowDeleteModal(false);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setDeleting(false);
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="p-2 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all disabled:opacity-50"
              title="Apagar lead"
            >
              <Icon icon={deleting ? "solar:refresh-linear" : "solar:trash-bin-trash-linear"} width="20" className={deleting ? "animate-spin" : ""} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            >
              <Icon icon="solar:close-circle-linear" width="20" />
            </button>
          </div>
        </div>

        {/* Status Selector */}
        <div className="p-4 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Status do Lead</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isActive = lead.status === option.value;
              const colors = statusColorMap[option.value];
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={updatingStatus || isActive}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActive ? colors.active : colors.base
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
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

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Apagar lead?"
        description={`O lead de "${lead.name}" será removido do board e não poderá ser recuperado.`}
        confirmLabel="Sim, apagar"
        cancelLabel="Cancelar"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
