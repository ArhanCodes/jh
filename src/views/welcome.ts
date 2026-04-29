import type { Store } from '../store';
import { modules } from '../curriculum';

export function renderWelcome(store: Store): HTMLElement {
  const root = document.createElement('div');
  root.className = 'welcome';

  const hasProgress = store.hasAnyProgress();
  const continueId = store.nextIncompleteModuleId();
  const continueModule = modules.find((m) => m.id === continueId)!;
  const completedCount = modules.filter((m) => store.isComplete(m.id)).length;

  root.innerHTML = `
    <div class="welcome-hero">
      <div class="welcome-eyebrow">An online course by JH Interiors</div>
      <h1 class="welcome-title">
        AI for the<br />
        <em>Modern Interior</em><br />
        Designer.
      </h1>
      <p class="welcome-lede">
        A nine-module course on the new AI workflow for designers — from client brief to final presentation. Built and taught from a Dubai studio rooted in soft elegance, calm living, and timeless interiors.
      </p>

      <div class="welcome-cta-row">
        ${
          hasProgress
            ? `<button class="btn btn-primary" id="welcome-continue">
                Continue · Module ${continueModule.number} →
              </button>
              <button class="btn btn-ghost" id="welcome-restart">View Curriculum</button>`
            : `<button class="btn btn-primary" id="welcome-start">
                Begin the Course →
              </button>
              <button class="btn btn-ghost" id="welcome-curriculum">View Curriculum</button>`
        }
      </div>

      ${
        hasProgress
          ? `<div class="welcome-progress-note">
              ${completedCount} of ${modules.length} modules complete · your progress is saved
            </div>`
          : `<div class="welcome-progress-note">
              ${modules.length} modules · self-paced · saves your progress as you go
            </div>`
      }
    </div>

    <div class="welcome-section">
      <div class="welcome-section-label">What You'll Learn</div>
      <div class="welcome-modules">
        ${modules
          .map((m) => {
            const done = store.isComplete(m.id);
            return `
              <button class="welcome-module-card" data-mod="${m.id}">
                <span class="welcome-mc-num">${m.number}</span>
                <span class="welcome-mc-body">
                  <span class="welcome-mc-title">${m.title}${m.titleEm ? ' ' + m.titleEm : ''}</span>
                  <span class="welcome-mc-tagline">${m.tagline.split('.')[0]}.</span>
                </span>
                <span class="welcome-mc-meta">
                  ${done ? '<span class="welcome-mc-done">✓</span>' : ''}
                  <span class="welcome-mc-duration">${m.duration}</span>
                </span>
              </button>
            `;
          })
          .join('')}
      </div>
    </div>

    <div class="welcome-section welcome-philosophy">
      <div class="welcome-quote">
        "AI gives you options.<br />
        <em>Designers</em> choose the best one."
      </div>
      <div class="welcome-quote-attr">— The course philosophy</div>
    </div>

    <div class="welcome-footer">
      <div class="welcome-footer-brand">
        <span class="brand-j">J</span><span class="brand-h">H</span>
        <span class="brand-script">design</span>
      </div>
      <div class="welcome-footer-meta">
        JH Interiors · Modern, refined interiors · Dubai
      </div>
      <div class="welcome-footer-links">
        <a href="https://www.instagram.com/jhdesign.interior/" target="_blank" rel="noopener">@jhdesign.interior</a>
      </div>
    </div>
  `;

  /* CTAs */
  const startBtn = root.querySelector<HTMLButtonElement>('#welcome-start');
  startBtn?.addEventListener('click', () => {
    store.set(() => ({ view: 'module', activeModuleId: modules[0]!.id, activeTab: 'lesson' }));
  });

  const continueBtn = root.querySelector<HTMLButtonElement>('#welcome-continue');
  continueBtn?.addEventListener('click', () => {
    store.set(() => ({ view: 'module', activeModuleId: continueId, activeTab: 'lesson' }));
  });

  const curriculumBtn = root.querySelector<HTMLButtonElement>('#welcome-curriculum');
  curriculumBtn?.addEventListener('click', () => {
    document.querySelector('.welcome-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  const restartBtn = root.querySelector<HTMLButtonElement>('#welcome-restart');
  restartBtn?.addEventListener('click', () => {
    document.querySelector('.welcome-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* Module cards */
  root.querySelectorAll<HTMLButtonElement>('.welcome-module-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.mod;
      if (id) store.set(() => ({ view: 'module', activeModuleId: id, activeTab: 'lesson' }));
    });
  });

  return root;
}
