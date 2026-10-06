import { memo } from 'react';
import { Eyebrow, SketchAnnotation, SketchStroke } from './utils';

export const HeroSection = memo(() => {
  return (
    <section
      id="home"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 'clamp(7rem, 12vw, 9.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        paddingInline: 'var(--container-px)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: 'var(--container-max)',
        marginInline: 'auto',
        width: '100%',
      }}
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '5%',
          top: '12%',
          width: 'clamp(280px, 45vw, 550px)',
          height: 'clamp(280px, 45vw, 550px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(168, 60, 40, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Annotations */}
      <SketchAnnotation
        text="vol. 01 — creative portfolio"
        style={{ position: 'absolute', top: '7.5rem', right: 'var(--container-px)' }}
        rotation={2}
      />
      <SketchAnnotation
        text="handcrafted web design studio"
        style={{ position: 'absolute', bottom: '5rem', left: 'var(--container-px)' }}
        rotation={-1}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Eyebrow accent>Web Design & Development Studio</Eyebrow>

        {/* Massive Editorial Headline */}
        <h1
          data-reveal
          style={{
            fontSize: 'clamp(3rem, 7.5vw, 6.75rem)',
            maxWidth: '15ch',
            marginBottom: '0.5rem',
            lineHeight: 1.05,
          }}
        >
          Desain Web{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>
            yang Berkesan
          </span>{' '}
          & Bertumbuh.
        </h1>

        <SketchStroke style={{ width: 'clamp(220px, 38vw, 440px)', marginBottom: '2rem' }} />

        {/* Subtitle */}
        <p
          data-reveal
          style={{
            maxWidth: '52ch',
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--ink-600)',
            lineHeight: 1.7,
            marginBottom: '2.75rem',
            fontWeight: 300,
          }}
        >
          Kami merancang dan membangun website premium dengan performa kilat, estetika berkelas, dan sistem fungsional seperti katalog produk hingga booking online yang siap pakai.
        </p>

        {/* Action Buttons (Island Architecture) */}
        <div data-reveal style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="#portfolio" className="island-btn">
            <span>Lihat Karya Portofolio</span>
            <span className="island-btn-icon">↓</span>
          </a>

          <a href="#sketchbook" className="island-btn-outline">
            <span>📖 Buka Blueprint Sketchbook</span>
          </a>

          <a href="#contact" className="island-btn-outline">
            <span>Konsultasi Proyek ↗</span>
          </a>
        </div>

        {/* Live Project Quick Strip */}
        <div
          data-reveal
          style={{
            marginTop: 'clamp(3rem, 6vw, 4.5rem)',
            paddingTop: '2rem',
            borderTop: '1px solid var(--paper-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--sage-500)',
              boxShadow: '0 0 0 3px rgba(78, 110, 83, 0.2)',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-500)' }}>
              4 Proyek Live Tersedia:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Contoh Catalog', href: 'https://contohcatalog.netlify.app/' },
              { label: 'Creative Agency', href: 'https://creativeagen.netlify.app/' },
              { label: 'Barbershop', href: 'https://barbershop-xi-eight.vercel.app/' },
              { label: 'Wedding System', href: 'https://weddingbookingsistem.vercel.app/' },
            ].map(p => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px',
                  background: 'var(--paper-50)',
                  border: '1px solid var(--paper-300)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--ink-700)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--ink-800)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--paper-300)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span>{p.label}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--ink-400)' }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
HeroSection.displayName = 'HeroSection';
