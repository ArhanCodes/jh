import './styles.css';
import { Store } from './store';
import { modules } from './curriculum';
import { renderSidebar } from './views/sidebar';
import { renderLesson } from './views/lesson';
import { renderPromptBuilder } from './views/promptBuilder';
import { renderPaletteBuilder } from './views/paletteBuilder';
import { renderQuiz } from './views/quiz';
import { createSearchOverlay } from './views/search';
import { renderWelcome } from './views/welcome';

const store = new Store();

function moduleById(id: string) {
  return modules.find((m) => m.id === id) ?? modules[0]!;
}

function renderApp(): HTMLElement {
  const app = document.createElement('div');
  app.className = 'app';

  /* ===== HEADER ===== */
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <button class="header-brand" id="brand-home" type="button" aria-label="Welcome">
      <span class="brand-mark">
        <span class="brand-j">J</span><span class="brand-h">H</span>
        <span class="brand-script">design</span>
      </span>
      <span class="brand-tag">
        <span class="brand-tag-1">JH Interiors</span>
        <span>Modern · Refined · Timeless</span>
      </span>
    </button>
    <div class="header-search">
      <span class="header-search-icon">⌕</span>
      <input type="text" placeholder="Search the course   ⌘K" id="header-search-input" autocomplete="off" />
    </div>
    <div class="header-meta">
      <div class="header-progress">
        <span class="header-progress-text" id="progress-text">0%</span>
        <div class="header-progress-bar"><div class="header-progress-fill" id="progress-fill"></div></div>
      </div>
    </div>
  `;
  app.appendChild(header);

  /* ===== SIDEBAR ===== */
  const sidebar = renderSidebar(store);
  app.appendChild(sidebar);

  /* ===== MAIN ===== */
  const main = document.createElement('main');
  main.className = 'main';
  const mainInner = document.createElement('div');
  mainInner.className = 'main-inner';
  mainInner.id = 'main-inner';
  main.appendChild(mainInner);
  app.appendChild(main);

  /* ===== SEARCH OVERLAY ===== */
  const search = createSearchOverlay(store);
  app.appendChild(search.element);

  /* search input -> open overlay */
  const headerSearchInput = header.querySelector<HTMLInputElement>('#header-search-input')!;
  headerSearchInput.addEventListener('focus', () => {
    headerSearchInput.blur();
    search.open();
  });

  /* brand wordmark -> welcome */
  header.querySelector<HTMLButtonElement>('#brand-home')!.addEventListener('click', () => {
    store.set(() => ({ view: 'welcome' }));
    main.scrollTop = 0;
  });

  /* ===== Render progress UI (header + sidebar) ===== */
  let lastModuleId = '';
  let lastTab: string = '';

  const renderProgress = () => {
    const ratio = store.completionRatio();
    const fill = header.querySelector<HTMLElement>('#progress-fill')!;
    const text = header.querySelector<HTMLElement>('#progress-text')!;
    fill.style.width = `${Math.round(ratio * 100)}%`;
    text.textContent = `${Math.round(ratio * 100)}% complete`;
  };

  /* ===== Render module content (full rebuild) ===== */
  let lastView = '';
  const renderMain = () => {
    const state = store.get();

    /* always update progress chrome */
    renderProgress();

    /* skip wholesale rebuild if the view didn't change — protects locally-mutated content like quiz results */
    if (
      state.view === lastView &&
      state.activeModuleId === lastModuleId &&
      state.activeTab === lastTab
    ) {
      return;
    }
    lastView = state.view;
    lastModuleId = state.activeModuleId;
    lastTab = state.activeTab;

    /* welcome view branch */
    if (state.view === 'welcome') {
      mainInner.innerHTML = '';
      mainInner.appendChild(renderWelcome(store));
      main.scrollTop = 0;
      return;
    }

    const mod = moduleById(state.activeModuleId);
    const idx = modules.findIndex((m) => m.id === mod.id);
    const prev = idx > 0 ? modules[idx - 1] : null;
    const next = idx < modules.length - 1 ? modules[idx + 1] : null;

    mainInner.innerHTML = '';

    /* module head */
    const head = document.createElement('div');
    head.className = 'module-head';
    head.innerHTML = `
      <div class="module-eyebrow">Module ${mod.number} of ${String(modules.length).padStart(2, '0')}</div>
      <h1 class="module-title">${mod.title}${mod.titleEm ? ` <em>${mod.titleEm}</em>` : ''}.</h1>
      <p class="module-tagline">${mod.tagline}</p>
      <div class="module-meta">
        <span class="module-meta-item"><strong>${mod.duration}</strong></span>
        <span class="module-meta-item">Tools: <strong>${mod.tools.join(', ')}</strong></span>
        <span class="module-meta-item">${mod.lessons.length} lessons · ${mod.quiz.length} quiz</span>
      </div>
    `;
    mainInner.appendChild(head);

    /* tabs */
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    const tabDefs: Array<{ id: 'lesson' | 'try' | 'quiz'; label: string; show: boolean; badge?: string }> = [
      { id: 'lesson', label: 'Lesson', show: true },
      { id: 'try', label: 'Try It', show: mod.interactive !== null, badge: 'Live' },
      { id: 'quiz', label: 'Quiz', show: true },
    ];
    tabDefs.filter((t) => t.show).forEach((t) => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (state.activeTab === t.id ? ' active' : '');
      btn.innerHTML = t.label + (t.badge ? `<span class="tab-badge">${t.badge}</span>` : '');
      btn.addEventListener('click', () => {
        store.set(() => ({ activeTab: t.id }));
      });
      tabs.appendChild(btn);
    });
    mainInner.appendChild(tabs);

    /* content based on tab */
    let content: HTMLElement;
    if (state.activeTab === 'lesson') {
      content = renderLesson(mod);
    } else if (state.activeTab === 'try') {
      if (mod.interactive === 'prompt-builder') content = renderPromptBuilder();
      else if (mod.interactive === 'palette-builder') content = renderPaletteBuilder();
      else content = renderLesson(mod);
    } else {
      content = renderQuiz(mod, store);
    }
    mainInner.appendChild(content);

    /* mark lesson complete button (only on lesson tab) */
    if (state.activeTab === 'lesson') {
      const markRow = document.createElement('div');
      markRow.style.marginTop = '2.5rem';
      markRow.style.display = 'flex';
      markRow.style.gap = '0.75rem';
      markRow.style.alignItems = 'center';
      const isDone = store.get().progress[mod.id]?.lessonComplete;
      markRow.innerHTML = `
        <button class="btn ${isDone ? 'btn-ghost' : 'btn-primary'}" id="mark-done">
          ${isDone ? 'Lesson Marked Complete ✓' : 'Mark Lesson Complete'}
        </button>
        <span style="font-size: 0.78rem; color: var(--ink-mute); letter-spacing: 0.05em;">
          Then take the quiz to lock in the module.
        </span>
      `;
      markRow.querySelector<HTMLButtonElement>('#mark-done')!.addEventListener('click', () => {
        store.setProgress(mod.id, { lessonComplete: true });
        if (mod.interactive) {
          store.set(() => ({ activeTab: 'try' }));
        } else {
          store.set(() => ({ activeTab: 'quiz' }));
        }
      });
      mainInner.appendChild(markRow);
    }

    /* prev/next nav */
    const navFooter = document.createElement('div');
    navFooter.className = 'nav-footer';

    if (prev) {
      const b = document.createElement('button');
      b.className = 'nav-footer-btn prev';
      b.innerHTML = `
        <span class="nav-footer-btn-label">← Previous · ${prev.number}</span>
        <span class="nav-footer-btn-title">${prev.title}${prev.titleEm ? ' ' + prev.titleEm : ''}</span>
      `;
      b.addEventListener('click', () => {
        store.set(() => ({ activeModuleId: prev.id, activeTab: 'lesson' }));
        main.scrollTop = 0;
      });
      navFooter.appendChild(b);
    } else {
      navFooter.appendChild(document.createElement('div'));
    }

    if (next) {
      const b = document.createElement('button');
      b.className = 'nav-footer-btn next';
      b.innerHTML = `
        <span class="nav-footer-btn-label">Next · ${next.number} →</span>
        <span class="nav-footer-btn-title">${next.title}${next.titleEm ? ' ' + next.titleEm : ''}</span>
      `;
      b.addEventListener('click', () => {
        store.set(() => ({ activeModuleId: next.id, activeTab: 'lesson' }));
        main.scrollTop = 0;
      });
      navFooter.appendChild(b);
    } else {
      navFooter.appendChild(document.createElement('div'));
    }

    mainInner.appendChild(navFooter);
  };

  store.subscribe(renderMain);
  renderMain();

  return app;
}

const root = document.getElementById('app');
if (root) {
  root.appendChild(renderApp());
}
