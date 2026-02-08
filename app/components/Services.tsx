"use client";
import { Icon } from "@iconify/react";
import { SERVICES, SPECIAL_SERVICE } from "../data/content";

const colorMap: Record<string, { bg: string, text: string, hoverBg: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", hoverBg: "group-hover:bg-indigo-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", hoverBg: "group-hover:bg-emerald-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", hoverBg: "group-hover:bg-blue-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", hoverBg: "group-hover:bg-violet-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", hoverBg: "group-hover:bg-rose-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", hoverBg: "group-hover:bg-orange-100" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", hoverBg: "group-hover:bg-teal-100" },
  pink: { bg: "bg-pink-50", text: "text-pink-600", hoverBg: "group-hover:bg-pink-100" },
};

export default function Services() {
  return (
    <section id="servicos" className="py-20 md:py-28 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16 fade-in visible">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-4 block">
            Áreas de Atuação
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Defesa completa dos
            <br />
            seus direitos trabalhistas
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Atuação abrangente em todas as frentes do Direito do Trabalho, com
            foco na defesa do empregado.
          </p>
        </div>

        {/* Special Service Card */}
        <div className="card-hover bg-indigo-50 rounded-2xl p-6 md:p-8 border border-indigo-200 mb-6 fade-in visible">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full mb-4">
                <Icon icon="solar:star-bold" width="10" />
                {SPECIAL_SERVICE.badge}
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900 mb-3">
                {SPECIAL_SERVICE.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {SPECIAL_SERVICE.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {SPECIAL_SERVICE.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-white text-indigo-700 font-medium px-2.5 py-1 rounded-lg border border-indigo-200">
                    {tag}
                  </span>
                ))}
              </div>
              <a href="https://wa.me/5500000000000?text=Olá,%20gostaria%20de%20saber%20sobre%20rescisão%20indireta." className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all">
                <Icon icon="solar:chat-round-dots-linear" width="16" />
                {SPECIAL_SERVICE.cta}
              </a>
            </div>
            <div className="space-y-3">
              {SPECIAL_SERVICE.alerts.map((alert, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <Icon icon="solar:danger-triangle-linear" width="18" className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800 mb-0.5">
                        {alert.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {alert.sub}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regular Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in visible">
          {SERVICES.map((service, index) => {
             // Skip if it's the special service we already displayed
             if (service.title === SPECIAL_SERVICE.title) return null;

             const colors = colorMap[service.colorClass] || colorMap.indigo;

             return (
              <div key={index} className="card-hover bg-white rounded-2xl p-6 border border-slate-200/80 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center ${colors.hoverBg} transition-colors`}>
                    <Icon icon={service.icon} width="20" className={colors.text} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 service-number">
                    {service.id}
                  </span>
                </div>
                <h3 className="font-semibold text-base tracking-tight text-slate-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag, tIndex) => (
                    <span key={tIndex} className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
