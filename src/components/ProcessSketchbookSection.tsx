import {
  memo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Eyebrow, SketchAnnotation, SketchStroke } from './utils';
import { PROCESS_PLATES, type ProcessPlate } from '../data/processPlates';

// ── CONSTANTS FOR MENG TO TACTILE ENGINE ──────────────────────────────────
const N = 18;          // 18 strips for realistic paper curl curvature
const SPAN = 0.449;    // gutter to outer edge span fraction
const BETA = 0.60;     // peak curl arc in radians
const TILT_X = 4.5;
const TILT_Y = 7;
const ZOOM_MIN = 0.9;
const ZOOM_MAX = 1.45;
const MAG = 2.3;

// ── EDITORIAL PLATES INDEX LIST (Strict Rule 4: Memoized) ──────────────────
interface PlateListProps {
  plates: ProcessPlate[];
  currentIdx: number;
  onSelect: (index: number) => void;
}

const PlateList = memo(({ plates, currentIdx, onSelect }: PlateListProps) => {
  return (
    <div style={{
      maxWidth: '1060px',
      marginInline: 'auto',
      marginTop: 'clamp(2.5rem, 5vw, 4rem)',
      paddingInline: 'var(--container-px)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'var(--ink-400)',
        marginBottom: '1rem',
      }}>
        Daftar Lembaran Kerja (Klik untuk Buka Langsung):
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '0.65rem',
      }}>
        {plates.map((plate, i) => {
          const isActive = i === currentIdx;
          return (
            <button
              key={plate.id}
              onClick={() => onSelect(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--ink-900)' : 'var(--paper-50)',
                color: isActive ? 'var(--paper-50)' : 'var(--ink-800)',
                border: `1.5px solid ${isActive ? 'var(--ink-900)' : 'var(--paper-300)'}`,
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-hairline)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 250ms var(--ease-fluid)',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--ink-700)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--paper-300)';
                  e.currentTarget.style.transform = 'none';
                }
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: isActive ? 'var(--accent-300)' : 'var(--accent-500)',
              }}>
                {plate.number}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {plate.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: isActive ? 'rgba(255,255,255,0.6)' : 'var(--ink-500)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '2px',
                }}>
                  {plate.subtitle}
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: isActive ? 'var(--accent-300)' : 'var(--ink-400)',
              }}>
                {isActive ? '●' : '→'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
PlateList.displayName = 'PlateList';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT: ProcessSketchbookSection
// ═══════════════════════════════════════════════════════════════════════════
export const ProcessSketchbookSection = memo(() => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [loupeEnabled, setLoupeEnabled] = useState(true);

  // References for DOM and Physics tracking (Strict Rule 3)
  const stageRef = useRef<HTMLDivElement>(null);
  const sb3dRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);
  const zoomInnerRef = useRef<HTMLDivElement>(null);

  // State refs for animation loops without triggering parent re-render
  const curIdxRef = useRef(0);
  const turnRef = useRef<{ dir: 'next' | 'prev'; from: number; to: number; t: number } | null>(null);
  const stripsRef = useRef<HTMLDivElement[]>([]);
  const springRef = useRef<{
    kind: 'spring' | 'tween';
    v?: number;
    target: number;
    done?: () => void;
    k?: number;
    c?: number;
    from?: number;
    dur?: number;
    e?: number;
  } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const dragRef = useRef<{
    dir: 'next' | 'prev';
    x0: number;
    w: number;
    moved: number;
    vel: number;
    tPrev: number;
  } | null>(null);

  // Loupe tracking refs
  const lxRef = useRef<number | null>(null);
  const lyRef = useRef<number | null>(null);
  const lgrabRef = useRef<{ cx: number; cy: number; lx0: number; ly0: number } | null>(null);
  const lTargetRef = useRef<{ x: number; y: number } | null>(null);

  // 3D tilt tracking refs
  const viewRef = useRef({ rx: 0, ry: 0, z: 1, trx: 0, try_: 0, tz: 1 });
  const viewActiveRef = useRef(false);

  const M = PROCESS_PLATES.length;

  // ── Kick Animation Frame Loop ──────────────────────────────────────────
  const kick = useCallback(() => {
    if (rafRef.current === null) {
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(function tick(now) {
        rafRef.current = null;
        const dt = Math.min(0.032, (now - lastTimeRef.current) / 1000 || 0.016);
        lastTimeRef.current = now;

        // 1. Process Spring Page Turn
        if (springRef.current && turnRef.current) {
          const s = springRef.current;
          if (s.kind === 'tween') {
            s.e = (s.e || 0) + dt;
            const k = Math.min(1, s.e / (s.dur || 0.3));
            turnRef.current.t = (s.from || 0) + (s.target - (s.from || 0)) * k;
            applyTurn(turnRef.current.t);
            if (k >= 1) {
              springRef.current = null;
              if (s.done) s.done();
            }
          } else {
            const x = turnRef.current.t - s.target;
            s.v = (s.v || 0) + (-(s.k || 170) * x - (s.c || 26) * (s.v || 0)) * dt;
            turnRef.current.t += (s.v || 0) * dt;
            if (Math.abs(turnRef.current.t - s.target) < 0.002 && Math.abs(s.v || 0) < 0.02) {
              turnRef.current.t = s.target;
              springRef.current = null;
              applyTurn(turnRef.current.t);
              if (s.done) s.done();
            } else {
              applyTurn(turnRef.current.t);
            }
          }
        }

        // 2. Process View Tilt Spring
        const eTilt = 0.14;
        let tiltMoved = false;
        const v = viewRef.current;
        for (const [k, t] of [['rx', 'trx'], ['ry', 'try_'], ['z', 'tz']] as const) {
          const d = v[t] - v[k];
          if (Math.abs(d) > 0.0006) {
            v[k] += d * eTilt;
            tiltMoved = true;
          } else {
            v[k] = v[t];
          }
        }
        if (tiltMoved) {
          applyView();
        }
        viewActiveRef.current = tiltMoved;

        // 3. Process Loupe Shove Ease
        let lmoved = false;
        if (lTargetRef.current && lxRef.current !== null && lyRef.current !== null) {
          if (lgrabRef.current) {
            lTargetRef.current = null;
          } else {
            const dx = lTargetRef.current.x - lxRef.current;
            const dy = lTargetRef.current.y - lyRef.current;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
              lxRef.current = lTargetRef.current.x;
              lyRef.current = lTargetRef.current.y;
              lTargetRef.current = null;
              placeLoupe();
            } else {
              lxRef.current += dx * 0.17;
              lyRef.current += dy * 0.17;
              placeLoupe();
              lmoved = true;
            }
          }
        }

        if ((springRef.current || viewActiveRef.current || lmoved) && rafRef.current === null) {
          rafRef.current = requestAnimationFrame(tick);
        }
      });
    }
  }, []);

  // ── Apply 3D Tilt CSS ──────────────────────────────────────────────────
  const applyView = useCallback(() => {
    const sb3d = sb3dRef.current;
    if (!sb3d) return;
    const v = viewRef.current;
    sb3d.style.setProperty('--rx', v.rx.toFixed(2) + 'deg');
    sb3d.style.setProperty('--ry', v.ry.toFixed(2) + 'deg');
    sb3d.style.setProperty('--zoom', v.z.toFixed(3));
    placeLoupe();
  }, []);

  // ── Apply 18-Strip Curved Turn Physics ──────────────────────────────────
  const applyTurn = useCallback((t: number) => {
    const sb3d = sb3dRef.current;
    if (!sb3d) return;

    const th = Math.PI * t;
    const beta = BETA * Math.sin(Math.PI * t);
    const D = 180 / Math.PI;
    const tt = th + beta;
    const td = (2 * beta) / N;

    sb3d.style.setProperty('--tt', (tt * D).toFixed(2) + 'deg');
    sb3d.style.setProperty('--td', (td * D).toFixed(3) + 'deg');
    sb3d.style.setProperty('--shade', Math.sin(Math.PI * t).toFixed(3));

    const strips = stripsRef.current;
    for (let i = 0; i < strips.length; i++) {
      const l1 = Math.abs(Math.cos(tt - i * td));
      const l2 = Math.abs(Math.cos(tt - (i + 1) * td));
      const st = strips[i].style;
      st.setProperty('--lit', l1.toFixed(3));
      st.setProperty('--a1', ((1 - l1) * 0.62).toFixed(3));
      st.setProperty('--a2', ((1 - l2) * 0.62).toFixed(3));
    }
  }, []);

  // ── Build 18-Strip Curved Leaf DOM ─────────────────────────────────────
  const buildCurl = useCallback((dir: 'next' | 'prev', from: number, to: number) => {
    stripsRef.current = [];
    const c = document.createElement('div');
    c.className = 'curl ' + dir;
    c.style.setProperty('--n', String(N));
    c.style.setProperty('--span', String(SPAN));
    let host = c;

    for (let i = 0; i < N; i++) {
      const s = document.createElement('div');
      s.className = 'strip';
      s.style.setProperty('--i', String(i));
      const gut = 'calc(var(--bw) * 0.5)';
      const sw = 'calc(var(--bw) * ' + SPAN + ' / ' + N + ')';
      const A = 'calc(-1 * (' + gut + ' + ' + i + ' * ' + sw + '))';
      const B = 'calc(' + (i + 1) + ' * ' + sw + ' - ' + gut + ')';

      const f = document.createElement('div');
      f.className = 'face front';
      const b = document.createElement('div');
      b.className = 'face back';

      const dress = (el: HTMLElement, url: string, px: string) => {
        el.style.backgroundImage = 'url(' + url + ')';
        el.style.backgroundPositionX = px;
      };

      dress(f, PROCESS_PLATES[from].url, dir === 'next' ? A : B);
      dress(b, PROCESS_PLATES[to].url, dir === 'next' ? B : A);

      const shF = document.createElement('div');
      shF.className = 'sh';
      const glF = document.createElement('div');
      glF.className = 'gl';
      f.appendChild(shF);
      f.appendChild(glF);

      const shB = document.createElement('div');
      shB.className = 'sh';
      const glB = document.createElement('div');
      glB.className = 'gl';
      b.appendChild(shB);
      b.appendChild(glB);

      s.appendChild(f);
      s.appendChild(b);
      if (i === N - 1) s.classList.add('edge');
      host.appendChild(s);
      host = s;
      stripsRef.current.push(s);
    }
    return c;
  }, []);

  // ── Sync Magnified Layer for Loupe ─────────────────────────────────────
  const syncZoomLayer = useCallback(() => {
    const zoomInner = zoomInnerRef.current;
    const book = bookRef.current;
    if (!zoomInner || !book) return;
    zoomInner.textContent = '';
    for (const c of Array.from(book.children)) {
      if (c.classList.contains('sb-zone')) continue;
      zoomInner.appendChild(c.cloneNode(true));
    }
  }, []);

  // ── Place Loupe & Update Lens View ─────────────────────────────────────
  const placeLoupe = useCallback(() => {
    const loupe = loupeRef.current;
    const book = bookRef.current;
    const zoomWrap = zoomWrapRef.current;
    const zoomInner = zoomInnerRef.current;
    if (!loupe || !book || !zoomWrap || !zoomInner) return;
    if (lxRef.current === null || lyRef.current === null) return;

    const bw = book.clientWidth;
    const bh = book.clientHeight;
    if (!bw || !bh) return;

    const R = Math.round(Math.max(150, Math.min(240, bw * 0.22))) / 2;
    const bez = R * 2 * 0.058;
    loupe.style.setProperty('--lr', R * 2 + 'px');
    loupe.style.transform = `translate3d(${(lxRef.current - R).toFixed(1)}px, ${(lyRef.current - R).toFixed(1)}px, 0)`;

    const z = viewRef.current.z;
    const cx = bw / 2;
    const cy = bh / 2;
    const x0 = cx + (bw * 0.051 - cx) * z;
    const x1 = cx + (bw * 0.949 - cx) * z;
    const y0 = cy + (bh * 0.218 - cy) * z;
    const y1 = cy + (bh * 0.782 - cy) * z;

    const lx = lxRef.current;
    const ly = lyRef.current;
    const inside = lx > x0 && lx < x1 && ly > y0 && ly < y1
      ? Math.min(lx - x0, x1 - lx, ly - y0, y1 - ly)
      : -100;
    const k = Math.max(0, Math.min(1, (inside + R * 0.3) / (R * 0.55)));

    zoomWrap.style.opacity = k.toFixed(3);
    if (k > 0.002) {
      const r = (R - bez).toFixed(1);
      const mask = `radial-gradient(circle ${r}px at ${lx.toFixed(1)}px ${ly.toFixed(1)}px, #000 calc(100% - 1px), transparent 100%)`;
      zoomWrap.style.webkitMaskImage = mask;
      zoomWrap.style.maskImage = mask;

      const px = cx + (lx - cx) / z;
      const py = cy + (ly - cy) / z;
      const s = MAG * z;
      zoomInner.style.transform = `translate(${(lx - px * s).toFixed(1)}px, ${(ly - py * s).toFixed(1)}px) scale(${s.toFixed(4)})`;
    }
  }, []);

  // ── Rest Loupe to Lower Right Corner ───────────────────────────────────
  const restLoupe = useCallback(() => {
    const book = bookRef.current;
    if (!book) return;
    const bw = book.clientWidth;
    const bh = book.clientHeight;
    lxRef.current = bw * 0.88;
    lyRef.current = bh * 0.85;
    placeLoupe();
  }, [placeLoupe]);

  // ── Paint Book Spread ──────────────────────────────────────────────────
  const paint = useCallback(() => {
    const book = bookRef.current;
    const sb3d = sb3dRef.current;
    if (!book || !sb3d) return;
    book.textContent = '';

    const t = turnRef.current;
    const idx = curIdxRef.current;

    if (!t) {
      const f = document.createElement('div');
      f.className = 'sb-full';
      const im = new Image();
      im.src = PROCESS_PLATES[idx].url;
      im.alt = PROCESS_PLATES[idx].title;
      im.draggable = false;
      f.appendChild(im);
      book.appendChild(f);
      sb3d.style.setProperty('--shade', '0');
    } else {
      const next = t.dir === 'next';

      // Left Half
      const dL = document.createElement('div');
      dL.className = 'sb-half left';
      const imL = new Image();
      imL.className = 'sb-half-img left';
      imL.draggable = false;
      imL.src = PROCESS_PLATES[next ? t.from : t.to].url;
      dL.appendChild(imL);
      const gL = document.createElement('div');
      gL.className = 'gutter-shade left';
      dL.appendChild(gL);
      book.appendChild(dL);

      // Right Half
      const dR = document.createElement('div');
      dR.className = 'sb-half right';
      const imR = new Image();
      imR.className = 'sb-half-img right';
      imR.draggable = false;
      imR.src = PROCESS_PLATES[next ? t.to : t.from].url;
      dR.appendChild(imR);
      const gR = document.createElement('div');
      gR.className = 'gutter-shade right';
      dR.appendChild(gR);
      book.appendChild(dR);

      // 18-Strip Bending Leaf
      book.appendChild(buildCurl(t.dir, t.from, t.to));
      applyTurn(t.t);
    }

    // Touch & Mouse Hit Zones (Left / Right half)
    const zPrev = document.createElement('button');
    zPrev.className = 'sb-zone sb-prev';
    zPrev.setAttribute('aria-label', 'Lembar sebelumnya');
    const zNext = document.createElement('button');
    zNext.className = 'sb-zone sb-next';
    zNext.setAttribute('aria-label', 'Lembar selanjutnya');
    book.appendChild(zPrev);
    book.appendChild(zNext);

    sb3d.style.setProperty('--bw', book.clientWidth + 'px');
    syncZoomLayer();
    placeLoupe();
  }, [applyTurn, buildCurl, placeLoupe, syncZoomLayer]);

  // ── Spring Page Commit / Cancel ────────────────────────────────────────
  const commitTurn = useCallback(() => {
    if (!turnRef.current) return;
    springRef.current = {
      kind: 'spring',
      v: 0,
      target: 1,
      k: 170,
      c: 26,
      done: () => {
        if (turnRef.current) {
          curIdxRef.current = turnRef.current.to;
          setActiveIdx(curIdxRef.current);
          turnRef.current = null;
          paint();
        }
      },
    };
    kick();
  }, [kick, paint]);

  const cancelTurn = useCallback(() => {
    if (!turnRef.current) return;
    springRef.current = {
      kind: 'spring',
      v: 0,
      target: 0,
      k: 150,
      c: 24,
      done: () => {
        turnRef.current = null;
        paint();
      },
    };
    kick();
  }, [kick, paint]);

  const startTurn = useCallback((dir: 'next' | 'prev', t: number = 0) => {
    springRef.current = null;
    if (turnRef.current) {
      curIdxRef.current = turnRef.current.to;
      turnRef.current = null;
    }
    const from = curIdxRef.current;
    const to = dir === 'next' ? (from + 1) % M : (from - 1 + M) % M;
    turnRef.current = { dir, from, to, t };
    paint();
  }, [M, paint]);

  const step = useCallback((dir: 'next' | 'prev') => {
    startTurn(dir, 0);
    commitTurn();
  }, [commitTurn, startTurn]);

  const goTo = useCallback((targetIndex: number) => {
    if (targetIndex === curIdxRef.current) return;
    if (turnRef.current) {
      curIdxRef.current = turnRef.current.to;
      turnRef.current = null;
    }
    const fwd = (targetIndex - curIdxRef.current + M) % M;
    const back = (curIdxRef.current - targetIndex + M) % M;
    if (Math.min(fwd, back) === 1) {
      step(fwd === 1 ? 'next' : 'prev');
      return;
    }
    curIdxRef.current = targetIndex;
    setActiveIdx(targetIndex);
    paint();
  }, [M, paint, step]);

  // ── Setup Gestures & Pointer Events ────────────────────────────────────
  useEffect(() => {
    const stage = stageRef.current;
    const book = bookRef.current;
    const loupe = loupeRef.current;
    if (!stage || !book || !loupe) return;

    paint();
    restLoupe();

    // 1. Pointer Down on Stage / Book Zone
    const onStagePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('.tool') || target.closest('.sb-arrow') || target.closest('.loupe')) return;

      const onBook = target.closest('.sb-zone');
      if (!onBook) return;

      e.preventDefault();
      stage.setPointerCapture(e.pointerId);

      const r = book.getBoundingClientRect();
      const dir = (e.clientX - r.left) / r.width > 0.5 ? 'next' : 'prev';
      startTurn(dir, 0);

      dragRef.current = {
        dir,
        x0: e.clientX,
        w: r.width,
        moved: 0,
        vel: 0,
        tPrev: performance.now(),
      };
    };

    // 2. Pointer Move (Interactive Curl drag with mouse / touch)
    const onStagePointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const d = dragRef.current;
      const dx = e.clientX - d.x0;
      d.moved = Math.max(d.moved, Math.abs(dx));
      const raw = (d.dir === 'next' ? -dx : dx) / (d.w * 0.62);
      const t = Math.max(0, Math.min(1, raw));
      const now = performance.now();
      d.vel = (t - (turnRef.current ? turnRef.current.t : 0)) / Math.max(0.001, (now - d.tPrev) / 1000);
      d.tPrev = now;

      if (turnRef.current) {
        turnRef.current.t = t;
        applyTurn(t);
      }
    };

    // 3. Pointer Up / End Drag
    const onStagePointerUp = () => {
      if (!dragRef.current) return;
      const d = dragRef.current;
      dragRef.current = null;
      if (!turnRef.current) return;

      if (d.moved < 6) {
        commitTurn(); // Tap to flip
        return;
      }
      const go = turnRef.current.t > 0.42 || d.vel > 1.1;
      if (go) commitTurn();
      else cancelTurn();
    };

    stage.addEventListener('pointerdown', onStagePointerDown);
    stage.addEventListener('pointermove', onStagePointerMove);
    stage.addEventListener('pointerup', onStagePointerUp);
    stage.addEventListener('pointercancel', onStagePointerUp);

    // 4. Loupe Draggable Pointer Events
    const onLoupePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      lTargetRef.current = null;
      lgrabRef.current = {
        cx: e.clientX,
        cy: e.clientY,
        lx0: lxRef.current || 100,
        ly0: lyRef.current || 100,
      };
      loupe.classList.add('held');
      loupe.setPointerCapture(e.pointerId);
    };

    const onLoupePointerMove = (e: PointerEvent) => {
      if (!lgrabRef.current) return;
      const bw = book.clientWidth;
      const bh = book.clientHeight;
      lxRef.current = Math.max(0, Math.min(bw, lgrabRef.current.lx0 + (e.clientX - lgrabRef.current.cx)));
      lyRef.current = Math.max(0, Math.min(bh, lgrabRef.current.ly0 + (e.clientY - lgrabRef.current.cy)));
      placeLoupe();
    };

    const onLoupePointerUp = () => {
      lgrabRef.current = null;
      loupe.classList.remove('held');
    };

    const tiltTo = (cx: number, cy: number) => {
      if (dragRef.current) return;
      const r = book.getBoundingClientRect();
      if (!r.width) return;
      const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)));
      const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
      const v = viewRef.current;
      v.trx = Math.max(-TILT_X, Math.min(TILT_X, -ny * TILT_X));
      v.try_ = Math.max(-TILT_Y, Math.min(TILT_Y, nx * TILT_Y));
      viewActiveRef.current = true;
      kick();
    };

    const onStageHover = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || dragRef.current) return;
      tiltTo(e.clientX, e.clientY);
    };

    stage.addEventListener('pointermove', onStageHover, { passive: true });
    loupe.addEventListener('pointerdown', onLoupePointerDown);
    loupe.addEventListener('pointermove', onLoupePointerMove);
    loupe.addEventListener('pointerup', onLoupePointerUp);
    loupe.addEventListener('pointercancel', onLoupePointerUp);

    // Resize handler
    const onResize = () => {
      if (sb3dRef.current && bookRef.current) {
        sb3dRef.current.style.setProperty('--bw', bookRef.current.clientWidth + 'px');
        placeLoupe();
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      stage.removeEventListener('pointerdown', onStagePointerDown);
      stage.removeEventListener('pointermove', onStagePointerMove);
      stage.removeEventListener('pointermove', onStageHover);
      stage.removeEventListener('pointerup', onStagePointerUp);
      stage.removeEventListener('pointercancel', onStagePointerUp);

      loupe.removeEventListener('pointerdown', onLoupePointerDown);
      loupe.removeEventListener('pointermove', onLoupePointerMove);
      loupe.removeEventListener('pointerup', onLoupePointerUp);
      loupe.removeEventListener('pointercancel', onLoupePointerUp);

      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyTurn, cancelTurn, commitTurn, paint, placeLoupe, restLoupe, startTurn]);

  // ── Toolbar Handlers (Strict Rule 2) ───────────────────────────────────
  const handlePrev = useCallback(() => step('prev'), [step]);
  const handleNext = useCallback(() => step('next'), [step]);
  const handleSelectPlate = useCallback((i: number) => goTo(i), [goTo]);

  const handleZoomIn = useCallback(() => {
    const v = viewRef.current;
    const nz = Math.min(ZOOM_MAX, +(v.tz * 1.15).toFixed(2));
    v.tz = nz;
    viewActiveRef.current = true;
    setZoomPercent(Math.round(nz * 100));
    kick();
  }, [kick]);

  const handleZoomOut = useCallback(() => {
    const v = viewRef.current;
    const nz = Math.max(ZOOM_MIN, +(v.tz / 1.15).toFixed(2));
    v.tz = nz;
    viewActiveRef.current = true;
    setZoomPercent(Math.round(nz * 100));
    kick();
  }, [kick]);

  const handleToggleLoupe = useCallback(() => {
    setLoupeEnabled(prev => {
      const nextVal = !prev;
      const loupe = loupeRef.current;
      if (loupe) loupe.classList.toggle('on', nextVal);
      if (nextVal && lxRef.current === null) restLoupe();
      return nextVal;
    });
  }, [restLoupe]);

  const currentPlate = PROCESS_PLATES[activeIdx];

  return (
    <section id="sketchbook" className="section" style={{
      background: 'var(--paper-100)',
      borderTop: '1px solid var(--paper-300)',
      borderBottom: '1px solid var(--paper-300)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <Eyebrow accent>Proses Pembuatan Website</Eyebrow>
          <h2 data-reveal style={{
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            maxWidth: '22ch',
            marginInline: 'auto',
            marginBottom: '0.75rem',
          }}>
            Dari Sketsa Ide Hingga{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent-500)' }}>
              Website Siap di Tangan Klien
            </em>
          </h2>
          <p data-reveal style={{ color: 'var(--ink-500)', maxWidth: '58ch', marginInline: 'auto', fontSize: '1rem' }}>
            Sentuh layar pada HP atau seret kursor mouse Anda untuk membalik halaman sketchbook secara interaktif. Balik lembaran, gunakan kaca pembesar, dan lihat transparansi alur kerja pembuatan website kami.
          </p>
          <SketchStroke style={{ width: '220px', marginInline: 'auto', marginTop: '1.25rem' }} />
        </div>

        {/* ── Meng To Tactile Sketchbook Stage ── */}
        <div data-reveal className="sb-wrap" id="sbWrap">
          <div ref={stageRef} className="sb-stage" id="sbStage">
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="sb-arrow left"
              id="sbLeft"
              aria-label="Lembar sebelumnya"
              title="Lembar sebelumnya"
            >
              <svg viewBox="0 0 14 44" width="16" height="44" fill="none" aria-hidden="true">
                <polyline points="11,3 3,22 11,41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* 3D Viewport Box */}
            <div ref={sb3dRef} className="sb-3d" id="sb3d">
              <div className="sb-tilt" id="sbTilt">
                <div className="sb-cast ambient" aria-hidden="true" />
                <div className="sb-cast contact" aria-hidden="true" />
                <div className="sb-cast hair" aria-hidden="true" />
                {/* Book DOM Container */}
                <div ref={bookRef} className="sb-book" id="sbBook" />
              </div>

              {/* Magnifier 2.3x Zoom Layer */}
              <div ref={zoomWrapRef} className="zoomwrap" id="zoomWrap" aria-hidden="true">
                <div ref={zoomInnerRef} className="zoominner" id="zoomInner" />
              </div>

              {/* Draggable Physical Loupe with Brass Rim */}
              <div ref={loupeRef} className={`loupe ${loupeEnabled ? 'on' : ''}`} id="loupe">
                <span className="grip" />
                <span className="ring">
                  <span className="lens" id="loupeLens">
                    <span className="mag" id="loupeMag" />
                  </span>
                </span>
              </div>
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="sb-arrow right"
              id="sbRight"
              aria-label="Lembar selanjutnya"
              title="Lembar selanjutnya"
            >
              <svg viewBox="0 0 14 44" width="16" height="44" fill="none" aria-hidden="true">
                <polyline points="3,3 11,22 3,41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Current Plate Caption */}
          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-500)',
              fontWeight: 600,
            }}>
              {currentPlate.phase}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              color: 'var(--ink-900)',
              marginTop: '2px',
            }}>
              {currentPlate.title}
            </div>
          </div>

          {/* Sketchbook Floating Tools */}
          <div className="sb-tools" role="group" aria-label="Kontrol Sketchbook">
            <button onClick={handleZoomOut} className="tool" aria-label="Zoom out" title="Perkecil">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8.6" cy="8.6" r="5.6" />
                <path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8" />
              </svg>
            </button>

            <span className="zoom-read">{zoomPercent}%</span>

            <button onClick={handleZoomIn} className="tool" aria-label="Zoom in" title="Perbesar">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8.6" cy="8.6" r="5.6" />
                <path d="M12.8 12.8 17.4 17.4M6.2 8.6h4.8M8.6 6.2v4.8" />
              </svg>
            </button>

            <span className="tool-sep" aria-hidden="true" />

            <button
              onClick={handleToggleLoupe}
              className="tool"
              aria-label="Kaca Pembesar"
              aria-pressed={loupeEnabled}
              title={loupeEnabled ? 'Sembunyikan Kaca Pembesar' : 'Aktifkan Kaca Pembesar'}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8.8" cy="8.8" r="5.8" />
                <path d="M13 13l4.4 4.4" />
                <path d="M6.4 7.2a3.2 3.2 0 0 1 2.4-1.4" opacity=".55" />
              </svg>
            </button>
          </div>

          {/* Interactive Hint */}
          <p className="sb-hint">
            Seret halaman dengan mouse atau jari di HP untuk membalik · Geser kaca pembesar untuk melihat detail sketsa
          </p>

          <SketchAnnotation
            text="← seret lembaran untuk membalik"
            style={{ position: 'absolute', bottom: '-1.5rem', left: '2rem' }}
            rotation={-2}
          />
        </div>

        {/* ── Editorial Plates Index ── */}
        <PlateList
          plates={PROCESS_PLATES}
          currentIdx={activeIdx}
          onSelect={handleSelectPlate}
        />
      </div>

      {/* ── Meng To Exact 18-Strip Bending & Loupe Styles ── */}
      <style>{`
        .sb-wrap {
          display: grid;
          justify-items: center;
          gap: 16px;
          width: 100%;
          position: relative;
          z-index: 2;
          user-select: none;
          -webkit-user-select: none;
        }
        .sb-stage {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          touch-action: pan-y;
        }
        .sb-arrow {
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 6px;
          border: 0;
          background: transparent;
          color: var(--ink-400);
          cursor: pointer;
          transition: color .2s, transform .2s;
          -webkit-tap-highlight-color: transparent;
          z-index: 10;
        }
        .sb-arrow:hover {
          color: var(--ink-900);
          transform: scale(1.15);
        }
        .sb-3d {
          position: relative;
          flex: 1 1;
          min-width: 0;
          max-width: 960px;
          perspective: 1800px;
          perspective-origin: 50% 46%;
        }
        .sb-tilt {
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--zoom, 1));
          will-change: transform;
        }
        .sb-book {
          position: relative;
          width: 100%;
          aspect-ratio: 1760/1240;
          transform-style: preserve-3d;
          z-index: 1;
          box-shadow: 0 20px 48px -12px rgba(24, 21, 18, 0.18);
          border-radius: 8px;
          background: #faf6ee;
        }
        /* Realistic Ambient Drop Shadows underneath book */
        .sb-cast {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }
        .sb-cast.ambient {
          left: 5%; right: 5%; top: 25%; bottom: 2%;
          background: radial-gradient(50% 50% at 50% 58%, rgba(40,30,15,.3) 0%, rgba(40,30,15,.15) 40%, transparent 74%);
          filter: blur(28px);
          opacity: calc(1 - var(--shade, 0) * .42);
        }
        .sb-cast.contact {
          left: 8%; right: 8%; top: 60%; bottom: 8%;
          background: radial-gradient(50% 44% at 50% 42%, rgba(40,30,15,.35) 0%, rgba(40,30,15,.12) 48%, transparent 78%);
          filter: blur(12px);
          opacity: calc(1 - var(--shade, 0) * .5);
        }

        .sb-full { position: absolute; inset: 0; }
        .sb-full img { width: 100%; height: auto; display: block; border-radius: 6px; }

        .sb-half { position: absolute; top: 0; bottom: 0; width: 50%; overflow-x: clip; overflow-y: visible; }
        .sb-half.left { left: 0; }
        .sb-half.right { left: 50%; }
        .sb-half-img { width: 200%; max-width: none; height: auto; display: block; }
        .sb-half-img.right { margin-left: -100%; }

        .gutter-shade {
          position: absolute;
          top: 0; bottom: 0; width: 46%;
          pointer-events: none;
          opacity: calc(var(--shade, 0) * .65);
        }
        .gutter-shade.left { right: 0; background: linear-gradient(270deg, rgba(40,30,15,.28), transparent 82%); }
        .gutter-shade.right { left: 0; background: linear-gradient(90deg, rgba(40,30,15,.24), transparent 82%); }

        /* The 18 Nested Strips Forming a Curved Bending Leaf */
        .curl {
          position: absolute;
          top: 0;
          height: 100%;
          width: calc(var(--bw, 0px) * var(--span));
          transform-style: preserve-3d;
          z-index: 6;
        }
        .curl.next {
          left: 50%;
          transform-origin: left center;
          transform: rotateY(calc(-1 * var(--tt, 0deg)));
        }
        .curl.prev {
          right: 50%;
          transform-origin: right center;
          transform: rotateY(var(--tt, 0deg));
        }
        .strip {
          position: absolute;
          top: 0;
          height: 100%;
          width: calc(var(--bw, 0px) * var(--span) / var(--n));
          transform-style: preserve-3d;
        }
        .curl.next .strip { transform-origin: left center; }
        .curl.prev .strip { transform-origin: right center; }
        .curl.next > .strip { left: 0; }
        .curl.prev > .strip { right: 0; left: auto; }
        .curl.next .strip .strip { left: 100%; transform: rotateY(var(--td, 0deg)); }
        .curl.prev .strip .strip { right: 100%; transform: rotateY(calc(-1 * var(--td, 0deg))); }

        .face {
          position: absolute;
          top: 0; bottom: 0; left: 0; right: -1.2px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background-repeat: no-repeat;
          background-size: var(--bw, 0px) auto;
        }
        .face.back { transform: rotateY(180deg); }
        .face .sh {
          position: absolute; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none;
        }
        .curl.next .face.front .sh, .curl.prev .face.back .sh {
          background: linear-gradient(90deg, rgba(58,43,20,var(--a1, 0)), rgba(58,43,20,var(--a2, 0)));
        }
        .curl.next .face.back .sh, .curl.prev .face.front .sh {
          background: linear-gradient(90deg, rgba(58,43,20,var(--a2, 0)), rgba(58,43,20,var(--a1, 0)));
        }
        .face .gl {
          position: absolute; left: 0; right: 0; top: 0; bottom: 0; pointer-events: none;
          background: #fffaf0;
          opacity: calc(var(--shade, 0) * var(--lit, 1) * var(--lit, 1) * .18);
        }

        /* Draggable Pointer Hit Zones */
        .sb-zone {
          position: absolute;
          top: 0; bottom: 0;
          border: 0;
          background: transparent;
          cursor: grab;
          z-index: 60;
          -webkit-tap-highlight-color: transparent;
        }
        .sb-zone:active { cursor: grabbing; }
        .sb-prev { left: 0; width: 50%; }
        .sb-next { right: 50%; width: 50%; }

        /* Magnifier Loupe Physics */
        .loupe {
          position: absolute;
          left: 0; top: 0;
          width: var(--lr, 240px);
          height: var(--lr, 240px);
          pointer-events: none;
          z-index: 80;
          opacity: 0;
          transition: opacity .25s ease;
          will-change: transform;
        }
        .loupe.on { opacity: 1; }
        .loupe.held .ring { cursor: grabbing; }
        .loupe .ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: auto;
          cursor: grab;
          box-shadow:
            0 1px 2px rgba(40,30,15,.3),
            0 10px 18px rgba(40,30,15,.22),
            0 24px 38px rgba(40,30,15,.18);
        }
        .loupe .ring:before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: linear-gradient(146deg, #fdf7e9 0%, #e6d7b4 14%, #b69d70 32%, #7d6740 50%, #cdbb92 66%, #f4ead3 80%, #9b8459 100%);
          box-shadow: inset 0 1px 1px rgba(255,255,255,.8), inset 0 -2px 3px rgba(70,52,26,.5);
          -webkit-mask-image: radial-gradient(circle closest-side at 50% 50%, transparent 0 88.2%, #000 89.8% 100%);
          mask-image: radial-gradient(circle closest-side at 50% 50%, transparent 0 88.2%, #000 89.8% 100%);
        }
        .loupe .grip {
          position: absolute;
          left: 50%; top: 50%;
          width: calc(var(--lr, 240px) * .74);
          height: calc(var(--lr, 240px) * .125);
          transform-origin: 0 50%;
          transform: rotate(40deg) translate(calc(var(--lr, 240px) * .33), -50%);
          border-radius: calc(var(--lr, 240px) * .06);
          pointer-events: auto;
          cursor: grab;
          background:
            linear-gradient(180deg, rgba(255,255,255,.46) 0 13%, rgba(255,255,255,0) 44%, rgba(0,0,0,.26) 100%),
            linear-gradient(90deg, #d9bd82 0 14%, #a9884e 14% 20%, #6d4c2b 20% 62%, #5a3d22 62% 92%, #7a563180 92% 100%);
          box-shadow: 0 8px 15px rgba(40,30,15,.24), 0 16px 24px rgba(40,30,15,.12);
        }
        .lens {
          position: relative;
          display: block;
          width: 100%; height: 100%;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(52,40,22,.5), inset 0 4px 12px rgba(40,30,14,.24);
        }
        .lens:before, .lens:after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
        }
        .lens:before {
          z-index: 1;
          background: radial-gradient(circle at 50% 50%, transparent 54%, rgba(40,30,15,.08) 76%, rgba(40,30,15,.28) 100%);
        }
        .lens:after {
          z-index: 2;
          background:
            radial-gradient(36% 26% at 29% 19%, rgba(255,255,255,.32), transparent 76%),
            radial-gradient(24% 16% at 74% 86%, rgba(255,255,255,.14), transparent 80%);
        }

        .zoomwrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 2;
          opacity: 0;
        }
        .zoominner {
          position: absolute;
          inset: 0;
          transform-origin: 0 0;
        }

        /* Toolbar controls */
        .sb-tools {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--paper-300);
          border-radius: 999px;
          padding: 5px 9px;
          background: rgba(253, 251, 247, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: var(--shadow-sm);
        }
        .tool {
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: transparent;
          color: var(--ink-600);
          cursor: pointer;
          transition: background-color .18s ease, color .18s ease;
        }
        .tool:hover {
          background: var(--paper-200);
          color: var(--ink-900);
        }
        .tool[aria-pressed="true"] {
          background: var(--accent-100);
          color: var(--accent-500);
        }
        .tool svg { width: 16px; height: 16px; display: block; }
        .tool-sep { width: 1px; height: 18px; background: var(--paper-300); margin: 0 2px; }
        .zoom-read {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: .08em;
          color: var(--ink-500);
          min-width: 42px;
          text-align: center;
        }
        .sb-hint {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--ink-400);
          text-align: center;
          margin-top: 4px;
        }

        @media (max-width: 640px) {
          .sb-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 70;
            background: rgba(253, 251, 247, 0.7);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            padding: 0;
          }
          .sb-arrow.left { left: 4px; }
          .sb-arrow.right { right: 4px; }
          .sb-hint { font-size: 9.5px; padding-inline: 12px; }
        }
      `}</style>
    </section>
  );
});
ProcessSketchbookSection.displayName = 'ProcessSketchbookSection';
