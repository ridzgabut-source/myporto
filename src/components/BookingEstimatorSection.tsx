import { memo, useState, useCallback, useMemo } from 'react';
import { Eyebrow, SketchAnnotation, SketchStroke } from './utils';

interface PackageOption {
  id: string;
  name: string;
  basePrice: number;
  duration: string;
  desc: string;
}

interface FeatureAddon {
  id: string;
  name: string;
  price: number;
  desc: string;
}

const PACKAGE_OPTIONS: PackageOption[] = [
  {
    id: 'landing',
    name: 'Landing Page Premium',
    basePrice: 500000,
    duration: '2–3 Hari',
    desc: '1 Halaman konversi tinggi untuk promosi produk atau campaign iklan.',
  },
  {
    id: 'company',
    name: 'Website Profil Bisnis',
    basePrice: 1500000,
    duration: '5–7 Hari',
    desc: '3–5 Halaman profesional (Home, About, Services, Gallery, Contact).',
  },
  {
    id: 'booking',
    name: 'Sistem Reservasi & Booking',
    basePrice: 2000000,
    duration: '7–10 Hari',
    desc: 'Kalender slot real-time untuk barbershop, klinik, salon, atau wedding.',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Katalog Produk',
    basePrice: 3000000,
    duration: '10–14 Hari',
    desc: 'Katalog produk lengkap dengan checkout otomatis & payment gateway.',
  },
];

const ADDONS: FeatureAddon[] = [
  {
    id: 'wa_auto',
    name: 'Otomatisasi Notifikasi WhatsApp',
    price: 300000,
    desc: 'Notifikasi konfirmasi booking instan ke WA pelanggan & admin.',
  },
  {
    id: 'custom_motion',
    name: 'Koreografi Animasi Awwwards Tier',
    price: 450000,
    desc: 'Micro-interactions interaktif & scroll kinetic experience.',
  },
  {
    id: 'seo_boost',
    name: 'Paket Optimasi SEO On-Page Lengkap',
    price: 350000,
    desc: 'Schema markup, OpenGraph, sitemap XML, dan kecepatan 100/100.',
  },
  {
    id: 'cms_admin',
    name: 'Panel Admin CMS Mandiri',
    price: 600000,
    desc: 'Kemudahan tambah/edit produk, artikel, atau portofolio tanpa koding.',
  },
];

export const BookingEstimatorSection = memo(() => {
  // Strict Rule 1: Colocate interactive state
  const [selectedPkg, setSelectedPkg] = useState<string>('booking');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['wa_auto']);

  // Strict Rule 2: Handlers wrapped in useCallback
  const handleSelectPackage = useCallback((id: string) => {
    setSelectedPkg(id);
  }, []);

  const handleToggleAddon = useCallback((id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const currentPkg = useMemo(
    () => PACKAGE_OPTIONS.find(p => p.id === selectedPkg) || PACKAGE_OPTIONS[0],
    [selectedPkg]
  );

  const totalPrice = useMemo(() => {
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const item = ADDONS.find(a => a.id === id);
      return sum + (item ? item.price : 0);
    }, 0);
    return currentPkg.basePrice + addonsTotal;
  }, [currentPkg, selectedAddons]);

  const formatRupiah = useCallback((val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  }, []);

  const waBriefUrl = useMemo(() => {
    const addonNames = selectedAddons
      .map(id => ADDONS.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const text = encodeURIComponent(
      `Halo RidzWeb Studio! Saya telah melakukan simulasi estimasi proyek website:\n\n` +
      `*Pilihan Paket:* ${currentPkg.name}\n` +
      `*Fitur Tambahan:* ${addonNames || 'Standar'}\n` +
      `*Estimasi Biaya:* ${formatRupiah(totalPrice)}\n` +
      `*Estimasi Pengerjaan:* ${currentPkg.duration}\n\n` +
      `Bisa kita jadwalkan konsultasi lebih lanjut? Terima kasih!`
    );
    return `https://wa.me/6281234567890?text=${text}`;
  }, [currentPkg, selectedAddons, totalPrice, formatRupiah]);

  return (
    <section id="estimator" className="section" style={{
      background: 'var(--paper-50)',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <Eyebrow accent>Kalkulator Proyek Transparan</Eyebrow>
          <h2 data-reveal style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            maxWidth: '20ch',
            marginInline: 'auto',
            marginBottom: '0.75rem',
          }}>
            Hitung Estimasi Biaya &{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>Waktu Pengerjaan</em>
          </h2>
          <p data-reveal style={{ color: 'var(--ink-500)', maxWidth: '52ch', marginInline: 'auto', fontSize: '1rem' }}>
            Simulasikan kebutuhan website bisnis Anda secara transparan. Pilih jenis website dan fitur khusus yang diinginkan untuk melihat proyeksi harga langsung.
          </p>
          <SketchStroke style={{ width: '200px', marginInline: 'auto', marginTop: '1.25rem' }} />
        </div>

        {/* Double-Bezel Interactive Calculator Box */}
        <div data-reveal className="double-bezel" style={{ maxWidth: '1060px', marginInline: 'auto' }}>
          <div className="double-bezel-inner" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'start',
            }}>
              {/* Left Column: Selections */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-400)',
                  marginBottom: '1rem',
                }}>
                  Langkah 1: Pilih Kategori Website
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                  {PACKAGE_OPTIONS.map(pkg => {
                    const isSelected = pkg.id === selectedPkg;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => handleSelectPackage(pkg.id)}
                        style={{
                          padding: '1rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${isSelected ? 'var(--ink-800)' : 'var(--paper-300)'}`,
                          background: isSelected ? 'var(--paper-100)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink-900)' }}>
                            {pkg.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', marginTop: '2px' }}>
                            {pkg.desc}
                          </div>
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: isSelected ? 'var(--accent-500)' : 'var(--ink-700)',
                          whiteSpace: 'nowrap',
                        }}>
                          {formatRupiah(pkg.basePrice)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-400)',
                  marginBottom: '1rem',
                }}>
                  Langkah 2: Tambah Fitur Kustom (Opsional)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {ADDONS.map(addon => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddon(addon.id)}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isChecked ? 'var(--accent-400)' : 'var(--paper-300)'}`,
                          background: isChecked ? 'var(--accent-100)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 200ms ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            border: `1.5px solid ${isChecked ? 'var(--accent-500)' : 'var(--paper-400)'}`,
                            background: isChecked ? 'var(--accent-500)' : '#ffffff',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                          }}>
                            {isChecked ? '✓' : ''}
                          </span>
                          <div>
                            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--ink-800)' }}>
                              {addon.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--ink-500)' }}>
                              {addon.desc}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--ink-600)',
                          whiteSpace: 'nowrap',
                        }}>
                          +{formatRupiah(addon.price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Instant Invoice Card */}
              <div style={{
                background: 'var(--paper-100)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(1.5rem, 3vw, 2.25rem)',
                border: '1px solid var(--paper-300)',
                boxShadow: 'var(--shadow-md)',
                position: 'sticky',
                top: '6rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--paper-300)',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-400)',
                  }}>
                    Ringkasan Proyek
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'var(--sage-100)',
                    color: 'var(--sage-600)',
                    fontWeight: 700,
                  }}>
                    Garansi 30 Hari
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ink-500)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Paket Dipilih
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink-900)', marginTop: '2px' }}>
                    {currentPkg.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-600)', marginTop: '4px' }}>
                    Waktu Pengerjaan: <strong style={{ color: 'var(--accent-500)' }}>{currentPkg.duration}</strong>
                  </div>
                </div>

                <div style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  background: '#ffffff',
                  border: '1px solid var(--paper-300)',
                  marginBottom: '1.75rem',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-400)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    Total Estimasi Investasi
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                    fontWeight: 700,
                    color: 'var(--ink-900)',
                    lineHeight: 1.1,
                    marginTop: '4px',
                  }}>
                    {formatRupiah(totalPrice)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', marginTop: '6px' }}>
                    Termasuk source code penuh, domain, SSL & support 30 hari.
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <a
                  href={waBriefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="island-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Kirim Brief Ini ke WhatsApp</span>
                  <span className="island-btn-icon">→</span>
                </a>

                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <SketchAnnotation
                    text="tanpa komitmen · konsultasi 100% gratis"
                    rotation={-1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
BookingEstimatorSection.displayName = 'BookingEstimatorSection';
