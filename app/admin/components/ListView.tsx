import type { Lead, LeadStatus } from '@/lib/types/database';
import { formatLeadCode } from '@/lib/utils/lead-code';

interface ListViewProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

const statusLabels: Record<LeadStatus, string> = {
  em_andamento: 'Em Andamento',
  quente: 'Quente',
  frio: 'Frio',
  contatado: 'Contatado',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

const statusColors: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  em_andamento: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  quente: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  frio: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  contatado: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  fechado: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  perdido: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
};

export default function ListView({ leads, onLeadClick }: ListViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700">Lead</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700">Telefone</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700">Serviço</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700">Status</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700">Última Msg</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700">Código</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onLeadClick(lead)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{lead.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{lead.phone}</td>
                <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{lead.service_title}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${statusColors[lead.status].bg} ${statusColors[lead.status].text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColors[lead.status].dot}`} />
                    {statusLabels[lead.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{formatDate(lead.last_message_at)}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-400">{formatLeadCode(lead.code)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
