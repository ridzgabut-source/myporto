import {useEffect,useRef,useState} from 'react';
import {createLensCopy,syncFixedContent} from './lensCopy';
import './interactions.css';
const SIZE=228;
const ZOOM=1.75;
const ignoreTarget=(target:EventTarget|null)=>target instanceof Element&&Boolean(target.closest('a,button,input,textarea,select,dialog,[contenteditable="true"]'));
export function InteractiveAtmosphere(){
 const lens=useRef<HTMLDivElement>(null);
 const viewport=useRef<HTMLDivElement>(null);
 const plane=useRef<HTMLDivElement>(null);
 const trail=useRef<SVGPathElement>(null);
 const glow=useRef<HTMLDivElement>(null);
 const toggle=useRef<()=>void>(()=>{});
 const [supported,setSupported]=useState(false);
 const [active,setActive]=useState(false);
 useEffect(()=>{
  const fine=matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let held=false,latched=false,copy:HTMLElement|null=null;
  let point={x:innerWidth/2,y:innerHeight/2};
  let pointerFrame=0,flightFrame=0,rebuildFrame=0;
  let lastContext=-Infinity;
  let flight={x:innerWidth*.87,y:innerHeight*.62,angle:0};
  let destination={...flight};
  const history:{x:number;y:number}[]=[];
  const sections=Array.from(document.querySelectorAll<HTMLElement>('#portfolio-content main section[id]'));
  const source=document.getElementById('portfolio-content');
  const desktop=()=>fine.matches&&innerWidth>=768;
  const isActive=()=>held||latched;
  const writePosition=()=>{
   if(!lens.current||!copy||!source)return;
   const rect=source.getBoundingClientRect();
   syncFixedContent(source,copy);
   lens.current.style.transform=`translate3d(${point.x-SIZE/2}px,${point.y-SIZE/2}px,0)`;
   copy.style.transform=`translate3d(${SIZE/2-ZOOM*(point.x-rect.left)}px,${SIZE/2-ZOOM*(point.y-rect.top)}px,0) scale(${ZOOM})`;
  };
  const refreshCopy=()=>{
   if(!source||!viewport.current||!isActive())return;
   copy=createLensCopy(source);viewport.current.replaceChildren(copy);writePosition();
  };
  const syncLens=()=>{
   const on=isActive()&&desktop()&&!document.querySelector('dialog[open]');
   if(lens.current)lens.current.dataset.active=String(on);
   document.documentElement.classList.toggle('lens-held',on);
   setActive(on);
   if(on){refreshCopy();}else{viewport.current?.replaceChildren();copy=null;}
  };
  const clear=()=>{held=false;latched=false;syncLens();};
  const renderPointer=()=>{
   pointerFrame=0;
   if(!motion.matches&&glow.current){glow.current.style.setProperty('--pointer-x',`${point.x}px`);glow.current.style.setProperty('--pointer-y',`${point.y}px`);}
   if(isActive())writePosition();
  };
  const move=(event:PointerEvent)=>{
   if(event.pointerType!=='mouse')return;
   point={x:event.clientX,y:event.clientY};
   if(held&&!(event.buttons&2)){held=false;syncLens();}
   if(!pointerFrame)pointerFrame=requestAnimationFrame(renderPointer);
  };
  const down=(event:PointerEvent)=>{
   if(event.button!==2||event.pointerType!=='mouse'||event.shiftKey||!desktop()||ignoreTarget(event.target))return;
   point={x:event.clientX,y:event.clientY};held=true;lastContext=performance.now();syncLens();
  };
  const up=(event:PointerEvent)=>{if(event.button===2&&held){lastContext=performance.now();held=false;syncLens();}};
  const context=(event:MouseEvent)=>{
   if(!event.shiftKey&&!ignoreTarget(event.target)&&desktop()&&(held||performance.now()-lastContext<350))event.preventDefault();
  };
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){clear();return;}
   if(!latched||(ignoreTarget(event.target)&&!(event.target instanceof Element&&event.target.closest('.lens-toggle'))))return;
   const moves:Record<string,[number,number]>={ArrowLeft:[-28,0],ArrowRight:[28,0],ArrowUp:[0,-28],ArrowDown:[0,28]};
   const delta=moves[event.key];if(!delta)return;
   event.preventDefault();point.x=Math.max(SIZE/2,Math.min(innerWidth-SIZE/2,point.x+delta[0]));point.y=Math.max(SIZE/2,Math.min(innerHeight-SIZE/2,point.y+delta[1]));writePosition();
  };
  toggle.current=()=>{held=false;latched=!latched;if(latched)point={x:innerWidth/2,y:innerHeight/2};syncLens();};
  const waypoints=[[.87,.64],[.12,.51],[.87,.49],[.12,.62],[.9,.52],[.86,.74]];
  const renderFlight=()=>{
   flightFrame=0;
   if(motion.matches||document.hidden||!plane.current)return;
   const dx=destination.x-flight.x,dy=destination.y-flight.y;
   if(Math.hypot(dx,dy)>.6){
    flight.x+=dx*.12;flight.y+=dy*.12;
    const angle=Math.atan2(dy,dx)*180/Math.PI;
    const difference=((angle-flight.angle+540)%360)-180;flight.angle+=difference*.12;
    const last=history[history.length-1];if(!last||Math.hypot(last.x-flight.x,last.y-flight.y)>7){history.push({x:flight.x,y:flight.y});if(history.length>19)history.shift();}
    flightFrame=requestAnimationFrame(renderFlight);
   }
   plane.current.style.transform=`translate3d(${flight.x}px,${flight.y}px,0) rotate(${flight.angle}deg)`;
   if(trail.current)trail.current.setAttribute('d',history.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '));
  };
  const route=()=>{
   if(motion.matches||!sections.length){if(plane.current)plane.current.dataset.visible='false';return;}
   const current=scrollY+innerHeight*.5;
   const centers=sections.map(s=>{const rect=s.getBoundingClientRect();return scrollY+rect.top+rect.height*.35;});
   let index=0;while(index<centers.length-2&&current>centers[index+1])index++;
   const progress=Math.max(0,Math.min(1,(current-centers[index])/(centers[index+1]-centers[index])));
   const start=waypoints[index],end=waypoints[index+1];
   const mobile=innerWidth<768;
   destination={x:mobile?innerWidth-27:innerWidth*(start[0]+(end[0]-start[0])*progress),y:innerHeight*(start[1]+(end[1]-start[1])*progress)-Math.sin(progress*Math.PI)*(mobile?25:90),angle:0};
   if(plane.current){plane.current.dataset.visible='true';plane.current.dataset.section=sections[progress>.5?index+1:index].id;}
   if(!flightFrame)flightFrame=requestAnimationFrame(renderFlight);
  };
  const scroll=()=>{if(isActive()&&!pointerFrame)pointerFrame=requestAnimationFrame(renderPointer);route();};
  const update=()=>{setSupported(desktop());if(!desktop())clear();history.length=0;route();if(isActive())refreshCopy();};
  const visibility=()=>{if(document.hidden){clear();cancelAnimationFrame(flightFrame);flightFrame=0;}else route();};
  const observer=new MutationObserver(()=>{if(isActive()&&document.querySelector('dialog[open]')){clear();return;}if(isActive()&&!rebuildFrame)rebuildFrame=requestAnimationFrame(()=>{rebuildFrame=0;refreshCopy();});});
  if(source)observer.observe(source,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['open']});
  const resizeObserver=new ResizeObserver(()=>{route();if(isActive())refreshCopy();});
  sections.forEach(section=>resizeObserver.observe(section));
  update();
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',clear);window.addEventListener('blur',clear);window.addEventListener('contextmenu',context);window.addEventListener('keydown',key);window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',update);document.addEventListener('visibilitychange',visibility);fine.addEventListener('change',update);motion.addEventListener('change',update);
  return()=>{
   cancelAnimationFrame(pointerFrame);cancelAnimationFrame(flightFrame);cancelAnimationFrame(rebuildFrame);observer.disconnect();resizeObserver.disconnect();document.documentElement.classList.remove('lens-held');viewport.current?.replaceChildren();toggle.current=()=>{};
   window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',clear);window.removeEventListener('blur',clear);window.removeEventListener('contextmenu',context);window.removeEventListener('keydown',key);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',update);document.removeEventListener('visibilitychange',visibility);fine.removeEventListener('change',update);motion.removeEventListener('change',update);
  };
 },[]);
 return <>
  <div className="paper-atmosphere" aria-hidden="true"><div className="paper-grain"/><div className="paper-grid"/><div ref={glow} className="paper-glow"/></div>
  <div className="flight-layer" aria-hidden="true"><svg className="flight-trail"><path ref={trail}/></svg><div ref={plane} className="paper-plane" data-visible="false"><svg viewBox="0 0 76 52"><path d="M4 5 71 25 7 46 20 27Z" fill="#eeeadb" stroke="#777260" strokeWidth="1" strokeLinejoin="round"/><path d="m4 5 27 21 40-1-50 6Z" fill="#fbf8ee" stroke="#777260" strokeWidth="1" strokeLinejoin="round"/><path d="m21 31 10-5-7 14Z" fill="#b5ae97" stroke="#777260" strokeWidth=".8"/><path d="m31 26 40-1" stroke="#9b937b" strokeWidth=".7"/></svg></div></div>
  {supported&&<div className="lens-tools"><button type="button" className="lens-toggle" onClick={()=>toggle.current()} aria-pressed={active} aria-label="Kaca pembesar" aria-describedby="lens-instructions"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6M7 10h6M10 7v6"/></svg><span>Explore the details</span><kbd>1.75×</kbd></button><span id="lens-instructions">Tahan klik kanan · atau klik ikon. Panah untuk geser, Esc untuk tutup.</span></div>}
  <div ref={lens} className="magnifying-glass" data-active="false" aria-hidden="true"><div className="lens-handle"/><div className="lens-rim"><div ref={viewport} className="lens-viewport"/><div className="lens-reflection"/></div><span className="lens-stamp">1.75 × / A CLOSER LOOK</span></div>
 </>;
}
