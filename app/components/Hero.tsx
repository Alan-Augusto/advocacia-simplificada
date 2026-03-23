"use client";
import { Icon } from "@iconify/react";
import { HERO_CONTENT } from "../data/content";

export default function Hero() {
  return (
    <section className="hero-gradient min-h-[85vh] flex pt-20 items-center relative overflow-hidden">
      <div
        className="absolute bottom-0 right-0 h-9/10 w-auto"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 35%), linear-gradient(to bottom, transparent, black 12%)",
          maskComposite: "intersect",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 35%), linear-gradient(to bottom, transparent, black 12%)",
          WebkitMaskComposite: "source-in",
        }}
      >
        <img
          src="assets/hero.png"
          className="h-full w-auto object-contain"
          alt=""
        />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10 w-full">
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
              <a href="/atendimento" className="pulse-cta inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-7 py-3.5 rounded-xl transition-all text-sm">
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
      </div>
    </section>
  );
}
