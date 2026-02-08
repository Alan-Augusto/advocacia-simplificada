import { Icon } from "@iconify/react";

export default function CTA() {
  return (
    <section className="py-20 md:py-28 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10 fade-in visible">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          Atendimento disponível agora
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-6">
          Não deixe seus direitos
          <br />
          passarem em branco.
        </h2>
        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl mx-auto">
          O prazo para buscar seus direitos é limitado. Entre em contato agora
          para uma consulta gratuita e descubra o que você pode receber.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://wa.me/5500000000000?text=Olá,%20gostaria%20de%20uma%20consulta%20trabalhista." className="pulse-cta inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-4 rounded-xl transition-all text-sm">
            <Icon icon="solar:chat-round-dots-linear" width="18" />
            Falar pelo WhatsApp
          </a>
          <a href="tel:+5500000000000" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded-xl border border-white/10 transition-all text-sm">
            <Icon icon="solar:phone-linear" width="18" />
            Ligar Agora
          </a>
        </div>
        <p className="text-xs text-white/30 mt-6">
          Consulta inicial gratuita · Sigilo garantido · Atendimento online
        </p>
      </div>
    </section>
  );
}
