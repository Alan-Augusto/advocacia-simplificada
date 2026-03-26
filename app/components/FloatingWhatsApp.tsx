import { Icon } from "@iconify/react";
import { FLOATING_WHATSAPP_CONTENT } from "../data/content";

export default function FloatingWhatsApp() {
  return (
    <a 
      href="/atendimento" 
      className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-all hover:scale-105" 
      aria-label={FLOATING_WHATSAPP_CONTENT.aria_label}
    >
      <Icon icon="solar:chat-round-dots-bold" width="26" />
    </a>
  );
}
