import { useRef } from 'react';
import { usePaperFlight } from '../../hooks/usePaperFlight';

export function PaperFlight() {
  const plane = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGPathElement>(null);
  usePaperFlight(plane, trail);
  return (
    <div className="flight-layer" aria-hidden="true">
      <svg className="flight-trail">
        <path ref={trail} />
      </svg>
      <div ref={plane} className="paper-plane" data-visible="false">
        <svg viewBox="0 0 76 52">
          <path className="mobile-flight-tail" d="M2 27 C-9 37 -18 18 -31 28" />
          <path
            d="M4 5 71 25 7 46 20 27Z"
            fill="#eeeadb"
            stroke="#777260"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="m4 5 27 21 40-1-50 6Z"
            fill="#fbf8ee"
            stroke="#777260"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="m21 31 10-5-7 14Z"
            fill="#b5ae97"
            stroke="#777260"
            strokeWidth=".8"
          />
          <path d="m31 26 40-1" stroke="#9b937b" strokeWidth=".7" />
        </svg>
      </div>
    </div>
  );
}
