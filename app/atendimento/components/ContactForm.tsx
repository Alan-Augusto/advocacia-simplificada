import { useState } from "react";
import { Icon } from "@iconify/react";
import { Service, ContactInfo } from "../types";

interface ContactFormProps {
  selectedService: Service | null;
  initialData?: ContactInfo;
  onBack: () => void;
  onSubmit: (data: ContactInfo) => void;
}

export default function ContactForm({ selectedService, initialData, onBack, onSubmit }: ContactFormProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialData || { name: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contactInfo);
  };

  return (
    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 overflow-hidden pb-4 px-2">
      {/* Botão voltar */}
      <button
        type="button"
        onClick={onBack}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium transition-colors mb-4"
      >
        <Icon icon="solar:arrow-left-linear" width="20" />
        Voltar
      </button>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-center space-y-4 mb-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-${selectedService?.colorClass || 'indigo'}-50 text-${selectedService?.colorClass || 'indigo'}-600 mb-4`}>
            <Icon icon={selectedService?.icon || ""} width="32" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Identificação
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mx-auto">
            Para iniciar a análise imediata do seu caso, precisamos criar um protocolo único de atendimento. Na próxima etapa você passará por uma triagem rápida de caso e será redirecionado para o atendimento com o Dr. Luciano.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Seu Nome</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon icon="solar:user-circle-linear" width="20" />
              </div>
              <input
                required
                type="text"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Seu WhatsApp</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon icon="solar:phone-rounded-linear" width="20" />
              </div>
              <input
                required
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="Ex: (11) 99999-9999"
              />
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-100">
            <p className="text-[10px] text-slate-400 text-center leading-tight">
              <strong>Ambiente Seguro:</strong> Seus dados e relatos estão protegidos por sigilo advocatício e criptografia de ponta a ponta. O número é utilizado apenas para garantir que você possa recuperar este atendimento caso a conexão caia.
            </p>
          </div>
        </div>
      </div>

      {/* Botão fixo em baixo */}
      <div className="flex-shrink-0 pt-4 bg-slate-50">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Iniciar Atendimento
          <Icon icon="solar:arrow-right-bold" width="20" />
        </button>
      </div>
    </div>
  );
}
