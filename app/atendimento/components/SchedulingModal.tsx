"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { Appointment, AvailabilitySlot, SlotsByDate } from "@/lib/types/database";

interface SchedulingModalProps {
  isOpen: boolean;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadService: string;
  leadCode: string;
  onClose: () => void;
  onBooked: (appointment: Appointment) => void;
}

type SchedulingStep = 'calendar' | 'time_slots' | 'confirmation' | 'success';

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function SchedulingModal({
  isOpen,
  leadId,
  leadName,
  leadPhone,
  leadService,
  leadCode,
  onClose,
  onBooked,
}: SchedulingModalProps) {
  const [step, setStep] = useState<SchedulingStep>('calendar');
  const [slotsByDate, setSlotsByDate] = useState<SlotsByDate>({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  // Calendar navigation
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  useEffect(() => {
    if (!isOpen) return;
    setLoadingSlots(true);
    fetch('/api/appointments/available?days=60')
      .then((r) => r.json())
      .then((data) => setSlotsByDate(data.slots || {}))
      .catch(() => setSlotsByDate({}))
      .finally(() => setLoadingSlots(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const availableDates = new Set(Object.keys(slotsByDate));

  // ── Calendar helpers ──────────────────────────────────

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
  }

  function toDateStr(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isPast(year: number, month: number, day: number) {
    const d = new Date(year, month, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  function prevMonth() {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else setCalendarMonth(m => m - 1);
  }

  function nextMonth() {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else setCalendarMonth(m => m + 1);
  }

  // ── Format helpers ────────────────────────────────────

  function formatDateLabel(dateStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  }

  function formatTime(timeStr: string) {
    return timeStr.slice(0, 5); // 'HH:MM'
  }

  // ── Booking ───────────────────────────────────────────

  async function handleConfirm() {
    if (!selectedSlot) return;
    setBooking(true);
    setBookingError(null);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          lead_id: leadId,
          lead_name: leadName,
          lead_phone: leadPhone,
          lead_service: leadService,
          lead_code: leadCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || 'Erro ao confirmar agendamento');
        return;
      }
      setBookedAppointment(data.appointment);
      setStep('success');
    } catch {
      setBookingError('Erro de conexão. Tente novamente.');
    } finally {
      setBooking(false);
    }
  }

  // ── Render ────────────────────────────────────────────

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full ring-1 ring-slate-200 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {(step === 'time_slots' || step === 'confirmation') && (
              <button
                onClick={() => setStep(step === 'confirmation' ? 'time_slots' : 'calendar')}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-all"
              >
                <Icon icon="solar:arrow-left-linear" width="18" />
              </button>
            )}
            <h2 className="text-base font-semibold text-slate-900">
              {step === 'calendar' && 'Escolha uma data'}
              {step === 'time_slots' && 'Escolha um horário'}
              {step === 'confirmation' && 'Confirmar agendamento'}
              {step === 'success' && 'Agendamento confirmado!'}
            </h2>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-all"
            >
              <Icon icon="solar:close-circle-linear" width="20" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5">

          {/* ── Step 1: Calendar ── */}
          {step === 'calendar' && (
            <div>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-16">
                  <Icon icon="solar:refresh-linear" className="animate-spin text-primary-500" width="28" />
                </div>
              ) : availableDates.size === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="solar:calendar-linear" className="text-slate-300 mx-auto mb-2" width="36" />
                  <p className="text-sm text-slate-500">Nenhum horário disponível no momento.</p>
                  <p className="text-xs text-slate-400 mt-1">Tente mais tarde ou escolha receber contato.</p>
                </div>
              ) : (
                <>
                  {/* Month navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-all"
                    >
                      <Icon icon="solar:alt-arrow-left-linear" width="18" />
                    </button>
                    <span className="text-sm font-semibold text-slate-700">
                      {MONTHS_PT[calendarMonth]} {calendarYear}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-all"
                    >
                      <Icon icon="solar:alt-arrow-right-linear" width="18" />
                    </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {WEEKDAYS_PT.map((d) => (
                      <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Day grid */}
                  <div className="grid grid-cols-7 gap-y-1">
                    {/* Empty cells before first day */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                      const dateStr = toDateStr(calendarYear, calendarMonth, day);
                      const isAvailable = availableDates.has(dateStr);
                      const isPastDay = isPast(calendarYear, calendarMonth, day);
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={day}
                          disabled={!isAvailable || isPastDay}
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setSelectedSlot(null);
                            setStep('time_slots');
                          }}
                          className={`
                            w-9 h-9 mx-auto flex items-center justify-center rounded-full text-sm transition-all
                            ${isSelected ? 'bg-primary-600 text-white font-semibold shadow-md' :
                              isAvailable && !isPastDay ? 'bg-primary-50 text-primary-700 font-medium hover:bg-primary-100 ring-1 ring-primary-200' :
                              'text-slate-300 cursor-not-allowed'}
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-slate-400 text-center mt-4">
                    Dias com fundo azul têm horários disponíveis
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── Step 2: Time Slots ── */}
          {step === 'time_slots' && selectedDate && (
            <div>
              <p className="text-sm text-slate-500 mb-4 capitalize">{formatDateLabel(selectedDate)}</p>
              <div className="grid grid-cols-3 gap-2">
                {(slotsByDate[selectedDate] || []).map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep('confirmation');
                      }}
                      className={`
                        flex flex-col items-center justify-center rounded-xl py-3 text-sm font-medium transition-all border
                        ${isSelected
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-primary-50'}
                      `}
                    >
                      <span className="font-semibold">{formatTime(slot.start_time)}</span>
                      <span className="text-xs opacity-70 mt-0.5">{slot.duration_minutes} min</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Confirmation ── */}
          {step === 'confirmation' && selectedDate && selectedSlot && (
            <div>
              <div className="bg-primary-50 rounded-xl p-4 mb-5 border border-primary-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:calendar-broken" className="text-primary-600" width="18" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 capitalize">{formatDateLabel(selectedDate)}</p>
                    <p className="text-sm text-slate-600">às {formatTime(selectedSlot.start_time)} · {selectedSlot.duration_minutes} min</p>
                  </div>
                </div>
                <div className="border-t border-primary-100 pt-3 space-y-1">
                  <p className="text-xs text-slate-600"><span className="font-medium">Nome:</span> {leadName}</p>
                  <p className="text-xs text-slate-600"><span className="font-medium">Assunto:</span> {leadService}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-5 italic text-center">
                "O Dr. Luciano entrará em contato para esclarecer suas dúvidas e entender seu caso, sem compromisso."
              </p>

              {bookingError && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4 text-center">
                  {bookingError}
                </p>
              )}

              <button
                onClick={handleConfirm}
                disabled={booking}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {booking ? (
                  <Icon icon="solar:refresh-linear" className="animate-spin" width="18" />
                ) : (
                  <Icon icon="solar:check-circle-bold" width="18" />
                )}
                {booking ? 'Confirmando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          )}

          {/* ── Step 4: Success ── */}
          {step === 'success' && selectedDate && selectedSlot && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Icon icon="solar:check-circle-bold" className="text-emerald-600" width="32" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Agendamento confirmado!</h3>
              <p className="text-sm text-slate-600 mb-1 capitalize">{formatDateLabel(selectedDate)}</p>
              <p className="text-sm text-slate-600 mb-6">às {formatTime(selectedSlot.start_time)}</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                O Dr. Luciano entrará em contato no horário agendado. Fique atento ao seu telefone.
              </p>
              <button
                onClick={() => {
                  if (bookedAppointment) onBooked(bookedAppointment);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
