"use client";

import { Icon } from "@iconify/react";

interface ContactRequestModalProps {
  isOpen: boolean;
  leadName: string;
  onClose: () => void;
}

export default function ContactRequestModal({ isOpen, leadName, onClose }: ContactRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 ring-1 ring-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100">
          <Icon icon="solar:bell-bing-bold" className="text-primary-600" width="28" />
        </div>

        {/* Content */}
        <h2 className="text-lg font-semibold text-slate-900 text-center mb-2">
          Perfeito, {leadName.split(' ')[0]}!
        </h2>
        <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
          O Dr. Luciano foi notificado e entrará em contato com você nas próximas horas pelo número cadastrado.
        </p>

        {/* Action */}
        <button
          onClick={onClose}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-all"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
