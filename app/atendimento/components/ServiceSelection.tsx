import { Icon } from "@iconify/react";
import { SERVICES } from "@/app/data/content";
import { Service } from "../types";

interface ServiceSelectionProps {
  onSelectService: (service: Service) => void;
}

export default function ServiceSelection({ onSelectService }: ServiceSelectionProps) {
  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden py-4">
      <div className="flex-shrink-0 space-y-2 mb-4 text-center">
        <h2 className="text-lg font-semibold text-slate-800">
          Selecione o tema do seu caso
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="grid grid-cols-1 gap-3 pb-4">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative flex items-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all text-left"
            >
              {/* Note: Dynamic class names need to be safelisted in Tailwind config if not used elsewhere */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-${service.colorClass}-50 text-${service.colorClass}-600 group-hover:scale-110 transition-transform`}>
                <Icon icon={service.icon} width="24" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{service.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{service.description}</p>
              </div>
              <div className="absolute right-4 text-slate-300 group-hover:text-indigo-500 transition-colors">
                <Icon icon="solar:alt-arrow-right-linear" width="24" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
