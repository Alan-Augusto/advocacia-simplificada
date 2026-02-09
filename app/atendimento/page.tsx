"use client";

import { useState } from "react";
import { Service, Step, ContactInfo, Message } from "./types";
import StepIndicator from "./components/StepIndicator";
import ServiceSelection from "./components/ServiceSelection";
import ContactForm from "./components/ContactForm";
import ChatInterface from "./components/ChatInterface";
import { useChat } from "./hooks/useChat";

export default function AtendimentoPage() {
  const [step, setStep] = useState<Step>("selection");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ name: "", phone: "" });
  const [leadId, setLeadId] = useState<string | null>(null);
  const [leadCode, setLeadCode] = useState<string | null>(null);

  // Use the chat hook
  const { 
    messages, 
    setMessages, 
    loading, 
    loadingText, 
    showWhatsappButton, 
    chatFinished,
    sendMessage 
  } = useChat(selectedService, leadId);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep("contact"); 
  };

  const handleContactSubmit = async (data: ContactInfo) => {
    setContactInfo(data);
    
    // Create lead before starting chat
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          service_id: selectedService?.code || selectedService?.id || '01',
          service_title: selectedService?.title || 'Serviço não especificado',
        }),
      });

      if (response.ok) {
        const { lead } = await response.json();
        setLeadId(lead.id);
        setLeadCode(lead.code);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }

    setStep("chat");
    
    // Set initial fixed message without API call
    const initialMsgContent = selectedService?.initial_message || 
      "Olá! Como posso ajudar com seu caso trabalhista hoje?";
    
    const initialMessages: Message[] = [
      { 
        role: "system", 
        content: `Cliente: ${data.name}. Telefone: ${data.phone}. Interesse: ${selectedService?.title}.`,
        hidden: true
      },
      {
        role: "assistant",
        content: initialMsgContent
      }
    ];
    
    setMessages(initialMessages); 
  };

  const handleRestart = () => {
    setStep("selection");
    setSelectedService(null);
    setMessages([]);
    setLeadId(null);
    setLeadCode(null);
    // We can keep contact info for convenience if they restart
  };

  return (
    <main className="h-[100dvh] bg-slate-50 relative flex flex-col overflow-hidden">
       {/* Background decoration */}
       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="flex-1 w-full max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto flex flex-col z-10 h-full overflow-hidden">
        
        {/* Header fixo */}
        <div className="flex-shrink-0 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
          <StepIndicator currentStep={step} />
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {step === "selection" && (
            <ServiceSelection onSelectService={handleServiceSelect} />
          )}

          {step === "contact" && (
            <ContactForm 
              selectedService={selectedService} 
              initialData={contactInfo}
              onBack={() => setStep("selection")}
              onSubmit={handleContactSubmit}
            />
          )}

          {step === "chat" && (
            <ChatInterface 
              selectedService={selectedService}
              messages={messages}
              loading={loading}
              loadingText={loadingText}
              showWhatsappButton={showWhatsappButton}
              chatFinished={chatFinished}
              contactInfo={contactInfo}
              leadCode={leadCode}
              onSendMessage={sendMessage}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </main>
  );
}
