import { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import type { Lead, LeadStatus } from '@/lib/types/database';
import { formatLeadCode } from '@/lib/utils/lead-code';

// ─── Types ───────────────────────────────────────────────
interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onLeadMove: (leadId: string, newStatus: LeadStatus) => Promise<void>;
}

// ─── Constants ───────────────────────────────────────────
const STATUS_LABELS: Record<LeadStatus, string> = {
  em_andamento: 'Em Andamento',
  quente: 'Quente',
  frio: 'Frio',
  contatado: 'Contatado',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

const STATUS_ACCENT: Record<LeadStatus, string> = {
  em_andamento: 'bg-indigo-500',
  quente: 'bg-emerald-500',
  frio: 'bg-slate-400',
  contatado: 'bg-blue-500',
  fechado: 'bg-violet-500',
  perdido: 'bg-rose-500',
};

const KANBAN_COLUMNS: LeadStatus[] = [
  'quente',
  'contatado',
  'fechado',
  'em_andamento',
  'frio',
  'perdido',
];

// ─── Helpers ─────────────────────────────────────────────
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
}

// ─── Component ───────────────────────────────────────────
export default function KanbanBoard({ leads, onLeadClick, onLeadMove }: KanbanBoardProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const getLeadsByStatus = useCallback(
    (status: LeadStatus) => leads.filter((lead) => lead.status === status),
    [leads]
  );

  const handleDragStart = (lead: Lead) => setDraggedLead(lead);

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => setDragOverColumn(null);

  const handleDrop = async (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null);
      return;
    }

    await onLeadMove(draggedLead.id, newStatus);
    setDraggedLead(null);
  };

  return (
    <div className="h-full overflow-x-auto overflow-y-auto">
      <div className="flex gap-3 p-1 min-w-min h-full">
        {KANBAN_COLUMNS.map((status) => {
          const statusLeads = getLeadsByStatus(status);
          const isOver = dragOverColumn === status;

          return (
            <div
              key={status}
              className="flex-shrink-0 w-72 flex flex-col"
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div
                className={`
                  flex flex-col rounded-lg p-3 h-full min-h-[200px]
                  transition-all duration-200
                  ${isOver ? 'ring-2 ring-indigo-400 bg-indigo-50/70' : 'bg-slate-100/70'}
                `}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${STATUS_ACCENT[status]}`} />
                    <h3 className="text-sm font-semibold text-slate-900">
                      {STATUS_LABELS[status]}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md shadow-sm">
                    {statusLeads.length}
                  </span>
                </div>

                {/* Cards — scrollable within column */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                  {statusLeads.map((lead) => (
                    <KanbanCard
                      key={lead.id}
                      lead={lead}
                      isDragging={draggedLead?.id === lead.id}
                      onDragStart={() => handleDragStart(lead)}
                      onClick={() => onLeadClick(lead)}
                    />
                  ))}

                  {/* Empty column placeholder */}
                  {statusLeads.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-slate-300">
                      <Icon icon="solar:inbox-line-linear" width="24" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Kanban Card ─────────────────────────────────────────
function KanbanCard({
  lead,
  isDragging,
  onDragStart,
  onClick,
}: {
  lead: Lead;
  isDragging: boolean;
  onDragStart: () => void;
  onClick: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className={`
        w-full bg-white rounded-lg border border-slate-200 p-3
        hover:shadow-md hover:border-indigo-300
        transition-all duration-150 cursor-move
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-slate-900 line-clamp-1">{lead.name}</h4>
        <span className="text-xs font-mono text-slate-400">
          {formatLeadCode(lead.code).slice(-4)}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
        <Icon icon="solar:phone-linear" width="12" />
        {lead.phone}
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 line-clamp-1 flex-1">{lead.service_title}</span>
        <span className="text-slate-400 ml-2">{formatRelativeDate(lead.last_message_at)}</span>
      </div>
    </div>
  );
}
