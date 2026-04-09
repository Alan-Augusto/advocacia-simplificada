import { Icon } from '@iconify/react';
import type { Lead } from '@/lib/types/database';
import { formatLeadCode } from '@/lib/utils/lead-code';

interface PendingContactCardProps {
  lead: Lead;
  onMarkContacted?: (leadId: string) => void;
}

export default function PendingContactCard({ lead, onMarkContacted }: PendingContactCardProps) {
  const getTimeSinceRequest = (dateString: string): { text: string; urgency: 'normal' | 'warning' | 'critical' } => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 2) return { text: 'há menos de 2h', urgency: 'normal' };
    if (hours < 4) return { text: `há ${hours}h`, urgency: 'normal' };
    if (hours < 24) return { text: `há ${hours}h`, urgency: 'warning' };
    const days = Math.floor(hours / 24);
    return { text: `há ${days}d`, urgency: 'critical' };
  };

  const urgencyConfig = getTimeSinceRequest(lead.contact_requested_at!);
  
  const urgencyColors = {
    normal: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', badge: 'bg-slate-100 text-slate-600' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    critical: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', badge: 'bg-rose-100 text-rose-700' },
  };

  const colors = urgencyColors[urgencyConfig.urgency];

  return (
    <div className={`rounded-lg border p-3 ${colors.bg} ${colors.border} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-900">{lead.name}</h4>
            <span className="text-xs font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded">
              {formatLeadCode(lead.code).slice(-4)}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
            <Icon icon="solar:phone-linear" width="12" />
            {lead.phone}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Icon icon="solar:case-linear" width="12" className="text-slate-400" />
            <span className="line-clamp-1">{lead.service_title}</span>
          </div>
        </div>
        
        {/* Urgency badge */}
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
          {urgencyConfig.text}
        </span>
      </div>

      {/* Action button */}
      {onMarkContacted && (
        <button
          onClick={() => onMarkContacted(lead.id)}
          className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md
                     text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white 
                     transition-all"
        >
          <Icon icon="solar:phone-check-linear" width="12" />
          Marcar como contatado
        </button>
      )}
    </div>
  );
}
