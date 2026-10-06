import { memo, useEffect, useRef, useState, useCallback } from 'react';

// ── useScrollReveal hook ─────────────────────────────────────────────────
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

// ── Sketchbook decorative strokes (SVG) ──────────────────────────────────
export const SketchStroke = memo(({ style }: { style?: React.CSSProperties }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 200 12"
    fill="none"
    style={{ display: 'block', overflow: 'visible', ...style }}
  >
    <path
      d="M2 8 C30 3, 60 10, 100 6 S160 3, 198 7"
      stroke="var(--paper-400)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M10 9 C40 5, 80 11, 120 7 S175 4, 196 8"
      stroke="var(--paper-300)"
      strokeWidth="0.8"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
  </svg>
));
SketchStroke.displayName = 'SketchStroke';

// ── Section eyebrow tag ──────────────────────────────────────────────────
interface EyebrowProps {
  children: React.ReactNode;
  accent?: boolean;
}

export const Eyebrow = memo(({ children, accent = false }: EyebrowProps) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.3rem 0.85rem',
    borderRadius: '999px',
    fontSize: '0.6875rem',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-mono)',
    border: `1px solid ${accent ? 'var(--accent-200)' : 'var(--paper-400)'}`,
    color: accent ? 'var(--accent-600)' : 'var(--ink-500)',
    background: accent ? 'var(--accent-100)' : 'var(--paper-200)',
    marginBottom: '1.25rem',
  }}>
    <span style={{
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: accent ? 'var(--accent-400)' : 'var(--ink-400)',
      flexShrink: 0,
    }} />
    {children}
  </div>
));
Eyebrow.displayName = 'Eyebrow';

// ── Floating sketchbook annotation ───────────────────────────────────────
interface AnnotationProps {
  text: string;
  style?: React.CSSProperties;
  rotation?: number;
}

export const SketchAnnotation = memo(({ text, style, rotation = -3 }: AnnotationProps) => (
  <div style={{
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6875rem',
    color: 'var(--ink-400)',
    transform: `rotate(${rotation}deg)`,
    letterSpacing: '0.02em',
    pointerEvents: 'none',
    userSelect: 'none',
    ...style,
  }}>
    {text}
  </div>
));
SketchAnnotation.displayName = 'SketchAnnotation';

// ── Scroll-aware counter ─────────────────────────────────────────────────
interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export const StatCounter = memo(({ value, suffix = '', label }: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate();
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 700,
        color: 'var(--ink-800)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        color: 'var(--ink-500)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginTop: '0.5rem',
      }}>
        {label}
      </div>
    </div>
  );
});
StatCounter.displayName = 'StatCounter';
