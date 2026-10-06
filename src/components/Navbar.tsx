import { memo, useState, useCallback, useRef, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '#home' },
  { label: 'Portofolio', href: '#portfolio' },
  { label: 'Workflow Sketchbook', href: '#sketchbook' },
  { label: 'Layanan', href: '#services' },
  { label: 'Tentang', href: '#about' },
  { label: 'Kontak', href: '#contact' },
];

// ── NavLink — memoized child component ────────────────────────────────────
interface NavLinkProps {
  item: NavItem;
  index: number;
  isOpen: boolean;
  onClose: () => void;
}

const NavLink = memo(({ item, index, isOpen, onClose }: NavLinkProps) => {
  const delay = 60 + index * 50;
  return (
    <a
      href={item.href}
      onClick={onClose}
      style={{
        display: 'block',
        fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        color: 'var(--paper-50)',
        lineHeight: 1.15,
        transform: isOpen ? 'translateY(0)' : 'translateY(2rem)',
        opacity: isOpen ? 1 : 0,
        transition: `transform 600ms cubic-bezier(0.32,0.72,0,1) ${delay}ms, opacity 500ms ease ${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {item.label}
      <span style={{
        display: 'inline-block',
        marginLeft: '0.5rem',
        fontSize: '0.45em',
        fontFamily: 'var(--font-mono)',
        fontStyle: 'normal',
        verticalAlign: 'super',
        color: 'var(--accent-300)',
      }}>
        0{index + 1}
      </span>
    </a>
  );
});
NavLink.displayName = 'NavLink';

// ── HamburgerButton — isolated click handler ─────────────────────────────
interface HamburgerProps {
  isOpen: boolean;
  onToggle: () => void;
}

const HamburgerButton = memo(({ isOpen, onToggle }: HamburgerProps) => (
  <button
    onClick={onToggle}
    aria-label="Buka menu navigasi"
    style={{
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      position: 'relative',
      zIndex: 1001,
      background: 'transparent',
    }}
  >
    <span style={{
      display: 'block',
      width: '20px',
      height: '1.5px',
      background: isOpen ? 'var(--paper-50)' : 'var(--ink-900)',
      borderRadius: '2px',
      transform: isOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none',
      transition: 'transform 300ms ease, background 200ms ease',
    }} />
    <span style={{
      display: 'block',
      width: '20px',
      height: '1.5px',
      background: isOpen ? 'var(--paper-50)' : 'var(--ink-900)',
      borderRadius: '2px',
      transform: isOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none',
      transition: 'transform 300ms ease, background 200ms ease',
    }} />
  </button>
));
HamburgerButton.displayName = 'HamburgerButton';

// ── Floating Navbar Island ────────────────────────────────────────────────
export const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Strict Rule 3: Use useRef for tracking scroll without unnecessary reflow
  const lastScrollYRef = useRef(0);

  // Strict Rule 2: All handlers wrapped in useCallback
  const handleToggle = useCallback(() => setIsOpen(v => !v), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const isPast = y > 50;
      if (isPast !== (lastScrollYRef.current > 50)) {
        setScrolled(isPast);
      }
      lastScrollYRef.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when overlay open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          padding: '0.5rem 0.65rem 0.5rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          background: scrolled
            ? 'rgba(253, 251, 247, 0.9)'
            : 'rgba(253, 251, 247, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(218, 205, 181, 0.65)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          transition: 'box-shadow 400ms ease, background 400ms ease',
          width: 'min(94vw, 760px)',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#home"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.25rem',
            color: 'var(--ink-900)',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          ridz<span style={{ color: 'var(--accent-500)' }}>web</span>
        </a>

        {/* Desktop Links */}
        <div
          style={{
            display: 'flex',
            gap: '0.2rem',
            alignItems: 'center',
          }}
          className="nav-desktop-links"
        >
          {NAV_ITEMS.slice(0, 5).map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'var(--ink-600)',
                transition: 'background 250ms ease, color 250ms ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--paper-200)';
                e.currentTarget.style.color = 'var(--ink-900)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--ink-600)';
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right Action + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <a
            href="#contact"
            className="island-btn"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Hubungi</span>
            <span className="island-btn-icon" style={{ width: '1.4rem', height: '1.4rem', fontSize: '0.7rem' }}>
              ↗
            </span>
          </a>

          <HamburgerButton isOpen={isOpen} onToggle={handleToggle} />
        </div>
      </nav>

      {/* Fullscreen Mobile Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 998,
          background: 'rgba(24, 21, 18, 0.95)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--container-px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 400ms var(--ease-fluid)',
        }}
      >
        <div style={{ maxWidth: '640px', marginInline: 'auto', width: '100%' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent-300)',
            marginBottom: '2rem',
          }}>
            Navigasi Portofolio
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3.5rem' }}>
            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item.href}
                item={item}
                index={i}
                isOpen={isOpen}
                onClose={handleClose}
              />
            ))}
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'rgba(253, 251, 247, 0.4)',
          }}>
            ridzweb.studio — Web Design & Booking Systems Indonesia
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .nav-desktop-links { display: none !important; }
        }
      `}</style>
    </>
  );
});
Navbar.displayName = 'Navbar';
