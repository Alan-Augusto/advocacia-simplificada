"use client";

import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';

interface AddSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type Mode = 'single' | 'bulk';

const DURATION_OPTIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1h30' },
];

const INTERVAL_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hora' },
];

function generatePreview(startFrom: string, startUntil: string, intervalMinutes: number): string[] {
  if (!startFrom || !startUntil || !intervalMinutes) return [];
  const [sh, sm] = startFrom.split(':').map(Number);
  const [eh, em] = startUntil.split(':').map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  const times: string[] = [];
  while (cur < end) {
    const h = Math.floor(cur / 60).toString().padStart(2, '0');
    const m = (cur % 60).toString().padStart(2, '0');
    times.push(`${h}:${m}`);
    cur += intervalMinutes;
  }
  return times;
}

export default function AddSlotsModal({ isOpen, onClose, onCreated }: AddSlotsModalProps) {
  const [mode, setMode] = useState<Mode>('bulk');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single slot fields
  const [singleDate, setSingleDate] = useState('');
  const [singleTime, setSingleTime] = useState('');
  const [singleDuration, setSingleDuration] = useState(30);

  // Bulk fields
  const [bulkDate, setBulkDate] = useState('');
  const [bulkStartFrom, setBulkStartFrom] = useState('09:00');
  const [bulkStartUntil, setBulkStartUntil] = useState('12:00');
  const [bulkInterval, setBulkInterval] = useState(30);
  const [bulkDuration, setBulkDuration] = useState(30);

  const preview = useMemo(
    () => generatePreview(bulkStartFrom, bulkStartUntil, bulkInterval),
    [bulkStartFrom, bulkStartUntil, bulkInterval]
  );

  if (!isOpen) return null;

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      let body: Record<string, unknown>;

      if (mode === 'single') {
        if (!singleDate || !singleTime) {
          setError('Preencha a data e o horário');
          return;
        }
        body = { date: singleDate, start_time: singleTime, duration_minutes: singleDuration };
      } else {
        if (!bulkDate || !bulkStartFrom || !bulkStartUntil) {
          setError('Preencha todos os campos');
          return;
        }
        if (preview.length === 0) {
          setError('Nenhum horário gerado — verifique os horários de início e fim');
          return;
        }
        body = {
          bulk: true,
          date: bulkDate,
          start_from: bulkStartFrom,
          start_until: bulkStartUntil,
          interval_minutes: bulkInterval,
          duration_minutes: bulkDuration,
        };
      }

      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao criar horários');
        return;
      }

      onCreated();
      onClose();
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Adicionar Horários</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400"
          >
            <Icon icon="solar:close-circle-linear" width="20" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex p-4 pb-0 gap-2">
          <button
            onClick={() => setMode('bulk')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'bulk' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Em Lote
          </button>
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'single' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Único
          </button>
        </div>

        <div className="p-5 space-y-4">
          {mode === 'single' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Data</label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Horário</label>
                <input
                  type="time"
                  value={singleTime}
                  onChange={(e) => setSingleTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Duração da consulta</label>
                <select
                  value={singleDuration}
                  onChange={(e) => setSingleDuration(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {DURATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Data</label>
                <input
                  type="date"
                  value={bulkDate}
                  onChange={(e) => setBulkDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Início</label>
                  <input
                    type="time"
                    value={bulkStartFrom}
                    onChange={(e) => setBulkStartFrom(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fim</label>
                  <input
                    type="time"
                    value={bulkStartUntil}
                    onChange={(e) => setBulkStartUntil(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Intervalo</label>
                  <select
                    value={bulkInterval}
                    onChange={(e) => setBulkInterval(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {INTERVAL_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duração</label>
                  <select
                    value={bulkDuration}
                    onChange={(e) => setBulkDuration(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {DURATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Preview */}
              {preview.length > 0 && (
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-700 mb-2">
                    Serão criados {preview.length} horários:
                  </p>
                  <p className="text-xs text-indigo-600">{preview.join(', ')}</p>
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Icon icon="solar:refresh-linear" className="animate-spin" width="18" />
            ) : (
              <Icon icon="solar:add-circle-bold" width="18" />
            )}
            {loading ? 'Criando...' : mode === 'bulk' ? `Criar ${preview.length} Horários` : 'Adicionar Horário'}
          </button>
        </div>
      </div>
    </div>
  );
}
