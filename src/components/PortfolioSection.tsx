import { memo, useState, useCallback } from 'react';
import { Eyebrow, SketchAnnotation, SketchStroke } from './utils';

export interface PortfolioItem {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  url: string;
  tags: string[];
  accent: string;
  features: string[];
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'catalog',
    number: '01',
    title: 'Contoh Catalog',
    category: 'E-Commerce / Katalog',
    year: '2024',
    description:
      'Website katalog produk modern dengan UI bersih, navigasi cepat, filter kategori intuitif, dan tampilan etalase produk yang meningkatkan konversi penjualan.',
    url: 'https://contohcatalog.netlify.app/',
    tags: ['React', 'Katalog', 'Responsive', 'Tailwind'],
    accent: '#4e6e53',
    features: ['Filter Kategori Real-Time', 'Modal Detail Produk Cepat', 'Integrasi WhatsApp Checkout'],
  },
  {
    id: 'creative-agency',
    number: '02',
    title: 'Creative Agency Studio',
    category: 'Agency / Studio',
    year: '2024',
    description:
      'Landing page agensi digital dengan koreografi animasi kinetik, showcase portofolio interaktif, dan citra visual mewah untuk menarik klien korporat & brand premium.',
    url: 'https://creativeagen.netlify.app/',
    tags: ['Motion UI', 'Agency', 'Branding', 'Awwwards'],
    accent: '#a83c28',
    features: ['Smooth Page Scroll Dynamics', 'Cinematic Typography', 'Interaksi Hover Magnetik'],
  },
  {
    id: 'barbershop',
    number: '03',
    title: 'Barbershop Online Booking',
    category: 'Bisnis Lokal / Booking',
    year: '2024',
    description:
      'Platform website barbershop terintegrasi dengan reservasi kursi potong online real-time, galeri gaya rambut, paket harga transparan, dan jadwal barber.',
    url: 'https://barbershop-xi-eight.vercel.app/',
    tags: ['Online Booking', 'Kalender Slot', 'Bisnis Lokal'],
    accent: '#9a6a3e',
    features: ['Pemilihan Jam & Kursi Real-Time', 'Notifikasi Booking Langsung', 'Galeri Portofolio Model'],
  },
  {
    id: 'wedding',
    number: '04',
    title: 'Wedding Booking & RSVP System',
    category: 'Event / Wedding',
    year: '2024',
    description:
      'Sistem pemesanan paket wedding dan manajemen reservasi acara pernikahan. Dilengkapi kalender tanggal interaktif, galeri venue estetik, dan sistem konfirmasi tamu.',
    url: 'https://weddingbookingsistem.vercel.app/',
    tags: ['Wedding Platform', 'RSVP & Booking', 'Admin Ready'],
    accent: '#6b5c8a',
    features: ['Manajemen Tanggal & Kuota Acara', 'Kalkulator Paket Wedding', 'Konfirmasi WhatsApp Otomatis'],
  },
];

const CATEGORIES = [
  'Semua',
  'E-Commerce / Katalog',
  'Agency / Studio',
  'Bisnis Lokal / Booking',
  'Event / Wedding',
];

// ── PortfolioCard — Memoized child component (Strict Rule 4) ─────────────
interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
}

const PortfolioCard = memo(({ item, index }: PortfolioCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <article
      data-reveal
      style={{
        transitionDelay: `${index * 80}ms`,
        display: 'grid',
        gridTemplateColumns: isEven ? '1fr 1.15fr' : '1.15fr 1fr',
        gap: 'clamp(2rem, 5vw, 4rem)',
        alignItems: 'center',
        padding: 'clamp(1.75rem, 4vw, 3rem)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--paper-50)',
        border: '1px solid var(--paper-300)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 500ms var(--ease-fluid), border-color 500ms var(--ease-fluid)',
      }}
      className="portfolio-card"
    >
      {/* Subtle Radial Ambient Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          ...(isEven ? { right: '-8%', top: '-15%' } : { left: '-8%', bottom: '-15%' }),
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${item.accent}14 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content Side ── */}
      <div style={{ order: isEven ? 1 : 2, position: 'relative', zIndex: 1 }}>
        {/* Category & Year Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-500)',
          marginBottom: '1rem',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--paper-200)',
            border: '1px solid var(--paper-300)',
            color: 'var(--ink-700)',
            fontWeight: 700,
          }}>
            {item.number}
          </span>
          <span>{item.category}</span>
          <span style={{ color: 'var(--paper-400)' }}>•</span>
          <span>{item.year}</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'clamp(1.65rem, 3vw, 2.4rem)',
          color: 'var(--ink-900)',
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}>
          {item.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.925rem',
          color: 'var(--ink-600)',
          lineHeight: 1.7,
          marginBottom: '1.5rem',
          maxWidth: '48ch',
        }}>
          {item.description}
        </p>

        {/* Key Features Pill */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          marginBottom: '1.75rem',
        }}>
          {item.features.map(feat => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--ink-700)' }}>
              <span style={{ color: item.accent, fontWeight: 700, fontSize: '0.75rem' }}>✓</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Tech Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '2rem' }}>
          {item.tags.map(tag => (
            <span
              key={tag}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                background: 'var(--paper-200)',
                border: '1px solid var(--paper-300)',
                color: 'var(--ink-600)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Button-in-Button Island CTA (High-End Visual Design rule) */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="island-btn"
          title={`Buka live demo ${item.title}`}
        >
          <span>Lihat Live Demo</span>
          <span className="island-btn-icon">↗</span>
        </a>
      </div>

      {/* ── Mockup / Live Preview Side (Double-Bezel Architecture) ── */}
      <div style={{ order: isEven ? 2 : 1, position: 'relative', zIndex: 1 }}>
        <div className="double-bezel">
          <div className="double-bezel-inner" style={{ aspectRatio: '16/10', position: 'relative', background: '#f5f0e8' }}>
            {/* Browser Window Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: 'rgba(233, 224, 206, 0.9)',
              borderBottom: '1px solid rgba(43, 35, 24, 0.1)',
            }}>
              {['#e8816b', '#d4c27a', '#8db894'].map(c => (
                <span
                  key={c}
                  style={{
                    display: 'block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: c,
                  }}
                />
              ))}

              <div style={{
                flex: 1,
                height: '18px',
                borderRadius: '4px',
                background: '#ffffff',
                border: '1px solid rgba(43, 35, 24, 0.1)',
                display: 'flex',
                alignItems: 'center',
                paddingInline: '8px',
                marginLeft: '6px',
                overflow: 'hidden',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: 'var(--ink-400)',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}>
                  🔒 {item.url.replace('https://', '')}
                </span>
              </div>
            </div>

            {/* Live iframe Preview */}
            <iframe
              src={item.url}
              title={item.title}
              loading="lazy"
              style={{
                width: '200%',
                height: '200%',
                border: 'none',
                transform: 'scale(0.5)',
                transformOrigin: 'top left',
                pointerEvents: 'none',
              }}
            />

            {/* Click to open overlay */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(24, 21, 18, 0)',
                transition: 'background 300ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(24, 21, 18, 0.4)';
                const badge = e.currentTarget.querySelector('.preview-badge') as HTMLElement;
                if (badge) badge.style.opacity = '1';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(24, 21, 18, 0)';
                const badge = e.currentTarget.querySelector('.preview-badge') as HTMLElement;
                if (badge) badge.style.opacity = '0';
              }}
            >
              <div
                className="preview-badge"
                style={{
                  opacity: 0,
                  transition: 'opacity 300ms ease',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  background: 'var(--paper-50)',
                  color: 'var(--ink-900)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                Buka Website Langsung ↗
              </div>
            </a>
          </div>
        </div>

        {/* Small Annotation */}
        <div style={{
          position: 'absolute',
          bottom: '-1.5rem',
          right: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          color: 'var(--ink-400)',
        }}>
          live preview render ↑
        </div>
      </div>
    </article>
  );
});
PortfolioCard.displayName = 'PortfolioCard';

// ── CategoryFilter — Isolated Filter Component (Strict Rule 1 & 4) ────────
interface CategoryFilterProps {
  active: string;
  onChange: (cat: string) => void;
}

const CategoryFilter = memo(({ active, onChange }: CategoryFilterProps) => (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
  }}>
    {CATEGORIES.map(cat => {
      const isSelected = active === cat;
      return (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          style={{
            padding: '0.45rem 1.1rem',
            borderRadius: '999px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            border: `1.5px solid ${isSelected ? 'var(--ink-800)' : 'var(--paper-300)'}`,
            background: isSelected ? 'var(--ink-800)' : 'var(--paper-50)',
            color: isSelected ? 'var(--paper-50)' : 'var(--ink-600)',
            transition: 'all 300ms var(--ease-fluid)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {cat}
        </button>
      );
    })}
  </div>
));
CategoryFilter.displayName = 'CategoryFilter';

// ── PortfolioSection Main Component ───────────────────────────────────────
export const PortfolioSection = memo(() => {
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Strict Rule 2: Handlers wrapped in useCallback
  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  const filteredItems = activeCategory === 'Semua'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="section">
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <Eyebrow accent>Karya Nyata Kami</Eyebrow>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <h2 data-reveal style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                marginBottom: '0.5rem',
              }}>
                Portofolio Proyek{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>Terpilih</em>
              </h2>
              <p data-reveal style={{ color: 'var(--ink-500)', maxWidth: '52ch', fontSize: '1rem' }}>
                Koleksi website live yang telah kami rancang dan bangun — mencakup e-commerce, landing page agensi, sistem reservasi barbershop, dan platform wedding.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <SketchAnnotation
                text={`${PORTFOLIO_ITEMS.length} proyek siap dicoba live`}
                rotation={-1}
              />
              <SketchStroke style={{ width: '160px', marginTop: '0.25rem' }} />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />

        {/* Projects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2.5rem, 5vw, 4rem)' }}>
          {filteredItems.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .portfolio-card {
            grid-template-columns: 1fr !important;
          }
          .portfolio-card > div:first-child,
          .portfolio-card > div:last-child {
            order: unset !important;
          }
        }
      `}</style>
    </section>
  );
});
PortfolioSection.displayName = 'PortfolioSection';
