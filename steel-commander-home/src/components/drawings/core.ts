// Shared geometry + helpers for the parametric steel-building drawings.
// All building geometry is expressed in FEET; U converts feet -> SVG units.

export const U = 10;

export const C = {
  ink: "#1d1d1b",
  graphite: "#454640",
  pencil: "#8b8c84",
  rule: "#c4c5bb",
  paper: "#f2f2eb",
  paper2: "#e9e9e0",
  paper3: "#dfdfd4",
  red: "#d2232a",
};

export type Pt = [number, number];

export const r2 = (v: number) => Math.round(v * 100) / 100;

/** elevation coords: y up (ground = 0) */
export const EX = (x: number) => r2(x * U);
export const EY = (y: number) => r2(-y * U);
export const epts = (p: Pt[]) => p.map(([x, y]) => `${EX(x)},${EY(y)}`).join(" ");

/** plan coords: y down */
export const PX = (v: number) => r2(v * U);
export const ppts = (p: Pt[]) => p.map(([x, y]) => `${PX(x)},${PX(y)}`).join(" ");

export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));

/** feet -> 24'-6" */
export function ftIn(ft: number) {
  const total = Math.round(ft * 12);
  const f = Math.floor(total / 12);
  const i = total % 12;
  return `${f}'-${i}"`;
}

/** linear interpolation along a polyline (x ascending); extrapolates ends */
export function yAt(chain: Pt[], x: number) {
  if (chain.length < 2) return chain[0]?.[1] ?? 0;
  for (let i = 0; i < chain.length - 1; i++) {
    const [x1, y1] = chain[i];
    const [x2, y2] = chain[i + 1];
    if (x >= x1 && x <= x2) return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1 || 1);
  }
  const first = x < chain[0][0];
  const [a, b] = first
    ? [chain[0], chain[1]]
    : [chain[chain.length - 2], chain[chain.length - 1]];
  const s = (b[1] - a[1]) / (b[0] - a[0] || 1);
  return a[1] + s * (x - a[0]);
}

/** offset a left->right polyline along its left-hand normal (up for roofs) */
export function offsetChain(chain: Pt[], d: number): Pt[] {
  const nrm = (a: Pt, b: Pt): Pt => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  };
  return chain.map((p, i) => {
    const n1 = i > 0 ? nrm(chain[i - 1], p) : null;
    const n2 = i < chain.length - 1 ? nrm(p, chain[i + 1]) : null;
    if (n1 && n2) {
      let mx = n1[0] + n2[0];
      let my = n1[1] + n2[1];
      const l = Math.hypot(mx, my) || 1;
      mx /= l;
      my /= l;
      const s = d / (mx * n1[0] + my * n1[1]);
      return [p[0] + mx * s, p[1] + my * s] as Pt;
    }
    const m = (n1 || n2) as Pt;
    return [p[0] + m[0] * d, p[1] + m[1] * d] as Pt;
  });
}

/** extend first/last segment of a chain along its direction */
export function extendChain(chain: Pt[], o0: number, o1: number): Pt[] {
  const c = chain.map((p) => [p[0], p[1]] as Pt);
  if (o0 && c.length > 1) {
    const [a, b] = [c[0], c[1]];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    c[0] = [a[0] - (dx / l) * o0, a[1] - (dy / l) * o0];
  }
  if (o1 && c.length > 1) {
    const a = c[c.length - 2];
    const b = c[c.length - 1];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    c[c.length - 1] = [b[0] + (dx / l) * o1, b[1] + (dy / l) * o1];
  }
  return c;
}

/** deterministic PRNG so SSR + client drawings match */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** stipple dot tile (unit square coordinates) */
export const STIPPLE: [number, number, number][] = (() => {
  const r = rng(42);
  const out: [number, number, number][] = [];
  for (let i = 0; i < 22; i++)
    out.push([r2(r()), r2(r()), r2(0.35 + r() * 0.55)]);
  return out;
})();

/** bare winter tree, returned as one path per branch depth (for tapering) */
export function treePaths(
  seed: number,
  x: number,
  h: number,
  maxDepth = 7,
): { d: string; depth: number }[] {
  const r = rng(seed);
  const levels: string[][] = [];
  const branch = (
    x0: number,
    y0: number,
    len: number,
    ang: number,
    depth: number,
  ) => {
    const x1 = x0 + Math.cos(ang) * len;
    const y1 = y0 + Math.sin(ang) * len;
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(`M${EX(x0)} ${EY(y0)}L${EX(x1)} ${EY(y1)}`);
    if (depth >= maxDepth) return;
    const kids = depth < 1 ? 2 : r() < 0.45 ? 3 : 2;
    for (let k = 0; k < kids; k++) {
      const spread = 0.3 + r() * 0.32;
      let a = ang + (k - (kids - 1) / 2) * spread + (r() - 0.5) * 0.28;
      a = a * 0.78 + (Math.PI / 2) * 0.22; // keep crown upright + oval
      branch(x1, y1, len * (0.7 + r() * 0.1), a, depth + 1);
    }
  };
  branch(x, 0, h * 0.24, Math.PI / 2 + (r() - 0.5) * 0.06, 0);
  return levels.map((l, depth) => ({ d: l.join(""), depth }));
}
