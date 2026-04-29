import type { PaletteParams } from '../types';
import { generatePalette } from '../lib/palettes';

const SCHEMES: Array<{ value: PaletteParams['scheme']; label: string }> = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'split-comp', label: 'Split-Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'monochrome', label: 'Monochromatic' },
];

const MOODS: Array<{ value: PaletteParams['mood']; label: string }> = [
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'bold', label: 'Bold' },
];

export function renderPaletteBuilder(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'builder';
  root.innerHTML = `
    <div class="builder-head">
      <div>
        <div class="builder-title">Palette Generator</div>
        <div class="builder-subtitle">Pick a base hue and a scheme. The palette and rationale render instantly.</div>
      </div>
    </div>

    <div class="palette-controls">
      <div class="builder-field" style="flex: 1; min-width: 160px;">
        <label>Base hue (0–360)</label>
        <input type="range" id="pal-hue" min="0" max="360" value="32" style="
          width: 100%;
          accent-color: var(--gold);
          background: linear-gradient(to right,
            hsl(0,40%,55%), hsl(60,40%,55%), hsl(120,40%,55%),
            hsl(180,40%,55%), hsl(240,40%,55%), hsl(300,40%,55%), hsl(360,40%,55%));
          height: 6px;
          border-radius: 3px;
          appearance: none;
          -webkit-appearance: none;
        " />
        <span id="pal-hue-val" style="font-size: 0.75rem; color: var(--ink-mute); margin-top: 0.25rem; letter-spacing: 0.1em;">32°</span>
      </div>
      <div class="builder-field" style="min-width: 200px;">
        <label>Scheme</label>
        <select id="pal-scheme">
          ${SCHEMES.map((s) => `<option value="${s.value}">${s.label}</option>`).join('')}
        </select>
      </div>
      <div class="builder-field" style="min-width: 160px;">
        <label>Mood</label>
        <select id="pal-mood">
          ${MOODS.map((m) => `<option value="${m.value}">${m.label}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="builder-actions">
      <button class="btn btn-primary" id="pal-go">Generate Palette</button>
    </div>

    <div class="palette-display" id="pal-display">
      <div class="empty-results">Pick your inputs and generate. Palette appears here.</div>
    </div>
  `;

  const display = root.querySelector<HTMLElement>('#pal-display')!;
  const hueInput = root.querySelector<HTMLInputElement>('#pal-hue')!;
  const hueVal = root.querySelector<HTMLElement>('#pal-hue-val')!;

  hueInput.addEventListener('input', () => {
    hueVal.textContent = `${hueInput.value}°`;
  });

  root.querySelector<HTMLButtonElement>('#pal-go')!.addEventListener('click', () => {
    const params: PaletteParams = {
      baseHue: parseInt(hueInput.value, 10),
      scheme: (root.querySelector<HTMLSelectElement>('#pal-scheme')!).value as PaletteParams['scheme'],
      mood: (root.querySelector<HTMLSelectElement>('#pal-mood')!).value as PaletteParams['mood'],
    };

    const { swatches, rationale } = generatePalette(params);

    const swatchHtml = swatches
      .map(
        (s) => `
        <div class="palette-swatch" style="background: ${s.hex}; color: ${textColorFor(s.hex)};" data-hex="${s.hex}">
          <span class="swatch-meta">
            <span style="display:block; font-weight:500; margin-bottom: 0.2rem;">${s.role}</span>
            <span style="display:block; font-family: var(--serif); font-style: italic; margin-bottom: 0.2rem;">${s.name}</span>
            <span style="display:block; opacity: 0.85;">${s.hex.toUpperCase()}</span>
          </span>
        </div>
      `
      )
      .join('');

    display.innerHTML = `
      <div class="palette-strip">${swatchHtml}</div>
      <div class="palette-rationale">${rationale}</div>
    `;

    display.querySelectorAll<HTMLElement>('.palette-swatch').forEach((el) => {
      el.addEventListener('click', async () => {
        const hex = el.dataset.hex ?? '';
        try {
          await navigator.clipboard.writeText(hex);
          const orig = el.querySelector('.swatch-meta')!.innerHTML;
          el.querySelector('.swatch-meta')!.innerHTML = '<span style="display:block; font-weight:500;">Copied ✓</span>';
          setTimeout(() => {
            el.querySelector('.swatch-meta')!.innerHTML = orig;
          }, 1200);
        } catch {
          /* ignore */
        }
      });
    });
  });

  return root;
}

function textColorFor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? 'rgba(14, 13, 11, 0.9)' : 'rgba(245, 240, 232, 0.95)';
}
