import {
  memo,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { PROJECTS } from '../data/content';
import {
  CoverPage,
  IntroPage,
  PortfolioIndexPage,
  ProjectPage,
  ServicesPage,
  ProcessPage,
  ContactPage,
  BackCoverPage,
} from './PageContents';

// ── All spreads data ──────────────────────────────────────────────────────
type SpreadDef = {
  id: string;
  label: string;
  left: ReactNode;
  right: ReactNode;
  isCover?: boolean;
};

function buildSpreads(): SpreadDef[] {
  return [
    {
      id: 'cover',
      label: 'Sampul',
      left: <CoverPage />,
      right: null,
      isCover: true,
    },
    {
      id: 'intro',
      label: 'Tentang & Index',
      left: <PortfolioIndexPage pageNum={2} />,
      right: <IntroPage pageNum={3} />,
    },
    {
      id: 'proj-0',
      label: 'Proyek I — Catalog',
      left: <ProjectPage project={PROJECTS[0]} pageNum={4} side="left" />,
      right: <ProjectPage project={PROJECTS[0]} pageNum={5} side="right" showUrl />,
    },
    {
      id: 'proj-1',
      label: 'Proyek II — Agency',
      left: <ProjectPage project={PROJECTS[1]} pageNum={6} side="left" />,
      right: <ProjectPage project={PROJECTS[1]} pageNum={7} side="right" showUrl />,
    },
    {
      id: 'proj-2',
      label: 'Proyek III — Barbershop',
      left: <ProjectPage project={PROJECTS[2]} pageNum={8} side="left" />,
      right: <ProjectPage project={PROJECTS[2]} pageNum={9} side="right" showUrl />,
    },
    {
      id: 'proj-3',
      label: 'Proyek IV — Wedding',
      left: <ProjectPage project={PROJECTS[3]} pageNum={10} side="left" />,
      right: <ProjectPage project={PROJECTS[3]} pageNum={11} side="right" showUrl />,
    },
    {
      id: 'services',
      label: 'Layanan & Proses',
      left: <ServicesPage pageNum={12} side="left" />,
      right: <ProcessPage pageNum={13} side="right" />,
    },
    {
      id: 'contact',
      label: 'Kontak & Penutup',
      left: <ContactPage pageNum={14} side="left" />,
      right: <BackCoverPage />,
    },
  ];
}

// ── Memoized: build once, never rebuild on re-render ─────────────────────
const SPREADS = buildSpreads();
const TOTAL = SPREADS.length;

// ══════════════════════════════════════════════════════════════════════════
// SINGLE PAGE WRAPPER
// ══════════════════════════════════════════════════════════════════════════
const Page = memo(({ children, radius }: { children: ReactNode; radius: string }) => (
  <div style={{
    position: 'absolute',
    inset: 0,
    borderRadius: radius,
    overflow: 'hidden',
    background: '#f0ebe0',
  }}>
    {children}
  </div>
));
Page.displayName = 'Page';

// ══════════════════════════════════════════════════════════════════════════
// MAGNIFYING GLASS
// Real zoom: renders the page content inside the lens at 2x scale,
// offset so the zoomed area matches cursor position.
// ══════════════════════════════════════════════════════════════════════════
interface MagGlassProps {
  children: ReactNode;       // same content as shown in the book
  bookW: number;
  bookH: number;
}

const LENS_D = 140; // lens diameter px
const ZOOM   = 2.3;

const MagnifyingGlass = memo(({ children, bookW, bookH }: MagGlassProps) => {
  const lensRef   = useRef<HTMLDivElement>(null);
  const innerRef  = useRef<HTMLDivElement>(null);
  const posRef    = useRef({ x: 150, y: 150 });
  const dragging  = useRef(false);

  // Apply position without triggering React re-render
  const commit = useCallback(() => {
    const lens  = lensRef.current;
    const inner = innerRef.current;
    if (!lens || !inner) return;
    const { x, y } = posRef.current;
    lens.style.left   = `${x - LENS_D / 2}px`;
    lens.style.top    = `${y - LENS_D / 2}px`;
    // The inner content is scaled ZOOM× from top-left of book.
    // Offset it so the area under the lens centre is centred inside lens.
    inner.style.left  = `${-(x * ZOOM - LENS_D / 2)}px`;
    inner.style.top   = `${-(y * ZOOM - LENS_D / 2)}px`;
  }, []);

  useEffect(() => { commit(); }, [commit]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.stopPropagation();
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const book = lensRef.current?.parentElement;
    if (!book) return;
    const rect = book.getBoundingClientRect();
    posRef.current = {
      x: Math.max(0, Math.min(bookW, e.clientX - rect.left)),
      y: Math.max(0, Math.min(bookH, e.clientY - rect.top)),
    };
    commit();
    e.stopPropagation();
  }, [bookW, bookH, commit]);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  return (
    <div
      ref={lensRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'absolute',
        width:  `${LENS_D}px`,
        height: `${LENS_D}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'grab',
        zIndex: 200,
        userSelect: 'none',
        touchAction: 'none',
        boxShadow: `
          0 0 0 3px rgba(240,235,224,0.95),
          0 0 0 5px rgba(43,35,24,0.30),
          0 0 0 7px rgba(240,235,224,0.65),
          0 14px 32px rgba(0,0,0,0.55),
          inset 0 1px 2px rgba(255,255,255,0.5)
        `,
      }}
    >
      {/* Zoomed content clone */}
      <div
        ref={innerRef}
        style={{
          position: 'absolute',
          width:  `${bookW}px`,
          height: `${bookH}px`,
          transform: `scale(${ZOOM})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
      {/* Glass sheen */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 32% 28%, rgba(255,255,255,0.28) 0%, transparent 55%)',
        pointerEvents: 'none',
      }}/>
      {/* Handle */}
      <div style={{
        position: 'absolute',
        bottom: '-32px', right: '-10px',
        width: '10px', height: '38px',
        borderRadius: '5px',
        background: 'linear-gradient(180deg,rgba(43,35,24,.45),rgba(43,35,24,.75))',
        transform: 'rotate(38deg)',
        transformOrigin: 'top center',
        boxShadow: '0 4px 10px rgba(0,0,0,.4)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
});
MagnifyingGlass.displayName = 'MagnifyingGlass';

// ══════════════════════════════════════════════════════════════════════════
// PROGRESS DOTS (memoized, stable callback via index)
// ══════════════════════════════════════════════════════════════════════════
interface DotsProps { total: number; current: number; onGoto: (i: number) => void; }

const ProgressDots = memo(({ total, current, onGoto }: DotsProps) => (
  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onGoto(i)}
        aria-label={`Spread ${i + 1}`}
        style={{
          width:  i === current ? '22px' : '6px',
          height: '6px',
          borderRadius: '3px',
          background: i === current ? 'rgba(240,235,224,.9)' : 'rgba(240,235,224,.22)',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          transition: 'all 400ms cubic-bezier(0.32,0.72,0,1)',
        }}
      />
    ))}
  </div>
));
ProgressDots.displayName = 'ProgressDots';

// ══════════════════════════════════════════════════════════════════════════
// MAIN SKETCHBOOK
// ══════════════════════════════════════════════════════════════════════════
export const Sketchbook = memo(() => {
  const [idx, setIdx]           = useState(0);
  const [animDir, setAnimDir]   = useState<'next' | 'prev' | null>(null);
  const [showLens, setShowLens] = useState(false);

  // Refs — don't cause re-renders
  const flipping    = useRef(false);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeStart  = useRef<{ x: number; y: number } | null>(null);
  const bookElRef   = useRef<HTMLDivElement>(null);
  const [bookSize, setBookSize] = useState({ w: 900, h: 560 });

  const current = SPREADS[idx];
  const next    = SPREADS[idx + 1];
  const prev    = SPREADS[idx - 1];
  const isCover = !!current.isCover;

  // ── Book size tracking ──────────────────────────────────────────────────
  useEffect(() => {
    const el = bookElRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setBookSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Core flip function ──────────────────────────────────────────────────
  const flip = useCallback((dir: 'next' | 'prev') => {
    if (flipping.current) return;
    if (dir === 'next' && idx >= TOTAL - 1) return;
    if (dir === 'prev' && idx <= 0) return;

    flipping.current = true;
    setAnimDir(dir);

    timerRef.current = setTimeout(() => {
      setIdx(i => i + (dir === 'next' ? 1 : -1));
      setAnimDir(null);
      flipping.current = false;
    }, 680);
  }, [idx]);

  const goNext = useCallback(() => flip('next'), [flip]);
  const goPrev = useCallback(() => flip('prev'), [flip]);
  const goTo   = useCallback((i: number) => {
    if (i === idx || flipping.current) return;
    flip(i > idx ? 'next' : 'prev');
    // For multi-step jump we just go one at a time; chain if needed
    // Here we directly jump (simpler UX)
    if (timerRef.current) clearTimeout(timerRef.current);
    flipping.current = true;
    setAnimDir(i > idx ? 'next' : 'prev');
    timerRef.current = setTimeout(() => {
      setIdx(i);
      setAnimDir(null);
      flipping.current = false;
    }, 680);
  }, [idx, flip]);

  const toggleLens = useCallback(() => setShowLens(v => !v), []);

  // ── Keyboard ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext();
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [goNext, goPrev]);

  // ── Swipe / Drag (pointer events — works on both mouse & touch) ─────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    swipeStart.current = null;
    // Only count horizontal swipes (not vertical scrolls)
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.8) return;
    if (dx < 0) goNext();
    else goPrev();
  }, [goNext, goPrev]);

  // ── Dimensions ────────────────────────────────────────────────────────
  const bookMaxW = isCover ? 420 : 900;

  // ── Current page content for lens ────────────────────────────────────
  const lensContent = isCover
    ? current.left
    : <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{current.left}</div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{current.right}</div>
      </div>;

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 38%, #3d3025 0%, #1e1710 55%, #0e0c09 100%)',
      padding: 'clamp(0.75rem,2vw,1.25rem)',
      gap: 0,
      overflow: 'hidden',
    }}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div style={{
        width: '100%',
        maxWidth: `${bookMaxW}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '10px',
        flexShrink: 0,
        transition: 'max-width 600ms cubic-bezier(0.32,0.72,0,1)',
        gap: '1rem',
      }}>
        {/* Brand */}
        <div style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontStyle: 'italic',
          fontSize: '1.1rem',
          color: 'rgba(240,235,224,.7)',
          letterSpacing: '-.01em',
          flexShrink: 0,
        }}>
          ridz<span style={{ color: '#8db894', fontStyle: 'normal', fontWeight: 700 }}>web</span>
        </div>

        {/* Section label */}
        <div style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: '.58rem',
          color: 'rgba(240,235,224,.28)',
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          textAlign: 'center',
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {current.label}
        </div>

        {/* Lens toggle */}
        <button
          onClick={toggleLens}
          title={showLens ? 'Sembunyikan kaca pembesar' : 'Aktifkan kaca pembesar'}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '4px 11px',
            borderRadius: '999px',
            border: `1px solid ${showLens ? 'rgba(141,184,148,.5)' : 'rgba(240,235,224,.15)'}`,
            background: showLens ? 'rgba(141,184,148,.12)' : 'rgba(240,235,224,.05)',
            color: showLens ? '#8db894' : 'rgba(240,235,224,.4)',
            fontFamily: "'DM Mono',monospace",
            fontSize: '.58rem',
            letterSpacing: '.07em',
            cursor: 'pointer',
            transition: 'all 300ms ease',
            flexShrink: 0,
          }}
        >
          🔍 {showLens ? 'Kaca ON' : 'Kaca'}
        </button>
      </div>

      {/* ── Book container ──────────────────────────────────────────── */}
      <div
        ref={bookElRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: `${bookMaxW}px`,
          flex: '1 1 0',
          minHeight: 0,
          transition: 'max-width 600ms cubic-bezier(0.32,0.72,0,1)',
          // Realistic book shadow
          filter: 'drop-shadow(0 36px 72px rgba(0,0,0,.75)) drop-shadow(0 6px 18px rgba(0,0,0,.5))',
          // perspective for 3D
          perspective: '2200px',
          touchAction: 'pan-y',
        }}
      >
        {/* ════════════════════════════════════════════════════════
            LAYER A: "behind" — next/prev spread (visible through
            the turning page during animation)
        ════════════════════════════════════════════════════════ */}
        {animDir && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex',
            borderRadius: '4px',
            overflow: 'hidden',
            zIndex: 1,
          }}>
            {animDir === 'next' && next ? (
              isCover ? (
                <Page radius="6px"><>{next.left}</></Page>
              ) : (
                <>
                  <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '6px 0 0 6px' }}>
                    {next.left}
                  </div>
                  <div style={{
                    position: 'absolute', left: '50%', top: 0, bottom: 0, width: '10px',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(to right,rgba(43,35,24,.18),rgba(43,35,24,.04),rgba(43,35,24,.18))',
                    zIndex: 5, pointerEvents: 'none',
                  }}/>
                  <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '0 6px 6px 0' }}>
                    {next.right}
                  </div>
                </>
              )
            ) : animDir === 'prev' && prev ? (
              <>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '6px 0 0 6px' }}>
                  {prev.left}
                </div>
                <div style={{
                  position: 'absolute', left: '50%', top: 0, bottom: 0, width: '10px',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(to right,rgba(43,35,24,.18),rgba(43,35,24,.04),rgba(43,35,24,.18))',
                  zIndex: 5, pointerEvents: 'none',
                }}/>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '0 6px 6px 0' }}>
                  {prev.right}
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            LAYER B: current spread — the "flipping" half animates
        ════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          zIndex: 2,
        }}>
          {/* ── Left side ── */}
          <div style={{
            flex: isCover ? '1 1 100%' : '1 1 50%',
            position: 'relative',
            height: '100%',
            transformOrigin: 'right center',
            // When going PREV: left page is the one that flips (appears to fold right)
            transform: animDir === 'prev'
              ? 'perspective(2200px) rotateY(45deg) scaleX(0.85)'
              : 'none',
            transition: animDir === 'prev'
              ? 'transform 680ms cubic-bezier(0.77,0,0.175,1)'
              : animDir === null
              ? 'transform 680ms cubic-bezier(0.32,0.72,0,1)'
              : 'none',
            willChange: 'transform',
            zIndex: animDir === 'prev' ? 10 : 2,
            borderRadius: isCover ? '6px' : '6px 0 0 6px',
            overflow: 'hidden',
            boxShadow: !isCover ? 'inset -6px 0 14px rgba(43,35,24,.1)' : undefined,
          }}>
            {current.left}

            {/* Flip shadow during animation */}
            {animDir === 'prev' && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '6px 0 0 6px',
                background: 'linear-gradient(to right, transparent 40%, rgba(43,35,24,.22))',
                pointerEvents: 'none',
              }}/>
            )}

            {/* Prev corner hot zone */}
            {!isCover && (
              <button
                onClick={goPrev}
                disabled={idx === 0}
                aria-label="Halaman sebelumnya"
                style={{
                  position: 'absolute', bottom: 0, left: 0,
                  width: '64px', height: '64px',
                  background: 'transparent', border: 'none',
                  cursor: idx === 0 ? 'default' : 'pointer',
                  opacity: idx === 0 ? 0 : 1,
                  zIndex: 20,
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
                  padding: '8px',
                  transition: 'opacity 300ms ease',
                }}
              >
                <svg viewBox="0 0 32 32" width="28" height="28">
                  <path d="M28 28 L4 28 L4 4" fill="none" stroke="rgba(43,35,24,.2)" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M8 24 L4 28 L8 28" fill="none" stroke="rgba(43,35,24,.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* ── Spine ── */}
          {!isCover && (
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: '10px', transform: 'translateX(-50%)',
              background: 'linear-gradient(to right,rgba(43,35,24,.18),rgba(43,35,24,.04),rgba(43,35,24,.18))',
              zIndex: 15, pointerEvents: 'none',
            }}/>
          )}

          {/* ── Right side ── */}
          {!isCover && (
            <div style={{
              flex: '1 1 50%',
              position: 'relative',
              height: '100%',
              transformOrigin: 'left center',
              // When going NEXT: right page is the one that flips (appears to fold left)
              transform: animDir === 'next'
                ? 'perspective(2200px) rotateY(-45deg) scaleX(0.85)'
                : 'none',
              transition: animDir === 'next'
                ? 'transform 680ms cubic-bezier(0.77,0,0.175,1)'
                : animDir === null
                ? 'transform 680ms cubic-bezier(0.32,0.72,0,1)'
                : 'none',
              willChange: 'transform',
              zIndex: animDir === 'next' ? 10 : 2,
              borderRadius: '0 6px 6px 0',
              overflow: 'hidden',
              boxShadow: 'inset 6px 0 14px rgba(43,35,24,.08)',
            }}>
              {current.right}

              {/* Flip shadow during animation */}
              {animDir === 'next' && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '0 6px 6px 0',
                  background: 'linear-gradient(to left, transparent 40%, rgba(43,35,24,.22))',
                  pointerEvents: 'none',
                }}/>
              )}

              {/* Next corner hot zone */}
              <button
                onClick={goNext}
                disabled={idx === TOTAL - 1}
                aria-label="Halaman berikutnya"
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '64px', height: '64px',
                  background: 'transparent', border: 'none',
                  cursor: idx === TOTAL - 1 ? 'default' : 'pointer',
                  opacity: idx === TOTAL - 1 ? 0 : 1,
                  zIndex: 20,
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                  padding: '8px',
                  transition: 'opacity 300ms ease',
                }}
              >
                <svg viewBox="0 0 32 32" width="28" height="28">
                  <path d="M4 28 L28 28 L28 4" fill="none" stroke="rgba(43,35,24,.2)" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M24 24 L28 28 L24 28" fill="none" stroke="rgba(43,35,24,.35)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Cover: next corner */}
          {isCover && (
            <button
              onClick={goNext}
              aria-label="Buka buku"
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '72px', height: '72px',
                background: 'transparent', border: 'none',
                cursor: 'pointer', zIndex: 20,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                padding: '10px',
              }}
            >
              <svg viewBox="0 0 32 32" width="28" height="28">
                <path d="M4 28 L28 28 L28 4" fill="none" stroke="rgba(240,235,224,.25)" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M24 24 L28 28 L24 28" fill="none" stroke="rgba(240,235,224,.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* ── Magnifying glass overlay ── */}
        {showLens && bookSize.w > 0 && (
          <MagnifyingGlass bookW={bookSize.w} bookH={bookSize.h}>
            {lensContent}
          </MagnifyingGlass>
        )}
      </div>

      {/* ── Bottom nav ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: `${bookMaxW}px`,
        paddingTop: '10px',
        flexShrink: 0,
        gap: '1rem',
        transition: 'max-width 600ms cubic-bezier(0.32,0.72,0,1)',
      }}>
        <button
          onClick={goPrev}
          disabled={idx === 0}
          style={{
            padding: '5px 13px',
            borderRadius: '999px',
            border: '1px solid rgba(240,235,224,.14)',
            background: 'transparent',
            color: idx === 0 ? 'rgba(240,235,224,.18)' : 'rgba(240,235,224,.55)',
            fontFamily: "'DM Mono',monospace",
            fontSize: '.58rem',
            letterSpacing: '.07em',
            cursor: idx === 0 ? 'default' : 'pointer',
            transition: 'all 300ms ease',
          }}
        >← Sebelumnya</button>

        <ProgressDots total={TOTAL} current={idx} onGoto={goTo} />

        <button
          onClick={goNext}
          disabled={idx === TOTAL - 1}
          style={{
            padding: '5px 13px',
            borderRadius: '999px',
            border: '1px solid rgba(240,235,224,.14)',
            background: idx === TOTAL - 1 ? 'transparent' : 'rgba(240,235,224,.07)',
            color: idx === TOTAL - 1 ? 'rgba(240,235,224,.18)' : 'rgba(240,235,224,.65)',
            fontFamily: "'DM Mono',monospace",
            fontSize: '.58rem',
            letterSpacing: '.07em',
            cursor: idx === TOTAL - 1 ? 'default' : 'pointer',
            transition: 'all 300ms ease',
          }}
        >Berikutnya →</button>
      </div>

      {/* Keyboard hint */}
      <div style={{
        fontFamily: "'DM Mono',monospace",
        fontSize: '.48rem',
        color: 'rgba(240,235,224,.13)',
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        marginTop: '6px',
        flexShrink: 0,
      }}>
        ← → geser · klik sudut halaman
      </div>
    </div>
  );
});
Sketchbook.displayName = 'Sketchbook';
