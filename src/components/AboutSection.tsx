import { memo } from 'react';
import { Eyebrow, SketchAnnotation, SketchStroke, StatCounter } from './utils';

const VALUES_LIST = [
  {
    num: '01',
    title: 'Estetika yang Berbobot',
    desc: 'Kami menjauhi desain template biasa. Setiap tipografi, jarak whitespace, dan bayangan diatur manual untuk menghadirkan kesan mewah.',
  },
  {
    num: '02',
    title: 'Performa Tanpa Kompromi',
    desc: 'Kode React modern yang dioptimasi ketat — loading di bawah 1 detik, skor Lighthouse mendekati 100, dan bebas lag di smartphone.',
  },
  {
    num: '03',
    title: 'Transparansi & Kepemilikan 100%',
    desc: 'Semua hak cipta, source code GitHub, dan akses domain sepenuhnya milik Anda. Tanpa biaya tersembunyi pasca serah terima.',
  },
];

const ValueItem = memo(({ item, index }: { item: typeof VALUES_LIST[0]; index: number }) => (
  <div
    data-reveal
    style={{
      transitionDelay: `${index * 80}ms`,
      display: 'flex',
      gap: '1.25rem',
      alignItems: 'flex-start',
    }}
  >
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      fontWeight: 700,
      color: 'var(--accent-500)',
      background: 'var(--paper-200)',
      border: '1px solid var(--paper-300)',
      padding: '0.3rem 0.6rem',
      borderRadius: '6px',
      flexShrink: 0,
    }}>
      {item.num}
    </span>
    <div>
      <h4 style={{
        fontSize: '1.15rem',
        color: 'var(--ink-900)',
        marginBottom: '0.4rem',
        lineHeight: 1.3,
      }}>
        {item.title}
      </h4>
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--ink-500)',
        lineHeight: 1.65,
        maxWidth: '42ch',
      }}>
        {item.desc}
      </p>
    </div>
  </div>
));
ValueItem.displayName = 'ValueItem';

export const AboutSection = memo(() => {
  return (
    <section id="about" className="section" style={{
      background: 'var(--paper-200)',
      borderTop: '1px solid var(--paper-300)',
      borderBottom: '1px solid var(--paper-300)',
    }}>
      <div className="container">
        {/* Main 2-column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'start',
          marginBottom: 'clamp(3.5rem, 7vw, 6rem)',
        }}>
          {/* Left Column: Studio Manifesto */}
          <div>
            <Eyebrow accent>Filosofi & Pendekatan</Eyebrow>
            <h2 data-reveal style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              marginBottom: '1.25rem',
            }}>
              Keahlian Digital dengan{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>
                Sentuhan Personal
              </em>
            </h2>

            <SketchStroke style={{ width: '220px', marginBottom: '1.75rem' }} />

            <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-600)', lineHeight: 1.75 }}>
                <strong>RidzWeb Studio</strong> adalah praktek desain & rekayasa web independen di Indonesia. Kami memadukan seni visual editorial dengan arsitektur rekayasa perangkat lunak modern untuk menciptakan website yang memorable.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink-600)', lineHeight: 1.75 }}>
                Bagi kami, setiap klien memiliki cerita unik. Kami tidak sekadar merangkai kode, melainkan membedah model bisnis Anda agar website yang dilahirkan mampu menarik calon pembeli dan mempermudah operasional harian.
              </p>
            </div>

            {/* Tech Badges */}
            <div data-reveal style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {['React 19', 'TypeScript', 'Next.js', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Figma', 'SEO Technical'].map(tech => (
                <span
                  key={tech}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                    background: 'var(--paper-100)',
                    border: '1px solid var(--paper-300)',
                    color: 'var(--ink-700)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Values */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--ink-400)',
              marginBottom: '2rem',
            }}>
              Prinsip Pengerjaan Kami
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {VALUES_LIST.map((item, i) => (
                <ValueItem key={item.num} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row in Double-Bezel Architecture */}
        <div data-reveal className="double-bezel">
          <div
            className="double-bezel-inner"
            style={{
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '2rem',
              position: 'relative',
            }}
          >
            <SketchAnnotation
              text="metrik performa studio"
              style={{ position: 'absolute', top: '1rem', right: '1.5rem' }}
              rotation={2}
            />

            <StatCounter value={30} suffix="+" label="Proyek Selesai" />
            <StatCounter value={100} suffix="%" label="Klien Puas" />
            <StatCounter value={3} suffix="+" label="Tahun Pengalaman" />
            <StatCounter value={100} suffix="/100" label="Skor Lighthouse" />
          </div>
        </div>
      </div>
    </section>
  );
});
AboutSection.displayName = 'AboutSection';
