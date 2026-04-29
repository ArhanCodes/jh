import type { ChatMessage } from '../lib/nobu';
import {
  askNobu,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  NobuNotConfiguredError,
} from '../lib/nobu';

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hello — I'm Nobu, your course assistant. I can talk you through any module, suggest prompts for Midjourney, build a quick palette, or help with a real design problem you're working on. What's on your mind?",
};

export interface NobuController {
  trigger: HTMLElement;
  panel: HTMLElement;
  open(): void;
  close(): void;
}

export function createNobu(): NobuController {
  /* ===== TRIGGER (floating button) ===== */
  const trigger = document.createElement('button');
  trigger.className = 'nobu-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-label', 'Open Nobu chat');
  trigger.innerHTML = `
    <span class="nobu-trigger-mark">N</span>
    <span class="nobu-trigger-label">Ask Nobu</span>
  `;

  /* ===== PANEL ===== */
  const panel = document.createElement('div');
  panel.className = 'nobu-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Nobu chat');
  panel.innerHTML = `
    <div class="nobu-head">
      <div class="nobu-head-info">
        <div class="nobu-head-avatar">N</div>
        <div>
          <div class="nobu-head-name">Nobu</div>
          <div class="nobu-head-sub">Course assistant · always on</div>
        </div>
      </div>
      <div class="nobu-head-actions">
        <button class="nobu-icon-btn" id="nobu-clear" type="button" title="Clear conversation" aria-label="Clear conversation">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 6h18"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
        <button class="nobu-icon-btn" id="nobu-close" type="button" title="Close" aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="nobu-msgs" id="nobu-msgs"></div>

    <form class="nobu-input-form" id="nobu-form">
      <input type="text" id="nobu-input" placeholder="Ask Nobu anything…" autocomplete="off" />
      <button type="submit" class="nobu-send" id="nobu-send" aria-label="Send">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </form>
  `;

  /* ===== STATE ===== */
  let history: ChatMessage[] = loadChatHistory();
  let pending = false;

  const msgs = panel.querySelector<HTMLElement>('#nobu-msgs')!;
  const form = panel.querySelector<HTMLFormElement>('#nobu-form')!;
  const input = panel.querySelector<HTMLInputElement>('#nobu-input')!;
  const sendBtn = panel.querySelector<HTMLButtonElement>('#nobu-send')!;
  const clearBtn = panel.querySelector<HTMLButtonElement>('#nobu-clear')!;
  const closeBtn = panel.querySelector<HTMLButtonElement>('#nobu-close')!;

  function renderMessages(): void {
    const messages = history.length === 0 ? [GREETING] : history;
    msgs.innerHTML = messages
      .map((m) => {
        const escapedContent = escapeHtml(m.content).replace(/\n/g, '<br />');
        return `
          <div class="nobu-msg nobu-msg-${m.role}">
            ${m.role === 'assistant' ? '<div class="nobu-msg-mark">N</div>' : ''}
            <div class="nobu-msg-bubble">${escapedContent}</div>
          </div>
        `;
      })
      .join('');
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'nobu-msg nobu-msg-assistant nobu-typing';
    el.innerHTML = `
      <div class="nobu-msg-mark">N</div>
      <div class="nobu-msg-bubble">
        <span class="nobu-dot"></span><span class="nobu-dot"></span><span class="nobu-dot"></span>
      </div>
    `;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  async function send(content: string): Promise<void> {
    if (!content.trim() || pending) return;
    pending = true;
    sendBtn.disabled = true;
    input.disabled = true;

    history.push({ role: 'user', content });
    renderMessages();
    saveChatHistory(history);

    const typing = showTyping();

    try {
      const reply = await askNobu(history);
      typing.remove();
      history.push({ role: 'assistant', content: reply });
      renderMessages();
      saveChatHistory(history);
    } catch (err) {
      typing.remove();
      let content: string;
      if (err instanceof NobuNotConfiguredError) {
        content =
          "I'm not connected yet — the site owner needs to add a Groq API key to enable me. Get a free one at console.groq.com and add it as a GitHub secret called GROQ_API_KEY. Once that's done, push any change and I'll be live.";
      } else {
        content = `I lost my words for a moment — try again? (${(err as Error).message})`;
      }
      history.push({ role: 'assistant', content });
      renderMessages();
    } finally {
      pending = false;
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  }

  /* ===== EVENTS ===== */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value;
    input.value = '';
    void send(value);
  });

  clearBtn.addEventListener('click', () => {
    if (history.length === 0) return;
    if (confirm('Clear this conversation with Nobu?')) {
      history = [];
      clearChatHistory();
      renderMessages();
    }
  });

  closeBtn.addEventListener('click', () => api.close());

  trigger.addEventListener('click', () => api.open());

  /* keyboard: Cmd+J toggles Nobu */
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'j' || e.key === 'J') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (panel.classList.contains('open')) api.close();
      else api.open();
    }
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      api.close();
    }
  });

  const api = {
    trigger,
    panel,
    open(): void {
      panel.classList.add('open');
      trigger.classList.add('hidden');
      renderMessages();
      setTimeout(() => input.focus(), 100);
    },
    close(): void {
      panel.classList.remove('open');
      trigger.classList.remove('hidden');
    },
  };

  /* render initial state */
  renderMessages();

  return api;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
