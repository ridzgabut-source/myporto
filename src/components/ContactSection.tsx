import {
  memo,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Eyebrow, SketchAnnotation, SketchStroke } from './utils';

// ── ISOLATED FORM FIELD COMPONENT (Strict Rule 1: Colocate State) ─────────
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const FormField = memo(({
  id,
  label,
  type = 'text',
  placeholder,
  required,
  isTextarea,
  value,
  onChange,
}: FormFieldProps) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1.1rem',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--paper-300)',
    background: 'var(--paper-50)',
    color: 'var(--ink-900)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-sans)',
    lineHeight: 1.5,
    outline: 'none',
    transition: 'border-color 250ms ease, box-shadow 250ms ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--ink-500)',
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: 'var(--accent-500)' }}>*</span>}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          placeholder={placeholder}
          required={required}
          rows={4}
          value={value}
          onChange={handleChange}
          style={{ ...baseStyle, resize: 'vertical', minHeight: '110px' }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--ink-700)';
            e.target.style.boxShadow = '0 0 0 3px rgba(39, 34, 28, 0.08)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--paper-300)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
          style={baseStyle}
          onFocus={e => {
            e.target.style.borderColor = 'var(--ink-700)';
            e.target.style.boxShadow = '0 0 0 3px rgba(39, 34, 28, 0.08)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--paper-300)';
            e.target.style.boxShadow = 'none';
          }}
        />
      )}
    </div>
  );
});
FormField.displayName = 'FormField';

// ── CONTACT FORM WITH ISOLATED LOCAL STATE ────────────────────────────────
const ContactForm = memo(() => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [serviceType, setServiceType] = useState('Landing Page');
  const [brief, setBrief] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Strict Rule 3: Use useRef for timers that don't affect visual rendering directly
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Strict Rule 2: Handlers wrapped in useCallback
  const handleNameChange = useCallback((v: string) => setName(v), []);
  const handleContactChange = useCallback((v: string) => setContactInfo(v), []);
  const handleServiceChange = useCallback((v: string) => setServiceType(v), []);
  const handleBriefChange = useCallback((v: string) => setBrief(v), []);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Generate WhatsApp direct redirect as backup
    const waText = encodeURIComponent(
      `Halo RidzWeb Studio! Saya ingin konsultasi proyek website.\n\n*Nama:* ${name}\n*Kontak:* ${contactInfo}\n*Layanan:* ${serviceType}\n*Detail Proyek:* ${brief}`
    );

    timerRef.current = window.setTimeout(() => {
      setStatus('sent');
      // Auto-open WhatsApp after simulation
      window.open(`https://wa.me/6281234567890?text=${waText}`, '_blank');
      setName('');
      setContactInfo('');
      setBrief('');

      timerRef.current = window.setTimeout(() => {
        setStatus('idle');
      }, 4000);
    }, 900);
  }, [name, contactInfo, serviceType, brief]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <FormField
          id="name"
          label="Nama Lengkap / Perusahaan"
          placeholder="Nama Anda atau Brand"
          required
          value={name}
          onChange={handleNameChange}
        />
        <FormField
          id="contact"
          label="WhatsApp atau Email"
          placeholder="0812... atau nama@email.com"
          required
          value={contactInfo}
          onChange={handleContactChange}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <label
          htmlFor="service-select"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-500)',
            fontWeight: 500,
          }}
        >
          Kebutuhan Layanan
        </label>
        <select
          id="service-select"
          value={serviceType}
          onChange={e => handleServiceChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.85rem 1.1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1.5px solid var(--paper-300)',
            background: 'var(--paper-50)',
            color: 'var(--ink-900)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="Landing Page">Landing Page Premium (Mulai 500rb)</option>
          <option value="Website Profil">Website Profil Bisnis & Korporat</option>
          <option value="E-Commerce & Katalog">E-Commerce & Katalog Produk</option>
          <option value="Sistem Booking Online">Sistem Booking / Reservasi Online</option>
          <option value="Custom Project">Custom Web App & Portofolio</option>
        </select>
      </div>

      <FormField
        id="brief"
        label="Deskripsi Singkat Proyek"
        placeholder="Ceritakan tujuan website, fitur yang diinginkan, dan deadline estimasi..."
        required
        isTextarea
        value={brief}
        onChange={handleBriefChange}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="island-btn"
          style={{
            background: status === 'sent' ? 'var(--sage-600)' : 'var(--ink-900)',
            cursor: status === 'sending' ? 'wait' : 'pointer',
          }}
        >
          <span>
            {status === 'idle' && 'Kirim Pesan & Buka WhatsApp'}
            {status === 'sending' && 'Menghubungkan...'}
            {status === 'sent' && '✓ Terkirim ke WhatsApp!'}
          </span>
          <span className="island-btn-icon">→</span>
        </button>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-400)' }}>
          🔒 Data terjaga 100% rahasia
        </span>
      </div>
    </form>
  );
});
ContactForm.displayName = 'ContactForm';

// ── CONTACT SECTION ───────────────────────────────────────────────────────
export const ContactSection = memo(() => {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'clamp(2.5rem, 6vw, 6rem)',
          alignItems: 'start',
        }}>
          {/* Left Info Column */}
          <div>
            <Eyebrow accent>Konsultasi & Penawaran</Eyebrow>
            <h2 data-reveal style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              marginBottom: '1rem',
            }}>
              Mari Diskusikan{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>
                Ide Website Anda
              </em>
            </h2>

            <SketchStroke style={{ width: '200px', marginBottom: '1.5rem' }} />

            <p data-reveal style={{
              color: 'var(--ink-500)',
              fontSize: '1rem',
              lineHeight: 1.75,
              marginBottom: '2.5rem',
              maxWidth: '46ch',
            }}>
              Siap meningkatkan citra bisnis dengan website profesional? Hubungi kami langsung melalui WhatsApp untuk konsultasi cepat tanpa biaya, atau isi formulir di samping.
            </p>

            {/* Quick Contact Cards */}
            <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  icon: '💬',
                  label: 'WhatsApp Konsultasi',
                  val: '+62 812-3456-7890 (Respon Cepat)',
                  href: 'https://wa.me/6281234567890?text=Halo%20RidzWeb,%20saya%20tertarik%20untuk%20membuat%20website.',
                },
                {
                  icon: '✉',
                  label: 'Email Kerja Sama',
                  val: 'hello@ridzweb.studio',
                  href: 'mailto:hello@ridzweb.studio',
                },
                {
                  icon: '📍',
                  label: 'Area Layanan',
                  val: 'Indonesia (Remote & Online Meeting)',
                  href: '#',
                },
              ].map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--paper-300)',
                    background: 'var(--paper-50)',
                    boxShadow: 'var(--shadow-hairline)',
                    transition: 'all 300ms var(--ease-fluid)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--ink-600)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--paper-300)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--ink-400)', letterSpacing: '0.08em' }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink-800)', marginTop: '2px' }}>
                      {c.val}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <SketchAnnotation
                text="respon WhatsApp rata-rata < 15 menit"
                rotation={-2}
              />
            </div>
          </div>

          {/* Right Form with Double-Bezel Architecture */}
          <div data-reveal className="double-bezel">
            <div className="double-bezel-inner" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--paper-300)',
                paddingBottom: '1rem',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--ink-900)' }}>
                  Formulir Konsultasi Proyek
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'var(--accent-100)',
                  color: 'var(--accent-600)',
                  fontWeight: 600,
                }}>
                  Gratis Konsultasi
                </span>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
ContactSection.displayName = 'ContactSection';
