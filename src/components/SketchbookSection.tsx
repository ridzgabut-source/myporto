import { memo, useRef, useState, useCallback, useEffect } from 'react';
import { Eyebrow, SketchAnnotation } from './utils';

// ── SketchbookSection ─────────────────────────────────────────────────────
// Renders the actual Meng To Singapore Sketchbook HTML dengan
// halaman yang bisa dibalik + kaca pembesar + zoom controls
// via iframe, tapi dibungkus dalam UI portofolio yang branded.

export const SketchbookSection = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fade-in iframe on load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Sync fullscreen state when user presses Escape
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <section
      id="sketchbook"
      style={{
        paddingBlock: 'clamp(5rem, 10vw, 9rem)',
        background: 'var(--paper-200)',
        borderTop: '1px solid var(--paper-300)',
        borderBottom: '1px solid var(--paper-300)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background blob */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        left: '-10%',
        top: '20%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-100) 0%, transparent 70%)',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '2rem',
          flexWrap: 'wrap',
          marginBottom: 'clamp(2rem, 5vw, 3.5rem)',
        }}>
          <div>
            <Eyebrow accent>Sketchbook Interaktif</Eyebrow>
            <h2
              data-reveal
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--ink-800)',
              }}
            >
              Buka Lembaran{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>
                Sketchbook
              </em>
            </h2>
            <p
              data-reveal
              style={{
                marginTop: '0.75rem',
                maxWidth: '52ch',
                color: 'var(--ink-500)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
              }}
            >
              Inspirasi desain kami berakar dari estetika sketchbook — lembut, tekstural, dan penuh detail.
              Jelajahi langsung: balik halaman, gunakan kaca pembesar, dan rasakan pengalaman buku yang sesungguhnya.
            </p>
          </div>

          {/* Feature chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
            {[
              { icon: '📖', label: 'Balik Halaman' },
              { icon: '🔍', label: 'Kaca Pembesar' },
              { icon: '🎨', label: '9 Ilustrasi Plates' },
            ].map(f => (
              <div key={f.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid var(--paper-400)',
                background: 'var(--paper-100)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink-600)',
                letterSpacing: '0.06em',
              }}>
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sketchbook Frame ── */}
        <div
          ref={wrapperRef}
          style={{
            position: 'relative',
          }}
        >
          {/* Double-bezel outer shell */}
          <div style={{
            background: 'rgba(26,21,16,0.05)',
            border: '1px solid rgba(26,21,16,0.12)',
            padding: '8px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            {/* Inner core with browser chrome */}
            <div style={{
              borderRadius: 'calc(var(--radius-lg) - 8px)',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6)',
              background: '#ece7dc',
            }}>
              {/* Browser-style title bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '10px 16px',
                background: 'rgba(236,231,220,0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(43,39,33,0.1)',
              }}>
                {/* Traffic lights */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {['#e8816b', '#d4c27a', '#8db894'].map(c => (
                    <span key={c} style={{
                      display: 'block', width: '10px', height: '10px',
                      borderRadius: '50%', background: c,
                    }} />
                  ))}
                </div>

                {/* URL bar */}
                <div style={{
                  flex: 1,
                  height: '22px',
                  borderRadius: '6px',
                  background: 'rgba(43,39,33,0.06)',
                  border: '1px solid rgba(43,39,33,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingInline: '10px',
                  gap: '6px',
                  maxWidth: '380px',
                  margin: '0 auto',
                }}>
                  <span style={{ fontSize: '0.55rem', color: 'rgba(43,39,33,0.4)' }}>🔒</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'rgba(43,39,33,0.5)',
                    letterSpacing: '0.02em',
                  }}>
                    ridzweb.studio / sketchbook
                  </span>
                </div>

                {/* Fullscreen button */}
                <button
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Keluar fullscreen' : 'Fullscreen'}
                  title={isFullscreen ? 'Keluar fullscreen (Esc)' : 'Buka fullscreen'}
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(43,39,33,0.15)',
                    background: 'rgba(43,39,33,0.05)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'rgba(43,39,33,0.6)',
                    cursor: 'pointer',
                    transition: 'all 300ms ease',
                    letterSpacing: '0.06em',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.background = 'rgba(43,39,33,0.12)';
                    el.style.color = 'rgba(43,39,33,0.9)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.background = 'rgba(43,39,33,0.05)';
                    el.style.color = 'rgba(43,39,33,0.6)';
                  }}
                >
                  {isFullscreen ? '⊠ Keluar' : '⊞ Fullscreen'}
                </button>
              </div>

              {/* The actual sketchbook iframe */}
              <div style={{ position: 'relative' }}>
                {/* Loading shimmer */}
                {!isLoaded && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#ece7dc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    zIndex: 10,
                    minHeight: '600px',
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: '2px solid rgba(43,39,33,0.1)',
                      borderTopColor: 'rgba(43,39,33,0.4)',
                      animation: 'sketchbookSpin 1s linear infinite',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'rgba(43,39,33,0.4)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>
                      Membuka Sketchbook…
                    </span>
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  src="/landing-pages/meng-to-sketchbook.html"
                  title="Singapore Sketchbook — Meng To"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="eager"
                  onLoad={handleLoad}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'clamp(500px, 70vh, 820px)',
                    border: 'none',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 600ms cubic-bezier(0.32,0.72,0,1)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Decorative annotations around the frame */}
          <SketchAnnotation
            text="← seret kaca pembesar"
            style={{ position: 'absolute', bottom: '-2rem', left: '2rem', fontSize: '0.65rem' }}
            rotation={-1}
          />
          <SketchAnnotation
            text="klik sudut halaman untuk membalik →"
            style={{ position: 'absolute', bottom: '-2rem', right: '2rem', fontSize: '0.65rem', textAlign: 'right' }}
            rotation={1}
          />
        </div>

        {/* ── Instruction cards ── */}
        <div
          data-reveal
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: 'clamp(2rem, 4vw, 3rem)',
          }}
        >
          {[
            {
              icon: '📖',
              title: 'Balik Halaman',
              desc: 'Klik pojok kanan/kiri bawah halaman untuk membalik seperti buku sungguhan.',
            },
            {
              icon: '🔍',
              title: 'Kaca Pembesar',
              desc: 'Seret kaca pembesar ke manapun untuk memperbesar detail ilustrasi secara real-time.',
            },
            {
              icon: '🔎',
              title: 'Zoom Controls',
              desc: 'Gunakan tombol +/− di pojok kanan bawah untuk mengatur tingkat zoom keseluruhan.',
            },
            {
              icon: '📑',
              title: 'Index Editorial',
              desc: 'Scroll ke bawah untuk menemukan indeks editorial dengan daftar semua halaman.',
            },
          ].map((tip, i) => (
            <div
              key={tip.title}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--paper-300)',
                background: 'var(--paper-100)',
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{tip.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                color: 'var(--ink-800)',
                marginBottom: '0.35rem',
                fontWeight: 400,
              }}>
                {tip.title}
              </div>
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--ink-500)',
                lineHeight: 1.6,
              }}>
                {tip.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes sketchbookSpin {
          to { transform: rotate(360deg); }
        }
        /* Fullscreen mode: expand iframe height */
        :fullscreen #sketchbook iframe,
        :-webkit-full-screen #sketchbook iframe {
          height: calc(100vh - 44px) !important;
        }
        :fullscreen .container,
        :-webkit-full-screen .container {
          max-width: none !important;
          padding-inline: 0 !important;
        }
      `}</style>
    </section>
  );
});
SketchbookSection.displayName = 'SketchbookSection';
