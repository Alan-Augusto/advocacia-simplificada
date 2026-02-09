"use client";

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Service } from '@/lib/types/database';

interface ServiceFormProps {
  service: Service | null;
  onClose: () => void;
}

const colorOptions = [
  { value: 'indigo', label: 'Indigo', className: 'bg-indigo-500' },
  { value: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue', className: 'bg-blue-500' },
  { value: 'violet', label: 'Violet', className: 'bg-violet-500' },
  { value: 'rose', label: 'Rose', className: 'bg-rose-500' },
  { value: 'orange', label: 'Orange', className: 'bg-orange-500' },
  { value: 'teal', label: 'Teal', className: 'bg-teal-500' },
  { value: 'pink', label: 'Pink', className: 'bg-pink-500' },
];

const iconOptions = [
  'solar:document-add-linear',
  'solar:wallet-money-linear',
  'solar:logout-2-linear',
  'solar:clock-circle-linear',
  'solar:user-check-linear',
  'solar:heart-pulse-linear',
  'solar:shield-warning-linear',
  'solar:users-group-rounded-linear',
  'solar:home-smile-linear',
  'solar:case-linear',
  'solar:document-text-linear',
  'solar:briefcase-linear',
];

export default function ServiceForm({ service, onClose }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    code: service?.code || '',
    title: service?.title || '',
    description: service?.description || '',
    tags: service?.tags?.join(', ') || '',
    icon: service?.icon || iconOptions[0],
    color_class: service?.color_class || 'indigo',
    order: service?.order || 999,
    initial_message: service?.initial_message || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const url = service
        ? `/api/admin/services/${service.id}`
        : '/api/admin/services';
      
      const method = service ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            {service ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Icon icon="solar:close-circle-linear" width="24" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Ex: 01, 02, 10..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Vínculo de Emprego"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva brevemente o serviço..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: Carteira assinada, Freelancer, Regularização"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ícone <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.icon === icon
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Icon icon={icon} width="24" className="mx-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cor <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color_class: color.value })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.color_class === color.value
                      ? 'border-slate-900 font-semibold'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${color.className}`} />
                    <span>{color.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ordem de exibição
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>

          {/* Initial Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mensagem Inicial do Chat <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.initial_message}
              onChange={(e) => setFormData({ ...formData, initial_message: e.target.value })}
              placeholder="Primeira mensagem enviada quando o usuário escolhe este serviço..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            {saving ? (
              <>
                <Icon icon="solar:refresh-linear" width="20" className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Icon icon="solar:check-circle-linear" width="20" />
                Salvar Serviço
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
