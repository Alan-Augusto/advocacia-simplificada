import { Icon } from "@iconify/react";
import { FOOTER_CONTENT, FOOTER_NAV_LINKS } from "../data/content";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm tracking-tight">
                  DL
                </span>
              </div>
              <span className="font-semibold text-base tracking-tight text-slate-900">
                {FOOTER_CONTENT.brand}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {FOOTER_CONTENT.description}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-900 mb-4">{FOOTER_CONTENT.navigation_title}</h4>
            <div className="space-y-2.5">
              {FOOTER_NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="block text-sm text-slate-400 hover:text-slate-600 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-900 mb-4">{FOOTER_CONTENT.contact_title}</h4>
            <a href="/atendimento" className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-6 py-3 rounded-lg transition-all text-sm">
              <Icon icon="solar:chat-round-dots-linear" width="16" />
              Iniciar Atendimento
            </a>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            {FOOTER_CONTENT.copyright}
          </p>
          <p className="text-xs text-slate-300">{FOOTER_CONTENT.oab}</p>
        </div>
      </div>
    </footer>
  );
}
