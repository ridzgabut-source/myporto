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
    return () => {
      controller.abort();
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
