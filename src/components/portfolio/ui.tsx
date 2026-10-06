import type { ReactNode } from 'react';
import {track} from '../../lib/analytics';
export const Arrow=()=> <span aria-hidden="true">↗</span>;
export function External({href,children,event='contact_click'}:{href:string;children:ReactNode;event?:string}){return <a href={href} target="_blank" rel="noopener noreferrer" onClick={()=>track(event,{url:href})}>{children} <Arrow/></a>;}
export function Heading({number,label,title,description}:{number:string;label:string;title:string;description?:string}){return <div className="section-heading"><div><p className="eyebrow"><span>{number} /</span> {label}</p><h2>{title}</h2></div>{description&&<p className="section-description">{description}</p>}</div>;}
