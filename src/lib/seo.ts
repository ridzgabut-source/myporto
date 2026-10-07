import { profile } from '../data/profile';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';

export const projectPath = (project: Project) => `/projects/${project.slug}/`;
export const normalizePath = (path: string) =>
  path.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
export function siteOrigin(value = profile.siteUrl) {
  const url = new URL(value.includes('://') ? value : `https://${value}`);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error('SITE_URL must be a public HTTP(S) website URL');
  return url.origin + '/';
}
export function getPageMetadata(path = '/', site = profile.siteUrl) {
  const base = siteOrigin(site);
  const project = projects.find(
    (project) => normalizePath(projectPath(project)) === normalizePath(path),
  );
  const home = normalizePath(path) === '/';
  return {
    title: home
      ? 'Farid — Full Stack Developer Indonesia | Portofolio Website'
      : project
        ? `${project.title} — Case Study Website | Farid`
        : 'Halaman tidak ditemukan | Farid',
    description: home
      ? 'Portofolio Farid, Full Stack Developer di Indonesia. Jelajahi website katalog, laundry, creative agency, barbershop, dan sistem booking wedding.'
      : project
        ? project.description
        : 'Halaman ini tidak tersedia. Jelajahi project dan portofolio Farid.',
    canonical: home
      ? base
      : project
        ? new URL(projectPath(project), base).href
        : new URL('/404.html', base).href,
    image: new URL('/og/portfolio.png', base).href,
    indexable: home || Boolean(project),
    project,
  };
}
export function structuredData(path = '/', site = profile.siteUrl) {
  const meta = getPageMetadata(path, site),
    base = siteOrigin(site);
  const person = {
    '@type': 'Person',
    '@id': base + '#farid',
    name: profile.name,
    jobTitle: profile.role,
    url: base,
    description:
      'Full Stack Developer Indonesia yang membangun website, sistem booking, dan pengalaman web interaktif.',
    sameAs: [profile.github.split('?')[0]],
    email: profile.email,
    address: { '@type': 'PostalAddress', addressCountry: 'ID' },
    knowsAbout: [
      'Web Development',
      'React',
      'TypeScript',
      'Responsive Web Design',
      'Booking Systems',
    ],
  };
  const website = {
    '@type': 'WebSite',
    '@id': base + '#website',
    url: base,
    name: 'Farid — Developer Portfolio',
    inLanguage: 'id-ID',
    publisher: { '@id': person['@id'] },
  };
  const work = (project: Project) => ({
    '@type': 'CreativeWork',
    '@id': new URL(projectPath(project), base).href + '#project',
    name: project.title,
    description: project.description,
    url: new URL(projectPath(project), base).href,
    sameAs: project.demo,
    creator: { '@id': person['@id'] },
    inLanguage: 'id-ID',
    ...(project.cover ? { image: new URL(project.cover, base).href } : {}),
  });
  const graph: unknown[] = [person, website];
  if (normalizePath(path) === '/')
    graph.push(
      {
        '@type': 'ProfilePage',
        '@id': base + '#profile',
        url: base,
        name: meta.title,
        description: meta.description,
        inLanguage: 'id-ID',
        isPartOf: { '@id': website['@id'] },
        mainEntity: { '@id': person['@id'] },
      },
      {
        '@type': 'ItemList',
        '@id': base + '#projects',
        name: 'Project website Farid',
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: work(project),
        })),
      },
    );
  else if (meta.project) {
    graph.push(
      work(meta.project),
      {
        '@type': 'WebPage',
        '@id': meta.canonical + '#page',
        url: meta.canonical,
        name: meta.title,
        description: meta.description,
        inLanguage: 'id-ID',
        isPartOf: { '@id': website['@id'] },
        mainEntity: { '@id': meta.canonical + '#project' },
        breadcrumb: { '@id': meta.canonical + '#breadcrumb' },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': meta.canonical + '#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Portofolio Farid',
            item: base,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: meta.project.title,
            item: meta.canonical,
          },
        ],
      },
    );
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
