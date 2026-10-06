import { memo } from 'react';
import { PROJECTS, SERVICES_DATA, PROCESS_STEPS, type PortfolioProject } from '../data/content';

// ── Shared paper page wrapper ─────────────────────────────────────────────
const PAGE_BASE: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--paper)',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
};

// ── Decorative ruled lines (notebook lines) ───────────────────────────────
const RuledLines = memo(({ count = 18, startY = 120 }: { count?: number; startY?: number }) => (
  <svg
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.18 }}
    preserveAspectRatio="none"
  >
    {Array.from({ length: count }).map((_, i) => (
      <line
        key={i}
        x1="32" y1={startY + i * 28} x2="calc(100% - 32px)" y2={startY + i * 28}
        stroke="var(--earth)"
        strokeWidth="0.5"
      />
    ))}
  </svg>
));
RuledLines.displayName = 'RuledLines';

// ── Left margin red rule ──────────────────────────────────────────────────
const MarginRule = memo(() => (
  <div aria-hidden="true" style={{
    position: 'absolute',
    left: '52px',
    top: 0,
    bottom: 0,
    width: '1.5px',
    background: 'rgba(168,60,40,0.22)',
    pointerEvents: 'none',
  }} />
));
MarginRule.displayName = 'MarginRule';

// ── Page number stamp ─────────────────────────────────────────────────────
const PageNum = memo(({ n, side = 'right' }: { n: number; side?: 'left' | 'right' }) => (
  <div style={{
    position: 'absolute',
    bottom: '18px',
    [side]: '24px',
    fontFamily: 'var(--f-mono)',
    fontSize: '0.6rem',
    color: 'var(--ink-faint)',
    letterSpacing: '0.1em',
  }}>
    — {n} —
  </div>
));
PageNum.displayName = 'PageNum';

// ── Sketchbook hand-annotation style text ────────────────────────────────
const Annotation = memo(({ text, style }: { text: string; style?: React.CSSProperties }) => (
  <span style={{
    fontFamily: 'var(--f-mono)',
    fontSize: '0.6rem',
    color: 'var(--ink-faint)',
    letterSpacing: '0.06em',
    display: 'block',
    ...style,
  }}>
    {text}
  </span>
));
Annotation.displayName = 'Annotation';

// ══════════════════════════════════════════════════════════════════════════
// PAGE CONTENT COMPONENTS
// ══════════════════════════════════════════════════════════════════════════

// ── COVER (halaman sampul) ────────────────────────────────────────────────
export const CoverPage = memo(() => (
  <div style={{
    ...PAGE_BASE,
    background: 'var(--ink)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  }}>
    {/* Botanical corner art (SVG) */}
    <svg aria-hidden="true" viewBox="0 0 280 400" style={{
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '55%',
      opacity: 0.12,
      pointerEvents: 'none',
    }}>
      <path d="M280 400 Q200 300 240 200 Q280 100 220 0" stroke="var(--paper)" strokeWidth="1.5" fill="none"/>
      <path d="M260 360 Q180 280 200 180 Q220 80 160 20" stroke="var(--paper)" strokeWidth="1" fill="none"/>
      <ellipse cx="220" cy="200" rx="40" ry="60" stroke="var(--paper)" strokeWidth="0.8" fill="none" transform="rotate(-20 220 200)"/>
      <ellipse cx="200" cy="150" rx="30" ry="45" stroke="var(--paper)" strokeWidth="0.8" fill="none" transform="rotate(15 200 150)"/>
      <ellipse cx="240" cy="280" rx="35" ry="50" stroke="var(--paper)" strokeWidth="0.8" fill="none" transform="rotate(-10 240 280)"/>
    </svg>

    {/* Corner label */}
    <div style={{
      position: 'absolute',
      top: '28px',
      left: '28px',
      fontFamily: 'var(--f-mono)',
      fontSize: '0.55rem',
      color: 'rgba(240,235,224,0.3)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      lineHeight: 1.8,
    }}>
      portofolio<br />vol. 2024
    </div>

    {/* Main title */}
    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 2rem' }}>
      <div style={{
        fontFamily: 'var(--f-mono)',
        fontSize: '0.6rem',
        color: 'rgba(141,184,148,0.8)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: '1.25rem',
      }}>
        ✦ studio kreatif ✦
      </div>
      <div style={{
        fontFamily: 'var(--f-display)',
        fontStyle: 'italic',
        fontSize: 'clamp(2.8rem, 6vw, 5rem)',
        color: 'var(--paper)',
        lineHeight: 1.0,
        letterSpacing: '-0.02em',
        marginBottom: '0.5rem',
      }}>
        ridz
      </div>
      <div style={{
        fontFamily: 'var(--f-display)',
        fontSize: 'clamp(2.8rem, 6vw, 5rem)',
        color: 'var(--sage-light)',
        lineHeight: 1.0,
        letterSpacing: '-0.02em',
        fontWeight: 700,
        marginBottom: '2rem',
      }}>
        web
      </div>
      {/* Decorative separator */}
      <svg viewBox="0 0 120 8" style={{ width: '120px', margin: '0 auto 1.5rem', display: 'block' }}>
        <path d="M4 4 C20 1, 45 7, 60 4 S100 1, 116 4" stroke="rgba(240,235,224,0.3)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </svg>
      <div style={{
        fontFamily: 'var(--f-sans)',
        fontSize: '0.8rem',
        color: 'rgba(240,235,224,0.45)',
        letterSpacing: '0.08em',
        lineHeight: 1.6,
      }}>
        Jasa Pembuatan Website Premium
      </div>
    </div>

    {/* Bottom instruction */}
    <div style={{
      position: 'absolute',
      bottom: '22px',
      right: '28px',
      fontFamily: 'var(--f-mono)',
      fontSize: '0.55rem',
      color: 'rgba(240,235,224,0.25)',
      letterSpacing: '0.1em',
      textAlign: 'right',
    }}>
      klik sudut untuk membalik →
    </div>
  </div>
));
CoverPage.displayName = 'CoverPage';

// ── INTRO / about me page ─────────────────────────────────────────────────
export const IntroPage = memo(({ pageNum }: { pageNum: number }) => (
  <div style={{ ...PAGE_BASE, padding: '32px 36px 32px 64px', overflowY: 'auto' }}>
    <RuledLines />
    <MarginRule />
    <PageNum n={pageNum} side="right" />

    {/* Header */}
    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: '0.58rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)',
      marginBottom: '16px',
    }}>
      tentang kami — 01
    </div>

    <h2 style={{
      fontFamily: 'var(--f-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
      fontWeight: 400,
      color: 'var(--ink)',
      lineHeight: 1.15,
      letterSpacing: '-0.01em',
      marginBottom: '6px',
    }}>
      Halo, saya{' '}
      <span style={{ color: 'var(--sage)', fontStyle: 'normal', fontWeight: 700 }}>Ridz</span>
    </h2>
    <div style={{
      fontFamily: 'var(--f-sans)',
      fontSize: '0.75rem',
      color: 'var(--ink-faint)',
      marginBottom: '20px',
    }}>
      Web Designer & Developer — Indonesia
    </div>

    {/* Horizontal rule sketch */}
    <svg viewBox="0 0 200 6" style={{ width: '160px', marginBottom: '20px', display: 'block' }}>
      <path d="M2 3 C30 1, 70 5, 100 3 S160 1, 198 3" stroke="var(--earth)" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.4"/>
    </svg>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
      {[
        'Saya membangun website yang tidak hanya indah secara visual, tetapi juga berfungsi optimal untuk bisnis Anda.',
        'Dengan pengalaman 3+ tahun, saya telah menyelesaikan 30+ proyek — dari landing page sederhana hingga sistem booking yang kompleks.',
        'Setiap project saya kerjakan dengan penuh perhatian pada detail: tipografi yang tepat, animasi yang halus, dan performa yang cepat.',
      ].map((p, i) => (
        <p key={i} style={{
          fontFamily: 'var(--f-sans)',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          lineHeight: 1.7,
        }}>
          {p}
        </p>
      ))}
    </div>

    {/* Skill chips */}
    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: '0.55rem',
      letterSpacing: '0.1em',
      color: 'var(--ink-faint)',
      textTransform: 'uppercase',
      marginBottom: '8px',
    }}>
      teknologi
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
      {['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Figma', 'Node.js', 'SEO'].map(s => (
        <span key={s} style={{
          padding: '3px 10px',
          borderRadius: '999px',
          fontSize: '0.6rem',
          fontFamily: 'var(--f-mono)',
          border: '1px solid var(--hairline)',
          color: 'var(--ink-soft)',
          background: 'rgba(43,35,24,0.04)',
          letterSpacing: '0.06em',
        }}>
          {s}
        </span>
      ))}
    </div>

    {/* Stats mini */}
    <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--hairline)', paddingTop: '16px' }}>
      {[
        { n: '30+', label: 'Proyek' },
        { n: '3+', label: 'Tahun' },
        { n: '100%', label: 'Puas' },
      ].map(st => (
        <div key={st.label}>
          <div style={{
            fontFamily: 'var(--f-display)',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--ink)',
            lineHeight: 1,
          }}>{st.n}</div>
          <div style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '0.55rem',
            color: 'var(--ink-faint)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}>{st.label}</div>
        </div>
      ))}
    </div>

    <Annotation text="→ lihat portofolio di halaman berikutnya" style={{ marginTop: '16px' }} />
  </div>
));
IntroPage.displayName = 'IntroPage';

// ── PORTFOLIO INDEX (daftar isi proyek) ───────────────────────────────────
export const PortfolioIndexPage = memo(({ pageNum }: { pageNum: number }) => (
  <div style={{ ...PAGE_BASE, padding: '32px 36px 32px 36px', overflowY: 'auto' }}>
    <RuledLines startY={80} />
    <PageNum n={pageNum} side="left" />

    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: '0.58rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)',
      marginBottom: '16px',
    }}>
      portofolio — index
    </div>

    <h2 style={{
      fontFamily: 'var(--f-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(1.4rem, 3vw, 2rem)',
      fontWeight: 400,
      color: 'var(--ink)',
      marginBottom: '24px',
      lineHeight: 1.2,
    }}>
      Karya <em style={{ color: 'var(--sage)' }}>Terpilih</em>
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {PROJECTS.map((p, i) => (
        <div key={p.id} style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '12px',
          padding: '10px 0',
          borderBottom: '1px dashed var(--hairline)',
        }}>
          <span style={{
            fontFamily: 'var(--f-display)',
            fontStyle: 'italic',
            fontSize: '1rem',
            color: p.colorAccent,
            minWidth: '28px',
          }}>{p.number}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--f-display)',
              fontSize: '0.95rem',
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}>{p.title}</div>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '0.55rem',
              color: 'var(--ink-faint)',
              letterSpacing: '0.06em',
              marginTop: '2px',
            }}>{p.category}</div>
          </div>
          <div style={{
            borderBottom: '1px dotted var(--hairline)',
            flex: '0 0 40px',
            height: '1px',
            marginBottom: '4px',
          }} />
          <span style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '0.6rem',
            color: 'var(--ink-faint)',
          }}>hal. {(i + 1) * 2 + 2}</span>
        </div>
      ))}
    </div>

    {/* Decoration */}
    <svg viewBox="0 0 60 60" style={{ position: 'absolute', bottom: '32px', right: '24px', width: '50px', opacity: 0.1 }}>
      <circle cx="30" cy="30" r="28" stroke="var(--ink)" strokeWidth="0.8" fill="none"/>
      <circle cx="30" cy="30" r="20" stroke="var(--ink)" strokeWidth="0.5" fill="none"/>
      <line x1="30" y1="2" x2="30" y2="58" stroke="var(--ink)" strokeWidth="0.5"/>
      <line x1="2" y1="30" x2="58" y2="30" stroke="var(--ink)" strokeWidth="0.5"/>
    </svg>
  </div>
));
PortfolioIndexPage.displayName = 'PortfolioIndexPage';

// ── PROJECT PAGE ──────────────────────────────────────────────────────────
interface ProjectPageProps {
  project: PortfolioProject;
  pageNum: number;
  side: 'left' | 'right';
  showUrl?: boolean;
}

export const ProjectPage = memo(({ project, pageNum, side, showUrl }: ProjectPageProps) => (
  <div style={{
    ...PAGE_BASE,
    padding: side === 'right' ? '32px 36px 40px 52px' : '32px 52px 40px 36px',
    overflowY: 'auto',
    borderLeft: side === 'right' ? '1px solid rgba(43,35,24,0.08)' : undefined,
    borderRight: side === 'left' ? '1px solid rgba(43,35,24,0.08)' : undefined,
  }}>
    <RuledLines startY={90} count={14} />
    {side === 'right' && <MarginRule />}
    <PageNum n={pageNum} side={side} />

    {/* Project number */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '16px',
    }}>
      <span style={{
        fontFamily: 'var(--f-display)',
        fontStyle: 'italic',
        fontSize: '2.5rem',
        color: project.colorAccent,
        lineHeight: 1,
        opacity: 0.8,
      }}>{project.number}</span>
      <div style={{
        fontFamily: 'var(--f-mono)',
        fontSize: '0.55rem',
        color: 'var(--ink-faint)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        lineHeight: 1.6,
      }}>
        {project.category}<br/>{project.year}
      </div>
    </div>

    <h3 style={{
      fontFamily: 'var(--f-display)',
      fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
      fontWeight: 400,
      color: 'var(--ink)',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      marginBottom: '12px',
    }}>
      {project.title}
    </h3>

    {/* Sketch underline */}
    <svg viewBox="0 0 180 5" style={{ width: '140px', display: 'block', marginBottom: '14px' }}>
      <path d="M2 3 C30 1, 70 4, 90 2.5 S150 1, 178 3" stroke={project.colorAccent} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
    </svg>

    <p style={{
      fontFamily: 'var(--f-sans)',
      fontSize: '0.8rem',
      color: 'var(--ink-soft)',
      lineHeight: 1.75,
      marginBottom: '16px',
    }}>
      {project.description}
    </p>

    {/* Tags */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '18px' }}>
      {project.tags.map(tag => (
        <span key={tag} style={{
          padding: '2px 8px',
          borderRadius: '3px',
          fontSize: '0.55rem',
          fontFamily: 'var(--f-mono)',
          letterSpacing: '0.08em',
          border: `1px solid ${project.colorAccent}40`,
          color: project.colorAccent,
          background: `${project.colorAccent}0f`,
        }}>
          {tag}
        </span>
      ))}
    </div>

    {/* Decorative browser mockup */}
    {showUrl && (
      <div style={{
        border: '1px solid var(--hairline)',
        borderRadius: '6px',
        overflow: 'hidden',
        background: 'var(--paper-warm)',
        marginBottom: '14px',
      }}>
        {/* Mini browser bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 8px',
          background: 'var(--paper-deep)',
          borderBottom: '1px solid var(--hairline)',
        }}>
          {[project.colorAccent + 'cc', '#d4c27acc', '#8db894cc'].map((c, i) => (
            <span key={i} style={{
              display: 'block', width: '6px', height: '6px',
              borderRadius: '50%', background: c,
            }}/>
          ))}
          <span style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '0.5rem',
            color: 'var(--ink-faint)',
            marginLeft: '6px',
          }}>{project.url.replace('https://', '')}</span>
        </div>
        {/* URL as link */}
        <div style={{ padding: '10px 12px' }}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '0.6rem',
              color: project.colorAccent,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Buka Live Demo ↗
          </a>
        </div>
      </div>
    )}

    {/* Hand-sketched corner deco */}
    <svg viewBox="0 0 80 80" style={{
      position: 'absolute',
      bottom: '28px',
      [side === 'right' ? 'right' : 'left']: '20px',
      width: '60px',
      opacity: 0.07,
      pointerEvents: 'none',
    }}>
      <rect x="5" y="5" width="70" height="70" rx="4" stroke="var(--ink)" strokeWidth="0.8" fill="none"/>
      <rect x="12" y="12" width="56" height="56" rx="2" stroke="var(--ink)" strokeWidth="0.5" fill="none"/>
      <line x1="5" y1="40" x2="75" y2="40" stroke="var(--ink)" strokeWidth="0.4"/>
      <line x1="40" y1="5" x2="40" y2="75" stroke="var(--ink)" strokeWidth="0.4"/>
    </svg>
  </div>
));
ProjectPage.displayName = 'ProjectPage';

// ── SERVICES PAGE ─────────────────────────────────────────────────────────
export const ServicesPage = memo(({ pageNum, side }: { pageNum: number; side: 'left' | 'right' }) => (
  <div style={{
    ...PAGE_BASE,
    padding: side === 'right' ? '32px 36px 40px 56px' : '32px 56px 40px 36px',
    overflowY: 'auto',
  }}>
    <RuledLines startY={100} count={16} />
    {side === 'right' && <MarginRule />}
    <PageNum n={pageNum} side={side} />

    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: '0.58rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)',
      marginBottom: '14px',
    }}>
      layanan — 05
    </div>

    <h2 style={{
      fontFamily: 'var(--f-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)',
      fontWeight: 400,
      color: 'var(--ink)',
      marginBottom: '20px',
      lineHeight: 1.15,
    }}>
      Yang Bisa Saya <em style={{ color: 'var(--sage)' }}>Bantu</em>
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {SERVICES_DATA.map(svc => (
        <div key={svc.title} style={{
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid var(--hairline)',
          background: 'rgba(255,255,255,0.35)',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1rem',
                color: 'var(--sage)',
                fontFamily: 'var(--f-mono)',
                lineHeight: 1,
              }}>{svc.icon}</span>
              <span style={{
                fontFamily: 'var(--f-display)',
                fontSize: '0.95rem',
                color: 'var(--ink)',
                fontWeight: 400,
              }}>{svc.title}</span>
            </div>
            <span style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '0.55rem',
              color: 'var(--earth)',
              letterSpacing: '0.06em',
              background: 'rgba(154,106,62,0.1)',
              padding: '2px 6px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
            }}>{svc.price}</span>
          </div>
          <p style={{
            fontFamily: 'var(--f-sans)',
            fontSize: '0.7rem',
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
          }}>{svc.desc}</p>
        </div>
      ))}
    </div>
  </div>
));
ServicesPage.displayName = 'ServicesPage';

// ── PROCESS PAGE ──────────────────────────────────────────────────────────
export const ProcessPage = memo(({ pageNum, side }: { pageNum: number; side: 'left' | 'right' }) => (
  <div style={{
    ...PAGE_BASE,
    padding: side === 'right' ? '32px 36px 40px 56px' : '32px 56px 40px 36px',
    overflowY: 'auto',
  }}>
    <RuledLines startY={100} count={20} />
    {side === 'right' && <MarginRule />}
    <PageNum n={pageNum} side={side} />

    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: '0.58rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)',
      marginBottom: '14px',
    }}>
      alur kerja — 06
    </div>

    <h2 style={{
      fontFamily: 'var(--f-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)',
      fontWeight: 400,
      color: 'var(--ink)',
      marginBottom: '20px',
      lineHeight: 1.15,
    }}>
      Cara <em style={{ color: 'var(--sage)' }}>Pesan</em>
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {PROCESS_STEPS.map((step, i) => (
        <div key={step.num} style={{
          display: 'flex',
          gap: '12px',
          position: 'relative',
          paddingBottom: i < PROCESS_STEPS.length - 1 ? '16px' : 0,
        }}>
          {/* Timeline dot + line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1.5px solid var(--hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--f-mono)',
              fontSize: '0.5rem',
              color: 'var(--ink-soft)',
              background: 'var(--paper)',
              flexShrink: 0,
              zIndex: 1,
            }}>{step.num}</div>
            {i < PROCESS_STEPS.length - 1 && (
              <div style={{
                width: '1px',
                flex: 1,
                background: 'linear-gradient(to bottom, var(--hairline), transparent)',
                minHeight: '20px',
              }}/>
            )}
          </div>
          {/* Content */}
          <div style={{ paddingTop: '2px', paddingBottom: i < PROCESS_STEPS.length - 1 ? '8px' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{
                fontFamily: 'var(--f-display)',
                fontSize: '0.85rem',
                color: 'var(--ink)',
                fontWeight: 400,
              }}>{step.title}</span>
              <span style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '0.5rem',
                color: 'var(--earth)',
                background: 'rgba(154,106,62,0.1)',
                padding: '1px 6px',
                borderRadius: '3px',
                letterSpacing: '0.06em',
              }}>{step.duration}</span>
            </div>
            <p style={{
              fontFamily: 'var(--f-sans)',
              fontSize: '0.7rem',
              color: 'var(--ink-soft)',
              lineHeight: 1.6,
            }}>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
));
ProcessPage.displayName = 'ProcessPage';

// ── CONTACT PAGE ──────────────────────────────────────────────────────────
export const ContactPage = memo(({ pageNum, side }: { pageNum: number; side: 'left' | 'right' }) => (
  <div style={{
    ...PAGE_BASE,
    padding: side === 'right' ? '32px 36px 40px 56px' : '32px 56px 40px 36px',
    overflowY: 'auto',
  }}>
    <RuledLines startY={100} count={18} />
    {side === 'right' && <MarginRule />}
    <PageNum n={pageNum} side={side} />

    <div style={{
      fontFamily: 'var(--f-mono)',
      fontSize: '0.58rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--ink-faint)',
      marginBottom: '14px',
    }}>
      kontak — 07
    </div>

    <h2 style={{
      fontFamily: 'var(--f-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)',
      fontWeight: 400,
      color: 'var(--ink)',
      marginBottom: '8px',
      lineHeight: 1.15,
    }}>
      Mari <em style={{ color: 'var(--sage)' }}>Mulai</em>
    </h2>
    <p style={{
      fontFamily: 'var(--f-sans)',
      fontSize: '0.75rem',
      color: 'var(--ink-soft)',
      lineHeight: 1.65,
      marginBottom: '20px',
    }}>
      Punya proyek yang ingin diwujudkan? Ceritakan kepada saya dan saya akan respons dalam 24 jam.
    </p>

    {/* Contact options */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
      {[
        { icon: '✉', label: 'Email', value: 'hello@ridzweb.studio', href: 'mailto:hello@ridzweb.studio' },
        { icon: '💬', label: 'WhatsApp', value: '+62 812-3456-7890', href: 'https://wa.me/6281234567890' },
        { icon: '🌐', label: 'Website', value: 'ridzweb.studio', href: '#' },
      ].map(c => (
        <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--hairline)',
            background: 'rgba(255,255,255,0.35)',
            textDecoration: 'none',
            transition: 'background 300ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(92,122,94,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)'; }}
        >
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.icon}</span>
          <div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.5rem', color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--f-sans)', fontSize: '0.75rem', color: 'var(--sage)', fontWeight: 500 }}>{c.value}</div>
          </div>
        </a>
      ))}
    </div>

    {/* Quick CTA */}
    <a
      href="https://wa.me/6281234567890"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '999px',
        background: 'var(--ink)',
        color: 'var(--paper)',
        fontFamily: 'var(--f-sans)',
        fontSize: '0.75rem',
        fontWeight: 600,
        transition: 'transform 400ms ease, background 300ms ease',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--sage)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--ink)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      💬 Chat via WhatsApp
    </a>

    <Annotation text="respons dalam 24 jam, siap konsultasi gratis" style={{ marginTop: '12px', textAlign: 'center' }} />
  </div>
));
ContactPage.displayName = 'ContactPage';

// ── BACK COVER ────────────────────────────────────────────────────────────
export const BackCoverPage = memo(() => (
  <div style={{
    ...PAGE_BASE,
    background: 'var(--ink)',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <svg aria-hidden="true" viewBox="0 0 200 300" style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '55%',
      opacity: 0.08,
      pointerEvents: 'none',
    }}>
      <path d="M0 300 Q80 200 40 100 Q0 0 60 -20" stroke="var(--paper)" strokeWidth="1.5" fill="none"/>
      <ellipse cx="50" cy="150" rx="35" ry="55" stroke="var(--paper)" strokeWidth="0.8" fill="none" transform="rotate(15 50 150)"/>
      <ellipse cx="30" cy="80" rx="25" ry="40" stroke="var(--paper)" strokeWidth="0.8" fill="none" transform="rotate(-10 30 80)"/>
    </svg>

    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 2rem' }}>
      <div style={{
        fontFamily: 'var(--f-display)',
        fontStyle: 'italic',
        fontSize: '1.2rem',
        color: 'rgba(240,235,224,0.4)',
        marginBottom: '16px',
      }}>
        — terima kasih —
      </div>
      <svg viewBox="0 0 80 8" style={{ width: '80px', margin: '0 auto 16px', display: 'block' }}>
        <path d="M2 4 C16 1, 36 7, 40 4 S65 1, 78 4" stroke="rgba(240,235,224,0.2)" strokeWidth="1" fill="none"/>
      </svg>
      <div style={{
        fontFamily: 'var(--f-display)',
        fontStyle: 'italic',
        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
        color: 'var(--paper)',
        lineHeight: 1.2,
      }}>
        ridzweb
      </div>
      <div style={{
        fontFamily: 'var(--f-mono)',
        fontSize: '0.55rem',
        color: 'rgba(240,235,224,0.3)',
        letterSpacing: '0.12em',
        marginTop: '8px',
      }}>
        WEB DESIGN STUDIO · INDONESIA
      </div>
    </div>
  </div>
));
BackCoverPage.displayName = 'BackCoverPage';
