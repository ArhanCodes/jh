import type { Store } from '../store';
import { modules } from '../curriculum';

export function renderSidebar(store: Store): HTMLElement {
  const aside = document.createElement('aside');
  aside.className = 'sidebar';

  /* brand block — clickable to welcome */
  const brandWrap = document.createElement('div');
  brandWrap.className = 'sidebar-brand-wrap';

  const brand = document.createElement('button');
  brand.className = 'sidebar-brand';
  brand.type = 'button';
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
  brand.addEventListener('click', () => {
    store.set(() => ({ view: 'welcome' }));
    const main = document.querySelector('.main');
    if (main) main.scrollTop = 0;
  });
  brandWrap.appendChild(brand);

  /* Instagram link — sibling of the brand button */
  const ig = document.createElement('a');
  ig.className = 'sidebar-brand-ig';
  ig.href = 'https://www.instagram.com/jhdesign.interior/';
  ig.target = '_blank';
  ig.rel = 'noopener noreferrer';
  ig.innerHTML = `
    <svg class="sidebar-brand-ig-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
    <span>@jhdesign.interior</span>
  `;
  brandWrap.appendChild(ig);

  aside.appendChild(brandWrap);

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
      store.set(() => ({ view: 'module', activeModuleId: mod.id, activeTab: 'lesson' }));
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
    const onModule = state.view === 'module';
    list.querySelectorAll<HTMLElement>('.module-nav-item').forEach((el) => {
      const id = el.dataset.moduleId;
      if (!id) return;
      el.classList.toggle('active', onModule && id === state.activeModuleId);
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
