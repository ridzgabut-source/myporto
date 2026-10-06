import { useEffect, useRef, useState } from 'react';
import { useDevicePerformance } from '../hooks/useDevicePerformance';

export default function Scene() {
  const host = useRef<HTMLDivElement>(null);
  const quality = useDevicePerformance();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (quality === 'static' || !host.current) return;
    const controller = new AbortController();
    const element = host.current;
    let dispose = () => {};
    let idle = 0,
      timer = 0;
    const load = () => {
      import('./createScene')
        .then(async ({ createScene }) => {
          if (controller.signal.aborted) return;
          const cleanup = await createScene(
            element,
            quality,
            controller.signal,
            setReady,
          );
          if (controller.signal.aborted) cleanup();
          else dispose = cleanup;
        })
        .catch(() => {
          if (!controller.signal.aborted) setReady(false);
        });
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      // Let the critical text and local fonts paint before preparing WebGL.
      document.fonts.ready.then(() => {
        if (controller.signal.aborted) return;
        if (typeof window.requestIdleCallback === 'function')
          idle = window.requestIdleCallback(load, { timeout: 1200 });
        else timer = window.setTimeout(load, 120);
      });
    });
    observer.observe(element);
    return () => {
      controller.abort();
      observer.disconnect();
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      dispose();
      setReady(false);
    };
  }, [quality]);
  return (
    <div className="scene-wrap" aria-hidden="true">
      <div className={`static-core ${ready ? 'hidden' : ''}`}>
        <div />
        <div />
        <div />
        <span>F.</span>
      </div>
      <div ref={host} className="scene-canvas" />
      <span className="scene-label label-one">React</span>
      <span className="scene-label label-two">TypeScript</span>
      <span className="scene-label label-three">Node.js</span>
      <span className="scene-label label-four">Three.js</span>
      <span className="scene-caption">
        {ready ? 'LIVE RENDER / THREE.JS' : 'STILL LIFE / FARID'} <i /> IDEAS IN
        MOTION
      </span>
    </div>
  );
}
