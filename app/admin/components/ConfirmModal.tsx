"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

type ConfirmModalVariant = "danger" | "warning" | "info";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmModalVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const variantConfig: Record<
  ConfirmModalVariant,
  {
    icon: string;
    iconBg: string;
    iconColor: string;
    confirmBtn: string;
  }
> = {
  danger: {
    icon: "solar:trash-bin-trash-bold",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    confirmBtn:
      "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white",
  },
  warning: {
    icon: "solar:danger-triangle-bold",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    confirmBtn:
      "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 text-white",
  },
  info: {
    icon: "solar:info-circle-bold",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    confirmBtn:
      "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white",
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const config = variantConfig[variant];

  // Fecha com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  // Foca no botão cancelar ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !loading && onCancel()}
      />

      {/* Panel */}
      <div
        className="
          relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm
          animate-in fade-in zoom-in-95 duration-200
          ring-1 ring-slate-200
        "
      >
        <div className="p-6">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${config.iconBg}`}
          >
            <Icon icon={config.icon} width="24" className={config.iconColor} />
          </div>

          {/* Text */}
          <h3
            id="confirm-modal-title"
            className="text-base font-semibold text-slate-900 mb-1"
          >
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              text-slate-700 bg-slate-100 hover:bg-slate-200
              transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
              disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center gap-2
              ${config.confirmBtn}
            `}
          >
            {loading && (
              <Icon
                icon="solar:refresh-linear"
                width="14"
                className="animate-spin"
              />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
