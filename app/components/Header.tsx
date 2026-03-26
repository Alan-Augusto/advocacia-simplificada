"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { HEADER_CONTENT, HEADER_NAV_LINKS } from "../data/content";
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
      className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${isScrolled
        ? "bg-white/90 border-slate-200/80"
        : "bg-white/80 border-slate-100/80"
        } border-b`}
      id="navbar"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Icon icon="solar:shield-minimalistic-broken" width="25" />
          <span className="font-semibold text-base tracking-tight text-slate-900">
            {HEADER_CONTENT.brand}
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {HEADER_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/atendimento"
            className="hidden sm:inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
          >
            {HEADER_CONTENT.cta}
            <Icon icon="solar:arrow-right-linear" width="16" />
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label={HEADER_CONTENT.mobile_menu_label}
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
            {HEADER_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-600 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/atendimento"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg mt-2"
            >
              {HEADER_CONTENT.cta}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
