import { useEffect, useState } from 'react';
export function useDevicePerformance() {
 const [quality,setQuality] = useState<'static'|'low'|'high'>('static');
 useEffect(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setQuality(motion.matches ? 'static' : innerWidth < 768 || navigator.hardwareConcurrency < 4 ? 'low' : 'high');
  update(); motion.addEventListener('change',update); window.addEventListener('resize',update);
  return () => {motion.removeEventListener('change',update);window.removeEventListener('resize',update);};
 },[]);
 return quality;
}
