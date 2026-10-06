import { useEffect, useRef } from 'react';
import './mobileEffects.css';
export function MobileEffects() {
  const ring = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const mobile = matchMedia('(max-width:767px)');
    const small = matchMedia('(max-width:480px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let ripple: Animation | null = null;
    let touch: { x: number; y: number; time: number; id: number } | null = null;
    let revealObserver: IntersectionObserver | null = null;
    let contentObserver: MutationObserver | null = null;
    const watched = new Set<HTMLElement>();
    const enabled = () => mobile.matches && !reduced.matches;
    const visible = (element: HTMLElement) => {
      element.classList.remove('reveal-pending');
      element.dataset.mobileRevealed = 'true';
      revealObserver?.unobserve(element);
    };
    const observeNew = () => {
      if (!enabled() || !revealObserver) return;
      watched.forEach((element) => {
        if (!element.isConnected) watched.delete(element);
      });
      document
        .querySelectorAll<HTMLElement>(
          small.matches
            ? '#main .section-heading'
            : '#main .section-heading,#main .about-bento > div,#main .project-card',
        )
        .forEach((element) => {
          if (watched.has(element)) return;
          watched.add(element);
          element.classList.add('mobile-reveal');
          if (
            element.getBoundingClientRect().top <= innerHeight - 20 ||
            element.dataset.mobileRevealed
          ) {
            visible(element);
            return;
          }
          element.classList.add('reveal-pending');
          revealObserver?.observe(element);
        });
    };
    const reset = () => {
      ripple?.cancel();
      touch = null;
      revealObserver?.disconnect();
      contentObserver?.disconnect();
      watched.forEach((element) => element.classList.remove('reveal-pending'));
      watched.clear();
      if (!enabled()) return;
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible(entry.target as HTMLElement);
          });
        },
        { rootMargin: '0px 0px -20px 0px', threshold: 0 },
      );
      observeNew();
      contentObserver = new MutationObserver(observeNew);
      const content = document.getElementById('main');
      if (content && !small.matches)
        contentObserver.observe(content, { childList: true, subtree: true });
    };
    const down = (event: PointerEvent) => {
      if (!enabled() || event.pointerType !== 'touch' || !event.isPrimary)
        return;
      if (
        event.target instanceof Element &&
        event.target.closest('input,textarea,select,[contenteditable="true"]')
      )
        return;
      touch = {
        x: event.clientX,
        y: event.clientY,
        time: performance.now(),
        id: event.pointerId,
      };
    };
    const move = (event: PointerEvent) => {
      if (
        touch &&
        event.pointerId === touch.id &&
        Math.hypot(event.clientX - touch.x, event.clientY - touch.y) > 12
      )
        touch = null;
    };
    const up = (event: PointerEvent) => {
      if (!touch || touch.id !== event.pointerId || !ring.current) return;
      const start = touch;
      touch = null;
      if (!enabled() || performance.now() - start.time > 600) return;
      ripple?.cancel();
      const position = `translate3d(${event.clientX - 25}px,${event.clientY - 25}px,0)`;
      ripple = ring.current.animate(
        [
          { opacity: 0.5, transform: `${position} scale(.35)` },
          { opacity: 0, transform: `${position} scale(1.35)` },
        ],
        { duration: 420, easing: 'cubic-bezier(.2,.65,.3,1)' },
      );
    };
    const cancel = () => {
      touch = null;
    };
    const focus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        const element = event.target.closest<HTMLElement>('.mobile-reveal');
        if (element) visible(element);
      }
    };
    reset();
    mobile.addEventListener('change', reset);
    small.addEventListener('change', reset);
    reduced.addEventListener('change', reset);
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', cancel, { passive: true });
    document.addEventListener('focusin', focus);
    return () => {
      ripple?.cancel();
      revealObserver?.disconnect();
      contentObserver?.disconnect();
      watched.forEach((element) => element.classList.remove('reveal-pending'));
      mobile.removeEventListener('change', reset);
      small.removeEventListener('change', reset);
      reduced.removeEventListener('change', reset);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      document.removeEventListener('focusin', focus);
    };
  }, []);
  return <span ref={ring} className="mobile-ink-ring" aria-hidden="true" />;
}
