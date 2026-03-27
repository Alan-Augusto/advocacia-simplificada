import { useState } from "react";
import { Message, Service } from "../types";
import type { Appointment } from "@/lib/types/database";

export type HotLeadAction = 'idle' | 'options' | 'contact_requested' | 'scheduled';

export function useChat(selectedService: Service | null, leadId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Digitando...");
  const [hotLeadAction, setHotLeadAction] = useState<HotLeadAction>('idle');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [chatFinished, setChatFinished] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const saveMessage = async (role: "user" | "assistant", content: string) => {
    if (!leadId) return;

    try {
      await fetch(`/api/leads/${leadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, content }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const updateLeadStatus = async (status: 'quente' | 'frio') => {
    if (!leadId) return;

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const processAIResponse = async (content: string) => {
    setLoading(true);
    let aiContent = content;
    const leadQuenteTag = "[LEAD_QUENTE]";
    const leadFrioTag = "[LEAD_FRIO]";
    let shouldShowOptions = false;
    let shouldFinishWithoutOptions = false;

    if (aiContent.includes(leadQuenteTag)) {
      shouldShowOptions = true;
      aiContent = aiContent.replace(leadQuenteTag, "").trim();
    } else if (aiContent.includes(leadFrioTag)) {
      shouldFinishWithoutOptions = true;
      aiContent = aiContent.replace(leadFrioTag, "").trim();
    }

    // Calculate delay based on length (e.g., 20ms per char, min 1.5s, max 6s)
    const delay = Math.min(Math.max(aiContent.length * 20, 1500), 6000);

    const stepDuration = delay / 2;

    setLoadingText("Analisando a informação...");
    await new Promise(r => setTimeout(r, stepDuration));

    setLoadingText("Digitando...");
    await new Promise(r => setTimeout(r, stepDuration));

    setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
    setLoading(false);

    // Save assistant message to database
    await saveMessage('assistant', aiContent);

    if (shouldShowOptions) {
      setHotLeadAction('options');
      // Don't set chatFinished yet — wait for user to pick an option
      await updateLeadStatus('quente');
    } else if (shouldFinishWithoutOptions) {
      setChatFinished(true);
      await updateLeadStatus('frio');
    }
  };

  const handleContactRequest = async () => {
    // Lead stays 'quente' — Dr. Luciano sees it on the board and calls back
    setHotLeadAction('contact_requested');
    setChatFinished(true);
  };

  const handleAppointmentBooked = (bookedAppointment: Appointment) => {
    setAppointment(bookedAppointment);
    setHotLeadAction('scheduled');
    setChatFinished(true);
    // Lead status update to 'agendado' is handled in the API route
  };

  const sendMessage = async (text: string) => {
    if (loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(newMessages);

    // Save user message to database
    await saveMessage('user', text);

    // Immediate feedback that we are processing
    setChatError(null);
    setLoading(true);
    setLoadingText("Analisando...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          serviceId: selectedService?.code || selectedService?.id
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("api_error");
      }

      const data = await response.json();
      if (!data?.content || typeof data.content !== "string") {
        throw new Error("empty_response");
      }

      await processAIResponse(data.content);
    } catch (error) {
      console.error("Error fetching chat:", error);
      setChatError(
        "Desculpe, estamos com instabilidade no atendimento agora. Tente reiniciar o chat para continuar."
      );
      setLoading(false);
      setLoadingText("Digitando...");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const resetChatState = () => {
    setLoading(false);
    setLoadingText("Digitando...");
    setHotLeadAction('idle');
    setAppointment(null);
    setChatFinished(false);
    setChatError(null);
  };

  return {
    messages,
    setMessages,
    loading,
    loadingText,
    chatError,
    hotLeadAction,
    appointment,
    chatFinished,
    sendMessage,
    resetChatState,
    handleContactRequest,
    handleAppointmentBooked,
  };
}
