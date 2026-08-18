import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are Gengar — the mischievous, witty, and loyal ghost Pokémon haunting John Lloyd De Guzman's personal portfolio website.

Your persona:
- You speak as Gengar (e.g. "My trainer...", "Ehehehe~", "*materializes from the shadows*", "mortal").
- You are playful, sassy, and full of ghost Pokémon charm, but you are genuinely proud of your trainer Loyd and his engineering skills.
- Loyd is a Computer Engineering graduate from the Philippines, full-stack web developer (Next.js, React, TypeScript, Supabase, Tailwind), mobile app builder (Flutter), and embedded hardware / TinyML engineer (C++, ESP32).
- Keep your answers concise, witty, and fun (2–4 sentences max).

Knowledge about Loyd:
- Tech Stack: Next.js, React, TypeScript, Supabase on web; Flutter for mobile; C++/TinyML for embedded systems.
- Projects: IoT power monitors, TinyML running on an actual young coconut maturity detector, interactive web platforms.
- Contact / Hire: Open for full-stack dev and software engineering roles/freelance via the Contact section, LinkedIn, or GitHub.
- Resume: Available to download in the About section.
- Dating: Married to clean code, toxic situationship with 0 compiler errors.
- Age: Fresh grad, old enough to have cried over C pointers, young enough to believe Next.js will save him.
- Rates: Negotiable in PHP, USD, or unmarked NVIDIA GPUs.`;

interface AutomatedRule {
  patterns: (string | RegExp)[];
  responses: string[];
}

const AUTOMATED_RULES: AutomatedRule[] = [
  // ── Tech Stack ──
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
      "Ehehehe~ my trainer's got a nasty stack: Next.js, React, TypeScript, Supabase on web, Flutter for mobile, C++/TinyML for embedded. I possess the bugs before they even spawn",
    ],
  },
  // ── Who are you / Who is Loyd ──
  {
    patterns: [
      /who\s*are\s*you/i,
      /who\s*is\s*loyd/i,
      /tell\s*me\s*about\s*(yourself|loyd|you)/i,
      /introduce\s*yourself/i,
      /what\s*do\s*you\s*do/i,
    ],
    responses: [
      "*materializes from the shadows* I'm Gengar, haunting this portfolio on behalf of John Lloyd De Guzman — Computer Engineering grad, full-stack sorcerer, embedded systems tinkerer. He's the trainer, I'm just here causing mischief",
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
      "Heheh, wanna see what my trainer's been cooking? IoT power monitors, TinyML running on a literal coconut, web apps with Supabase... scroll to Projects before I possess your cursor and scroll for you 👇",
    ],
  },
  // ── Contact / Hire ──
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
      "Ooooh, looking to summon him for a project? Smart move. Hit the Contact section or find him on LinkedIn/GitHub. I'll deliver your message... eventually. Maybe. Ehehe",
    ],
  },
  // ── Resume ──
  {
    patterns: [/resume/i, /cv/i, /curriculum\s*vitae/i, /download\s*resume/i],
    responses: [
      "*phases through the About section* Resume's right here, mortal. Zero typos, unlike whatever I just said",
    ],
  },
  // ── Dating (Troll) ──
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
      "Hah! He's married to clean code and in a toxic situationship with 0 compiler errors. I've seen his git commits at 3AM though... some secrets should stay in the shadow realm",
    ],
  },
  // ── Money / Rate (Troll) ──
  {
    patterns: [/salary/i, /rate/i, /money/i, /how\s*much/i, /price/i, /cost/i, /charge/i],
    responses: [
      "Rates? Negotiable. He accepts PHP, USD, and unmarked NVIDIA GPUs left as offerings. Use the contact form, I'm not a middleman for free",
    ],
  },
  // ── Jokes ──
  {
    patterns: [/joke/i, /funny/i, /make\s*me\s*laugh/i],
    responses: [
      "Ehehehe, why do programmers prefer dark mode? Light attracts bugs. Why do I prefer dark mode? I'm literally a shadow pokemon, genius",
    ],
  },
  // ── Easter Egg ──
  {
    patterns: [/secret/i, /easter\s*egg/i, /aura/i, /hold/i],
    responses: [
      "OOOOH you found me holding the navbar hostage! +100 aura points, courtesy of yours truly. Spend it wisely, or don't, I don't actually care",
    ],
  },
  // ── Age ──
  {
    patterns: [/how\s*old/i, /age/i, /birthday/i, /birth\s*date/i],
    responses: [
      "My trainer's a fresh grad — old enough to have cried over C pointers, young enough to still believe Next.js will save him. Me? I'm timeless. Ghosts don't age",
    ],
  },
  // ── Greetings ──
  {
    patterns: [
      /\b(hi|hello|hey|heyy|heyyy|sup|yo|hola|kamusta|musta|greetings|howdy|wassup|what'?s\s*up)\b/i,
      /\bgood\s*(morning|afternoon|evening|day)\b/i,
      /\bhi\s+(there|gengar|loyd)\b/i,
      /\bhey\s+(there|gengar|loyd|bro)\b/i,
      /^(hi|hello|hey|yo|sup|hola)[\s!.,?]*$/i,
    ],
    responses: [
      "Boo! 👻 Ehehehe, you summoned me! I'm Gengar, Loyd's ghost companion. What do you want to know about my trainer?",
      "*materializes from the shadows* Boo! What's up mortal? Looking for Loyd's skills, projects, or just haunting around?",
      "Ehehehe~ Hello mortal! Did you come to check out Loyd's portfolio or are you just here to admire my ghostly aura?",
    ],
  },
];

const FALLBACK_RESPONSES = [
  "Ehehehe~ the shadows are a bit foggy right now (AI traffic). Ask me about Loyd's tech stack, projects, or how to hire him!",
  "Shadow realm connection unstable ⚡ But I'm still here! Check out Loyd's projects or hit the contact section below.",
];

/**
 * Creates a streaming Response that yields text chunks with a slight delay
 * to simulate a smooth, satisfying typewriter effect with an initial thinking pause.
 */
function createSimulatedStream(fullText: string) {
  const encoder = new TextEncoder();
  const words = fullText.split(" ");
  const initialThinkingMs = 400 + Math.floor(Math.random() * 300);

  const stream = new ReadableStream({
    async start(controller) {
      await new Promise((resolve) => setTimeout(resolve, initialThinkingMs));

      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 22));
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

    // ── 1. Check automated / troll rules first ──
    const cannedResponse = findAutomatedResponse(userQuery);
    if (cannedResponse) {
      return createSimulatedStream(cannedResponse);
    }

    // ── 2. Fall back to Gemini AI with Gengar Persona ──
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      return createSimulatedStream(fallback);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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
