import {useEffect,useRef,useState} from 'react';
import {useDevicePerformance} from '../hooks/useDevicePerformance';
export default function Scene() {
 const host = useRef<HTMLDivElement>(null);
 const quality = useDevicePerformance();
 const [ready,setReady] = useState(false);
 useEffect(() => {
  if(quality === 'static') return;
  let cancelled=false; let cleanup = () => {};
  import('three').then(async T => {
   if(cancelled || !host.current) return;
   const element=host.current;
   let renderer: InstanceType<typeof T.WebGLRenderer>;
   try {renderer = new T.WebGLRenderer({alpha:true,antialias:quality==='high',powerPreference:'low-power'});} catch {return;}
   renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='high'?1.75:1));
   element.appendChild(renderer.domElement);
   const scene=new T.Scene(); const camera=new T.PerspectiveCamera(38,1,.1,100);camera.position.z=7.5;
   const group=new T.Group();scene.add(group);
   const core=new T.Mesh(new T.TorusKnotGeometry(.84,.29,quality==='high'?180:90,quality==='high'?28:14,2,3),new T.MeshPhysicalMaterial({color:0xcacac4,metalness:1,roughness:.19,clearcoat:1,clearcoatRoughness:.15})); group.add(core);
   let environment: InstanceType<typeof T.WebGLRenderTarget> | undefined;
   const generator=new T.PMREMGenerator(renderer);
   try{const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');const room=new RoomEnvironment();environment=generator.fromScene(room,.04);scene.environment=Array.isArray(environment.texture)?environment.texture[0]:environment.texture;room.dispose();}catch{/* Directional lights remain available. */}finally{generator.dispose();}
   if(cancelled){environment?.dispose();core.geometry.dispose();(core.material as InstanceType<typeof T.MeshPhysicalMaterial>).dispose();renderer.dispose();renderer.domElement.remove();return;}
   for(let i=0;i<2;i++){
    const ring=new T.Mesh(new T.TorusGeometry(1.9+i*.18,.004,4,100),new T.MeshBasicMaterial({color:0x88887e,transparent:true,opacity:.28}));
    ring.rotation.set(.55+i*.65,.25+i*.8,.3);group.add(ring);
   }
   const nodes: InstanceType<typeof T.Mesh>[]=[];
   for(let i=0;i<5;i++) {const node=new T.Mesh(new T.OctahedronGeometry(.075),new T.MeshBasicMaterial({color:0x77776e}));group.add(node);nodes.push(node);}
   const count=quality==='high'?28:12; const positions=new Float32Array(count*3);
   for(let i=0;i<positions.length;i++)positions[i]=(Math.random()-.5)*9;
   const particles=new T.Points(new T.BufferGeometry().setAttribute('position',new T.BufferAttribute(positions,3)),new T.PointsMaterial({color:0x9a9a8a,size:.012,transparent:true,opacity:.35}));scene.add(particles);
   scene.add(new T.AmbientLight(0xffffff,2));const light=new T.PointLight(0xffffff,65);light.position.set(3,3,4);scene.add(light);
   const fill=new T.PointLight(0xffffff,50);fill.position.set(-3,-1,2);scene.add(fill);
   const pointer={x:0,y:0};let visible=true;let lost=false;
   const move=(e:PointerEvent)=>{if(e.pointerType==='mouse'){pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;}};
   const resize=()=>{const w=element.clientWidth,h=element.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};resize();
   const observer=new ResizeObserver(resize);observer.observe(element);
   const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(element);
   const render=(time:number)=>{
    if(!visible || document.hidden || lost)return;
    const t=time*.00008;const scroll=Math.min(scrollY/innerHeight,1);
    group.rotation.y=t+pointer.x*.35;group.rotation.x=.3+pointer.y*.2;group.position.y=-scroll*.3;
    group.scale.setScalar(1-scroll*.15);camera.position.x+=(pointer.x*.5-camera.position.x)*.035;camera.position.z=7.5+scroll;
    nodes.forEach((node,i)=>{const angle=t*(i%2?-.6:.6)+i*Math.PI*2/5;node.position.set(Math.cos(angle)*2.15,Math.sin(angle)*1.65,Math.sin(angle+i)*.65);});
    particles.rotation.y=t*.12;renderer.render(scene,camera);
   };
   const contextLost=(event:Event)=>{event.preventDefault();lost=true;setReady(false);};
   renderer.domElement.addEventListener('webglcontextlost',contextLost);
   window.addEventListener('pointermove',move,{passive:true});renderer.setAnimationLoop(render);setReady(true);
   cleanup=()=>{renderer.setAnimationLoop(null);observer.disconnect();intersection.disconnect();window.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('webglcontextlost',contextLost);scene.traverse(object=>{if(object instanceof T.Mesh || object instanceof T.Points){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});environment?.dispose();renderer.dispose();renderer.domElement.remove();};
  }).catch(()=>setReady(false));
  return ()=>{cancelled=true;cleanup();setReady(false);};
 },[quality]);
 return <div className="scene-wrap" aria-hidden="true"><div className={`static-core ${ready?'hidden':''}`}><div/><div/><div/><span>F.</span></div><div ref={host} className="scene-canvas"/><span className="scene-label label-one">React</span><span className="scene-label label-two">TypeScript</span><span className="scene-label label-three">Node.js</span><span className="scene-label label-four">Three.js</span><span className="scene-caption">{ready?'LIVE RENDER / THREE.JS':'STILL LIFE / FARID'} <i/> IDEAS IN MOTION</span></div>;
}
