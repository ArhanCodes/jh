import type { Store } from '../store';
import { modules } from '../curriculum';

export function renderSidebar(store: Store): HTMLElement {
  const aside = document.createElement('aside');
  aside.className = 'sidebar';

  /* brand block */
  const brand = document.createElement('div');
  brand.className = 'sidebar-brand';
  brand.innerHTML = `
    <div class="sidebar-brand-logo">
      <span class="brand-j">J</span><span class="brand-h">H</span>
      <span class="brand-script">design</span>
    </div>
    <div class="sidebar-brand-name">JH Interiors</div>
    <div class="sidebar-brand-bio">
      Modern, refined interiors.<br />
      Timeless design. Thoughtful spaces.
    </div>
    <div class="sidebar-brand-loc">Dubai <span>·</span> Residential Design</div>
  `;
  aside.appendChild(brand);

  const list = document.createElement('ul');
  list.className = 'module-nav';

  const label = document.createElement('div');
  label.className = 'sidebar-section-label';
  label.textContent = 'Curriculum';
  aside.appendChild(label);

  modules.forEach((mod) => {
    const item = document.createElement('li');
    item.className = 'module-nav-item';
    item.dataset.moduleId = mod.id;

    const link = document.createElement('button');
    link.className = 'module-nav-link';
    link.innerHTML = `
      <span class="module-nav-num">${mod.number}</span>
      <span class="module-nav-title">${mod.title}${mod.titleEm ? ' ' + mod.titleEm : ''}</span>
      <span class="module-nav-status"></span>
    `;
    link.addEventListener('click', () => {
      store.set(() => ({ activeModuleId: mod.id, activeTab: 'lesson' }));
      const main = document.querySelector('.main');
      if (main) main.scrollTop = 0;
    });

    item.appendChild(link);
    list.appendChild(item);
  });

  aside.appendChild(list);

  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.innerHTML = `
    <strong>Progress saved.</strong> Your work persists locally — close the tab and come back any time.
  `;
  aside.appendChild(footer);

  const update = () => {
    const state = store.get();
    list.querySelectorAll<HTMLElement>('.module-nav-item').forEach((el) => {
      const id = el.dataset.moduleId;
      if (!id) return;
      el.classList.toggle('active', id === state.activeModuleId);
      el.classList.toggle('completed', store.isComplete(id));
      const status = el.querySelector('.module-nav-status');
      if (status) {
        status.textContent = store.isComplete(id) ? '✓' : '';
      }
    });
  };

  update();
  store.subscribe(update);

  return aside;
}
