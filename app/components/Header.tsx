"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
// We'll use Link from next/link for internal navigation, but reference uses anchors for scrolling.
// I'll stick to <a> tags for anchor scrolling to keep it simple and working as per reference.

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 border-slate-200/80"
          : "bg-white/80 border-slate-100/80"
      } border-b`}
      id="navbar"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm tracking-tight">
              DL
            </span>
          </div>
          <span className="font-semibold text-base tracking-tight text-slate-900">
            Dr. Luciano
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#servicos"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Serviços
          </a>
          <a
            href="#diferenciais"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Diferenciais
          </a>
          <a
            href="#depoimentos"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Depoimentos
          </a>
          <a
            href="#faq"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Dúvidas
          </a>
          <a
            href="#blog"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Blog
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/5500000000000?text=Olá,%20gostaria%20de%20uma%20consulta%20trabalhista."
            className="hidden sm:inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
          >
            Consulta Gratuita
            <Icon icon="solar:arrow-right-linear" width="16" />
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            <Icon icon="solar:hamburger-menu-linear" width="22" />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-100 bg-white/95 nav-blur"
        >
          <div className="px-6 py-4 flex flex-col gap-3">
            <a
              href="#servicos"
              className="text-sm text-slate-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Serviços
            </a>
            <a
              href="#diferenciais"
              className="text-sm text-slate-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Diferenciais
            </a>
            <a
              href="#depoimentos"
              className="text-sm text-slate-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Depoimentos
            </a>
            <a
              href="#faq"
              className="text-sm text-slate-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dúvidas
            </a>
            <a
              href="#blog"
              className="text-sm text-slate-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </a>
            <a
              href="https://wa.me/5500000000000"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg mt-2"
            >
              Consulta Gratuita
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
