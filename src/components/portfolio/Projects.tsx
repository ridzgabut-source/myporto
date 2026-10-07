import { useCardTilt } from '../../hooks/useCardTilt';
import { useRef, useState } from 'react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import { Heading, Arrow, External } from './ui';
import { Preview } from './ProjectPreview';
import { ProjectDetail } from './ProjectDetail';
import { projectPath } from '../../lib/seo';
import { track } from '../../lib/analytics';
const trackProject = (slug: string) => track('project_view', { project: slug });
export function Projects() {
  const grid = useRef<HTMLDivElement>(null);
  useCardTilt(grid);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const categories = [
    'All',
    'Full Stack',
    'Frontend',
    'Backend',
    'Automation',
    'Experimental',
  ];
  const filtered = projects.filter(
    (p) => filter === 'All' || p.category === filter,
  );
  return (
    <section id="projects" className="section">
      <Heading
        number="04"
        label="SELECTED WORK"
        title="Made with intention."
        description="A few things I have built. Each one a different problem, a different possibility."
      />
      <div className="filters" aria-label="Filter project">
        {categories.map((c) => (
          <button
            aria-pressed={filter === c}
            className={filter === c ? 'active' : ''}
            key={c}
            onClick={() => setFilter(c)}
          >
            {c}
            {c === 'All' && (
              <span>{String(projects.length).padStart(2, '0')}</span>
            )}
          </button>
        ))}
      </div>
      <div ref={grid} className="project-grid">
        {filtered.map((p, i) => (
          <article key={p.slug} className="project-card">
            <div className="preview-button">
              <Preview project={p} />
            </div>
            <div className="project-meta">
              <span>
                0{i + 1} / {p.category.toUpperCase()}
              </span>
              <span>{p.year}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <div className="tags">
              {p.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="project-actions">
              <External href={p.demo} event="project_demo_click">
                Live demo
              </External>
              <a href={projectPath(p)} onClick={() => trackProject(p.slug)}>
                Case study <Arrow />
              </a>
              <button
                type="button"
                aria-label={`Quick view ${p.title}`}
                onClick={() => setSelected(p)}
              >
                Quick view <Arrow />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state" role="status">
          Belum ada project yang dipublikasikan dalam kategori {filter}.
          <button onClick={() => setFilter('All')}>
            Lihat semua project ↗
          </button>
        </div>
      )}
      {selected && (
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
