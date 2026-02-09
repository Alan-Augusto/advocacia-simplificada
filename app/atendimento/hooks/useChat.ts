import { useState } from "react";
import { Message, Service } from "../types";

export function useChat(selectedService: Service | null, leadId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Digitando...");
  const [showWhatsappButton, setShowWhatsappButton] = useState(false);
  const [chatFinished, setChatFinished] = useState(false);

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
    let shouldShowWhatsapp = false;
    let shouldFinishWithoutWhatsapp = false;

    if (aiContent.includes(leadQuenteTag)) {
      shouldShowWhatsapp = true;
      aiContent = aiContent.replace(leadQuenteTag, "").trim();
    } else if (aiContent.includes(leadFrioTag)) {
      shouldFinishWithoutWhatsapp = true;
      aiContent = aiContent.replace(leadFrioTag, "").trim();
    }

    // Calculate delay based on length (e.g., 20ms per char, min 1.5s, max 6s)
    const delay = Math.min(Math.max(aiContent.length * 20, 1500), 6000);

    // Simulate states
    // Split delay roughly between steps
    const stepDuration = delay / 2;

    setLoadingText("Analisando a informação...");
    await new Promise(r => setTimeout(r, stepDuration));

    setLoadingText("Digitando...");
    await new Promise(r => setTimeout(r, stepDuration));

    setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
    setLoading(false);

    // Save assistant message to database
    await saveMessage('assistant', aiContent);

    if (shouldShowWhatsapp) {
      setShowWhatsappButton(true);
      setChatFinished(true);
      await updateLeadStatus('quente');
    } else if (shouldFinishWithoutWhatsapp) {
      // Chat encerrado sem WhatsApp - lead frio
      setShowWhatsappButton(false);
      setChatFinished(true);
      await updateLeadStatus('frio');
    }
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
    setLoading(true);
    setLoadingText("Analisando...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          serviceId: selectedService?.code || selectedService?.id
        }),
      });

      const data = await response.json();
      if (data.content) {
        await processAIResponse(data.content);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      setLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    loading,
    loadingText,
    showWhatsappButton,
    chatFinished,
    sendMessage
  };
}
