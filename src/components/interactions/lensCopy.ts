/** A read-only visual copy. Lives outside the content it copies. */
export function createLensCopy(source: HTMLElement) {
  const copy = source.cloneNode(true) as HTMLElement;
  copy.removeAttribute('id');
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  copy.classList.add('lens-copy');
  copy.style.width = `${source.getBoundingClientRect().width}px`;
  copy
    .querySelectorAll('[id]')
    .forEach((element) => element.removeAttribute('id'));
  copy
    .querySelectorAll('dialog,script,.skip-link,.mobile-nav-scrim')
    .forEach((element) => element.remove());
  copy
    .querySelectorAll('a,button,input,textarea,select,[tabindex]')
    .forEach((element) => element.setAttribute('tabindex', '-1'));
  // WebGL buffers cannot reliably be copied: use the existing still-life illustration.
  copy.querySelectorAll('.scene-canvas').forEach((element) => element.remove());
  copy
    .querySelectorAll('.static-core')
    .forEach((element) => element.classList.remove('hidden'));
  syncFixedContent(source, copy);
  return copy;
}

export function syncFixedContent(source: HTMLElement, copy: HTMLElement) {
  const sourceRect = source.getBoundingClientRect();
  const originals = Array.from(source.querySelectorAll<HTMLElement>('.navbar'));
  const copies = Array.from(copy.querySelectorAll<HTMLElement>('.navbar'));
  originals.forEach((element, index) => {
    const target = copies[index];
    if (!target) return;
    const rect = element.getBoundingClientRect();
    Object.assign(target.style, {
      position: 'absolute',
      top: `${rect.top - sourceRect.top}px`,
      left: `${rect.left - sourceRect.left}px`,
      right: 'auto',
      width: `${rect.width}px`,
      margin: '0',
    });
  });
}
