// "Plotter" engine: makes SVG drawings draw themselves line by line.
// - autoPlot: time based (WAAPI), used on load / when a sheet scrolls into view
// - layerPlotter: progress based (0..1), used for scroll-scrubbed sequences

const SHAPES = "path,line,polyline,polygon,rect,circle,ellipse";
const EASE = "cubic-bezier(.55,.06,.3,1)";

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function shapesIn(root: Element, withText = true) {
  const sel = withText ? `${SHAPES},text` : SHAPES;
  return Array.from(root.querySelectorAll<SVGElement>(sel)).filter(
    (el) => !el.closest("defs,pattern,clipPath,mask"),
  );
}

function isDashed(el: Element) {
  return !!el.closest("[stroke-dasharray]");
}

function prime(el: SVGElement) {
  el.setAttribute("pathLength", "1");
  el.style.strokeDasharray = "1 1";
}

export interface AutoPlotOpts {
  /** seconds over which element start times are spread */
  total?: number;
  /** seconds each element takes to draw */
  dur?: number;
  delay?: number;
  /** restrict + order by Elevation layers (data-layer) */
  layers?: string[];
}

export function autoPlot(root: Element, o: AutoPlotOpts = {}) {
  const total = o.total ?? 1.6;
  const dur = (o.dur ?? 0.9) * 1000;
  const delay = o.delay ?? 0;
  const groups: Element[] = o.layers
    ? (o.layers.map((l) => root.querySelector(`[data-layer="${l}"]`)).filter(Boolean) as Element[])
    : [root];
  const els = groups.flatMap((g) => shapesIn(g));
  const n = els.length;
  const anims: Animation[] = [];
  if (typeof (els[0] as SVGElement | undefined)?.animate !== "function") return () => {};
  els.forEach((el, i) => {
    const t = (delay + (n > 1 ? (i / (n - 1)) * total : 0)) * 1000;
    if (el.tagName.toLowerCase() === "text") {
      anims.push(
        el.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: dur * 0.6,
          delay: t + dur * 0.4,
          easing: "ease-out",
          fill: "backwards",
        }),
      );
      return;
    }
    if (isDashed(el)) {
      anims.push(
        el.animate([{ strokeOpacity: 0 }, { strokeOpacity: 1 }], {
          duration: dur * 0.6,
          delay: t,
          fill: "backwards",
        }),
      );
    } else {
      prime(el);
      anims.push(
        el.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
          duration: dur,
          delay: t,
          easing: EASE,
          fill: "backwards",
        }),
      );
    }
    const fo = el.getAttribute("fill-opacity") ?? "1";
    anims.push(
      el.animate([{ fillOpacity: 0 }, { fillOpacity: 0, offset: 0.5 }, { fillOpacity: fo }], {
        duration: dur * 1.25,
        delay: t,
        easing: "ease-out",
        fill: "backwards",
      }),
    );
  });
  return () => {
    for (const a of anims) a.cancel();
  };
}

/** total seconds an autoPlot run takes */
export const plotLength = (o: AutoPlotOpts = {}) => (o.delay ?? 0) + (o.total ?? 1.6) + (o.dur ?? 0.9) * 1.25;

/**
 * Scroll-scrubbed plotter for one group. Returns set(p) where p is 0..1.
 * Elements draw in DOM order, staggered across `spread` of the range.
 */
export function layerPlotter(g: SVGGElement | HTMLElement, spread = 0.55) {
  const els = shapesIn(g);
  const n = els.length;
  const w = 1 - spread;
  const items = els.map((el, i) => {
    const text = el.tagName.toLowerCase() === "text";
    const dashed = !text && isDashed(el);
    if (!text && !dashed) prime(el);
    return { el, o: n > 1 ? (i / (n - 1)) * spread : 0, text, dashed };
  });
  let last = -1;
  const set = (p: number) => {
    if (Math.abs(p - last) < 0.0004) return;
    last = p;
    g.style.opacity = p > 0.001 ? "1" : "0";
    g.style.fillOpacity = String(clamp((p - 0.4) / 0.6));
    for (const it of items) {
      const lp = clamp((p - it.o) / w);
      if (it.text) it.el.style.opacity = String(lp);
      else if (it.dashed) it.el.style.strokeOpacity = String(clamp(lp * 2));
      else it.el.style.strokeDashoffset = String(1 - lp);
    }
  };
  set(0);
  return set;
}
