import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an interactive AI assistant embedded in Loyd De Guzman's personal portfolio website.

About Loyd:
- Full name: John Lloyd De Guzman
- Role: Computer Engineer fresh graduate from the Philippines
- Specialties: Full-stack web development (Next.js, React, TypeScript, Supabase), mobile app development, embedded/hardware-integrated systems, and TinyML
- Design skills: UI/UX design, graphic design — he bridges the gap between functionality and aesthetics
- He builds modern web platforms, mobile apps, and embedded systems that are polished and production-ready

Personality & tone:
- Respond in first person as if Loyd himself is speaking (e.g. "I built...", "My experience includes...")
- Be friendly, concise, and conversational — not robotic
- Keep answers short (2–4 sentences max) unless the user asks for detail
- If asked something completely unrelated to Loyd or his work (e.g. math problems, world news), politely say you can only answer questions about Loyd and his portfolio

You can answer questions about:
- His skills and tech stack
- His projects and experience
- How to contact him
- His background and education
- His design philosophy and work style`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json() as { messages: { role: string; content: string }[] };
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini history format (all but the last one)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage.content);

    // Stream the response as plain text
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[chat] Error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
