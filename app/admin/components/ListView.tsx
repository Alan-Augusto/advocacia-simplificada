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
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
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
