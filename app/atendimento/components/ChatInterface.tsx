import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Service, Message, ContactInfo } from "../types";
import type { Appointment } from "@/lib/types/database";
import type { HotLeadAction } from "../hooks/useChat";
import SchedulingModal from "./SchedulingModal";
import ContactRequestModal from "./ContactRequestModal";

interface ChatInterfaceProps {
  selectedService: Service | null;
  messages: Message[];
  loading: boolean;
  loadingText: string;
  hotLeadAction: HotLeadAction;
  appointment: Appointment | null;
  chatFinished: boolean;
  contactInfo: ContactInfo;
  leadId: string | null;
  leadCode: string | null;
  onSendMessage: (text: string) => void;
  onRestart: () => void;
  onContactRequest: () => void;
  onAppointmentBooked: (appointment: Appointment) => void;
}

export default function ChatInterface({
  selectedService,
  messages,
  loading,
  loadingText,
  hotLeadAction,
  chatFinished,
  contactInfo,
  leadId,
  leadCode,
  onSendMessage,
  onRestart,
  onContactRequest,
  onAppointmentBooked,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
    onContactRequest();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Chat Header - Fixo */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${selectedService?.colorClass || 'indigo'}-100 text-${selectedService?.colorClass || 'indigo'}-600 border border-${selectedService?.colorClass || 'indigo'}-200`}>
            <Icon icon={selectedService?.icon || "solar:chat-line-linear"} width="20" />
          </div>
          <div className="leading-tight">
            <h3 className="font-semibold text-slate-900 text-sm">{selectedService?.title}</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online agora
            </p>
          </div>
        </div>
        <button
          onClick={onRestart}
          title="Reiniciar"
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <Icon icon="solar:restart-square-linear" width="20" />
        </button>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.length === 0 && !loading && (
          <div className="text-center py-12 px-4 opacity-50">
            <div className={`w-16 h-16 mx-auto rounded-full bg-${selectedService?.colorClass || 'indigo'}-100 text-${selectedService?.colorClass || 'indigo'}-500 flex items-center justify-center mb-4`}>
              <Icon icon="solar:chat-round-line-linear" width="32" />
            </div>
            <p className="text-sm text-slate-500">Iniciando conversa sobre {selectedService?.title}...</p>
          </div>
        )}

        {messages.filter(m => !m.hidden).map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {/* Avatar do Assistente - Desktop */}
            {msg.role === "assistant" && (
              <div className="hidden md:flex w-8 h-8 rounded-full items-center justify-center shadow-md bg-primary-100 text-primary-600 flex-shrink-0">
                <Icon icon="mdi:sparkles" width="16" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-2xl px-5 py-3.5 text-sm sm:text-base leading-relaxed shadow-sm ${msg.role === "user"
                  ? "bg-primary-600 text-white rounded-br-none"
                  : "bg-slate-50 border border-slate-200 text-slate-700 rounded-bl-none"
                }`}
            >
              {msg.content}
              {msg.role === "assistant" && (
                <div className="text-[10px] mt-1 opacity-50 text-right">
                  Advocacia Simplificada AI
                </div>
              )}
            </div>

            {/* Avatar do Usuário - Desktop */}
            {msg.role === "user" && (
              <div className="hidden md:flex w-8 h-8 rounded-full flex-shrink-0 items-center justify-center text-white shadow-md bg-slate-400 font-semibold text-xs">
                {contactInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
              <span className="text-xs text-slate-400 font-medium">{loadingText}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area or Final Action - Fixo em baixo */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-slate-200">
        {hotLeadAction === 'options' ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm text-center text-slate-600 font-medium">
              Entendemos seu caso. Como prefere prosseguir?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleContactClick}
                className="flex items-center justify-center gap-2 w-full border border-primary-300 text-primary-700 font-semibold px-5 py-3 rounded-xl hover:bg-primary-50 transition-all"
              >
                <Icon icon="solar:phone-calling-rounded-linear" width="20" />
                Receber contato nas próximas horas
              </button>
              <button
                onClick={() => setIsSchedulingOpen(true)}
                className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-primary-500/25 hover:-translate-y-0.5"
              >
                <Icon icon="solar:calendar-broken" width="20" />
                Agendar horário com o Dr. Luciano
              </button>
            </div>
          </div>
        ) : hotLeadAction === 'contact_requested' ? (
          <div className="text-center py-3 animate-in fade-in slide-in-from-bottom-4">
            <div className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <Icon icon="solar:check-circle-bold" width="20" />
              <span>Dr. Luciano será notificado e entrará em contato em breve.</span>
            </div>
          </div>
        ) : hotLeadAction === 'scheduled' ? (
          <div className="text-center py-3 animate-in fade-in slide-in-from-bottom-4">
            <div className="inline-flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <Icon icon="solar:calendar-broken" width="20" />
              <span>Consulta agendada com sucesso!</span>
            </div>
          </div>
        ) : chatFinished ? (
          <div className="text-center py-3 animate-in fade-in slide-in-from-bottom-4">
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Icon icon="solar:check-circle-linear" width="20" />
              <span>Atendimento encerrado</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center justify-center animate-in fade-in slide-in-from-bottom-4">
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua resposta..."
                rows={1}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900 placeholder:text-slate-400 resize-none min-h-[48px] max-h-[120px]"
                disabled={loading}
                autoFocus
                style={{ height: 'auto', minHeight: '48px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl w-12 h-12 flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <Icon icon="solar:plain-3-bold-duotone" width="24" />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <SchedulingModal
        isOpen={isSchedulingOpen}
        leadId={leadId || ''}
        leadName={contactInfo.name}
        leadPhone={contactInfo.phone}
        leadService={selectedService?.title || ''}
        leadCode={leadCode || ''}
        onClose={() => setIsSchedulingOpen(false)}
        onBooked={(booked) => {
          setIsSchedulingOpen(false);
          onAppointmentBooked(booked);
        }}
      />

      <ContactRequestModal
        isOpen={isContactModalOpen}
        leadName={contactInfo.name}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}

