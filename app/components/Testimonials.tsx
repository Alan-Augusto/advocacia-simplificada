"use client";

import { useRef, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { TESTIMONIALS, TESTIMONIALS_CONTENT } from "../data/content";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

// Create infinite carousel by duplicating testimonials
const INFINITE_TESTIMONIALS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export default function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // 3 cards + gaps
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
    
    // Pause autoplay on user interaction
    setIsAutoplayActive(false);
    
    // Resume after 5 seconds of inactivity
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    autoplayTimeoutRef.current = setTimeout(() => {
      setIsAutoplayActive(true);
    }, 5000);
  };

  // Handle infinite scroll reset
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollThreshold = scrollWidth / 3; // One full set of testimonials

      // Reset to middle when reaching the end
      if (scrollLeft > scrollThreshold * 1.8) {
        scrollContainerRef.current.scrollLeft = scrollThreshold * 0.8;
      }
      // Reset to middle when reaching the start
      else if (scrollLeft < scrollThreshold * 0.2) {
        scrollContainerRef.current.scrollLeft = scrollThreshold * 0.8;
      }
    }
  };

  useEffect(() => {
    if (!isAutoplayActive) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const scrollAmount = 320;
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoplayActive]);

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 fade-in visible">
          <span className="text-xs font-medium text-primary-600 uppercase tracking-widest mb-4 block">
            {TESTIMONIALS_CONTENT.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            {TESTIMONIALS_CONTENT.title}
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Icon key={i} icon="solar:star-bold" width="18" style={{ color: "#f59e0b" }} />
            ))}
          </div>
          <p className="text-sm text-slate-400">{TESTIMONIALS_CONTENT.rating_text}</p>
        </div>

        <div className="relative fade-in visible">
          {/* Carousel Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth py-8 [scrollbar-width:none] [-ms-overflow-style:none]"
            style={{ scrollBehavior: 'smooth' }}
          >
            {INFINITE_TESTIMONIALS.map((t, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border border-slate-200/80 card-hover flex flex-col"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon key={i} icon="solar:star-bold" width="14" style={{ color: "#f59e0b" }} />
                  ))}
                </div>

                {/* Review Text - Takes up space */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">"{t.text}"</p>

                {/* Profile Info - Aligned to bottom */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
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
                        {getInitials(t.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.date || "Avaliação no Google"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            aria-label="Anterior"
          >
            <Icon icon="solar:alt-arrow-left-linear" width="20" className="text-slate-700" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            aria-label="Próximo"
          >
            <Icon icon="solar:alt-arrow-right-linear" width="20" className="text-slate-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
