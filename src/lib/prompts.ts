import type { PromptParams } from '../types';

const CAMERA_LENSES = [
  'shot on 35mm film',
  'architectural photography',
  'wide angle 24mm',
  'medium format',
  'editorial magazine spread',
  'cinematic anamorphic',
  'natural daylight photography',
  'AD magazine quality',
];
const COMPOSITION_HINTS = [
  'symmetrical composition',
  'rule of thirds',
  'low angle perspective',
  'eye-level perspective',
  'centered hero shot',
  'depth of field',
  'leading lines',
];
const QUALITY_MODIFIERS = [
  'highly detailed',
  'photorealistic',
  'magazine quality',
  '8k resolution',
  'masterful composition',
  'award-winning interior photography',
];
const STYLE_AMPLIFIERS: Record<string, string[]> = {
  'modern luxury': ['boutique hotel feel', 'understated opulence', 'restrained luxury'],
  minimal: ['negative space', 'pure forms', 'quiet calm'],
  contemporary: ['current and refined', 'urbane', 'collected'],
  classic: ['timeless', 'enduring proportions', 'tailored'],
  japandi: ['wabi-sabi', 'crafted simplicity', 'natural texture'],
  scandinavian: ['hygge', 'soft warmth', 'pale wood and linen'],
  industrial: ['exposed structure', 'raw materials', 'urban edge'],
  'mid-century': ['organic forms', 'walnut and teak', 'Eames era'],
  bohemian: ['layered textiles', 'collected travel', 'warm eclectic'],
  'art deco': ['geometric grandeur', 'lacquer and brass', 'glamour'],
};

function seedShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function generatePrompts(params: PromptParams): string[] {
  const out = new Set<string>();
  const seed = Date.now() % 100000;
  const baseStyle = params.style.toLowerCase();
  const amplifiers = STYLE_AMPLIFIERS[baseStyle] ?? [''];

  for (let i = 0; i < 80 && out.size < params.count * 4; i++) {
    const materials = seedShuffle(params.materials, seed + i * 7)
      .slice(0, Math.max(2, Math.min(4, params.materials.length)))
      .join(' and ');
    const camera = seedShuffle(CAMERA_LENSES, seed + i * 13)[0];
    const comp = seedShuffle(COMPOSITION_HINTS, seed + i * 17)[0];
    const amp = amplifiers.length > 0 ? seedShuffle(amplifiers, seed + i * 23)[0] : '';
    const qual = seedShuffle(QUALITY_MODIFIERS, seed + i * 29)[0];

    const parts = [
      `${params.style} ${params.room}`,
      materials,
      `${params.lighting} lighting`,
      `${params.mood} mood`,
      amp,
      comp,
      camera,
      qual,
    ].filter((p) => p && p.length > 0);

    out.add(parts.join(', '));
  }

  return Array.from(out).slice(0, params.count);
}
