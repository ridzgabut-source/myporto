import { useEffect, useRef, useState } from 'react';
import { experience } from './data/experience';
import { sections } from './data/profile';
import { track } from './lib/analytics';
import { Arrow, Heading } from './components/portfolio/ui';
import { Projects } from './components/portfolio/Projects';
import { Skills } from './components/portfolio/Skills';
import './styles/global.css';
import { Hero } from './components/portfolio/Hero';
import { Navbar } from './components/portfolio/Navbar';
import { MobileEffects } from './components/interactions/MobileEffects';
import { About } from './components/portfolio/About';
import { Contact } from './components/portfolio/Contact';
import { InteractiveAtmosphere } from './components/interactions/InteractiveAtmosphere';
export default function App() {
  const [active, setActive] = useState('home');
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const paletteRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    track('page_view');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -55% 0px' },
    );
    document
      .querySelectorAll('main section[id]')
      .forEach((s) => observer.observe(s));
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener('keydown', key);
    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', key);
    };
  }, []);
  useEffect(() => {
    if (palette) paletteRef.current?.showModal();
    else paletteRef.current?.close();
  }, [palette]);
  return (
    <>
      <div id="portfolio-content" className="portfolio-content">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navbar active={active} onOpenConsole={() => setPalette(true)} />
        <main id="main">
          <Hero />
          <div className="tech-strip" aria-label="Technology focus">
            {[
              'React',
              'TypeScript',
              'Next.js',
              'Node.js',
              'PostgreSQL',
              'Three.js',
            ].map((s, i) => (
              <span key={s}>
                <small>0{i + 1}</small>
                {s}
              </span>
            ))}
          </div>
          <About />
          <Skills />
          <section id="experience" className="section">
            <Heading
              number="03"
              label="ALWAYS MOVING FORWARD"
              title="A work in progress."
              description="A growing collection of projects, experiments, and lessons along the way."
            />
            <div className="timeline">
              {experience.map((e) => (
                <article key={e.date}>
                  <div className="timeline-date">
                    {e.date}
                    <span />
                  </div>
                  <div>
                    <p className="mono">{e.company}</p>
                    <h3>{e.role}</h3>
                    <p>{e.description}</p>
                    <div className="tags">
                      {e.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <Arrow />
                </article>
              ))}
            </div>
          </section>
          <Projects />
          <Contact />
        </main>
        <footer>
          <a className="wordmark" href="#home">
            farid<span>.</span>
          </a>
          <span>
            © {new Date().getFullYear()} Farid. Crafted with intention.
          </span>
          <a href="#home">Back to top ↑</a>
        </footer>
        <dialog
          ref={paletteRef}
          className="palette"
          onCancel={() => setPalette(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPalette(false);
          }}
          aria-label="Developer command palette"
        >
          <div>
            <label htmlFor="command">
              Developer console{' '}
              <button
                onClick={() => setPalette(false)}
                aria-label="Close command palette"
              >
                ✕
              </button>
            </label>
            <input
              id="command"
              placeholder="Type a section name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {sections
              .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
              .map((s) => (
                <a
                  key={s}
                  href={`#${s.toLowerCase()}`}
                  onClick={() => {
                    setPalette(false);
                    setQuery('');
                  }}
                >
                  /{s.toLowerCase()} <span>↵</span>
                </a>
              ))}
          </div>
        </dialog>
      </div>
      <InteractiveAtmosphere />
      <MobileEffects />
    </>
  );
}
