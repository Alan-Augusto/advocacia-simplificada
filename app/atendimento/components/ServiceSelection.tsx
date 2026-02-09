"use client";

import { Icon } from "@iconify/react";
import { Service } from "../types";
import { useEffect, useState } from "react";

interface ServiceSelectionProps {
  onSelectService: (service: Service) => void;
}

export default function ServiceSelection({ onSelectService }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data.services || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="text-slate-500">Carregando serviços...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden py-4">
      <div className="flex-shrink-0 space-y-2 mb-4 md:mb-6 text-center">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-slate-800">
          Selecione o tema do seu caso
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-6  md:pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-4">
          {services.map((service) => (
            <button
              key={service.id || service.code}
              onClick={() => onSelectService(service)}
              className="group relative flex items-center p-4 md:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-500 transition-all text-left hover:-translate-y-0.5"
            >
              {/* Note: Dynamic class names need to be safelisted in Tailwind config if not used elsewhere */}
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mr-4 bg-${service.colorClass || service.color_class}-50 text-${service.colorClass || service.color_class}-600 group-hover:scale-110 transition-transform`}>
                <Icon icon={service.icon} width="24" className="md:w-7 md:h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 md:text-lg">{service.title}</h3>
                <p className="text-xs md:text-sm text-slate-500 line-clamp-1">{service.description}</p>
              </div>
              <div className="absolute right-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                <Icon icon="solar:alt-arrow-right-linear" width="24" className="md:w-6 md:h-6" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
