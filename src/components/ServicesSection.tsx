import { memo } from 'react';
import { Eyebrow, SketchStroke } from './utils';

interface ServiceItem {
  number: string;
  title: string;
  priceTag: string;
  description: string;
  features: string[];
  tags: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    number: '01',
    title: 'Landing Page Premium',
    priceTag: 'Mulai 500rb',
    description:
      'Halaman tunggal yang dioptimasi untuk rasio konversi tinggi. Sangat cocok untuk peluncuran produk baru, campaign iklan, atau personal brand.',
    features: ['Mobile First Responsive', 'Animasi Halus & Interaktif', 'Integrasi WhatsApp Checkout Langsung'],
    tags: ['Konversi Tinggi', 'Cepat & Ringan', 'SEO Friendly'],
  },
  {
    number: '02',
    title: 'Website Profil Bisnis',
    priceTag: 'Mulai 1.5jt',
    description:
      'Website multi-halaman berkelas untuk memperkuat reputasi, kredibilitas, dan profesionalisme bisnis Anda di mata klien dan investor.',
    features: ['Halaman Tentang, Layanan & Kontak', 'CMS Pengelolaan Konten Mudah', 'Domain .com / .id Gratis 1 Tahun'],
    tags: ['Branding Korporat', 'Multi-Halaman', 'Dashboard Admin'],
  },
  {
    number: '03',
    title: 'E-Commerce & Katalog Online',
    priceTag: 'Mulai 3jt',
    description:
      'Etalase toko digital lengkap dengan filter kategori, keranjang belanja, integrasi WhatsApp order, atau payment gateway otomatis.',
    features: ['Manajemen Produk & Stok', 'Checkout Otomatis via QRIS / VA', 'Perhitungan Ongkos Kirim'],
    tags: ['Toko Online', 'Katalog Digital', 'Payment Gateway'],
  },
  {
    number: '04',
    title: 'Sistem Reservasi & Booking Online',
    priceTag: 'Mulai 2jt',
    description:
      'Solusi reservasi mandiri untuk barbershop, klinik, studio foto, wedding, dan restoran. Bebas bentrok jadwal dengan konfirmasi otomatis.',
    features: ['Kalender Slot & Jam Real-Time', 'Notifikasi Pengingat WhatsApp', 'Manajemen Kuota & Jadwal Staf'],
    tags: ['Booking System', 'Kalender Otomatis', 'Notifikasi WA'],
  },
  {
    number: '05',
    title: 'Portofolio Kreatif & Studio',
    priceTag: 'Mulai 1.2jt',
    description:
      'Showcase karya berkelas tinggi untuk fotografer, desainer, arsitek, dan agensi yang ingin tampil unik dan memukau klien internasional.',
    features: ['Galeri Interaktif & Lightbox', 'Visual Estetik & Tipografi Elegan', 'Kecepatan Loading Maksimal'],
    tags: ['Karya Kreatif', 'Awwwards Quality', 'Custom Motion'],
  },
  {
    number: '06',
    title: 'Maintenance & Optimasi Kecepatan',
    priceTag: 'Mulai 300rb/bln',
    description:
      'Layanan pemeliharaan rutin, backup data, pembaruan keamanan, dan optimasi Core Web Vitals agar website selalu prima 24/7.',
    features: ['Laporan Kinerja Bulanan', 'Backup Rutin Cloud', 'Dukungan Teknis Prioritas'],
    tags: ['Garansi Aman', 'Kecepatan 100', 'Monitoring 24/7'],
  },
];

// ── ServiceCard — Memoized Child Component (Strict Rule 4) ────────────────
interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

const ServiceCard = memo(({ service, index }: ServiceCardProps) => {
  return (
    <div
      data-reveal
      style={{
        transitionDelay: `${index * 60}ms`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 3vw, 2.25rem)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--paper-50)',
        border: '1px solid var(--paper-300)',
        boxShadow: 'var(--shadow-hairline)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 400ms var(--ease-fluid), border-color 400ms ease, box-shadow 400ms ease',
      }}
      className="service-card"
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'var(--ink-700)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--paper-300)';
        e.currentTarget.style.boxShadow = 'var(--shadow-hairline)';
      }}
    >
      <div>
        {/* Number & Price Tag Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-500)',
            letterSpacing: '0.1em',
          }}>
            {service.number} //
          </span>

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'var(--paper-200)',
            border: '1px solid var(--paper-300)',
            color: 'var(--ink-800)',
            fontWeight: 600,
          }}>
            {service.priceTag}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.35rem',
          color: 'var(--ink-900)',
          marginBottom: '0.75rem',
          lineHeight: 1.25,
        }}>
          {service.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--ink-600)',
          lineHeight: 1.65,
          marginBottom: '1.5rem',
        }}>
          {service.description}
        </p>

        {/* Features Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {service.features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--ink-700)' }}>
              <span style={{ color: 'var(--sage-500)', fontWeight: 700 }}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Footer */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.35rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--paper-200)',
      }}>
        {service.tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.625rem',
              fontFamily: 'var(--font-mono)',
              background: 'var(--paper-200)',
              color: 'var(--ink-500)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
});
ServiceCard.displayName = 'ServiceCard';

// ── SERVICES SECTION COMPONENT ────────────────────────────────────────────
export const ServicesSection = memo(() => {
  return (
    <section id="services" className="section" style={{
      background: 'var(--paper-100)',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
          <Eyebrow accent>Layanan & Paket Solusi</Eyebrow>
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
                Layanan Pengembangan Web{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>Terpadu</em>
              </h2>
              <p data-reveal style={{ color: 'var(--ink-500)', maxWidth: '54ch', fontSize: '1rem' }}>
                Dari halaman tunggal konversi kilat hingga platform reservasi dan e-commerce lengkap, kami sesuaikan dengan anggaran dan tujuan bisnis Anda.
              </p>
            </div>

            <a href="#contact" className="island-btn">
              <span>Konsultasikan Paket</span>
              <span className="island-btn-icon">→</span>
            </a>
          </div>
          <SketchStroke style={{ width: '220px', marginTop: '1.25rem' }} />
        </div>

        {/* Grid of Service Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
          gap: 'clamp(1rem, 2vw, 1.5rem)',
        }}>
          {SERVICES_DATA.map((service, i) => (
            <ServiceCard key={service.number} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});
ServicesSection.displayName = 'ServicesSection';
