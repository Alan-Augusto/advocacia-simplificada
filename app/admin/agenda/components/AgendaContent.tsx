"use client";

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import type { AvailabilitySlot, AppointmentWithSlot, AppointmentStatus } from '@/lib/types/database';
import AgendaCalendar from './AgendaCalendar';
import AppointmentCard from './AppointmentCard';
import AddSlotsModal from './AddSlotsModal';

type AppointmentFilter = 'upcoming' | 'today' | 'all' | 'cancelled';

const FILTER_LABELS: Record<AppointmentFilter, string> = {
  upcoming: 'Próximas',
  today: 'Hoje',
  all: 'Todas',
  cancelled: 'Canceladas',
};

export default function AgendaContent() {
  const today = new Date().toISOString().split('T')[0];

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isAddSlotsOpen, setIsAddSlotsOpen] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentFilter>('upcoming');
  const [deletingSlot, setDeletingSlot] = useState<string | null>(null);

  // ── Fetch slots ───────────────────────────────────────
  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const startDate = today;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 90);
      const endDate = futureDate.toISOString().split('T')[0];

      const res = await fetch(`/api/admin/availability?start=${startDate}&end=${endDate}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, [today]);

  // ── Fetch appointments ────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    setLoadingApps(true);
    try {
      const params = new URLSearchParams();
      if (appointmentFilter === 'upcoming') params.set('upcoming', 'true');
      else if (appointmentFilter === 'today') params.set('date', today);
      else if (appointmentFilter === 'cancelled') params.set('status', 'cancelled');

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoadingApps(false);
    }
  }, [appointmentFilter, today]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);
  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ── Slot actions ─────────────────────────────────────
  async function handleDeleteSlot(slotId: string) {
    setDeletingSlot(slotId);
    try {
      const res = await fetch(`/api/admin/availability/${slotId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Não foi possível remover o horário');
        return;
      }
      fetchSlots();
    } finally {
      setDeletingSlot(null);
    }
  }

  // ── Appointment actions ───────────────────────────────
  function handleUpdateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) =>
      prev.map((a) => a.id === id ? { ...a, status } : a)
    );
    // Re-fetch to reflect freed slot in calendar
    fetchSlots();
  }

  // ── Slots for selected date ───────────────────────────
  const slotsForDate = slots.filter((s) => s.date === selectedDate);

  // ── Appointments for selected date (shown in slots panel) ─
  const appointmentsForDate = appointments.filter(
    (a) => a.slot?.date === selectedDate
  );

  function formatSelectedDate(dateStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(y, m - 1, d));
  }

  function formatTime(timeStr: string) {
    return timeStr?.slice(0, 5) || '';
  }

  function getSlotAppointment(slotId: string) {
    return appointmentsForDate.find((a) => a.slot_id === slotId);
  }

  // ── Filtered appointments for right panel ─────────────
  const filteredAppointments = appointmentFilter === 'upcoming'
    ? appointments.filter((a) => a.status !== 'cancelled')
    : appointments;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full overflow-auto lg:overflow-hidden">

      {/* ── Left Panel: Availability Management ── */}
      <div className="lg:w-[40%] flex-shrink-0 flex flex-col gap-4">

        {/* Calendar Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Calendário</h3>
            <button
              onClick={() => setIsAddSlotsOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-all"
            >
              <Icon icon="solar:add-circle-bold" width="14" />
              Adicionar Horários
            </button>
          </div>

          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <Icon icon="solar:refresh-linear" className="animate-spin text-primary-500" width="24" />
            </div>
          ) : (
            <AgendaCalendar
              slots={slots}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
        </div>

        {/* Slots for selected date */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 min-h-0 overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-900 mb-1 capitalize">
            {formatSelectedDate(selectedDate)}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {slotsForDate.length} horário{slotsForDate.length !== 1 ? 's' : ''} cadastrado{slotsForDate.length !== 1 ? 's' : ''}
          </p>

          {slotsForDate.length === 0 ? (
            <div className="text-center py-8">
              <Icon icon="solar:calendar-add-linear" className="text-slate-300 mx-auto mb-2" width="32" />
              <p className="text-xs text-slate-400">Nenhum horário para esta data</p>
            </div>
          ) : (
            <div className="space-y-2">
              {slotsForDate.map((slot) => {
                const appt = getSlotAppointment(slot.id);
                const isBooked = slot.is_booked && appt;
                return (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 border text-xs ${
                      isBooked ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${isBooked ? 'text-teal-700' : 'text-slate-700'}`}>
                        {formatTime(slot.start_time)}
                      </span>
                      <span className="text-slate-400">{slot.duration_minutes} min</span>
                      {isBooked && (
                        <span className="text-teal-600 font-medium truncate max-w-[100px]">· {appt.lead_name}</span>
                      )}
                      {!isBooked && <span className="text-emerald-600">Disponível</span>}
                    </div>
                    {!isBooked && (
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        disabled={deletingSlot === slot.id}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-40"
                      >
                        {deletingSlot === slot.id ? (
                          <Icon icon="solar:refresh-linear" className="animate-spin" width="12" />
                        ) : (
                          <Icon icon="solar:trash-bin-trash-linear" width="14" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel: Appointments List ── */}
      <div className="lg:flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-0">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Consultas Agendadas</h3>
          {/* Filter tabs */}
          <div className="flex gap-1 border-b border-slate-100 pb-0 -mx-4 px-4 overflow-x-auto">
            {(Object.keys(FILTER_LABELS) as AppointmentFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setAppointmentFilter(f)}
                className={`pb-2 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                  appointmentFilter === f
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Appointment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loadingApps ? (
            <div className="flex items-center justify-center py-12">
              <Icon icon="solar:refresh-linear" className="animate-spin text-primary-500" width="24" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Icon icon="solar:calendar-linear" className="text-slate-300 mb-2" width="36" />
              <p className="text-sm text-slate-500">Nenhuma consulta encontrada</p>
              <p className="text-xs text-slate-400 mt-1">
                {appointmentFilter === 'upcoming' ? 'Nenhuma consulta agendada próxima' : 'Tente outro filtro'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                onUpdateStatus={handleUpdateStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Slots Modal */}
      <AddSlotsModal
        isOpen={isAddSlotsOpen}
        onClose={() => setIsAddSlotsOpen(false)}
        onCreated={() => { setIsAddSlotsOpen(false); fetchSlots(); }}
      />
    </div>
  );
}
