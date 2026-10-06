import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { sections } from '../../data/profile';
import { track } from '../../lib/analytics';
import { getWhatsAppLink } from '../../lib/whatsapp';
import { Arrow } from './ui';
import './navigation.css';
export function Navbar({
  active,
  onOpenConsole,
}: {
  active: string;
  onOpenConsole: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const media = matchMedia('(max-width:767px)');
    const resize = () => {
      setMobile(media.matches);
      if (!media.matches) setOpen(false);
    };
    resize();
    media.addEventListener('change', resize);
    let frame = 0;
    let distance = 0;
    let previousScrolled = false;
    const paint = () => {
      frame = 0;
      const nextScrolled = scrollY > 30;
      if (nextScrolled !== previousScrolled) {
        previousScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }
      if (progress.current)
        progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      distance = Math.max(
        0,
        document.documentElement.scrollHeight - innerHeight,
      );
      schedule();
    };
    const observer = new ResizeObserver(measure);
    const content = document.getElementById('main');
    if (content) observer.observe(content);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
      observer.disconnect();
      media.removeEventListener('change', resize);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
    };
  }, []);
  useEffect(() => {
    if (!open || !mobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('mobile-menu-open');
    const pointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        close();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
      }
    };
    window.addEventListener('pointerdown', pointer);
    window.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.documentElement.classList.remove('mobile-menu-open');
      window.removeEventListener('pointerdown', pointer);
      window.removeEventListener('keydown', key);
    };
  }, [open, mobile]);
  const choose = (event?: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!event || !mobile || !open) {
      close();
      return;
    }
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const hash = event.currentTarget.hash;
    const destination = document.getElementById(hash.slice(1));
    if (!destination) {
      close();
      return;
    }
    event.preventDefault();
    close(true);
    if (navigationTimer.current) clearTimeout(navigationTimer.current);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    navigationTimer.current = setTimeout(
      () => {
        navigationTimer.current = null;
        history.pushState(null, '', hash);
        destination.scrollIntoView({
          behavior: reduced ? 'instant' : 'smooth',
          block: 'start',
        });
      },
      reduced ? 0 : 240,
    );
  };
  return (
    <>
      <button
        type="button"
        className={`mobile-nav-scrim ${open && mobile ? 'open' : ''}`}
        tabIndex={-1}
        aria-label="Dismiss navigation overlay"
        aria-hidden={!open || !mobile}
        inert={!open || !mobile}
        onClick={() => close(true)}
      />
      <header
        ref={header}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        data-menu-open={open && mobile}
      >
        <a
          className="wordmark"
          href="#home"
          aria-label="Farid home"
          onClick={choose}
        >
          farid<span>{'\u00ae'}</span>
          <small>INDEPENDENT DEVELOPER</small>
        </a>
        <button
          ref={trigger}
          type="button"
          className="menu-toggle"
          onClick={() => {
            if (navigationTimer.current) {
              clearTimeout(navigationTimer.current);
              navigationTimer.current = null;
            }
            setOpen((value) => !value);
          }}
          aria-expanded={open && mobile}
          aria-controls="portfolio-navigation"
          aria-label={open ? 'Close navigation' : 'Menu navigation'}
        >
          <span className="menu-label">{open ? 'Close' : 'Menu'}</span>
          <span className="hamburger-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
        <div
          id="portfolio-navigation"
          className={`nav-panel ${open ? 'open' : ''}`}
          aria-hidden={mobile && !open ? true : undefined}
          inert={mobile && !open}
        >
          <div className="nav-panel-inner">
            <div className="nav-sheet">
              <p className="nav-panel-label">A LITTLE EXPLORING</p>
              <nav aria-label="Main navigation">
                {sections.map((section, index) => (
                  <a
                    key={section}
                    href={`#${section.toLowerCase()}`}
                    className={active === section.toLowerCase() ? 'active' : ''}
                    aria-current={
                      active === section.toLowerCase() ? 'location' : undefined
                    }
                    onClick={choose}
                  >
                    <span className="nav-item-number">0{index + 1}</span>
                    <span>{section}</span>
                    <span className="nav-item-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </nav>
              <div className="nav-panel-footer">
                <span className="status-dot" /> AVAILABLE FOR GOOD IDEAS{' '}
                <span>INDONESIA / UTC +7</span>
              </div>
            </div>
          </div>
        </div>
        <div className="nav-actions">
          <button
            type="button"
            className="command-button"
            onClick={onOpenConsole}
            aria-label="Open command palette"
          >
            ⌘ K
          </button>
          <a
            className="nav-contact-button"
            href={getWhatsAppLink('navbar')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              choose();
              track('contact_click', { channel: 'whatsapp', source: 'navbar' });
            }}
          >
            Let's talk <Arrow />
          </a>
        </div>
        <div className="nav-reading-track" aria-hidden="true">
          <div ref={progress} className="nav-reading-progress" />
        </div>
      </header>
    </>
  );
}
