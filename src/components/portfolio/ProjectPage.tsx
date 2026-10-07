import { useEffect } from 'react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import { profile } from '../../data/profile';
import { projectPath } from '../../lib/seo';
import { track } from '../../lib/analytics';
import { getWhatsAppLink } from '../../lib/whatsapp';
import { Preview } from './ProjectPreview';
import { Arrow, External } from './ui';

function ProjectHeader() {
  return (
    <header className="project-header">
      <a className="wordmark" href="/">
        farid<span>&reg;</span>
      </a>
      <a href="/#projects">&larr; Semua project</a>
    </header>
  );
}
export function ProjectPage({ project }: { project: Project }) {
  useEffect(() => {
    track('project_view', { project: project.slug });
  }, [project.slug]);
  return (
    <>
      <a className="skip-link" href="#main">
        Langsung ke konten
      </a>
      <ProjectHeader />
      <main id="main" className="project-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Portofolio Farid</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>
        <p className="eyebrow">
          CASE STUDY / {project.category.toUpperCase()} / {project.year}
        </p>
        <h1>{project.title}</h1>
        <p className="project-intro">{project.description}</p>
        <div className="tags">
          {project.technologies.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Preview project={project} priority />
        <div className="case-grid">
          <div>
            <h2>Tantangan</h2>
            <p>{project.problem}</p>
            <h2>Pendekatan</h2>
            <p>{project.solution}</p>
            <h2>Fokus pengalaman pengguna</h2>
            <p>{project.challenge}</p>
          </div>
          <div>
            <h2>Fitur yang bisa dijelajahi</h2>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <h2>Jelajahi hasilnya</h2>
            <p>
              Buka demo untuk melihat alur dan antarmuka {project.title}. Punya
              kebutuhan serupa? Hubungi {profile.name} untuk mendiskusikan
              project website kamu.
            </p>
            <a
              className="button primary"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track('project_demo_click', { project: project.slug })
              }
            >
              Buka live demo <Arrow />
            </a>
            <a
              className="button secondary"
              href={getWhatsAppLink('hero')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Diskusi project <Arrow />
            </a>
            {project.github && (
              <External href={project.github} event="github_click">
                Source code GitHub
              </External>
            )}
          </div>
        </div>
        <section className="project-next" aria-labelledby="more-projects">
          <h2 id="more-projects">Project lainnya</h2>
          {projects
            .filter((item) => item.slug !== project.slug)
            .map((item) => (
              <a key={item.slug} href={projectPath(item)}>
                {item.title} <Arrow />
              </a>
            ))}
        </section>
      </main>
      <footer>
        <a className="wordmark" href="/">
          farid<span>.</span>
        </a>
        <span>
          &copy; {new Date().getFullYear()} Farid. Built with intention.
        </span>
        <a href="/#contact">
          Hubungi Farid <Arrow />
        </a>
      </footer>
    </>
  );
}
export function NotFound() {
  return (
    <>
      <ProjectHeader />
      <main className="project-page" id="main">
        <p className="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</p>
        <h1>Mungkin salah belok.</h1>
        <p>
          Halaman ini tidak tersedia. Masih ada beberapa project yang bisa kamu
          jelajahi.
        </p>
        <a className="button primary" href="/">
          Kembali ke portofolio <Arrow />
        </a>
      </main>
    </>
  );
}
