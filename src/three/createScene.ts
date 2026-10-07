import * as T from 'three';
import type { RenderQuality } from '../hooks/useDevicePerformance';

type AnimatedQuality = Exclude<RenderQuality, 'static'>;

export async function createScene(
  element: HTMLElement,
  quality: AnimatedQuality,
  signal: AbortSignal,
  onReady: (ready: boolean) => void,
) {
  const high = quality === 'high';
  // Bake the chrome lighting once, rather than generating an environment on every visit.
  const matcap = await new T.TextureLoader()
    .loadAsync('/textures/chrome-matcap.png')
    .catch(() => undefined);
  if (matcap) matcap.colorSpace = T.SRGBColorSpace;
  if (signal.aborted) {
    matcap?.dispose();
    return () => {};
  }
  let renderer: T.WebGLRenderer;
  try {
    renderer = new T.WebGLRenderer({
      alpha: true,
      antialias: high,
      powerPreference: 'low-power',
    });
  } catch {
    matcap?.dispose();
    return () => {};
  }
  let pixelRatio = Math.min(devicePixelRatio, high ? 1.25 : 1);
  renderer.setPixelRatio(pixelRatio);
  element.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 7.5;
  const group = new T.Group();
  scene.add(group);
  const core = new T.Mesh(
    new T.TorusKnotGeometry(0.84, 0.29, high ? 112 : 72, high ? 20 : 12, 2, 3),
    matcap ? new T.MeshMatcapMaterial({ matcap }) : new T.MeshNormalMaterial(),
  );
  group.add(core);
  for (let index = 0; index < 2; index++) {
    const ring = new T.Mesh(
      new T.TorusGeometry(1.9 + index * 0.18, 0.004, 4, high ? 100 : 64),
      new T.MeshBasicMaterial({
        color: 0x88887e,
        transparent: true,
        opacity: 0.28,
      }),
    );
    ring.rotation.set(0.55 + index * 0.65, 0.25 + index * 0.8, 0.3);
    group.add(ring);
  }
  const nodes = new T.InstancedMesh(
    new T.OctahedronGeometry(0.075),
    new T.MeshBasicMaterial({ color: 0x77776e }),
    5,
  );
  nodes.instanceMatrix.setUsage(T.DynamicDrawUsage);
  // The five small satellites orbit outside their initial shared bounds.
  nodes.frustumCulled = false;
  group.add(nodes);
  const nodeMatrix = new T.Matrix4();
  const positions = new Float32Array((high ? 28 : 12) * 3);
  for (let index = 0; index < positions.length; index++)
    positions[index] = (Math.random() - 0.5) * 9;
  const particles = new T.Points(
    new T.BufferGeometry().setAttribute(
      'position',
      new T.BufferAttribute(positions, 3),
    ),
    new T.PointsMaterial({
      color: 0x9a9a8a,
      size: 0.012,
      transparent: true,
      opacity: 0.35,
    }),
  );
  scene.add(particles);
  let frame = 0,
    lastTime = 0,
    nextRenderTime = 0,
    elapsed = 0,
    blocked = false,
    visible = false,
    lost = false,
    disposed = false,
    presented = false;
  let slowFrames = 0;
  let width = 0,
    height = 0;
  const pointer = { x: 0, y: 0 };
  const currentPointer = { x: 0, y: 0 };
  let targetScroll = 0,
    currentScroll = 0;
  const scroll = () => {
    targetScroll = Math.min(Math.max(scrollY / Math.max(height, 1), 0), 1);
  };
  const running = () =>
    visible && !document.hidden && !lost && !disposed && !blocked;
  const render = (time: number) => {
    frame = 0;
    if (!running()) {
      lastTime = 0;
      nextRenderTime = 0;
      return;
    }
    // Avoid rendering twice as many pixels on 120/144 Hz displays.
    if (lastTime && time < nextRenderTime - 0.75) {
      frame = requestAnimationFrame(render);
      return;
    }
    // Keep the fractional remainder so 144 Hz screens do not fall to 48 fps.
    const interval = 1000 / 60;
    const overshoot = nextRenderTime ? Math.max(0, time - nextRenderTime) : 0;
    nextRenderTime = time + interval - (overshoot % interval);
    const frameTime = lastTime ? time - lastTime : interval;
    const delta = Math.min(frameTime, 48);
    // Sustained slow frames reduce resolution, without rebuilding the scene.
    slowFrames = frameTime > 26 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (high && slowFrames >= 45 && pixelRatio > 1) {
      pixelRatio = 1;
      renderer.setPixelRatio(pixelRatio);
      slowFrames = 0;
    }
    lastTime = time;
    elapsed += delta;
    const ease = 1 - Math.exp(-delta / 180);
    const t = elapsed * 0.00008;
    currentScroll += (targetScroll - currentScroll) * ease;
    currentPointer.x += (pointer.x - currentPointer.x) * ease;
    currentPointer.y += (pointer.y - currentPointer.y) * ease;
    group.rotation.y = t + currentPointer.x * 0.35;
    group.rotation.x = 0.3 + currentPointer.y * 0.2;
    group.position.y = -currentScroll * 0.3;
    group.scale.setScalar(1 - currentScroll * 0.15);
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * ease;
    camera.position.z = 7.5 + currentScroll;
    for (let index = 0; index < nodes.count; index++) {
      const angle = t * (index % 2 ? -0.6 : 0.6) + (index * Math.PI * 2) / 5;
      nodeMatrix.makeTranslation(
        Math.cos(angle) * 2.15,
        Math.sin(angle) * 1.65,
        Math.sin(angle + index) * 0.65,
      );
      nodes.setMatrixAt(index, nodeMatrix);
    }
    nodes.instanceMatrix.needsUpdate = true;
    particles.rotation.y = t * 0.12;
    renderer.render(scene, camera);
    if (!presented) {
      presented = true;
      onReady(true);
    }
    frame = requestAnimationFrame(render);
  };
  const sync = () => {
    blocked =
      document.documentElement.classList.contains('mobile-menu-open') ||
      document.documentElement.classList.contains('lens-held') ||
      Boolean(document.querySelector('dialog[open]'));
    if (running()) {
      if (!frame) frame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      nextRenderTime = 0;
    }
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') {
      pointer.x = event.clientX / innerWidth - 0.5;
      pointer.y = event.clientY / innerHeight - 0.5;
    }
  };
  const resize = () => {
    const nextWidth = element.clientWidth,
      nextHeight = element.clientHeight;
    if (
      !nextWidth ||
      !nextHeight ||
      (nextWidth === width && nextHeight === height)
    )
      return;
    width = nextWidth;
    height = nextHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    scroll();
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    sync();
    onReady(false);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(element);
  resize();
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  intersection.observe(element);
  const menu = new MutationObserver(sync);
  menu.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  const dialogs = new MutationObserver(sync);
  const content = document.getElementById('portfolio-content');
  if (content)
    dialogs.observe(content, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open'],
    });
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  if (high) window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('scroll', scroll, { passive: true });
  document.addEventListener('visibilitychange', sync);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    sync();
    observer.disconnect();
    intersection.disconnect();
    menu.disconnect();
    dialogs.disconnect();
    window.removeEventListener('pointermove', move);
    window.removeEventListener('scroll', scroll);
    document.removeEventListener('visibilitychange', sync);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    const geometries = new Set<T.BufferGeometry>();
    const materials = new Set<T.Material>();
    scene.traverse((object) => {
      if (object instanceof T.Mesh || object instanceof T.Points) {
        geometries.add(object.geometry);
        (Array.isArray(object.material)
          ? object.material
          : [object.material]
        ).forEach((material) => materials.add(material));
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    matcap?.dispose();
    nodes.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
  if (signal.aborted) dispose();
  return dispose;
}
