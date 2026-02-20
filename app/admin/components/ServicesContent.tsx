"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { Service } from '@/lib/types/database';
import ServiceForm from '../services/components/ServiceForm';

export default function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (service: Service) => {
    try {
      await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !service.is_active }),
      });
      fetchServices();
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
    fetchServices();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon icon="solar:refresh-linear" width="28" className="text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <>
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:settings-linear" width="28" className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum serviço cadastrado</h3>
          <p className="text-sm text-slate-500 mb-6">Comece adicionando seu primeiro serviço</p>
          <button
            onClick={handleNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 transition-all"
          >
            <Icon icon="solar:add-circle-linear" width="18" />
            Novo Serviço
          </button>
        </div>
        {showForm && <ServiceForm service={editingService} onClose={handleFormClose} />}
      </>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-all h-fit"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-lg bg-${service.color_class}-100 text-${service.color_class}-600 flex items-center justify-center`}>
                    <Icon icon={service.icon} width="22" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{service.title}</h3>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {service.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Ordem: {service.order}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    service.is_active
                      ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                  title={service.is_active ? 'Desativar' : 'Ativar'}
                >
                  <Icon
                    icon={service.is_active ? 'solar:eye-linear' : 'solar:eye-closed-linear'}
                    width="18"
                  />
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{service.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {service.tags?.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {(service.tags?.length || 0) > 3 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                    +{(service.tags?.length || 0) - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <button
                onClick={() => handleEdit(service)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <Icon icon="solar:pen-linear" width="16" />
                Editar Serviço
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && <ServiceForm service={editingService} onClose={handleFormClose} />}
    </div>
  );
}

// Export the action button for PageContainer
export function ServicesActions({ onNew }: { onNew: () => void }) {
  return (
    <button
      onClick={onNew}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
    >
      <Icon icon="solar:add-circle-linear" width="18" />
      Novo Serviço
    </button>
  );
}
