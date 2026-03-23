"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';
import type { AppointmentWithSlot, AppointmentStatus } from '@/lib/types/database';

interface AppointmentCardProps {
  appointment: AppointmentWithSlot;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não compareceu',
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: 'bg-teal-100 text-teal-700 border border-teal-200',
  completed: 'bg-violet-100 text-violet-700 border border-violet-200',
  cancelled: 'bg-rose-100 text-rose-700 border border-rose-200',
  no_show: 'bg-amber-100 text-amber-700 border border-amber-200',
};

export default function AppointmentCard({ appointment, onUpdateStatus }: AppointmentCardProps) {
  const [loading, setLoading] = useState(false);

  const { slot } = appointment;

  function formatDate(dateStr: string, timeStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
    return `${dayLabel} às ${timeStr.slice(0, 5)}`;
  }

  async function handleAction(newStatus: AppointmentStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onUpdateStatus(appointment.id, newStatus);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{appointment.lead_name}</p>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Icon icon="solar:calendar-linear" width="12" />
            {slot ? formatDate(slot.date, slot.start_time) : 'Data não disponível'}
            {slot && <span className="text-slate-400">· {slot.duration_minutes} min</span>}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[appointment.status]}`}>
          {STATUS_LABELS[appointment.status]}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1">
          <Icon icon="solar:phone-linear" width="12" />
          {appointment.lead_phone}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="solar:case-linear" width="12" />
          {appointment.lead_service}
        </span>
        <span className="flex items-center gap-1 font-mono">
          <Icon icon="solar:tag-price-linear" width="12" />
          #{appointment.lead_code}
        </span>
      </div>

      {appointment.status === 'scheduled' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('completed')}
            disabled={loading}
            className="flex-1 text-xs font-medium py-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 transition-all disabled:opacity-50"
          >
            Marcar Concluída
          </button>
          <button
            onClick={() => handleAction('cancelled')}
            disabled={loading}
            className="flex-1 text-xs font-medium py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}

      {appointment.status === 'completed' && (
        <button
          onClick={() => handleAction('no_show')}
          disabled={loading}
          className="w-full text-xs font-medium py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all disabled:opacity-50"
        >
          Marcar como Não compareceu
        </button>
      )}
    </div>
  );
}
