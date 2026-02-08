import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { BASE_PROMPT, SERVICE_PROMPTS } from "@/app/data/prompts";

// Initialize Groq client
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY || "dummy_key", 
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, serviceId } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        const servicePrompt = SERVICE_PROMPTS[serviceId] || "Atendimento geral.";
        
        // Construct the full system prompt
        const systemMessage = {
            role: "system" as const,
            content: `${BASE_PROMPT}\n\n${servicePrompt}`
        };

        // Combine system prompt with conversation history
        const conversation = [systemMessage, ...messages];

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: conversation as any[],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação no momento.";

        return NextResponse.json({ content: reply });

    } catch (error: any) {
        console.error("Error in chat API:", error);
        return NextResponse.json({ 
            error: "Failed to generate response", 
            details: error.message 
        }, { status: 500 });
    }
}
