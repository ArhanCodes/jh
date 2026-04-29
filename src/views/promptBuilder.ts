import type { PromptParams } from '../types';
import { generatePrompts } from '../lib/prompts';

const STYLES = [
  'modern luxury', 'minimal', 'contemporary', 'classic', 'japandi',
  'scandinavian', 'industrial', 'mid-century', 'bohemian', 'art deco',
];
const ROOMS = [
  'living room', 'bedroom', 'kitchen', 'dining room', 'bathroom',
  'study', 'entryway', 'home office',
];
const MATERIALS = [
  'marble', 'walnut', 'oak', 'travertine', 'brass', 'linen', 'velvet',
  'leather', 'concrete', 'rattan', 'glass', 'stone',
];
const LIGHTING = [
  'soft natural', 'golden hour', 'soft afternoon', 'cinematic',
  'ambient warm', 'dramatic side', 'overcast diffuse',
];
const MOODS = [
  'calm', 'inviting', 'refined', 'bold', 'energetic', 'serene', 'warm and grounded',
];

export function renderPromptBuilder(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'builder';
  root.innerHTML = `
    <div class="builder-head">
      <div>
        <div class="builder-title">Prompt Builder</div>
        <div class="builder-subtitle">Pick your variables and generate eight prompt variations instantly.</div>
      </div>
    </div>

    <div class="builder-grid">
      <div class="builder-field">
        <label>Style</label>
        <select id="pb-style">
          ${STYLES.map((s) => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
      <div class="builder-field">
        <label>Room</label>
        <select id="pb-room">
          ${ROOMS.map((r) => `<option value="${r}">${r}</option>`).join('')}
        </select>
      </div>
      <div class="builder-field">
        <label>Lighting</label>
        <select id="pb-lighting">
          ${LIGHTING.map((l) => `<option value="${l}">${l}</option>`).join('')}
        </select>
      </div>
      <div class="builder-field">
        <label>Mood</label>
        <select id="pb-mood">
          ${MOODS.map((m) => `<option value="${m}">${m}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="builder-field" style="margin-bottom: 1.25rem;">
      <label>Materials — pick 2 to 4</label>
      <div class="chip-group" id="pb-materials">
        ${MATERIALS.map(
          (m, i) => `<span class="chip${i < 2 ? ' active' : ''}" data-mat="${m}">${m}</span>`
        ).join('')}
      </div>
    </div>

    <div class="builder-actions">
      <button class="btn btn-primary" id="pb-go">Generate 8 Variations</button>
      <button class="btn btn-ghost btn-sm" id="pb-reset">Reset</button>
    </div>

    <div class="results" id="pb-results">
      <div class="empty-results">Pick your variables and hit generate. Output appears here.</div>
    </div>
  `;

  const results = root.querySelector<HTMLElement>('#pb-results')!;
  const goBtn = root.querySelector<HTMLButtonElement>('#pb-go')!;

  root.querySelectorAll<HTMLElement>('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const active = root.querySelectorAll('.chip.active').length;
      if (chip.classList.contains('active')) {
        if (active > 2) chip.classList.remove('active');
      } else {
        if (active < 4) chip.classList.add('active');
      }
    });
  });

  root.querySelector<HTMLButtonElement>('#pb-reset')!.addEventListener('click', () => {
    (root.querySelector<HTMLSelectElement>('#pb-style')!).selectedIndex = 0;
    (root.querySelector<HTMLSelectElement>('#pb-room')!).selectedIndex = 0;
    (root.querySelector<HTMLSelectElement>('#pb-lighting')!).selectedIndex = 0;
    (root.querySelector<HTMLSelectElement>('#pb-mood')!).selectedIndex = 0;
    root.querySelectorAll<HTMLElement>('.chip').forEach((c, i) => {
      c.classList.toggle('active', i < 2);
    });
    results.innerHTML = '<div class="empty-results">Pick your variables and hit generate. Output appears here.</div>';
  });

  goBtn.addEventListener('click', () => {
    const materials = Array.from(root.querySelectorAll<HTMLElement>('.chip.active'))
      .map((el) => el.dataset.mat ?? '')
      .filter(Boolean);

    if (materials.length < 2) return;

    const params: PromptParams = {
      style: (root.querySelector<HTMLSelectElement>('#pb-style')!).value,
      room: (root.querySelector<HTMLSelectElement>('#pb-room')!).value,
      lighting: (root.querySelector<HTMLSelectElement>('#pb-lighting')!).value,
      mood: (root.querySelector<HTMLSelectElement>('#pb-mood')!).value,
      materials,
      count: 8,
    };

    const prompts = generatePrompts(params);

    if (prompts.length === 0) {
      results.innerHTML = '<div class="empty-results">No combinations generated. Try different variables.</div>';
      return;
    }

    results.innerHTML = `
      <div class="results-head">
        <div class="results-head-title">${prompts.length} prompt variations</div>
      </div>
      ${prompts
        .map(
          (p) => `
        <div class="result-item">
          <div class="result-prompt">${p}</div>
          <div class="result-actions">
            <button class="result-copy" data-prompt="${escapeAttr(p)}">Copy</button>
          </div>
        </div>
      `
        )
        .join('')}
    `;

    results.querySelectorAll<HTMLButtonElement>('.result-copy').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const prompt = btn.dataset.prompt ?? '';
        try {
          await navigator.clipboard.writeText(prompt);
          btn.classList.add('copied');
          btn.textContent = 'Copied';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = 'Copy';
          }, 1400);
        } catch {
          btn.textContent = 'Copy failed';
        }
      });
    });
  });

  return root;
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
