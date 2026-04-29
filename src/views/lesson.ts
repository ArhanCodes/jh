import type { Module } from '../types';

export function renderLesson(module: Module): HTMLElement {
  const wrap = document.createElement('div');

  module.lessons.forEach((lesson) => {
    const sec = document.createElement('section');
    sec.className = 'lesson-section';

    const h = document.createElement('h2');
    h.className = 'lesson-h';
    h.textContent = lesson.title;
    sec.appendChild(h);

    lesson.sections.forEach((s) => {
      if (s.type === 'paragraph' && typeof s.content === 'string') {
        const p = document.createElement('p');
        p.className = 'lesson-p';
        p.innerHTML = s.content;
        sec.appendChild(p);
      } else if (s.type === 'heading' && typeof s.content === 'string') {
        const sh = document.createElement('h3');
        sh.className = 'lesson-h';
        sh.style.fontSize = '1.2rem';
        sh.style.marginTop = '1.5rem';
        sh.style.marginBottom = '0.85rem';
        sh.style.color = 'var(--gold)';
        sh.style.fontStyle = 'italic';
        sh.textContent = s.content;
        sec.appendChild(sh);
      } else if (s.type === 'list' && Array.isArray(s.content)) {
        const ul = document.createElement('ul');
        ul.className = 'lesson-list';
        s.content.forEach((item) => {
          const li = document.createElement('li');
          li.innerHTML = item;
          ul.appendChild(li);
        });
        sec.appendChild(ul);
      } else if (s.type === 'callout' && typeof s.content === 'string') {
        const c = document.createElement('div');
        c.className = 'lesson-callout';
        c.innerHTML = `
          <div class="lesson-callout-label">Principle</div>
          <p>"${s.content}"</p>
        `;
        sec.appendChild(c);
      }
    });

    wrap.appendChild(sec);
  });

  /* exercise card */
  const ex = document.createElement('div');
  ex.className = 'exercise-card';
  ex.innerHTML = `
    <div class="exercise-label">Exercise</div>
    <div class="exercise-prompt">${module.exercise.prompt}</div>
    <div class="exercise-guidance">${module.exercise.guidance}</div>
  `;
  wrap.appendChild(ex);

  return wrap;
}
