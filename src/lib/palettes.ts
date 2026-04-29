import type { PaletteParams, PaletteSwatch } from '../types';

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}
function toHex(n: number): string { return n.toString(16).padStart(2, '0'); }
function hslHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function nameOf(h: number, l: number): string {
  const lt = l < 0.25 ? 'Deep' : l < 0.45 ? 'Burnished' : l < 0.65 ? 'Soft' : l < 0.85 ? 'Pale' : 'Linen';
  const hueName = (() => {
    if (h < 15 || h >= 345) return 'Ember';
    if (h < 40) return 'Terracotta';
    if (h < 60) return 'Wheat';
    if (h < 90) return 'Olive';
    if (h < 150) return 'Sage';
    if (h < 195) return 'Lagoon';
    if (h < 230) return 'Ocean';
    if (h < 270) return 'Iris';
    if (h < 305) return 'Aubergine';
    return 'Rose';
  })();
  return `${lt} ${hueName}`;
}

const ROLES = ['Anchor', 'Accent', 'Support', 'Support', 'Highlight'];

export function generatePalette(
  params: PaletteParams
): { swatches: PaletteSwatch[]; rationale: string } {
  const { baseHue, scheme, mood } = params;
  let hues: number[];
  switch (scheme) {
    case 'analogous':       hues = [-30, -15, 0, 15, 30].map((d) => baseHue + d); break;
    case 'complementary':   hues = [0, 0, 0, 180, 180].map((d) => baseHue + d); break;
    case 'triadic':         hues = [0, 120, 240, 0, 120].map((d) => baseHue + d); break;
    case 'split-comp':      hues = [0, 0, 150, 210, 0].map((d) => baseHue + d); break;
    case 'monochrome':
    default:                hues = [0, 0, 0, 0, 0].map((d) => baseHue + d);
  }

  let sats: number[], lights: number[];
  switch (mood) {
    case 'warm':    sats = [0.45, 0.55, 0.35, 0.25, 0.20]; lights = [0.20, 0.45, 0.65, 0.80, 0.90]; break;
    case 'cool':    sats = [0.30, 0.40, 0.25, 0.20, 0.15]; lights = [0.18, 0.40, 0.60, 0.78, 0.92]; break;
    case 'bold':    sats = [0.65, 0.75, 0.55, 0.40, 0.30]; lights = [0.25, 0.50, 0.55, 0.70, 0.85]; break;
    case 'neutral':
    default:        sats = [0.20, 0.25, 0.18, 0.12, 0.08]; lights = [0.22, 0.42, 0.60, 0.78, 0.92];
  }

  const swatches: PaletteSwatch[] = hues.map((h, i) => {
    const s = sats[i] ?? 0.3;
    const l = lights[i] ?? 0.5;
    return {
      hex: hslHex(h, s, l),
      name: nameOf(((h % 360) + 360) % 360, l),
      role: ROLES[i] ?? 'Support',
    };
  });

  const schemeWord: Record<PaletteParams['scheme'], string> = {
    analogous: 'analogous',
    complementary: 'complementary',
    triadic: 'triadic',
    'split-comp': 'split-complementary',
    monochrome: 'monochromatic',
  };
  const moodWord: Record<PaletteParams['mood'], string> = {
    warm: 'warm and grounded',
    cool: 'cool and quiet',
    bold: 'confident and energetic',
    neutral: 'restrained and refined',
  };
  const rationale = `An ${schemeWord[scheme]} palette tuned to feel ${moodWord[mood]}. The anchor holds the room together; the accent brings tension; the supporting tones thin gracefully toward a near-white that gives the eye somewhere to rest.`;

  return { swatches, rationale };
}
