import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const server = await createServer({
  server: { host: '127.0.0.1', port: 4182, strictPort: true },
});
await server.listen();
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 256, height: 256 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  await page.goto('http://127.0.0.1:4182/');
  await page.evaluate(async () => {
    const T = await import('/node_modules/three/build/three.module.js');
    const { RoomEnvironment } =
      await import('/node_modules/three/examples/jsm/environments/RoomEnvironment.js');
    const renderer = new T.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(256, 256);
    renderer.setClearColor(0x000000, 0);
    document.body.replaceChildren(renderer.domElement);
    document.body.style.cssText =
      'margin:0;width:256px;height:256px;overflow:hidden;background:transparent;box-shadow:none;border-radius:0';
    document.documentElement.style.background = 'transparent';
    const scene = new T.Scene();
    const camera = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 3;
    const room = new RoomEnvironment();
    const generator = new T.PMREMGenerator(renderer);
    const environment = generator.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.add(
      new T.Mesh(
        new T.SphereGeometry(0.99, 64, 48),
        new T.MeshPhysicalMaterial({
          color: 0xcacac4,
          metalness: 1,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.15,
        }),
      ),
    );
    scene.add(new T.AmbientLight(0xffffff, 2));
    const light = new T.PointLight(0xffffff, 65);
    light.position.set(3, 3, 4);
    scene.add(light);
    const fill = new T.PointLight(0xffffff, 50);
    fill.position.set(-3, -1, 2);
    scene.add(fill);
    renderer.render(scene, camera);
  });
  await mkdir('public/textures', { recursive: true });
  await page.screenshot({
    path: 'public/textures/chrome-matcap.png',
    omitBackground: true,
  });
} finally {
  await browser?.close();
  await server.close();
}
