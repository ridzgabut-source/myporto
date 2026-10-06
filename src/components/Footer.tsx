import { memo, useCallback } from 'react';
import { SketchStroke } from './utils';

export const Footer = memo(() => {
  const year = new Date().getFullYear();

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer style={{
      background: 'var(--ink-950)',
      color: 'var(--paper-100)',
      paddingTop: 'clamp(3.5rem, 7vw, 6rem)',
      paddingBottom: 'clamp(2rem, 4vw, 3rem)',
      paddingInline: 'var(--container-px)',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 'var(--container-max)', marginInline: 'auto' }}>
        {/* Top Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          marginBottom: 'clamp(3rem, 6vw, 4.5rem)',
        }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 2', minWidth: '240px' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
            }}>
              ridz<span style={{ color: 'var(--accent-400)' }}>web</span>
            </div>
            <SketchStroke style={{ width: '130px', marginBottom: '1.25rem', opacity: 0.5 }} />
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(250, 247, 240, 0.55)',
              maxWidth: '36ch',
              lineHeight: 1.7,
            }}>
              Studio web design & pembuatan sistem digital premium di Indonesia. Membantu brand bertumbuh dengan pengalaman digital tak terlupakan.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
              {[
                { label: 'GitHub', href: 'https://github.com', text: 'GitHub' },
                { label: 'WhatsApp', href: 'https://wa.me/6281234567890', text: 'WhatsApp' },
                { label: 'Email', href: 'mailto:hello@ridzweb.studio', text: 'Email' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(250, 247, 240, 0.15)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'rgba(250, 247, 240, 0.65)',
                    transition: 'all 250ms ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-400)';
                    e.currentTarget.style.color = 'var(--accent-400)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(250, 247, 240, 0.15)';
                    e.currentTarget.style.color = 'rgba(250, 247, 240, 0.65)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {s.text} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(250, 247, 240, 0.4)',
              marginBottom: '1.25rem',
            }}>
              Navigasi Halaman
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { label: 'Beranda', href: '#home' },
                { label: 'Portofolio Proyek', href: '#portfolio' },
                { label: 'Workflow Sketchbook', href: '#sketchbook' },
                { label: 'Layanan & Biaya', href: '#services' },
                { label: 'Tentang Studio', href: '#about' },
                { label: 'Konsultasi Kontak', href: '#contact' },
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(250, 247, 240, 0.65)',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--paper-100)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250, 247, 240, 0.65)'; }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Live Projects Quick Access */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(250, 247, 240, 0.4)',
              marginBottom: '1.25rem',
            }}>
              Karya Pilihan
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { name: 'Contoh Catalog', url: 'https://contohcatalog.netlify.app/' },
                { name: 'Creative Agency', url: 'https://creativeagen.netlify.app/' },
                { name: 'Barbershop Online', url: 'https://barbershop-xi-eight.vercel.app/' },
                { name: 'Wedding Booking', url: 'https://weddingbookingsistem.vercel.app/' },
              ].map(p => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(250, 247, 240, 0.65)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'color 200ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-300)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250, 247, 240, 0.65)'; }}
                >
                  <span>{p.name}</span>
                  <span style={{ fontSize: '0.7rem' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(250, 247, 240, 0.08)',
          marginBottom: '1.75rem',
        }} />

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'rgba(250, 247, 240, 0.4)',
          }}>
            © {year} RidzWeb Studio. Hak Cipta Dilindungi Undang-Undang.
          </span>

          <button
            onClick={handleScrollTop}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'rgba(250, 247, 240, 0.6)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--paper-100)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250, 247, 240, 0.6)'; }}
          >
            <span>Kembali ke Atas</span>
            <span>↑</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child > div:first-child { grid-column: 1 !important; }
        }
      `}</style>
    </footer>
  );
});
Footer.displayName = 'Footer';
