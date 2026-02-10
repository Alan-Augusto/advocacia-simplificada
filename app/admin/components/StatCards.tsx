import { Icon } from '@iconify/react';
import type { LeadStats } from '@/lib/types/database';

interface StatCardsProps {
  stats: LeadStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
  );
}
