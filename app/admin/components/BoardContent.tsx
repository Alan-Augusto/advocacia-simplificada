"use client";

import { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import type { Lead, LeadStats, LeadStatus } from '@/lib/types/database';
import LeadCard from './LeadCard';
import LeadDetail from './LeadDetail';
import StatCards from './StatCards';
import ViewToggle from './ViewToggle';
import KanbanBoard from './KanbanBoard';
import ListView from './ListView';

// ─── Types ───────────────────────────────────────────────
type ViewMode = 'kanban' | 'list' | 'cards';

const STATUS_FILTERS: Array<{ value: LeadStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'quente', label: 'Quentes' },
  { value: 'frio', label: 'Frios' },
  { value: 'contatado', label: 'Contatados' },
  { value: 'fechado', label: 'Fechados' },
  { value: 'perdido', label: 'Perdidos' },
];

// ─── Component ───────────────────────────────────────────
export default function BoardContent() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({ total: 0, quente: 0, em_andamento: 0, conversao: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // ── Data fetching ────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();

      setLeads(data.leads || []);
      setStats(data.stats || { total: 0, quente: 0, em_andamento: 0, conversao: 0 });
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ── Lead move (optimistic update) ────────────────────
  const handleLeadMove = useCallback(
    async (leadId: string, newStatus: LeadStatus) => {
      try {
        // Optimistic update
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );

        await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        fetchLeads();
      } catch (error) {
        console.error('Error updating lead status:', error);
        fetchLeads(); // revert on error
      }
    },
    [fetchLeads]
  );

  // ─── Render ──────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      {/* ── Fixed top panel: Stats + Search + Filter ─── */}
      <div className="flex-shrink-0 space-y-3">
        {/* Stat Cards */}
        <StatCards stats={stats} />

        {/* Toolbar: Search + View Toggle + Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, telefone..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
                <Icon
                  icon="solar:magnifer-linear"
                  width="16"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

            {/* Status Filters — only for list/cards views */}
            {viewMode !== 'kanban' && (
              <div className="flex gap-2 overflow-x-auto">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      filterStatus === filter.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Data area: fills remaining height ────────── */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : leads.length === 0 ? (
          <EmptyState hasSearch={!!searchQuery} />
        ) : (
          <DataView
            viewMode={viewMode}
            leads={leads}
            onLeadClick={setSelectedLead}
            onLeadMove={handleLeadMove}
          />
        )}
      </div>

      {/* ── Lead detail modal ───────────────────────── */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={fetchLeads}
        />
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <Icon icon="solar:refresh-linear" width="28" className="text-indigo-600 animate-spin" />
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-3">
        <Icon icon="solar:inbox-line-linear" width="24" className="text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">Nenhum lead encontrado</h3>
      <p className="text-sm text-slate-500">
        {hasSearch
          ? 'Tente ajustar sua busca ou filtros'
          : 'Os leads capturados pela IA aparecerão aqui'}
      </p>
    </div>
  );
}

function DataView({
  viewMode,
  leads,
  onLeadClick,
  onLeadMove,
}: {
  viewMode: ViewMode;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onLeadMove: (leadId: string, newStatus: LeadStatus) => Promise<void>;
}) {
  if (viewMode === 'kanban') {
    return (
      <KanbanBoard leads={leads} onLeadClick={onLeadClick} onLeadMove={onLeadMove} />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="h-full overflow-y-auto">
        <ListView leads={leads} onLeadClick={onLeadClick} />
      </div>
    );
  }

  // Cards view
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
        ))}
      </div>
    </div>
  );
}
