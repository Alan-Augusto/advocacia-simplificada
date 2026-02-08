import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm tracking-tight">
                  DL
                </span>
              </div>
              <span className="font-semibold text-base tracking-tight text-slate-900">
                Dr. Luciano
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Advocacia Trabalhista Especializada. Defesa dos direitos do
              trabalhador com atendimento humanizado e resultados comprovados.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-900 mb-4">Navegação</h4>
            <div className="space-y-2.5">
              <a href="#servicos" className="block text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Serviços
              </a>
              <a href="#diferenciais" className="block text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Diferenciais
              </a>
              <a href="#depoimentos" className="block text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Depoimentos
              </a>
              <a href="#faq" className="block text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Dúvidas Frequentes
              </a>
              <a href="#blog" className="block text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Blog
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm text-slate-900 mb-4">Contato</h4>
            <div className="space-y-2.5">
              <a href="https://wa.me/5500000000000" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                <Icon icon="solar:chat-round-dots-linear" width="16" />
                WhatsApp
              </a>
              <a href="tel:+5500000000000" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                <Icon icon="solar:phone-linear" width="16" />
                Telefone
              </a>
              <a href="mailto:contato@drlucianoadvocacia.com.br" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                <Icon icon="solar:letter-linear" width="16" />
                E-mail
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © 2025 Dr. Luciano — Advocacia Trabalhista. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-slate-300">OAB/XX 000.000</p>
        </div>
      </div>
    </footer>
  );
}
