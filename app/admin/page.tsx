"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { Lead, LeadStats, LeadStatus } from '@/lib/types/database';
import LeadCard from './components/LeadCard';
import LeadDetail from './components/LeadDetail';
import { formatLeadCode } from '@/lib/utils/lead-code';

type ViewMode = 'kanban' | 'list' | 'cards';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({ total: 0, quente: 0, em_andamento: 0, conversao: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const fetchLeads = async () => {
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
  };

  useEffect(() => {
    fetchLeads();
  }, [filterStatus, searchQuery]);

  const statusFilters: Array<{ value: LeadStatus | 'all'; label: string; color: string }> = [
    { value: 'all', label: 'Todos', color: 'slate' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'indigo' },
    { value: 'quente', label: 'Quentes', color: 'emerald' },
    { value: 'frio', label: 'Frios', color: 'slate' },
    { value: 'contatado', label: 'Contatados', color: 'blue' },
    { value: 'fechado', label: 'Fechados', color: 'violet' },
    { value: 'perdido', label: 'Perdidos', color: 'rose' },
  ];

  const statusLabels: Record<LeadStatus, string> = {
    em_andamento: 'Em Andamento',
    quente: 'Quente',
    frio: 'Frio',
    contatado: 'Contatado',
    fechado: 'Fechado',
    perdido: 'Perdido',
  };

  const kanbanColumns: LeadStatus[] = ['em_andamento', 'quente', 'contatado', 'fechado', 'frio', 'perdido'];

  const getLeadsByStatus = (status: LeadStatus) => leads.filter(lead => lead.status === status);

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
    <div className="min-h-screen p-3 lg:p-5 bg-slate-50">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Board de Leads</h1>
        <p className="text-sm text-slate-500">Gerencie todos os leads capturados pela IA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-indigo-50 rounded-md flex items-center justify-center">
              <Icon icon="solar:users-group-rounded-linear" width="16" className="text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Total</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-emerald-50 rounded-md flex items-center justify-center">
              <Icon icon="solar:fire-linear" width="16" className="text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Quentes</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.quente}</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-blue-50 rounded-md flex items-center justify-center">
              <Icon icon="solar:chat-round-linear" width="16" className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Andamento</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.em_andamento}</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-violet-50 rounded-md flex items-center justify-center">
              <Icon icon="solar:chart-2-linear" width="16" className="text-violet-600" />
            </div>
            <span className="text-xs font-medium text-slate-600">Conversão</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{stats.conversao}%</p>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 mb-4">
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
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon icon="solar:widget-5-linear" width="16" className="inline mr-1" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon icon="solar:list-linear" width="16" className="inline mr-1" />
              Lista
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon icon="solar:widget-2-linear" width="16" className="inline mr-1" />
              Cards
            </button>
          </div>

          {/* Status Filter - Only for non-kanban views */}
          {viewMode !== 'kanban' && (
            <div className="flex gap-2 overflow-x-auto">
              {statusFilters.map((filter) => (
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Icon icon="solar:refresh-linear" width="28" className="text-indigo-600 animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon icon="solar:inbox-line-linear" width="24" className="text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Nenhum lead encontrado</h3>
          <p className="text-sm text-slate-500">
            {searchQuery
              ? 'Tente ajustar sua busca ou filtros'
              : 'Os leads capturados pela IA aparecerão aqui'}
          </p>
        </div>
      ) : (
        <>
          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="flex gap-3 overflow-x-auto pb-3">
              {kanbanColumns.map((status) => {
                const statusLeads = getLeadsByStatus(status);
                return (
                  <div key={status} className="flex-shrink-0 w-72">
                    <div className="bg-slate-50 rounded-lg p-3 h-full">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-900">{statusLabels[status]}</h3>
                        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md">
                          {statusLeads.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {statusLeads.map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() => setSelectedLead(lead)}
                            className="w-full bg-white rounded-lg border border-slate-200 p-3 hover:shadow-md hover:border-indigo-300 transition-all text-left"
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
                              <span className="text-slate-400 ml-2">{formatDate(lead.last_message_at)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
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
                        onClick={() => setSelectedLead(lead)}
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
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => setSelectedLead(lead)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Lead Detail Modal */}
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
