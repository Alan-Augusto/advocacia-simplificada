"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';
import type { AvailabilitySlot } from '@/lib/types/database';

interface AgendaCalendarProps {
  slots: AvailabilitySlot[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function AgendaCalendar({ slots, selectedDate, onDateSelect }: AgendaCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // Compute slot stats per date
  const dateStats: Record<string, { available: number; booked: number }> = {};
  for (const slot of slots) {
    if (!dateStats[slot.date]) dateStats[slot.date] = { available: 0, booked: 0 };
    if (slot.is_booked) dateStats[slot.date].booked++;
    else dateStats[slot.date].available++;
  }

  function getDaysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
  }
  function getFirstDay(y: number, m: number) {
    return new Date(y, m, 1).getDay();
  }
  function toDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  function isPast(y: number, m: number, d: number) {
    const date = new Date(y, m, d);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < t;
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-all"
        >
          <Icon icon="solar:alt-arrow-left-linear" width="16" />
        </button>
        <span className="text-sm font-semibold text-slate-700">
          {MONTHS_PT[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-all"
        >
          <Icon icon="solar:alt-arrow-right-linear" width="16" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS_PT.map((d, i) => (
          <div key={i} className="text-center text-xs font-medium text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateStr = toDateStr(year, month, day);
          const stats = dateStats[dateStr];
          const past = isPast(year, month, day);
          const isSelected = selectedDate === dateStr;
          const hasAvailable = stats && stats.available > 0;
          const allBooked = stats && stats.available === 0 && stats.booked > 0;

          return (
            <button
              key={day}
              onClick={() => onDateSelect(dateStr)}
              className={`
                relative w-8 h-8 mx-auto flex flex-col items-center justify-center rounded-full text-xs transition-all
                ${isSelected ? 'bg-primary-600 text-white font-semibold shadow-sm' :
                  past ? 'text-slate-300 cursor-default' :
                  hasAvailable ? 'text-slate-700 font-medium hover:bg-primary-50' :
                  allBooked ? 'text-slate-500 hover:bg-amber-50' :
                  'text-slate-400 hover:bg-slate-50'}
              `}
            >
              {day}
              {!isSelected && (hasAvailable || allBooked) && (
                <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${hasAvailable ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Disponível
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Lotado
        </span>
      </div>
    </div>
  );
}
