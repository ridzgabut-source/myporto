import {useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {projects} from '../../data/projects';
import type {Project} from '../../data/projects';
import {Heading,Arrow,External} from './ui';
import {Preview} from './ProjectPreview';
import {ProjectDetail} from './ProjectDetail';
export function Projects(){
 const [filter,setFilter]=useState('All');const [selected,setSelected]=useState<Project|null>(null);const reduced=useReducedMotion();
 const categories=['All','Full Stack','Frontend','Backend','Automation','Experimental'];
 const filtered=projects.filter(p=>filter==='All'||p.category===filter);
 return <section id="projects" className="section"><Heading number="04" label="SELECTED WORK" title="Made with intention." description="A few things I have built. Each one a different problem, a different possibility."/><div className="filters" aria-label="Filter project">{categories.map(c=><button aria-pressed={filter===c} className={filter===c?'active':''} key={c} onClick={()=>setFilter(c)}>{c}{c==='All'&&<span>04</span>}</button>)}</div><div className="project-grid"><AnimatePresence mode="popLayout">{filtered.map((p,i)=><motion.article layout={!reduced} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.22}} key={p.slug} className="project-card" onPointerMove={e=>{if(e.pointerType!=='mouse'||reduced)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--tilt',`${(e.clientX-r.left-r.width/2)/r.width*3}deg`);}} onPointerLeave={e=>e.currentTarget.style.setProperty('--tilt','0deg')}><button className="preview-button" onClick={()=>setSelected(p)} aria-label={`Buka case study ${p.title}`}><Preview project={p}/></button><div className="project-meta"><span>0{i+1} / {p.category.toUpperCase()}</span><span>{p.year}</span></div><h3>{p.title}</h3><p>{p.description}</p><div className="tags">{p.technologies.map(t=><span key={t}>{t}</span>)}</div><div className="project-actions"><External href={p.demo} event="project_demo_click">Live demo</External><button onClick={()=>setSelected(p)}>Case study <Arrow/></button></div></motion.article>)}</AnimatePresence></div>{!filtered.length&&<div className="empty-state" role="status">Belum ada project yang dipublikasikan dalam kategori {filter}.<button onClick={()=>setFilter('All')}>Lihat semua project ↗</button></div>}{selected&&<ProjectDetail project={selected} onClose={()=>setSelected(null)}/>}</section>;
}
