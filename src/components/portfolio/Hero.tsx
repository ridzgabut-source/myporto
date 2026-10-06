import { lazy, Suspense } from 'react';
import { projects } from '../../data/projects';
import { Arrow } from './ui';
import { getWhatsAppLink } from '../../lib/whatsapp';
import { track } from '../../lib/analytics';
const Scene = lazy(() => import('../../three/Scene'));
export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <p className="availability">
          <span className="status-dot" /> FARID / FULL STACK DEVELOPER
        </p>
        <h1>
          Thoughtful code.
          <br />
          <em>Meaningful experiences.</em>
        </h1>
        <p className="hero-description">
          Saya Farid, Full Stack Developer di Indonesia.
          <br /> Membangun website, sistem booking, dan pengalaman web
          interaktif.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            Explore my work <Arrow />
          </a>
          <a
            className="button secondary"
            href={getWhatsAppLink('hero')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('contact_click', { channel: 'whatsapp', source: 'hero' })
            }
          >
            Let's talk <Arrow />
          </a>
        </div>
      </div>
      <div className="hero-stage">
        <Suspense
          fallback={
            <div className="scene-placeholder" aria-hidden="true">
              F.
            </div>
          }
        >
          <Scene />
        </Suspense>
        <a href="#about" className="floating-card card-intro">
          <span className="card-symbol" aria-hidden="true">
            ↗
          </span>
          <h2>
            From a thought
            <br />
            to a working product.
          </h2>
          <p>
            Designed with care.
            <br />
            Built with purpose.
          </p>
          <span className="card-caption">A LITTLE ABOUT ME</span>
        </a>
        <a href="#projects" className="floating-card card-work">
          <div className="mini-projects" aria-hidden="true">
            <span>L.</span>
            <span>C.</span>
            <span>A.</span>
            <span>B.</span>
            <span>W.</span>
          </div>
          <h2>
            Real projects.
            <br />
            Ready to explore.
          </h2>
          <p>
            {projects.length} live experiences.
            <br />
            One curious developer.
          </p>
          <span className="card-caption">VIEW SELECTED WORK ↗</span>
        </a>
        <div className="hero-note note-left">
          <span className="mini-rule" />
          <p>
            Based in Indonesia.
            <br />
            Building for everywhere.
          </p>
          <span className="mono">LOCAL ROOTS. GLOBAL IDEAS.</span>
        </div>
        <div className="hero-note note-right">
          <svg aria-hidden="true" viewBox="0 0 40 40">
            <path
              d="M20 1 23 17 39 20 23 23 20 39 17 23 1 20 17 17Z"
              fill="currentColor"
            />
          </svg>
          <p>
            Less noise.
            <br />
            More intention.
          </p>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#about">
          ↓ <span>SCROLL TO DISCOVER</span>
        </a>
        <span className="mono">INDEPENDENT DEVELOPER</span>
        <span className="mono">SELECTED WORK / 2026</span>
      </div>
    </section>
  );
}
