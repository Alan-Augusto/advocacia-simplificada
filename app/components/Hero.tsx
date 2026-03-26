"use client";
import { Icon } from "@iconify/react";
import { HERO_CONTENT, TESTIMONIALS } from "../data/content";

export default function Hero() {
  return (
    <section className="hero-gradient min-h-[85vh] flex pt-20 items-center relative overflow-hidden">
      <div
        className="hidden sm:block absolute bottom-0 right-0 overflow-visible"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 35%), linear-gradient(to bottom, transparent, black 12%)",
          maskComposite: "intersect",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 35%), linear-gradient(to bottom, transparent, black 12%)",
          WebkitMaskComposite: "source-in",
        }}
      >
        <img
          src="assets/hero.png"
          className="h-[76vh] w-auto max-w-none object-contain"
          alt=""
        />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10 w-full">
          <div className="fade-in visible">
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></span>
              {HERO_CONTENT.badge}
            </div>
            <h1 className="sm:text-5xl lg:text-6xl leading-tight text-4xl font-semibold text-slate-900 tracking-tight mb-6">
              {HERO_CONTENT.title_prefix}<br /> 
              <span className="text-primary-600">{HERO_CONTENT.title_highlight}</span> <br /> 
              {HERO_CONTENT.title_suffix}
            </h1>
            <p className="leading-relaxed text-lg text-slate-500 max-w-lg mb-8">
              {HERO_CONTENT.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href="/atendimento" className="pulse-cta inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-7 py-3.5 rounded-xl transition-all text-sm">
                <Icon icon="solar:chat-round-dots-linear" width="18" />
                {HERO_CONTENT.cta_primary}
              </a>
              <a href="#servicos" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-7 py-3.5 rounded-xl border border-slate-200 transition-all text-sm">
                {HERO_CONTENT.cta_secondary}
                <Icon icon="solar:arrow-down-linear" width="16" />
              </a>
            </div>
            <div className="flex items-center gap-6">
              <a href="#depoimentos" className="flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer">
                <div className="flex -space-x-2">
                  {TESTIMONIALS.slice(0, 4).map((t) => (
                    <div
                      key={t.name}
                      className="w-8 h-8 rounded-full border-2 border-white flex-shrink-0 overflow-hidden bg-slate-200"
                    >
                      {t.photo ? (
                        <img
                          src={t.photo}
                          alt={`Foto de ${t.name}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-slate-700">
                          {t.name
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Icon key={i} icon="solar:star-bold" width="12" style={{ color: "#f59e0b" }} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{HERO_CONTENT.rating_text}</p>
                </div>
              </a>
            </div>
          </div>
      </div>
    </section>
  );
}
