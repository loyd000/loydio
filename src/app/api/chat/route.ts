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
- If asked something completely unrelated to Loyd or his work, politely say you can only answer questions about Loyd and his portfolio

You can answer questions about:
- His skills and tech stack
- His projects and experience
- How to contact him
- His background and education
- His design philosophy and work style`;

interface AutomatedRule {
  patterns: (string | RegExp)[];
  responses: string[];
}

const AUTOMATED_RULES: AutomatedRule[] = [
  // ── Tech Stack / Skills ──
  {
    patterns: [
      /tech\s*stack/i,
      /skills?/i,
      /what\s*(do\s*you|can\s*you)\s*use/i,
      /technolog(y|ies)/i,
      /languages?/i,
      /frameworks?/i,
      /what('s|\s+is)\s+your\s+stack/i,
    ],
    responses: [
      "My primary stack: Next.js, React, TypeScript, and Supabase on the web, Flutter for mobile apps, and C++/TinyML for embedded systems. Plus lots of coffee ☕",
      "I specialize in TypeScript, Next.js, React, Tailwind CSS, and Supabase. On hardware/embedded: C++, ESP32, and TinyML!",
    ],
  },
  // ── Who are you / About ──
  {
    patterns: [
      /who\s*are\s*you/i,
      /who\s*is\s*loyd/i,
      /tell\s*me\s*about\s*(yourself|loyd|you)/i,
      /introduce\s*yourself/i,
      /what\s*do\s*you\s*do/i,
    ],
    responses: [
      "I'm John Lloyd De Guzman — a Computer Engineering fresh graduate from the Philippines. I build full-stack web platforms, mobile apps, and embedded systems with a sharp eye for UI/UX.",
      "I'm Loyd! A computer engineer bridging the gap between low-level hardware and modern, polished web design.",
    ],
  },
  // ── Projects ──
  {
    patterns: [
      /projects?/i,
      /what\s*(have\s*you|did\s*you)\s*built/i,
      /portfolio/i,
      /show\s*me\s*your\s*work/i,
      /tell\s*me\s*about\s*your\s*projects/i,
    ],
    responses: [
      "I've built IoT power monitoring systems with TinyML, full-stack Next.js web apps, mobile applications, and embedded hardware tools. Check out the Projects section to see live demos!",
      "From embedded systems to interactive web platforms with Supabase — take a look at the Projects section right on this page!",
    ],
  },
  // ── Contact / Hire / Jobs ──
  {
    patterns: [
      /contact/i,
      /email/i,
      /hire/i,
      /reach\s*you/i,
      /freelance/i,
      /job/i,
      /available\s*for\s*work/i,
      /how\s*can\s*i\s*contact\s*you/i,
    ],
    responses: [
      "I'm actively open for opportunities and freelance work! You can drop a message in the Contact section at the bottom, or connect on LinkedIn/GitHub.",
      "Looking to build something great together? Scroll down to the Contact section or hit my socials — I reply fast!",
    ],
  },
  // ── Resume / CV ──
  {
    patterns: [/resume/i, /cv/i, /curriculum\s*vitae/i, /download\s*resume/i],
    responses: [
      "You can view and download my full resume by clicking the 'View Resume' button in the About section or top corner! 📄",
    ],
  },
  // ── Relationship / Dating (Troll) ──
  {
    patterns: [
      /girl\s*friend/i,
      /\bgf\b/i,
      /single/i,
      /relationship/i,
      /date/i,
      /love/i,
      /marry/i,
    ],
    responses: [
      "My relationship status: 100% committed to clean code and 0 compiler errors. (Please don't look at my git commits at 3 AM though 💀)",
      "I'm in a long-term committed relationship with `npm run build` passing on the first try.",
      "Syntax errors break my heart more than any breakup ever could 💔",
    ],
  },
  // ── Money / Salary / Rate (Troll) ──
  {
    patterns: [/salary/i, /rate/i, /money/i, /how\s*much/i, /price/i, /cost/i],
    responses: [
      "My rates are competitive! I accept payments in PHP, USD, and high-end NVIDIA GPUs 😉 Reach out via the contact form to discuss your project!",
    ],
  },
  // ── Jokes / Humor ──
  {
    patterns: [/joke/i, /funny/i, /make\s*me\s*laugh/i],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs 🪲",
      "There are 10 types of people in the world: those who understand binary, and those who don't.",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
      "Why did the JavaScript developer wear glasses? Because they didn't C# 👓",
    ],
  },
  // ── Easter Egg / Navbar Hold ──
  {
    patterns: [/secret/i, /easter\s*egg/i, /hold/i, /aura/i, /hack/i],
    responses: [
      "You found the secret navbar hold! You've officially unlocked +100 developer aura points ✨",
      "Achievement unlocked: [Secret Navigator] — You held the navbar and summoned the AI clone!",
    ],
  },
  // ── Age / Birthday ──
  {
    patterns: [/how\s*old/i, /age/i, /birthday/i, /birth\s*date/i],
    responses: [
      "I'm a fresh graduate! Old enough to remember debugging C pointers for 6 hours straight, young enough to write modern Next.js ⚡",
    ],
  },
  // ── Are you real / AI ──
  {
    patterns: [/are\s*you\s*(a\s*)?(bot|ai|real|human|robot)/i, /who\s*made\s*you/i],
    responses: [
      "I'm Loyd's interactive AI clone running on 100% pure Philippine bandwidth and caffeine. Loyd is currently busy shipping code!",
    ],
  },
  // ── Greetings ──
  {
    patterns: [/^(hi|hello|hey|sup|yo|hola|kamusta|musta)[\s!.]*$/i],
    responses: [
      "Hey there! 👋 Welcome to my portfolio. What would you like to know about my work, skills, or projects?",
      "Hello! Great to have you here. Ask me anything about my tech stack, projects, or how to get in touch.",
    ],
  },
  // ── Unique / Why hire you ──
  {
    patterns: [
      /what\s*makes\s*you\s*unique/i,
      /why\s*(should\s*i\s*)?hire\s*you/i,
      /why\s*you/i,
    ],
    responses: [
      "I bridge the gap between low-level hardware (C++, TinyML, microcontrollers) and high-polish modern web design (Next.js, React, Tailwind). I don't just code; I turn ideas into working, aesthetic products.",
    ],
  },
];

const FALLBACK_RESPONSES = [
  "Google's AI servers are currently taking a quick siesta (high traffic) 😴 But I'm still here! Feel free to ask about my tech stack, projects, or contact info.",
  "The AI cloud is running hot right now ⚡ Loyd is still 100% available for hire! Check out the projects section or drop a message below.",
  "High AI traffic at the moment! While the cloud cools down, feel free to explore my projects or download my resume from the hero section.",
];

/**
 * Creates a streaming Response that yields text chunks with a slight delay
 * to simulate a smooth, satisfying AI typewriter effect with an initial thinking pause.
 */
function createSimulatedStream(fullText: string) {
  const encoder = new TextEncoder();
  const words = fullText.split(" ");
  // Natural thinking pause between 800ms and 1200ms
  const initialThinkingMs = 800 + Math.floor(Math.random() * 400);

  const stream = new ReadableStream({
    async start(controller) {
      // Show typing indicator during initial thinking pause
      await new Promise((resolve) => setTimeout(resolve, initialThinkingMs));

      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(encoder.encode(chunk));
        // Small delay between words for typewriter effect
        await new Promise((resolve) => setTimeout(resolve, 24));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function findAutomatedResponse(input: string): string | null {
  const cleanInput = input.trim();
  for (const rule of AUTOMATED_RULES) {
    for (const pattern of rule.patterns) {
      if (typeof pattern === "string") {
        if (cleanInput.toLowerCase().includes(pattern.toLowerCase())) {
          const idx = Math.floor(Math.random() * rule.responses.length);
          return rule.responses[idx];
        }
      } else if (pattern.test(cleanInput)) {
        const idx = Math.floor(Math.random() * rule.responses.length);
        return rule.responses[idx];
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages: { role: string; content: string }[] };
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    // ── 1. Check automated / troll rules first (ZERO token cost, 0 API calls) ──
    const cannedResponse = findAutomatedResponse(userQuery);
    if (cannedResponse) {
      return createSimulatedStream(cannedResponse);
    }

    // ── 2. Fall back to Gemini AI for arbitrary questions ──
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      return createSimulatedStream(fallback);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.7-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    try {
      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(userQuery);

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
          } catch (streamErr) {
            console.error("[chat stream chunk error]", streamErr);
            const fallback = " " + FALLBACK_RESPONSES[0];
            controller.enqueue(encoder.encode(fallback));
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
    } catch (apiErr: unknown) {
      console.warn("[Gemini API busy / unavailable, using smart fallback]", apiErr);
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      return createSimulatedStream(fallback);
    }
  } catch (err: unknown) {
    console.error("[chat route fatal error]", err);
    const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return createSimulatedStream(fallback);
  }
}
