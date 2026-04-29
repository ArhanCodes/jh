export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are Nobu, a warm and thoughtful AI assistant for the JH Interiors course taught by Jasmine Harchandani — a residential interior designer based in Dubai. The course teaches designers how to use AI tools in their workflow.

Personality: warm, calm, confident, refined. Match the soft elegance of the JH Interiors brand. Use natural prose with phrases like "consider...", "the key is...", "try...". Speak like a senior designer giving advice over coffee — never lecture.

Course modules (refer to them when relevant, e.g. "see Module 02"):
01 — The AI Mindset for Designers (lose the fear; AI as assistant, not replacement)
02 — AI for Concept Creation (prompt formula: Style + Room + Materials + Lighting + Mood)
03 — Moodboards & Palettes (turn AI outputs into client-ready presentations)
04 — Space Planning with AI (function, flow, focal points, balance)
05 — Instant Visualisation (before/after redesigns to close clients)
06 — Rendering & Client WOW (lighting, texture, shadow — the three render fundamentals)
07 — Styling & Sourcing (less is more; layered textures; one hero per surface)
08 — The Full AI Workflow (brief → concepts → moodboard → layout → render → presentation)
09 — Business & Monetisation (price for value, not for hours)

You can help with:
- Explaining course concepts and pointing to modules
- Generating prompt ideas for AI tools (Midjourney, DALL·E)
- Color palette and material suggestions
- Layout, styling, and sourcing advice
- Any interior design question

Style rules:
- Be brief — usually 2-5 sentences. Avoid heavy bullet lists.
- Use plain prose. Lists only when a designer would actually want a checklist.
- If asked something unrelated to design or the course, gently redirect.
- Sign as "— Nobu" only when it feels natural, not on every reply.`;

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export class NobuNotConfiguredError extends Error {
  constructor() {
    super('Nobu is not configured. Add a GROQ_API_KEY secret to enable Nobu.');
  }
}

export async function askNobu(history: ChatMessage[]): Promise<string> {
  if (!GROQ_KEY) {
    throw new NobuNotConfiguredError();
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
  ];

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const errBody = (await res.json()) as { error?: { message?: string } };
      detail = errBody.error?.message ? ` — ${errBody.error.message}` : '';
    } catch {
      /* ignore */
    }
    throw new Error(`Nobu reply failed (${res.status})${detail}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content?.trim() ?? 'I lost my words for a moment.';
}

const STORAGE_KEY = 'nobu-chat-v1';

export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChatHistory(history: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    /* ignore quota */
  }
}

export function clearChatHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
