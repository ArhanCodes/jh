import type { SearchDoc, SearchHit } from '../types';
import { modules } from '../curriculum';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can',
  'of', 'to', 'for', 'with', 'in', 'on', 'at', 'by', 'from', 'as', 'that', 'this', 'these',
  'those', 'it', 'its', 'i', 'you', 'we', 'they', 'he', 'she', 'them', 'us', 'your', 'our',
  'one', 'two', 'three', 'first', 'second', 'third',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

interface IndexedDoc extends SearchDoc {
  tokens: string[];
  tokenSet: Set<string>;
  tfMap: Map<string, number>;
}

function buildSearchCorpus(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const text = lesson.sections
        .map((s) => (typeof s.content === 'string' ? s.content : s.content.join(' ')))
        .join(' ');
      docs.push({
        moduleId: mod.id,
        moduleNumber: mod.number,
        moduleTitle: `${mod.title}${mod.titleEm ? ' ' + mod.titleEm : ''}`,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        text,
      });
    }
    docs.push({
      moduleId: mod.id,
      moduleNumber: mod.number,
      moduleTitle: `${mod.title}${mod.titleEm ? ' ' + mod.titleEm : ''}`,
      lessonId: 'exercise',
      lessonTitle: 'Exercise',
      text: `${mod.tagline} ${mod.exercise.prompt} ${mod.exercise.guidance}`,
    });
  }
  return docs;
}

function buildIndex(rawDocs: SearchDoc[]): { docs: IndexedDoc[]; idfMap: Map<string, number> } {
  const docs = rawDocs.map((d) => {
    const tokens = tokenize(`${d.lessonTitle} ${d.text}`);
    const tfMap = new Map<string, number>();
    for (const t of tokens) tfMap.set(t, (tfMap.get(t) ?? 0) + 1);
    return { ...d, tokens, tokenSet: new Set(tokens), tfMap };
  });

  const docCount = docs.length;
  const dfMap = new Map<string, number>();
  for (const d of docs) {
    for (const t of d.tokenSet) dfMap.set(t, (dfMap.get(t) ?? 0) + 1);
  }
  const idfMap = new Map<string, number>();
  for (const [term, df] of dfMap) {
    idfMap.set(term, Math.log(1 + docCount / (1 + df)));
  }
  return { docs, idfMap };
}

function buildSnippet(doc: IndexedDoc, queryTerms: string[]): string {
  const text = doc.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = text.toLowerCase();
  let bestIdx = -1;
  for (const term of queryTerms) {
    const idx = lower.indexOf(term);
    if (idx >= 0 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx;
  }
  if (bestIdx < 0) return text.slice(0, 140) + (text.length > 140 ? '…' : '');

  const start = Math.max(0, bestIdx - 50);
  const end = Math.min(text.length, bestIdx + 130);
  let snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');

  for (const term of queryTerms) {
    const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    snippet = snippet.replace(re, '<mark>$1</mark>');
  }
  return snippet;
}

const INDEX = buildIndex(buildSearchCorpus());

export function searchCurriculum(q: string): SearchHit[] {
  const terms = tokenize(q);
  if (terms.length === 0) return [];

  const scored: Array<{ doc: IndexedDoc; score: number }> = [];
  for (const doc of INDEX.docs) {
    let score = 0, matched = 0;
    for (const term of terms) {
      const tf = doc.tfMap.get(term) ?? 0;
      if (tf > 0) {
        const idf = INDEX.idfMap.get(term) ?? 0;
        score += tf * idf;
        matched++;
      }
    }
    if (matched > 0) {
      score *= 1 + matched / terms.length;
      scored.push({ doc, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map(({ doc, score }) => ({
    moduleId: doc.moduleId,
    moduleNumber: doc.moduleNumber,
    moduleTitle: doc.moduleTitle,
    lessonTitle: doc.lessonTitle,
    snippet: buildSnippet(doc, terms),
    score,
  }));
}
