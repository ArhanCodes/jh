import type { AppState, ProgressEntry } from './types';
import { modules } from './curriculum';

const STORAGE_KEY = 'aid-course-state-v1';

const defaultProgress = (): Record<string, ProgressEntry> => {
  const out: Record<string, ProgressEntry> = {};
  for (const m of modules) {
    out[m.id] = { lessonComplete: false, quizScore: null, quizTotal: m.quiz.length };
  }
  return out;
};

const initialState = (): AppState => ({
  activeModuleId: modules[0]!.id,
  activeTab: 'lesson',
  progress: defaultProgress(),
});

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const base = initialState();
    return {
      activeModuleId: parsed.activeModuleId ?? base.activeModuleId,
      activeTab: parsed.activeTab ?? base.activeTab,
      progress: { ...base.progress, ...(parsed.progress ?? {}) },
    };
  } catch {
    return initialState();
  }
};

type Listener = (state: AppState) => void;

export class Store {
  private state: AppState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = load();
  }

  get(): AppState {
    return this.state;
  }

  set(updater: (s: AppState) => Partial<AppState>): void {
    this.state = { ...this.state, ...updater(this.state) };
    this.persist();
    this.notify();
  }

  setProgress(moduleId: string, partial: Partial<ProgressEntry>): void {
    const current = this.state.progress[moduleId];
    if (!current) return;
    const next = { ...current, ...partial };
    this.state = {
      ...this.state,
      progress: { ...this.state.progress, [moduleId]: next },
    };
    this.persist();
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  completionRatio(): number {
    const total = modules.length * 2;
    let done = 0;
    for (const m of modules) {
      const p = this.state.progress[m.id];
      if (!p) continue;
      if (p.lessonComplete) done++;
      if (p.quizScore !== null && p.quizScore >= Math.ceil(p.quizTotal * 0.5)) done++;
    }
    return done / total;
  }

  isComplete(moduleId: string): boolean {
    const p = this.state.progress[moduleId];
    if (!p) return false;
    return p.lessonComplete && p.quizScore !== null && p.quizScore >= Math.ceil(p.quizTotal * 0.5);
  }

  private notify(): void {
    for (const l of this.listeners) l(this.state);
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      /* ignore quota errors */
    }
  }
}
