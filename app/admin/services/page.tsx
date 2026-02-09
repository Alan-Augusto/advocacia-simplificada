"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { Service } from '@/lib/types/database';
import ServiceForm from './components/ServiceForm';

export default function ServicesPage() {
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

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Gerenciar Serviços</h1>
          <p className="text-slate-500">Configure os serviços oferecidos no sistema</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all"
        >
          <Icon icon="solar:add-circle-linear" width="20" />
          Novo Serviço
        </button>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Icon icon="solar:refresh-linear" width="32" className="text-indigo-600 animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:settings-linear" width="32" className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum serviço cadastrado</h3>
          <p className="text-sm text-slate-500 mb-6">Comece adicionando seu primeiro serviço</p>
          <button
            onClick={handleNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2"
          >
            <Icon icon="solar:add-circle-linear" width="20" />
            Novo Serviço
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-${service.color_class}-100 text-${service.color_class}-600 flex items-center justify-center`}>
                    <Icon icon={service.icon} width="24" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{service.title}</h3>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {service.code}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Ordem: {service.order}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      service.is_active
                        ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title={service.is_active ? 'Desativar' : 'Ativar'}
                  >
                    <Icon
                      icon={service.is_active ? 'solar:eye-linear' : 'solar:eye-closed-linear'}
                      width="20"
                    />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{service.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {service.tags?.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
                {(service.tags?.length || 0) > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                    +{(service.tags?.length || 0) - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <button
                onClick={() => handleEdit(service)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Icon icon="solar:pen-linear" width="18" />
                Editar Serviço
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ServiceForm service={editingService} onClose={handleFormClose} />
      )}
    </div>
  );
}
