import {forwardRef, useImperativeHandle, useRef} from 'react';

/**
 * A bracketed spec label on a hairline leader. The root's origin is the
 * anchor point on the glass; the Hero calls `place()` whenever the picture
 * is re-fitted and `show()` when the glass comes to rest. All motion is CSS.
 */
type Props = {label: string; side: 'left' | 'right'};

export type CalloutHandle = {
  place: (x: number, y: number, viewportWidth: number, scale: number) => void;
  show: (on: boolean) => void;
};

// Leader geometry in px before scaling: a short diagonal off the glass, then
// a flat run into the label.
const RISE = 46;
const DIAG = 44;
const RUN = 30;
const GAP = 14;
const MARGIN = 14;

const Callout = forwardRef<CalloutHandle, Props>(function Callout({label, side}, ref) {
  const root = useRef<HTMLDivElement>(null);
  const lead = useRef<SVGPathElement>(null);
  const box = useRef<HTMLDivElement>(null);

  const dir = side === 'right' ? 1 : -1;
  // Right-hand labels rise away from the glass, left-hand ones drop away,
  // so the pair never reads as a mirror image.
  const dy = side === 'right' ? -RISE : RISE;

  useImperativeHandle(ref, () => ({
    place(x, y, vw, s) {
      const el = root.current;
      const b = box.current;
      if (!el || !b) return;
      // Where the flat run ends (label's near edge = end + GAP), unscaled.
      let end = dir * (DIAG + RUN);
      const width = b.offsetWidth;
      const far = x + s * (end + dir * (GAP + width));
      const over = dir > 0 ? far - (vw - MARGIN) : MARGIN - far;
      // Narrow screens: pull the label in rather than run it off the edge.
      if (over > 0) end -= (dir * over) / s;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      lead.current?.setAttribute('d', `M0 0 L${dir * DIAG} ${dy} L${end} ${dy}`);
      b.style.left = dir > 0 ? `${end + GAP}px` : `${end - GAP - width}px`;
    },
    show(on) {
      root.current?.setAttribute('data-on', String(on));
    },
  }));

  return (
    <div ref={root} className="callout z-10" data-on="false" style={{transformOrigin: '0 0'}}>
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden="true">
        <path ref={lead} className="lead" d={`M0 0 L${dir * DIAG} ${dy} L${dir * (DIAG + RUN)} ${dy}`} pathLength={1} />
        <circle className="dot" cx="0" cy="0" r="2.5" />
      </svg>
      <div ref={box} className="absolute" style={{top: dy, translate: '0 -50%'}}>
        <span className="bracket b-tl" />
        <span className="bracket b-tr" />
        <span className="bracket b-bl" />
        <span className="bracket b-br" />
        <span className="tag block whitespace-nowrap bg-bone px-2.5 py-[0.3rem] font-mono text-micro font-medium uppercase text-night">
          {label}
        </span>
      </div>
    </div>
  );
});

export default Callout;
