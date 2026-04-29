export type LessonSectionType = 'paragraph' | 'list' | 'callout' | 'heading';

export interface LessonSection {
  type: LessonSectionType;
  content: string | string[];
}

export interface Lesson {
  id: string;
  title: string;
  sections: LessonSection[];
}

export interface Exercise {
  prompt: string;
  guidance: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type InteractiveType = 'prompt-builder' | 'palette-builder' | null;

export interface Module {
  id: string;
  number: string;
  title: string;
  titleEm?: string;
  tagline: string;
  duration: string;
  tools: string[];
  lessons: Lesson[];
  exercise: Exercise;
  quiz: QuizQuestion[];
  interactive: InteractiveType;
}

export interface ProgressEntry {
  lessonComplete: boolean;
  quizScore: number | null;
  quizTotal: number;
}

export interface AppState {
  activeModuleId: string;
  activeTab: 'lesson' | 'try' | 'quiz';
  progress: Record<string, ProgressEntry>;
}

/* ========== Worker message types ========== */

export interface PromptParams {
  style: string;
  room: string;
  materials: string[];
  lighting: string;
  mood: string;
  count: number;
}

export type PromptWorkerMsg =
  | { type: 'generate'; params: PromptParams; requestId: number };

export type PromptWorkerReply =
  | { type: 'result'; prompts: string[]; requestId: number; durationMs: number };

export interface PaletteParams {
  baseHue: number;
  scheme: 'analogous' | 'complementary' | 'triadic' | 'monochrome' | 'split-comp';
  mood: 'warm' | 'cool' | 'neutral' | 'bold';
}

export type PaletteWorkerMsg =
  | { type: 'generate'; params: PaletteParams; requestId: number };

export interface PaletteSwatch {
  hex: string;
  name: string;
  role: string;
}

export type PaletteWorkerReply =
  | {
      type: 'result';
      swatches: PaletteSwatch[];
      rationale: string;
      requestId: number;
      durationMs: number;
    };

export interface SearchDoc {
  moduleId: string;
  moduleNumber: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  text: string;
}

export interface SearchHit {
  moduleId: string;
  moduleNumber: string;
  moduleTitle: string;
  lessonTitle: string;
  snippet: string;
  score: number;
}

export type SearchWorkerMsg =
  | { type: 'index'; docs: SearchDoc[] }
  | { type: 'query'; q: string; requestId: number };

export type SearchWorkerReply =
  | { type: 'indexed'; count: number }
  | { type: 'results'; hits: SearchHit[]; requestId: number; durationMs: number };
