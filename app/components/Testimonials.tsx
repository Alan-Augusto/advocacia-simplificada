import { Icon } from "@iconify/react";
import { TESTIMONIALS } from "../data/content";

// Map for color classes to ensure Tailwind safe-listing
const colorMap: Record<string, { bg: string, text: string, icon: string }> = {
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700", icon: "#4f46e5" },
  amber: { bg: "bg-amber-100", text: "text-amber-700", icon: "#d97706" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "#059669" },
  rose: { bg: "bg-rose-100", text: "text-rose-700", icon: "#e11d48" },
  blue: { bg: "bg-blue-100", text: "text-blue-700", icon: "#2563eb" },
  violet: { bg: "bg-violet-100", text: "text-violet-700", icon: "#7c3aed" },
};

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 fade-in visible">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-4 block">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Icon key={i} icon="solar:star-bold" width="18" style={{ color: "#f59e0b" }} />
            ))}
          </div>
          <p className="text-sm text-slate-400">
            Nota 5/5 com base em avaliações reais
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in visible">
          {TESTIMONIALS.map((t, index) => {
            const colors = colorMap[t.color] || colorMap.indigo;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200/80 card-hover">
                <div className="flex items-center gap-0.5 mb-4">
                   {[1, 2, 3, 4, 5].map((i) => (
                    <Icon key={i} icon="solar:star-bold" width="14" style={{ color: "#f59e0b" }} />
                   ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${colors.bg} flex items-center justify-center`}>
                    <span className={`text-xs font-semibold ${colors.text}`}>{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
