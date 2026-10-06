import { useEffect, useRef } from 'react';
import type { Project } from '../../data/projects';
import { track } from '../../lib/analytics';
import { External } from './ui';
import { Preview } from './ProjectPreview';
export function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    track('project_view', { project: project.slug });
    return () => {
      document.body.style.overflow = prior;
    };
  }, [project]);
  const close = () => {
    dialog.current?.close();
    onClose();
  };
  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="case-title"
    >
      <div className="case-content">
        <button
          className="close-button"
          onClick={close}
          autoFocus
          aria-label="Tutup case study"
        >
          ✕
        </button>
        <p className="eyebrow">CASE STUDY / {project.year}</p>
        <h2 id="case-title">{project.title}</h2>
        <p>{project.description}</p>
        <Preview project={project} />
        <div className="case-grid">
          <div>
            <h3>Overview</h3>
            <p>{project.description}</p>
            <h3>Problem</h3>
            <p>{project.problem}</p>
            <h3>Solution</h3>
            <p>{project.solution}</p>
          </div>
          <div>
            <h3>Features</h3>
            <ul>
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <h3>Technology & scope</h3>
            <div className="tags">
              {project.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <p className="fine-print">
              Scope berdasarkan konten portofolio lama. Detail backend dan
              repository belum tersedia.
            </p>
            <h3>Technical challenge</h3>
            <p>{project.challenge}</p>
          </div>
        </div>
        <h3>User flow</h3>
        <div className="architecture">
          <span>Visitor</span>
          <b>→</b>
          <span>
            {project.kind === 'catalog'
              ? 'Browse products'
              : 'Explore services'}
          </span>
          <b>→</b>
          <span>
            {project.kind === 'agency' ? 'View work' : 'Choose details'}
          </span>
          <b>→</b>
          <span>
            {project.kind === 'agency' ? 'Contact' : 'Booking / Contact'}
          </span>
        </div>
        <External href={project.demo} event="project_demo_click">
          Explore live demo
        </External>
        {project.github && (
          <External href={project.github} event="github_click">
            GitHub repository
          </External>
        )}
      </div>
    </dialog>
  );
}
