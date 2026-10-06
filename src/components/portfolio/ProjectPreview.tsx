import type { CSSProperties } from 'react';
import type { Project } from '../../data/projects';
import { Arrow } from './ui';
export function Preview({ project }: { project: Project }) {
  return (
    <div
      className={`project-preview preview-${project.kind}`}
      style={{ '--project-color': project.color } as CSSProperties}
      aria-label={`Ilustrasi antarmuka ${project.title}`}
    >
      <div className="browser-bar">
        <span>● ● ●</span>
        <span>{new URL(project.demo).hostname}</span>
        <Arrow />
      </div>
      <div className="mock-site">
        <div className="mock-nav">
          <b>
            {project.kind === 'catalog'
              ? 'CATALOG.'
              : project.kind === 'agency'
                ? 'STUDIO / CREATIVE'
                : project.kind === 'barber'
                  ? 'THE BARBER.'
                  : 'everafter.'}
          </b>
          <span>ABOUT &nbsp; COLLECTION &nbsp; CONTACT</span>
        </div>
        {project.kind === 'catalog' ? (
          <>
            <h4>
              Everyday essentials.
              <br />
              Extraordinary design.
            </h4>
            <div className="product-shapes">
              <div />
              <div />
              <div />
            </div>
            <div className="mock-bottom">
              CURATED COLLECTION <span>EXPLORE SHOP ↗</span>
            </div>
          </>
        ) : project.kind === 'agency' ? (
          <>
            <span className="mock-small">INDEPENDENT CREATIVE STUDIO</span>
            <h4>
              Ideas into
              <br />
              <em>impact.</em>
            </h4>
            <div className="agency-mark">✳</div>
          </>
        ) : project.kind === 'barber' ? (
          <>
            <span className="mock-small">PRECISION. STYLE. CONFIDENCE.</span>
            <h4>
              A cut above
              <br />
              the rest.
            </h4>
            <div className="barber-lines" />
            <span className="mock-cta">BOOK YOUR CHAIR ↗</span>
          </>
        ) : (
          <>
            <span className="mock-small">YOUR DAY. YOUR STORY.</span>
            <h4>
              Beautiful beginnings,
              <br />
              <em>unforgettable moments.</em>
            </h4>
            <div className="wedding-arch" />
            <span className="mock-cta">EXPLORE PACKAGES ↗</span>
          </>
        )}
      </div>
      <span className="preview-note">
        UI illustration · Open live demo to explore
      </span>
    </div>
  );
}
