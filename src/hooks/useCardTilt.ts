import { useEffect } from 'react';
import type { RefObject } from 'react';

/** One pointer handler and at most one style write per frame for the whole grid. */
export function useCardTilt(grid: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = grid.current;
    if (!root) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine)',
    );
    let card: HTMLElement | null = null;
    let bounds: DOMRect | null = null;
    let frame = 0;
    let x = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card?.style.removeProperty('--tilt');
      card = null;
      bounds = null;
    };
    const paint = () => {
      frame = 0;
      if (!card?.isConnected) return;
      bounds ??= card.getBoundingClientRect();
      const tilt = ((x - bounds.left - bounds.width / 2) / bounds.width) * 3;
      card.style.setProperty(
        '--tilt',
        Math.max(-1.5, Math.min(1.5, tilt)).toFixed(3) + 'deg',
      );
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || motion.matches || !desktop.matches)
        return;
      const next =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('.project-card')
          : null;
      if (next !== card) {
        reset();
        card = next;
      }
      x = event.clientX;
      if (card && !frame) frame = requestAnimationFrame(paint);
    };
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('resize', reset);
    motion.addEventListener('change', reset);
    desktop.addEventListener('change', reset);
    return () => {
      reset();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('resize', reset);
      motion.removeEventListener('change', reset);
      desktop.removeEventListener('change', reset);
    };
  }, [grid]);
}
