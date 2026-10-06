import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { RenderQuality } from '../hooks/useDevicePerformance';

type AnimatedQuality = Exclude<RenderQuality, 'static'>;

export async function createScene(
  element: HTMLElement,
  quality: AnimatedQuality,
  signal: AbortSignal,
  onReady: (ready: boolean) => void,
) {
  const high = quality === 'high';
  const matcap = high
    ? undefined
    : await new T.TextureLoader()
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
  renderer.setPixelRatio(Math.min(devicePixelRatio, high ? 1.75 : 1));
  element.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 7.5;
  const group = new T.Group();
  scene.add(group);
  const core = new T.Mesh(
    new T.TorusKnotGeometry(0.84, 0.29, high ? 180 : 72, high ? 28 : 12, 2, 3),
    high
      ? new T.MeshPhysicalMaterial({
          color: 0xcacac4,
          metalness: 1,
          roughness: 0.19,
          clearcoat: 1,
          clearcoatRoughness: 0.15,
        })
      : matcap
        ? new T.MeshMatcapMaterial({ color: 0xffffff, matcap })
        : new T.MeshStandardMaterial({
            color: 0xcacac4,
            metalness: 1,
            roughness: 0.24,
          }),
  );
  group.add(core);
  let environment: T.WebGLRenderTarget | undefined;
  if (high) {
    const generator = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    try {
      environment = generator.fromScene(room, 0.04);
      scene.environment = Array.isArray(environment.texture)
        ? environment.texture[0]
        : environment.texture;
    } catch {
      /* Direct lights remain available. */
    } finally {
      room.dispose();
      generator.dispose();
    }
  }
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
  const nodes: T.Mesh[] = [];
  const nodeGeometry = new T.OctahedronGeometry(0.075);
  const nodeMaterial = new T.MeshBasicMaterial({ color: 0x77776e });
  for (let index = 0; index < 5; index++) {
    const node = new T.Mesh(nodeGeometry, nodeMaterial);
    group.add(node);
    nodes.push(node);
  }
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
  scene.add(new T.AmbientLight(0xffffff, 2));
  const light = new T.PointLight(0xffffff, 65);
  light.position.set(3, 3, 4);
  scene.add(light);
  const fill = new T.PointLight(0xffffff, 50);
  fill.position.set(-3, -1, 2);
  scene.add(fill);
  let frame = 0,
    lastTime = 0,
    elapsed = 0,
    visible = false,
    lost = false,
    disposed = false;
  let width = 0,
    height = 0;
  const pointer = { x: 0, y: 0 };
  let targetScroll = 0,
    currentScroll = 0;
  const scroll = () => {
    targetScroll = Math.min(Math.max(scrollY / Math.max(height, 1), 0), 1);
  };
  const running = () =>
    visible &&
    !document.hidden &&
    !lost &&
    !disposed &&
    !document.documentElement.classList.contains('mobile-menu-open');
  const render = (time: number) => {
    frame = 0;
    if (!running()) {
      lastTime = 0;
      return;
    }
    const delta = lastTime ? Math.min(time - lastTime, 48) : 16;
    lastTime = time;
    elapsed += delta;
    const ease = 1 - Math.exp(-delta / 180);
    const t = elapsed * 0.00008;
    currentScroll += (targetScroll - currentScroll) * ease;
    group.rotation.y = t + pointer.x * 0.35;
    group.rotation.x = 0.3 + pointer.y * 0.2;
    group.position.y = -currentScroll * 0.3;
    group.scale.setScalar(1 - currentScroll * 0.15);
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * ease;
    camera.position.z = 7.5 + currentScroll;
    nodes.forEach((node, index) => {
      const angle = t * (index % 2 ? -0.6 : 0.6) + (index * Math.PI * 2) / 5;
      node.position.set(
        Math.cos(angle) * 2.15,
        Math.sin(angle) * 1.65,
        Math.sin(angle + index) * 0.65,
      );
    });
    particles.rotation.y = t * 0.12;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  const sync = () => {
    if (running()) {
      if (!frame) frame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
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
    environment?.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
  if (signal.aborted) dispose();
  else onReady(true);
  return dispose;
}
