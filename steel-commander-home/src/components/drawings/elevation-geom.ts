import { type Pt, clamp, yAt } from "./core";

export type Opening =
  | { kind: "rollup"; x: number; w: number; h: number }
  | { kind: "dock"; x: number; w: number; h: number }
  | { kind: "walk"; x: number }
  | { kind: "window"; x: number; y: number; w?: number; h?: number }
  | { kind: "hangar"; x: number; w: number; h: number }
  | { kind: "slider"; x: number; w: number; h: number }
  | { kind: "storefront"; x: number; w: number; h: number }
  | { kind: "louver"; x: number; y: number; w: number; h: number };

export interface LeanToSpec {
  side: "left" | "right";
  width: number;
  high: number;
  low: number;
  open?: boolean;
  /** x is local to the lean-to (0 = its left edge) */
  openings?: Opening[];
}

export interface TreeSpec {
  x: number;
  h: number;
  seed: number;
  ghost?: boolean;
}

export interface ElevationSpec {
  width: number;
  eave: number;
  /** rise per 12 */
  pitch: number;
  roof?: "gable" | "single" | "gambrel";
  wainscot?: number;
  leanTos?: LeanToSpec[];
  openings?: Opening[];
  cupola?: boolean;
  trees?: TreeSpec[];
}

export type Layer =
  | "ground"
  | "foundation"
  | "ghost"
  | "primary"
  | "secondary"
  | "sheeting"
  | "openings"
  | "trees"
  | "dims";

export const DRAWING_LAYERS: Layer[] = ["ground", "sheeting", "openings", "trees"];
export const FRAME_LAYERS: Layer[] = ["ground", "foundation", "ghost", "primary", "secondary"];

export function roofChain(s: ElevationSpec): Pt[] {
  const W = s.width;
  const E = s.eave;
  const r = s.pitch / 12;
  if (s.roof === "single") return [[0, E], [W, E + W * r]];
  if (s.roof === "gambrel") {
    const k = W * 0.22;
    const r1 = k * 1.25;
    const R = E + r1 + (W / 2 - k) * r;
    return [[0, E], [k, E + r1], [W / 2, R], [W - k, E + r1], [W, E]];
  }
  return [[0, E], [W / 2, E + (W / 2) * r], [W, E]];
}

export function frameGeom(chain: Pt[], W: number) {
  const c0 = 0.6;
  const c1 = W - 0.6;
  const span = c1 - c0;
  const tc = clamp(span * 0.034, 1.1, 3.0);
  const bc = Math.max(0.65, tc * 0.45);
  const rdk = tc * 1.05;
  const rdr = clamp(span * 0.017, 0.75, 1.5);
  const top = (x: number) => yAt(chain, x) - 0.75;
  const rd = (x: number) => {
    const half = span / 2 - tc;
    const t = Math.min(x - (c0 + tc), c1 - tc - x) / (half || 1);
    return rdk + (rdr - rdk) * clamp(t, 0, 1);
  };
  const bot = (x: number) => top(x) - rd(x);
  const inner = chain.map((p) => p[0]).filter((x) => x > c0 && x < c1);
  const topPts: Pt[] = [[c0, top(c0)], ...inner.map((x) => [x, top(x)] as Pt), [c1, top(c1)]];
  const botXs = [c0 + tc, ...inner.filter((x) => x > c0 + tc && x < c1 - tc), c1 - tc];
  const botPts: Pt[] = botXs.map((x) => [x, bot(x)]);
  const poly: Pt[] = [
    [c0, 0],
    ...topPts,
    [c1, 0],
    [c1 - bc, 0],
    ...[...botPts].reverse(),
    [c0 + bc, 0],
  ];
  return { c0, c1, tc, bc, top, bot, poly, topPts, botPts };
}

export function buildGeometry(s: ElevationSpec) {
  const W = s.width;
  const E = s.eave;
  const chain = roofChain(s);
  const ridge = Math.max(...chain.map((p) => p[1]));
  const left = s.leanTos?.find((l) => l.side === "left");
  const right = s.leanTos?.find((l) => l.side === "right");
  const wall: Pt[] = [[0, 0], ...chain, [W, 0]];
  const leans = (s.leanTos ?? []).map((l) => {
    const x0 = l.side === "left" ? -l.width : W;
    const x1 = l.side === "left" ? 0 : W + l.width;
    const lchain: Pt[] = l.side === "left" ? [[x0, l.low], [0, l.high]] : [[W, l.high], [x1, l.low]];
    const poly: Pt[] = [[x0, 0], ...lchain, [x1, 0]];
    return { spec: l, x0, x1, chain: lchain, poly };
  });
  const minX = left ? -left.width : 0;
  const maxX = right ? W + right.width : W;
  const fg = frameGeom(chain, W);
  return { W, E, chain, ridge, wall, leans, minX, maxX, left, right, fg };
}

export function elevationBox(s: ElevationSpec, opts: { dims?: boolean; pad?: number } = {}) {
  const g = buildGeometry(s);
  const pad = opts.pad ?? 2;
  let x0 = g.minX - 2.4;
  let x1 = g.maxX + 2.4;
  let top = g.ridge + (s.cupola ? 4.4 : 1.4);
  for (const t of s.trees ?? []) {
    x0 = Math.min(x0, t.x - t.h * 0.44);
    x1 = Math.max(x1, t.x + t.h * 0.44);
    top = Math.max(top, t.h * 1.04);
  }
  let bottom = -4.2;
  if (opts.dims) {
    x0 = Math.min(x0, g.minX - 9.5);
    bottom = -6.4;
    top += 1.5;
  }
  x0 -= pad;
  x1 += pad;
  top += pad * 0.6;
  bottom -= pad * 0.3;
  return { x0, x1, top, bottom, w: x1 - x0, h: top - bottom };
}
