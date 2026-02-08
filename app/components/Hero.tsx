"use client";
import { Icon } from "@iconify/react";
import { HERO_CONTENT } from "../data/content";

export default function Hero() {
  return (
    <section className="hero-gradient min-h-screen flex pt-20 items-center">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="fade-in visible">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              {HERO_CONTENT.badge}
            </div>
            <h1 className="sm:text-5xl lg:text-6xl leading-tight text-4xl font-semibold text-slate-900 tracking-tight mb-6">
              {HERO_CONTENT.title_prefix}<br /> 
              <span className="text-indigo-600">{HERO_CONTENT.title_highlight}</span> <br /> 
              {HERO_CONTENT.title_suffix}
            </h1>
            <p className="leading-relaxed text-lg text-slate-500 max-w-lg mb-8">
              {HERO_CONTENT.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href="https://wa.me/5500000000000?text=Olá,%20gostaria%20de%20uma%20consulta%20trabalhista." className="pulse-cta inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-7 py-3.5 rounded-xl transition-all text-sm">
                <Icon icon="solar:chat-round-dots-linear" width="18" />
                {HERO_CONTENT.cta_primary}
              </a>
              <a href="#servicos" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-7 py-3.5 rounded-xl border border-slate-200 transition-all text-sm">
                {HERO_CONTENT.cta_secondary}
                <Icon icon="solar:arrow-down-linear" width="16" />
              </a>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-700">
                    J
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center text-xs font-medium text-amber-700">
                    A
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs font-medium text-emerald-700">
                    M
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-xs font-medium text-rose-700">
                    C
                  </div>
                </div>
                <div className="ml-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Icon key={i} icon="solar:star-bold" width="12" style={{ color: "#f59e0b" }} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{HERO_CONTENT.rating_text}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="fade-in hidden lg:block visible">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 to-slate-100/60 rounded-3xl transform rotate-2"></div>
              <div className="relative bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
                <div className="space-y-5">
                  <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-semibold text-lg tracking-tight">
                        DL
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900">
                        Dr. Luciano
                      </h3>
                      <p className="text-xs text-slate-400">
                        Advocacia Trabalhista
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Online
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <Icon icon="solar:shield-check-linear" width="20" className="text-indigo-500 mt-0.5 flex-shrink-0" />
                      <div className="">
                        <p className="text-xs font-medium text-slate-700">
                          Vínculo Empregatício
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Registro em carteira e regularização
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <Icon icon="solar:wallet-money-linear" width="20" className="text-indigo-500 mt-0.5 flex-shrink-0" />
                      <div className="">
                        <p className="text-xs font-medium text-slate-700">
                          Verbas Rescisórias
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          FGTS, férias, 13º e multas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <Icon icon="solar:clock-circle-linear" width="20" className="text-indigo-500 mt-0.5 flex-shrink-0" />
                      <div className="">
                        <p className="text-xs font-medium text-slate-700">
                          Horas Extras
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Jornada, intervalos e adicional noturno
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                      <Icon icon="solar:heart-pulse-linear" width="20" className="text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div className="">
                        <p className="text-xs font-medium text-indigo-700">
                          Danos e Indenizações
                        </p>
                        <p className="text-xs text-indigo-400 mt-0.5">
                          Moral, material, estético e existencial
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>+9 áreas de atuação</span>
                      <span className="flex items-center gap-1">
                        <Icon icon="solar:verified-check-bold" width="14" style={{color:"#6366f1"}} />
                        OAB Verificado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
