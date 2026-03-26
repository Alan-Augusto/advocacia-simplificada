import { Icon } from "@iconify/react";
import { FLOATING_WHATSAPP_CONTENT } from "../data/content";

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative inline-flex">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-emerald-300/70 [animation:floating-cta-wave_2.6s_ease-out_infinite]"
        />

        <a
          href="/atendimento"
          className="relative z-10 inline-flex h-14 items-center justify-center rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:bg-emerald-600"
          aria-label={FLOATING_WHATSAPP_CONTENT.aria_label}
        >
          <Icon icon="solar:chat-round-dots-bold" width="26" />
          <span className="ml-2 hidden sm:inline-block">Iniciar atendimento</span>
        </a>
      </div>
    </div>
  );
}
