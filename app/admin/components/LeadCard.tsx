import { Icon } from '@iconify/react';
import type { Lead } from '@/lib/types/database';
import { formatLeadCode } from '@/lib/utils/lead-code';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

const statusColors = {
  em_andamento: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  quente: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  frio: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  contatado: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  fechado: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  perdido: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

const statusLabels = {
  em_andamento: 'Em Andamento',
  quente: 'Quente',
  frio: 'Frio',
  contatado: 'Contatado',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const colors = statusColors[lead.status];
  const statusLabel = statusLabels[lead.status];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `há ${minutes}min`;
    if (hours < 24) return `há ${hours}h`;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md hover:border-indigo-300 transition-all text-left group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {lead.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Icon icon="solar:phone-linear" width="12" />
            {lead.phone}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
            {formatLeadCode(lead.code).slice(-4)}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Service */}
      <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-md">
        <Icon icon="solar:case-linear" width="14" className="text-slate-500 flex-shrink-0" />
        <span className="text-xs text-slate-700 font-medium line-clamp-1">{lead.service_title}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Icon icon="solar:clock-circle-linear" width="12" />
          <span>{formatDate(lead.last_message_at)}</span>
        </div>
        <div className="flex items-center gap-1 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs">Ver</span>
          <Icon icon="solar:alt-arrow-right-linear" width="12" />
        </div>
      </div>
    </button>
  );
}
