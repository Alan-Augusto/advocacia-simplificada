"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { SERVICES } from "@/app/data/content";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type Step = "selection" | "chat";

export default function AtendimentoPage() {
  const [step, setStep] = useState<Step>("selection");
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWhatsappButton, setShowWhatsappButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleServiceSelect = async (service: typeof SERVICES[0]) => {
    setSelectedService(service);
    setStep("chat");
    setLoading(true);

    // Initial message to trigger AI greeting
    const initialMessages: Message[] = [
      { role: "user", content: `Olá, tenho interesse em saber mais sobre ${service.title}.` }
    ];
    // We don't necessarily need to show this user message if we want the AI to "start". 
    // But showing it gives context to the user that they started the conversation.
    setMessages(initialMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: initialMessages, 
          serviceId: service.id 
        }),
      });

      const data = await response.json();
      
      if (data.content) {
        let aiContent = data.content;
        const finalizeTag = "[FINALIZAR_ATENDIMENTO]";
        
        if (aiContent.includes(finalizeTag)) {
          setShowWhatsappButton(true);
          aiContent = aiContent.replace(finalizeTag, "").trim();
        }

        setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [
      ...messages,
      { role: "user" as const, content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages, 
          serviceId: selectedService?.id 
        }),
      });

      const data = await response.json();

      if (data.content) {
         let aiContent = data.content;
        const finalizeTag = "[FINALIZAR_ATENDIMENTO]";
        
        if (aiContent.includes(finalizeTag)) {
          setShowWhatsappButton(true);
          aiContent = aiContent.replace(finalizeTag, "").trim();
        }

        setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {step === "selection" && (
          <div className="space-y-8 fade-in visible">
            <div className="text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Como podemos te ajudar hoje?
              </h1>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">
                Selecione o tema que melhor descreve seu caso para iniciarmos seu atendimento personalizado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`flex flex-col text-left p-6 rounded-2xl border transition-all hover:shadow-lg bg-white
                    ${selectedService?.id === service.id 
                      ? "border-indigo-600 ring-2 ring-indigo-100" 
                      : "border-slate-200 hover:border-indigo-300"
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${service.colorClass}-50 text-${service.colorClass}-600`}>
                    <Icon icon={service.icon} width="24" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-3">
                    {service.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "chat" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[70vh] fade-in visible">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${selectedService?.colorClass}-100 text-${selectedService?.colorClass}-600`}>
                    <Icon icon={selectedService?.icon || "solar:chat-line-linear"} width="20" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedService?.title}</h3>
                    <p className="text-xs text-slate-500">Assistente Virtual · Advocacia Simplificada</p>
                  </div>
              </div>
              <button 
                onClick={() => setStep("selection")}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <Icon icon="solar:restart-linear" width="14" />
                Trocar assunto
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area or Final Action */}
            <div className="p-4 bg-white border-t border-slate-100">
              {showWhatsappButton ? (
                 <div className="text-center py-2 space-y-3 fade-in visible">
                    <p className="text-sm text-slate-600">
                      Entendemos seu caso. Clique abaixo para falar com o especialista:
                    </p>
                    <a 
                      href={`https://wa.me/5500000000000?text=${encodeURIComponent(`Olá, passei pela triagem sobre *${selectedService?.title}*.`)}`}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-all w-full sm:w-auto hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
                    >
                      <Icon icon="solar:chat-round-dots-linear" width="20" />
                      Continuar no WhatsApp
                    </a>
                 </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Digite sua resposta..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl w-12 flex items-center justify-center transition-all"
                  >
                    <Icon icon="solar:plain-3-bold" width="20" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
