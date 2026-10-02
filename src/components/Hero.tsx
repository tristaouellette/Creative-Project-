import {useEffect, useRef} from 'react';
import {callouts, headline, tagline} from '../content';
import {FILM_ASPECT, FPS, FRAME_COUNT, loadFrames, MOBILE_CROP, type FrameSet} from '../lib/frames';
import {clamp, pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';
import {vars} from '../lib/style';
import {createRemap} from '../lib/timeRemap';
import Callout, {type CalloutHandle} from './Callout';
import {SunGlyph} from './Marks';
import Nav from './Nav';

/**
 * The whole page is this one shot: a slow push-in on the glass while it lifts
 * off the sandstone and tilts. The type never moves with the picture — it is
 * printed on the glass of the lens, and the film slides underneath it.
 */

const DURATION = FRAME_COUNT / FPS;
// Scroll window the film plays across; the tail is a hold on the resting glass.
const FILM_IN = 0;
const FILM_OUT = 0.88;
// Even, unhurried push — a soft start, then easing into the rest.
const REMAP = createRemap(
  [
    [0, 0],
    [0.1, DURATION * 0.08],
    [0.78, DURATION * 0.84],
    [1, DURATION],
  ],
  DURATION,
);
// The glass is "at rest" (callouts land) over the last few frames.
const REST_FROM = 0.94;

function Word({text, delay, className = ''}: {text: string; delay: number; className?: string}) {
  return (
    <span className={`word ${className}`} aria-hidden="true" style={vars({'--d': delay})}>
      {[...text].map((ch, i) => (
        <span key={i} style={vars({'--i': i})}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero({reduced}: {reduced: boolean}) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const calloutEls = useRef<(CalloutHandle | null)[]>([]);

  useEffect(() => {
    const section = root.current;
    const c = canvas.current;
    const ctx = c?.getContext('2d', {alpha: false});
    if (!section || !c || !ctx) return;

    // Portrait screens get the 3:4 centre-cut frames: sharper and lighter.
    const set: FrameSet = window.matchMedia('(max-aspect-ratio: 1/1)').matches ? 'm' : 'd';
    const frames: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    let head = 0;
    let drawn = -1;
    let dirty = true;

    const cancel = loadFrames(set, (i, img) => {
      frames[i] = img;
      // A better frame for what's on screen just arrived.
      if (Math.abs(i - head) < 4) dirty = true;
    });

    let cw = 0;
    let ch = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cw = c.clientWidth;
      ch = c.clientHeight;
      c.width = Math.round(cw * dpr);
      c.height = Math.round(ch * dpr);
      ctx.imageSmoothingQuality = 'high';
      dirty = true;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();

    const nearest = (i: number) => {
      for (let k = 0; k < FRAME_COUNT; k++) {
        if (i - k >= 0 && frames[i - k]) return i - k;
        if (i + k < FRAME_COUNT && frames[i + k]) return i + k;
      }
      return -1;
    };

    // Cover-fit of the current frame set into the viewport, in CSS px.
    const cover = () => {
      const aspect = set === 'm' ? 3 / 4 : FILM_ASPECT;
      const s = Math.max(cw / aspect, ch);
      const w = s * aspect;
      return {x: (cw - w) / 2, y: (ch - s) / 2, w, h: s};
    };

    // Callout scale follows the stage, clamped so labels stay readable.
    const place = () => {
      const r = cover();
      const scale = clamp(Math.min(cw / 1440, ch / 860), 0.72, 1.15);
      callouts.forEach((co, i) => {
        let nx = co.anchor[0];
        if (set === 'm') nx = (nx - MOBILE_CROP) / (1 - 2 * MOBILE_CROP);
        calloutEls.current[i]?.place(r.x + nx * r.w, r.y + co.anchor[1] * r.h, cw, scale);
      });
    };

    let last = performance.now();
    let rested = false;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const {p} = pinProgress(section);
      const target = reduced ? 0 : REMAP.at(range(p, FILM_IN, FILM_OUT)) * FPS;
      const diff = target - head;
      // Chase the scroll, never slower than the footage's own frame rate.
      const step = Math.max(FPS * 1.25, Math.abs(diff) * 3.2) * dt;
      head = Math.abs(diff) <= step ? target : head + Math.sign(diff) * step;

      const idx = nearest(clamp(Math.round(head), 0, FRAME_COUNT - 1));
      if (idx >= 0 && (idx !== drawn || dirty)) {
        const img = frames[idx]!;
        const r = cover();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(img, r.x, r.y, r.w, r.h);
        if (dirty) place();
        drawn = idx;
        dirty = false;
      }

      const atRest = !reduced && head / (FRAME_COUNT - 1) >= REST_FROM;
      if (atRest !== rested) {
        rested = atRest;
        place();
        calloutEls.current.forEach((el) => el?.show(atRest));
      }
    };

    const off = onFrame(tick);
    return () => {
      off();
      cancel();
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <section
      id="top"
      ref={root}
      className="relative"
      style={{height: reduced ? '100svh' : '430svh'}}
      aria-label="NOPAL — Drink the Desert"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        <canvas ref={canvas} className="absolute inset-0 block size-full" aria-hidden="true" />

        {/* Legibility: a whisper of shade behind the nav and the corner copy. */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(12_7_16/0.55)_0%,transparent_24%,transparent_70%,rgb(12_7_16/0.5)_100%)]" />

        <Nav />

        {/* Viewfinder */}
        <div className="pointer-events-none absolute inset-2.5 md:inset-3.5" aria-hidden="true">
          <span className="corner left-0 top-0 border-l border-t" />
          <span className="corner right-0 top-0 border-r border-t" />
          <span className="corner bottom-0 left-0 border-b border-l" />
          <span className="corner bottom-0 right-0 border-b border-r" />
        </div>

        <h1 className="sr-only">{headline.join(' ')}</h1>

        {/* The split headline, locked to the frame */}
        <div className="pointer-events-none absolute inset-x-0 top-[calc(4rem+4.5svh)] flex items-start justify-between px-[max(1rem,3.4vw)] font-display text-[18.5vw] font-medium uppercase leading-[0.78] tracking-[-0.012em] text-bone md:top-[calc(4.75rem+5.5svh)] md:text-mega">
          <Word text={headline[0]} delay={120} />
          <Word text={headline[1]} delay={320} />
        </div>
        <div className="pointer-events-none absolute bottom-[max(1.1rem,4.6svh)] right-[max(1rem,3.4vw)] font-display text-[18.5vw] font-medium uppercase leading-[0.78] tracking-[-0.012em] text-bone md:text-mega">
          <Word text={headline[2]} delay={480} />
        </div>

        {/* Bottom-left note */}
        <div className="absolute bottom-[calc(max(1.1rem,4.6svh)+18vw)] left-[max(1rem,3.4vw)] md:bottom-[max(1.1rem,4.6svh)]">
          <SunGlyph className="line-in mb-4 h-4 w-auto text-bone/80 md:mb-6 md:h-5" />
          <p className="font-mono text-tag font-medium uppercase text-bone">
            {tagline.map((line, i) => (
              <span key={line} className="line-in block" style={vars({'--d': 820 + i * 70})}>
                {line}
              </span>
            ))}
          </p>
        </div>

        {callouts.map((co, i) => (
          <Callout
            key={co.label}
            label={co.label}
            side={co.side}
            ref={(el) => {
              calloutEls.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
