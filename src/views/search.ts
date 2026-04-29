import type { SearchHit } from '../types';
import type { Store } from '../store';
import { searchCurriculum } from '../lib/search';

export interface SearchOverlay {
  open(): void;
  close(): void;
  element: HTMLElement;
}

export function createSearchOverlay(store: Store): SearchOverlay {
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-panel">
      <div class="search-panel-input">
        <span style="color: var(--ink-mute);">⌕</span>
        <input type="text" placeholder="Search the course…" id="search-input" autocomplete="off" />
        <button class="search-panel-close" id="search-close">ESC</button>
      </div>
      <div class="search-panel-results" id="search-results">
        <div class="search-empty">Type to search the curriculum.</div>
      </div>
    </div>
  `;

  const input = overlay.querySelector<HTMLInputElement>('#search-input')!;
  const results = overlay.querySelector<HTMLElement>('#search-results')!;
  const closeBtn = overlay.querySelector<HTMLButtonElement>('#search-close')!;

  let queryTimer: number | undefined;

  input.addEventListener('input', () => {
    clearTimeout(queryTimer);
    queryTimer = window.setTimeout(() => {
      const q = input.value.trim();
      if (!q) {
        results.innerHTML = '<div class="search-empty">Type to search the curriculum.</div>';
        return;
      }
      const hits = searchCurriculum(q);
      renderHits(hits);
    }, 80);
  });

  function renderHits(hits: SearchHit[]): void {
    if (hits.length === 0) {
      results.innerHTML = '<div class="search-empty">No matches. Try a different keyword.</div>';
      return;
    }
    results.innerHTML = `
      <div style="padding: 0.5rem 1.25rem; font-size: 0.7rem; color: var(--ink-mute); letter-spacing: 0.12em; text-transform: uppercase;">
        ${hits.length} result${hits.length === 1 ? '' : 's'}
      </div>
      ${hits
        .map(
          (h) => `
        <div class="search-result" data-mod="${h.moduleId}">
          <div class="search-result-mod">Module ${h.moduleNumber} · ${h.moduleTitle}</div>
          <div class="search-result-title">${h.lessonTitle}</div>
          <div class="search-result-snippet">${h.snippet}</div>
        </div>
      `
        )
        .join('')}
    `;
    results.querySelectorAll<HTMLElement>('.search-result').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.dataset.mod;
        if (id) {
          store.set(() => ({ activeModuleId: id, activeTab: 'lesson' }));
          api.close();
        }
      });
    });
  }

  closeBtn.addEventListener('click', () => api.close());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) api.close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) api.close();
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      api.open();
    }
  });

  const api: SearchOverlay = {
    open: () => {
      overlay.classList.add('show');
      setTimeout(() => input.focus(), 50);
    },
    close: () => {
      overlay.classList.remove('show');
      input.value = '';
      results.innerHTML = '<div class="search-empty">Type to search the curriculum.</div>';
    },
    element: overlay,
  };

  return api;
}
