import { useState } from "react";
import { Message, Service } from "../types";

export function useChat(selectedService: Service | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Digitando...");
  const [showWhatsappButton, setShowWhatsappButton] = useState(false);

  const processAIResponse = async (content: string) => {
    setLoading(true);
    let aiContent = content;
    const finalizeTag = "[FINALIZAR_ATENDIMENTO]";
    let shouldFinish = false;

    if (aiContent.includes(finalizeTag)) {
      shouldFinish = true;
      aiContent = aiContent.replace(finalizeTag, "").trim();
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

    if (shouldFinish) {
      setShowWhatsappButton(true);
    }
  };

  const sendMessage = async (text: string) => {
    if (loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(newMessages);

    // Immediate feedback that we are processing
    setLoading(true);
    setLoadingText("Analisando...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          serviceId: selectedService?.id
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
    sendMessage
  };
}
