import { memo } from 'react';

const MARQUEE_ITEMS = [
  'Web Design', '✦', 'Landing Page', '✦', 'E-Commerce', '✦',
  'Booking System', '✦', 'Portofolio', '✦', 'UI/UX Design', '✦',
  'React', '✦', 'Next.js', '✦', 'Framer Motion', '✦',
];

// ── Marquee band — decorative sketchbook element ─────────────────────────
export const SketchbookMarquee = memo(() => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // duplicate for seamless loop

  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid var(--paper-300)',
      borderBottom: '1px solid var(--paper-300)',
      background: 'var(--paper-200)',
      padding: '0.875rem 0',
      position: 'relative',
    }}>
      {/* Gradient fade masks */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '80px',
        background: 'linear-gradient(to right, var(--paper-200), transparent)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '80px',
        background: 'linear-gradient(to left, var(--paper-200), transparent)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Scrolling track */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        animation: 'marqueeScroll 30s linear infinite',
        width: 'max-content',
      }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: item === '✦' ? undefined : 'var(--font-mono)',
            fontStyle: item === '✦' ? undefined : undefined,
            fontSize: item === '✦' ? '0.5rem' : '0.75rem',
            letterSpacing: item === '✦' ? undefined : '0.1em',
            textTransform: 'uppercase',
            color: item === '✦' ? 'var(--accent-400)' : 'var(--ink-400)',
            whiteSpace: 'nowrap',
          }}>
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes marqueeScroll { from { transform: none; } to { transform: none; } }
        }
      `}</style>
    </div>
  );
});
SketchbookMarquee.displayName = 'SketchbookMarquee';

// ── Sketchbook page rule decoration ──────────────────────────────────────
export const PageRules = memo(({ side = 'left' }: { side?: 'left' | 'right' }) => (
  <div aria-hidden="true" style={{
    position: 'absolute',
    [side]: 0,
    top: '10%',
    bottom: '10%',
    width: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingBlock: '2rem',
    pointerEvents: 'none',
    opacity: 0.15,
    zIndex: 0,
  }}>
    {Array.from({ length: 40 }).map((_, i) => (
      <div key={i} style={{
        height: '1px',
        background: 'var(--ink-400)',
        width: side === 'left' ? '12px' : '8px',
        marginLeft: side === 'left' ? '0' : 'auto',
      }} />
    ))}
  </div>
));
PageRules.displayName = 'PageRules';
