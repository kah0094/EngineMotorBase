(() => {
  const bar = document.createElement('div');
  bar.className = 'desktop-bar';
  bar.innerHTML = `<span class="brand">Motor Editor</span><button data-act="open">Abrir</button><button data-act="save" class="desktop-save">Salvar</button><button data-act="saveas">Salvar como</button><span class="spacer"></span><span class="desktop-hint">Mouse: selecionar · arrastar · roda: zoom · Espaço + arrastar: pan</span><button data-act="about">?</button>`;
  document.body.insertBefore(bar, document.body.firstChild);
  const toast = (text, kind = 'ok') => { const old = document.querySelector('.desktop-toast'); old?.remove(); const el = document.createElement('div'); el.className = `desktop-toast ${kind}`; el.textContent = text; document.body.append(el); setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 220); }, 2200); };
  bar.addEventListener('click', async (event) => {
    const act = event.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    if (act === 'open') await window.motorDesktop.open();
    if (act === 'save') await window.motorDesktop.save(false);
    if (act === 'saveas') await window.motorDesktop.save(true);
    if (act === 'about') await window.motorDesktop.about();
  });
  window.addEventListener('motor-desktop-saved', () => toast('Projeto salvo no disco.'));
  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); window.motorDesktop.save(event.shiftKey); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'o') { event.preventDefault(); window.motorDesktop.open(); }
  }, true);
})();
