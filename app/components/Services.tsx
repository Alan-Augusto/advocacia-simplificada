"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { SERVICES_CONTENT } from "../data/content";

const colorMap: Record<string, { bg: string, text: string, hoverBg: string }> = {
  indigo: { bg: "bg-primary-50", text: "text-primary-600", hoverBg: "group-hover:bg-primary-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", hoverBg: "group-hover:bg-emerald-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", hoverBg: "group-hover:bg-blue-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", hoverBg: "group-hover:bg-violet-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", hoverBg: "group-hover:bg-rose-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", hoverBg: "group-hover:bg-orange-100" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", hoverBg: "group-hover:bg-teal-100" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", hoverBg: "group-hover:bg-pink-100" },
  red: { bg: "bg-red-50", text: "text-red-600", hoverBg: "group-hover:bg-red-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", hoverBg: "group-hover:bg-amber-100" },
  lime: { bg: "bg-lime-50", text: "text-lime-600", hoverBg: "group-hover:bg-lime-100" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", hoverBg: "group-hover:bg-cyan-100" },
  sky: { bg: "bg-sky-50", text: "text-sky-600", hoverBg: "group-hover:bg-sky-100" },
  fuchsia: { bg: "bg-fuchsia-50", text: "text-fuchsia-600", hoverBg: "group-hover:bg-fuchsia-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", hoverBg: "group-hover:bg-purple-100" },
  slate: { bg: "bg-slate-50", text: "text-slate-600", hoverBg: "group-hover:bg-slate-100" },
  gray: { bg: "bg-gray-50", text: "text-gray-600", hoverBg: "group-hover:bg-gray-100" },
  green: { bg: "bg-green-50", text: "text-green-600", hoverBg: "group-hover:bg-green-100" },
};

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
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

  return (
    <section id="servicos" className="py-20 md:py-28 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16 fade-in visible">
          <span className="text-xs font-medium text-primary-600 uppercase tracking-widest mb-4 block">
            {SERVICES_CONTENT.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            {SERVICES_CONTENT.title_prefix}
            <br />
            {SERVICES_CONTENT.title_suffix}
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            {SERVICES_CONTENT.description}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Icon icon="solar:refresh-linear" width="28" className="text-primary-600 animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Nenhum serviço disponível no momento.
          </div>
        ) : (
          /* Services Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in visible">
            {services.map((service, index) => {
               const colorClass = service.color_class || service.colorClass || 'indigo';
               const colors = colorMap[colorClass] || colorMap.indigo;

               return (
                <div key={service.id || index} className="card-hover bg-white rounded-2xl p-6 border border-slate-200/80 group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center ${colors.hoverBg} transition-colors`}>
                        <Icon icon={service.icon} width="20" className={colors.text} />
                      </div>
                      <span className="text-xs font-medium text-slate-400 service-number">
                        {service.code}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base tracking-tight text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {Array.isArray(service.tags) && service.tags.map((tag: string, tIndex: number) => (
                      <span key={tIndex} className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
