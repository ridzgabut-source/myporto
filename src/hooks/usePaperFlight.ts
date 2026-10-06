import { useEffect } from 'react';
import type { RefObject } from 'react';

type Position = { x: number; y: number; angle: number };
const WAYPOINTS = [
  [0.87, 0.64],
  [0.12, 0.51],
  [0.87, 0.49],
  [0.12, 0.62],
  [0.9, 0.52],
  [0.86, 0.74],
];
const smoothstep = (progress: number) =>
  progress * progress * (3 - 2 * progress);

export function usePaperFlight(
  plane: RefObject<HTMLDivElement | null>,
  trail: RefObject<SVGPathElement | null>,
) {
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('#main section[id]'),
    );
    let width = innerWidth,
      height = innerHeight;
    let centers: number[] = [];
    let routeFrame = 0,
      flightFrame = 0,
      lastTime = 0,
      initialized = false;
    let flight: Position = { x: 0, y: 0, angle: 0 };
    let destination = { ...flight };
    const history: { x: number; y: number }[] = [];
    const paused = () =>
      motion.matches ||
      document.hidden ||
      document.documentElement.classList.contains('mobile-menu-open');
    const stop = () => {
      cancelAnimationFrame(flightFrame);
      cancelAnimationFrame(routeFrame);
      flightFrame = 0;
      routeFrame = 0;
      lastTime = 0;
    };
    const paint = () => {
      if (plane.current)
        plane.current.style.transform = `translate3d(${flight.x.toFixed(2)}px,${flight.y.toFixed(2)}px,0) rotate(${flight.angle.toFixed(2)}deg)`;
    };
    const animate = (time: number) => {
      flightFrame = 0;
      if (paused()) {
        lastTime = 0;
        return;
      }
      const elapsed = lastTime ? Math.min(time - lastTime, 48) : 16;
      lastTime = time;
      const ease = 1 - Math.exp(-elapsed / 110);
      const dx = destination.x - flight.x,
        dy = destination.y - flight.y;
      const turn = ((destination.angle - flight.angle + 540) % 360) - 180;
      flight.x += dx * ease;
      flight.y += dy * ease;
      flight.angle += turn * ease;
      paint();
      // The mobile tail travels with the plane in one compositor layer.
      // Desktop keeps a short history; only update its path after meaningful movement.
      if (width >= 768) {
        const last = history[history.length - 1];
        if (!last || Math.hypot(last.x - flight.x, last.y - flight.y) > 7) {
          history.push({ x: flight.x, y: flight.y });
          if (history.length > 19) history.shift();
          trail.current?.setAttribute(
            'd',
            history
              .map(
                (point, index) =>
                  `${index ? 'L' : 'M'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
              )
              .join(' '),
          );
        }
      }
      if (Math.hypot(dx, dy) > 0.2 || Math.abs(turn) > 0.2)
        flightFrame = requestAnimationFrame(animate);
      else lastTime = 0;
    };
    const route = () => {
      routeFrame = 0;
      if (motion.matches) {
        if (plane.current) plane.current.dataset.visible = 'false';
        stop();
        return;
      }
      if (paused() || centers.length < 2) return;
      const current = scrollY + height * 0.5;
      let index = 0;
      while (index < centers.length - 2 && current > centers[index + 1])
        index++;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (current - centers[index]) /
            Math.max(1, centers[index + 1] - centers[index]),
        ),
      );
      const eased = smoothstep(progress);
      const start = WAYPOINTS[index],
        end = WAYPOINTS[index + 1];
      const mobile = width < 768;
      const deltaX = width * (end[0] - start[0]);
      const deltaY = height * (end[1] - start[1]);
      destination = {
        x: mobile
          ? width - 25
          : width * (start[0] + (end[0] - start[0]) * eased),
        y:
          height * (start[1] + (end[1] - start[1]) * eased) -
          Math.sin(eased * Math.PI) * (mobile ? 18 : 90),
        angle: mobile
          ? -22 + Math.sin(eased * Math.PI) * 12
          : (Math.atan2(
              deltaY - Math.cos(eased * Math.PI) * 90 * Math.PI,
              deltaX,
            ) *
              180) /
            Math.PI,
      };
      if (!initialized) {
        flight = { ...destination };
        initialized = true;
        paint();
      }
      if (plane.current) {
        plane.current.dataset.visible = 'true';
        plane.current.dataset.section =
          sections[progress > 0.5 ? index + 1 : index].id;
      }
      if (!flightFrame) flightFrame = requestAnimationFrame(animate);
    };
    const schedule = () => {
      if (!routeFrame) routeFrame = requestAnimationFrame(route);
    };
    // Geometry reads happen when layout changes, never in the scroll handler.
    const measure = () => {
      const offset = scrollY;
      centers = sections.map((section) => {
        const rect = section.getBoundingClientRect();
        return offset + rect.top + rect.height * 0.35;
      });
      schedule();
    };
    const resize = () => {
      // Ignore toolbar-only height changes on phones: they otherwise jerk the flight route.
      if (innerWidth !== width || width >= 768) {
        width = innerWidth;
        height = innerHeight;
        history.length = 0;
        trail.current?.setAttribute('d', '');
        measure();
      }
    };
    const visibility = () => {
      if (document.hidden) stop();
      else schedule();
    };
    const layout = new ResizeObserver(measure);
    sections.forEach((section) => layout.observe(section));
    // Resume at the existing position after closing the mobile menu.
    const menu = new MutationObserver(() => {
      if (paused()) stop();
      else schedule();
    });
    menu.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', schedule);
    return () => {
      stop();
      layout.disconnect();
      menu.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', schedule);
    };
  }, [plane, trail]);
}
