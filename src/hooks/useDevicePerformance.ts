import { useEffect, useState } from 'react';
export type RenderQuality = 'static' | 'low' | 'high';

export function useDevicePerformance() {
  const [quality, setQuality] = useState<RenderQuality>('static');
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width:767px)');
    const coarse = matchMedia('(pointer:coarse)');
    const update = () =>
      setQuality(
        motion.matches
          ? 'static'
          : compact.matches ||
              coarse.matches ||
              navigator.hardwareConcurrency < 4
            ? 'low'
            : 'high',
      );
    update();
    // Media query changes avoid work on browser toolbar resize events.
    const queries = [motion, compact, coarse];
    queries.forEach((query) => query.addEventListener('change', update));
    return () =>
      queries.forEach((query) => query.removeEventListener('change', update));
  }, []);
  return quality;
}
