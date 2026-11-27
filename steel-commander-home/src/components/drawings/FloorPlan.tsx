"use client";

import { type CSSProperties, type ReactNode, useId } from "react";
import { C, PX, type Pt, U, ftIn, ppts, r2 } from "./core";

export type Wall = "N" | "S" | "E" | "W";

export interface PlanOpening {
  wall: Wall;
  at: number;
  w: number;
  kind: "rollup" | "walk" | "hangar" | "slider" | "window" | "dock" | "storefront";
  label?: string;
}

export interface PlanRoom {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  sub?: string;
  door?: { side: Wall; at: number; w?: number };
}

export interface Fixture {
  kind:
    | "car"
    | "truck"
    | "plane"
    | "tractor"
    | "bed"
    | "sofa"
    | "counter"
    | "island"
    | "tub"
    | "toilet"
    | "bench"
    | "rack"
    | "table";
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
}

export interface PlanLeanTo {
  side: "N" | "S";
  x: number;
  len: number;
  depth: number;
  open?: boolean;
  label?: string;
}

export interface PlanSpec {
  length: number;
  width: number;
  bay: number;
  openings: PlanOpening[];
  rooms?: PlanRoom[];
  fixtures?: Fixture[];
  leanTos?: PlanLeanTo[];
  labels?: { x: number; y: number; text: string; big?: boolean }[];
  /** extra interior column lines (y in ft) */
  colRows?: number[];
}

const T = 0.7; // wall thickness

export function FloorPlan({
  spec,
  basePx = 800,
  className,
  style,
  grid = true,
}: {
  spec: PlanSpec;
  basePx?: number;
  className?: string;
  style?: CSSProperties;
  grid?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `p${uid}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;

  const L = spec.length;
  const W = spec.width;
  const nLean = Math.max(0, ...(spec.leanTos ?? []).filter((l) => l.side === "N").map((l) => l.depth));
  const sLean = Math.max(0, ...(spec.leanTos ?? []).filter((l) => l.side === "S").map((l) => l.depth));

  const x0 = -8;
  const x1 = L + 6.5;
  const y0 = -nLean - 9;
  const y1 = W + sLean + 5.5;
  const vbW = (x1 - x0) * U;
  const vbH = (y1 - y0) * U;
  const k = vbW / basePx;
  const sw = (px: number) => r2(px * k);
  const fs = sw(10);
  const mono = { fontFamily: "var(--font-plex-mono), monospace" };

  const n = Math.max(1, Math.round(L / spec.bay));
  const bayLen = L / n;
  const frames = Array.from({ length: n + 1 }, (_, i) => i * bayLen);

  const toXY = (wall: Wall, u: number, v: number): Pt => {
    switch (wall) {
      case "N":
        return [u, v];
      case "S":
        return [u, W - v];
      case "W":
        return [v, u];
      default:
        return [L - v, u];
    }
  };
  const quad = (wall: Wall, u0: number, u1: number, v0: number, v1: number) =>
    ppts([toXY(wall, u0, v0), toXY(wall, u1, v0), toXY(wall, u1, v1), toXY(wall, u0, v1)]);
  const seg = (a: Pt, b: Pt, props: Record<string, unknown>, key?: string | number) => (
    <line key={key} x1={PX(a[0])} y1={PX(a[1])} x2={PX(b[0])} y2={PX(b[1])} {...props} />
  );
  const text = (x: number, y: number, s: string, size = fs, color = C.graphite, key?: string | number) => (
    <text
      key={key}
      x={PX(x)}
      y={PX(y)}
      fontSize={size}
      fill={color}
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ ...mono, letterSpacing: ".04em" }}
    >
      {s}
    </text>
  );
  const dash = { strokeDasharray: `${sw(5)} ${sw(3.5)}` };
  const swing = (hinge: Pt, leafEnd: Pt, closeEnd: Pt, key?: string | number) => {
    // quarter arc from leafEnd to closeEnd around hinge
    const pts: Pt[] = [];
    const a0 = Math.atan2(leafEnd[1] - hinge[1], leafEnd[0] - hinge[0]);
    let a1 = Math.atan2(closeEnd[1] - hinge[1], closeEnd[0] - hinge[0]);
    let d = a1 - a0;
    if (d > Math.PI) a1 -= 2 * Math.PI;
    if (d < -Math.PI) a1 += 2 * Math.PI;
    d = a1 - a0;
    const r = Math.hypot(leafEnd[0] - hinge[0], leafEnd[1] - hinge[1]);
    for (let i = 0; i <= 10; i++) {
      const a = a0 + (d * i) / 10;
      pts.push([hinge[0] + Math.cos(a) * r, hinge[1] + Math.sin(a) * r]);
    }
    return (
      <g key={key}>
        {seg(hinge, leafEnd, { stroke: C.ink, strokeWidth: sw(1.1) })}
        <polyline points={ppts(pts)} fill="none" stroke={C.graphite} strokeWidth={sw(0.6)} />
      </g>
    );
  };

  /* ---------- openings ---------- */
  const opening = (o: PlanOpening, i: number) => {
    const u0 = o.at;
    const u1 = o.at + o.w;
    const els: ReactNode[] = [
      <polygon key="c" points={quad(o.wall, u0, u1, -0.08, T + 0.08)} fill={C.paper} />,
      seg(toXY(o.wall, u0, 0), toXY(o.wall, u0, T), { stroke: C.ink, strokeWidth: sw(1.1) }, "j0"),
      seg(toXY(o.wall, u1, 0), toXY(o.wall, u1, T), { stroke: C.ink, strokeWidth: sw(1.1) }, "j1"),
    ];
    if (o.kind === "rollup" || o.kind === "hangar" || o.kind === "dock") {
      els.push(
        seg(toXY(o.wall, u0, T + 0.9), toXY(o.wall, u1, T + 0.9), {
          stroke: C.ink,
          strokeWidth: sw(0.8),
          ...dash,
        }, "d"),
      );
      els.push(
        seg(toXY(o.wall, u0, T * 0.5), toXY(o.wall, u1, T * 0.5), { stroke: C.ink, strokeWidth: sw(0.6) }, "m"),
      );
      if (o.kind === "dock") {
        els.push(<polygon key="b1" points={quad(o.wall, u0 - 0.6, u0 + 0.2, -0.7, 0)} fill={C.ink} />);
        els.push(<polygon key="b2" points={quad(o.wall, u1 - 0.2, u1 + 0.6, -0.7, 0)} fill={C.ink} />);
      }
      if (o.label) {
        const [lx, ly] = toXY(o.wall, (u0 + u1) / 2, T + 2.2);
        const vertical = o.wall === "W" || o.wall === "E";
        els.push(
          <text
            key="l"
            x={PX(lx)}
            y={PX(ly)}
            fontSize={fs * 0.82}
            fill={C.graphite}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ ...mono, letterSpacing: ".04em" }}
            transform={vertical ? `rotate(-90 ${PX(lx)} ${PX(ly)})` : undefined}
          >
            {o.label}
          </text>,
        );
      }
    } else if (o.kind === "walk") {
      els.push(swing(toXY(o.wall, u0, T), toXY(o.wall, u0, T + o.w), toXY(o.wall, u1, T), "s"));
    } else if (o.kind === "slider") {
      els.push(<polygon key="a" points={quad(o.wall, u0 - o.w / 2, u0, -0.65, -0.25)} fill={C.paper} stroke={C.ink} strokeWidth={sw(0.9)} />);
      els.push(<polygon key="b" points={quad(o.wall, u1, u1 + o.w / 2, -0.65, -0.25)} fill={C.paper} stroke={C.ink} strokeWidth={sw(0.9)} />);
      els.push(
        seg(toXY(o.wall, u0 - o.w / 2, -0.95), toXY(o.wall, u1 + o.w / 2, -0.95), {
          stroke: C.graphite,
          strokeWidth: sw(0.6),
          ...dash,
        }, "t"),
      );
    } else if (o.kind === "window") {
      for (const v of [0.05, T / 2, T - 0.05])
        els.push(seg(toXY(o.wall, u0, v), toXY(o.wall, u1, v), { stroke: C.ink, strokeWidth: sw(0.6) }, `w${v}`));
    } else if (o.kind === "storefront") {
      els.push(seg(toXY(o.wall, u0, T / 2), toXY(o.wall, u1, T / 2), { stroke: C.ink, strokeWidth: sw(0.9) }, "g"));
      const m = Math.max(2, Math.round(o.w / 4));
      for (let j = 1; j < m; j++) {
        const u = u0 + (o.w * j) / m;
        els.push(seg(toXY(o.wall, u, 0), toXY(o.wall, u, T), { stroke: C.ink, strokeWidth: sw(0.8) }, `mu${j}`));
      }
      const c = (u0 + u1) / 2;
      els.push(swing(toXY(o.wall, c - 1.75, T), toXY(o.wall, c - 1.75, T + 3.5), toXY(o.wall, c + 1.75, T), "sd"));
    }
    return <g key={i}>{els}</g>;
  };

  /* ---------- rooms ---------- */
  const roomXY = (r: PlanRoom, side: Wall, u: number, v: number): Pt => {
    switch (side) {
      case "N":
        return [r.x + u, r.y + v];
      case "S":
        return [r.x + u, r.y + r.h - v];
      case "W":
        return [r.x + v, r.y + u];
      default:
        return [r.x + r.w - v, r.y + u];
    }
  };
  const roomWalls = (r: PlanRoom, i: number) => (
    <rect
      key={`rw${i}`}
      x={PX(r.x)}
      y={PX(r.y)}
      width={PX(r.w)}
      height={PX(r.h)}
      fill="none"
      stroke={C.ink}
      strokeWidth={sw(2)}
    />
  );
  const roomDoor = (r: PlanRoom, i: number) => {
    if (!r.door) return null;
    const s = r.door.side;
    const dw = r.door.w ?? 3;
    const a = r.door.at;
    return (
      <g key={`rd${i}`}>
        {seg(roomXY(r, s, a, 0), roomXY(r, s, a + dw, 0), { stroke: C.paper, strokeWidth: sw(3.4) })}
        {swing(roomXY(r, s, a, 0), roomXY(r, s, a, dw), roomXY(r, s, a + dw, 0))}
      </g>
    );
  };
  const roomLabel = (r: PlanRoom, i: number) => {
    const small = Math.min(r.w, r.h) < 11;
    return (
      <g key={`rl${i}`}>
        {r.label &&
          text(r.x + r.w / 2, r.y + r.h / 2 - (r.sub ? 1 : 0), r.label, small ? fs * 0.78 : fs, C.ink)}
        {r.sub && text(r.x + r.w / 2, r.y + r.h / 2 + 1.3, r.sub, fs * 0.75, C.pencil)}
      </g>
    );
  };

  /* ---------- fixtures ---------- */
  const fixture = (f: Fixture, i: number) => {
    const a = (f.w * U) / 2;
    const b = (f.h * U) / 2;
    const st = { fill: C.paper, stroke: C.graphite, strokeWidth: sw(0.85) };
    const ln = { fill: "none", stroke: C.graphite, strokeWidth: sw(0.7) };
    let body: ReactNode = null;
    switch (f.kind) {
      case "car":
        body = (
          <>
            {[-1, 1].map((sx) =>
              [-1, 1].map((sy) => (
                <rect key={`${sx}${sy}`} x={sx * a * 0.62 - a * 0.12} y={sy < 0 ? -b * 1.08 : b * 0.86} width={a * 0.24} height={b * 0.22} fill={C.graphite} />
              )),
            )}
            <rect x={-a} y={-b * 0.92} width={a * 2} height={b * 1.84} rx={b * 0.45} {...st} />
            <rect x={-a * 0.52} y={-b * 0.7} width={a * 0.72} height={b * 1.4} rx={b * 0.2} {...ln} />
            <path d={`M${a * 0.2} ${-b * 0.7}L${a * 0.42} ${-b * 0.82}M${a * 0.2} ${b * 0.7}L${a * 0.42} ${b * 0.82}M${a * 0.42} ${-b * 0.82}L${a * 0.42} ${b * 0.82}`} {...ln} />
            <path d={`M${-a * 0.52} ${-b * 0.7}L${-a * 0.7} ${-b * 0.78}L${-a * 0.7} ${b * 0.78}L${-a * 0.52} ${b * 0.7}`} {...ln} />
          </>
        );
        break;
      case "truck":
        body = (
          <>
            <rect x={-a} y={-b} width={a * 1.3} height={b * 2} rx={b * 0.12} {...st} />
            <rect x={a * 0.36} y={-b * 0.9} width={a * 0.64} height={b * 1.8} rx={b * 0.3} {...st} />
            <path d={`M${a * 0.56} ${-b * 0.8}L${a * 0.56} ${b * 0.8}`} {...ln} />
            <path d={`M${-a * 0.9} ${-b * 0.7}L${a * 0.2} ${-b * 0.7}M${-a * 0.9} ${b * 0.7}L${a * 0.2} ${b * 0.7}`} {...ln} />
          </>
        );
        break;
      case "plane": {
        const fw = b * 0.1;
        body = (
          <>
            <path
              d={`M${-a * 0.22} ${-fw}L${a * 0.02} ${-b}L${a * 0.18} ${-b}L${a * 0.12} ${-fw}ZM${-a * 0.22} ${fw}L${a * 0.02} ${b}L${a * 0.18} ${b}L${a * 0.12} ${fw}Z`}
              {...st}
            />
            <path
              d={`M${a * 0.7} ${-fw * 0.8}L${a * 0.84} ${-b * 0.34}L${a * 0.95} ${-b * 0.34}L${a * 0.93} ${-fw * 0.6}ZM${a * 0.7} ${fw * 0.8}L${a * 0.84} ${b * 0.34}L${a * 0.95} ${b * 0.34}L${a * 0.93} ${fw * 0.6}Z`}
              {...st}
            />
            <path
              d={`M${-a} 0Q${-a * 0.92} ${-fw * 1.3} ${-a * 0.65} ${-fw * 1.3}L${a * 0.85} ${-fw * 0.5}L${a} 0L${a * 0.85} ${fw * 0.5}L${-a * 0.65} ${fw * 1.3}Q${-a * 0.92} ${fw * 1.3} ${-a} 0Z`}
              {...st}
            />
            <path d={`M${-a * 0.78} ${-fw * 0.9}L${-a * 0.6} ${-fw * 0.9}L${-a * 0.6} ${fw * 0.9}L${-a * 0.78} ${fw * 0.9}`} {...ln} />
            <line x1={-a * 1.01} x2={-a * 1.01} y1={-b * 0.16} y2={b * 0.16} stroke={C.ink} strokeWidth={sw(1.2)} />
          </>
        );
        break;
      }
      case "tractor":
        body = (
          <>
            {[-1, 1].map((s) => (
              <g key={s}>
                <rect x={-a * 0.75} y={s > 0 ? b * 0.55 : -b} width={a * 0.55} height={b * 0.45} rx={sw(1)} fill={C.graphite} />
                <rect x={a * 0.45} y={s > 0 ? b * 0.45 : -b * 0.75} width={a * 0.35} height={b * 0.3} rx={sw(1)} fill={C.graphite} />
              </g>
            ))}
            <rect x={-a * 0.05} y={-b * 0.3} width={a} height={b * 0.6} rx={b * 0.1} {...st} />
            <rect x={-a * 0.6} y={-b * 0.5} width={a * 0.6} height={b} {...st} />
            <line x1={-a} x2={-a * 0.6} y1={0} y2={0} stroke={C.graphite} strokeWidth={sw(1)} />
          </>
        );
        break;
      case "bed":
        body = (
          <>
            <rect x={-a} y={-b} width={a * 2} height={b * 2} {...st} />
            <rect x={-a * 0.94} y={-b * 0.88} width={a * 0.3} height={b * 0.8} rx={sw(1.5)} {...ln} />
            <rect x={-a * 0.94} y={b * 0.08} width={a * 0.3} height={b * 0.8} rx={sw(1.5)} {...ln} />
            <path d={`M${-a * 0.45} ${-b}L${-a * 0.3} ${b}`} {...ln} />
          </>
        );
        break;
      case "sofa":
        body = (
          <>
            <rect x={-a} y={-b} width={a * 2} height={b * 2} rx={sw(2)} {...st} />
            <path d={`M${-a * 0.82} ${b}L${-a * 0.82} ${-b * 0.4}L${a * 0.82} ${-b * 0.4}L${a * 0.82} ${b}M0 ${-b * 0.4}L0 ${b}`} {...ln} />
          </>
        );
        break;
      case "counter":
        body = (
          <>
            <rect x={-a} y={-b} width={a * 2} height={b * 2} {...st} />
            <line x1={-a} x2={a} y1={b * 0.6} y2={b * 0.6} {...ln} />
            <rect x={-a * 0.12} y={-b * 0.55} width={a * 0.24} height={b * 0.9} rx={sw(1.5)} {...ln} />
          </>
        );
        break;
      case "island":
        body = (
          <>
            <rect x={-a} y={-b} width={a * 2} height={b * 2} {...st} />
            <rect x={-a * 0.88} y={-b * 0.7} width={a * 1.76} height={b * 1.4} {...ln} />
          </>
        );
        break;
      case "tub":
        body = (
          <>
            <rect x={-a} y={-b} width={a * 2} height={b * 2} {...st} />
            <rect x={-a * 0.85} y={-b * 0.72} width={a * 1.7} height={b * 1.44} rx={b * 0.6} {...ln} />
          </>
        );
        break;
      case "toilet":
        body = (
          <>
            <rect x={-a} y={-b} width={a * 0.6} height={b * 2} {...st} />
            <ellipse cx={a * 0.2} cy={0} rx={a * 0.75} ry={b * 0.8} {...st} />
          </>
        );
        break;
      case "bench":
        body = <rect x={-a} y={-b} width={a * 2} height={b * 2} fill={url("hatch")} stroke={C.graphite} strokeWidth={sw(0.85)} />;
        break;
      case "rack": {
        const m = Math.max(1, Math.round(f.w / 8));
        const sx = (a * 2) / m;
        body = (
          <>
            <rect x={-a} y={-b} width={a * 2} height={b * 2} {...st} />
            {Array.from({ length: m }, (_, j) => (
              <path
                key={j}
                d={`M${-a + j * sx} ${-b}L${-a + (j + 1) * sx} ${b}M${-a + (j + 1) * sx} ${-b}L${-a + j * sx} ${b}M${-a + (j + 1) * sx} ${-b}L${-a + (j + 1) * sx} ${b}`}
                {...ln}
              />
            ))}
          </>
        );
        break;
      }
      case "table":
        body = (
          <>
            {[-0.5, 0.5].map((cx) =>
              [-1, 1].map((sy) => (
                <rect key={`${cx}${sy}`} x={cx * a - a * 0.18} y={sy > 0 ? b * 1.05 : -b * 1.45} width={a * 0.36} height={b * 0.4} {...ln} />
              )),
            )}
            <rect x={-a} y={-b} width={a * 2} height={b * 2} {...st} />
          </>
        );
        break;
    }
    return (
      <g key={`f${i}`} transform={`translate(${PX(f.x)} ${PX(f.y)}) rotate(${f.rot ?? 0})`}>
        {body}
      </g>
    );
  };

  /* ---------- grid + dims ---------- */
  const rows = [0, ...(spec.colRows ?? []), W];
  const yBubble = -nLean - 6.6;
  const yDim = -nLean - 3;
  const br = sw(8.5);
  const tick = sw(4);
  const gridEls = grid ? (
    <g>
      {frames.map((x, i) => (
        <g key={`g${i}`}>
          {seg([x, yBubble + br / U], [x, W + sLean + 1.5], { stroke: C.pencil, strokeWidth: sw(0.6), ...dash })}
          <circle cx={PX(x)} cy={PX(yBubble)} r={br} fill={C.paper} stroke={C.graphite} strokeWidth={sw(0.8)} />
          {text(x, yBubble + 0.05, String(i + 1), fs * 0.9, C.ink)}
        </g>
      ))}
      {rows.map((y, i) => (
        <g key={`r${i}`}>
          {seg([-5 + br / U, y], [L + 1.5, y], { stroke: C.pencil, strokeWidth: sw(0.6), ...dash })}
          <circle cx={PX(-5)} cy={PX(y)} r={br} fill={C.paper} stroke={C.graphite} strokeWidth={sw(0.8)} />
          {text(-5, y + 0.05, String.fromCharCode(65 + i), fs * 0.9, C.ink)}
        </g>
      ))}
      {/* bay chain */}
      <g stroke={C.graphite} strokeWidth={sw(0.7)}>
        {seg([0, yDim], [L, yDim], {})}
        {frames.map((x, i) => (
          <line key={i} x1={PX(x) - tick} y1={PX(yDim) + tick} x2={PX(x) + tick} y2={PX(yDim) - tick} strokeWidth={sw(1.2)} />
        ))}
      </g>
      {frames.slice(0, -1).map((x, i) => text(x + bayLen / 2, yDim - 1.1, ftIn(bayLen), fs * 0.85, C.graphite, `bd${i}`))}
      {/* overall */}
      <g stroke={C.graphite} strokeWidth={sw(0.7)}>
        {seg([0, W + sLean + 3], [L, W + sLean + 3], {})}
        {[0, L].map((x) => (
          <line key={x} x1={PX(x) - tick} y1={PX(W + sLean + 3) + tick} x2={PX(x) + tick} y2={PX(W + sLean + 3) - tick} strokeWidth={sw(1.2)} />
        ))}
        {seg([L + 3.2, 0], [L + 3.2, W], {})}
        {[0, W].map((y) => (
          <line key={y} x1={PX(L + 3.2) - tick} y1={PX(y) + tick} x2={PX(L + 3.2) + tick} y2={PX(y) - tick} strokeWidth={sw(1.2)} />
        ))}
      </g>
      {text(L / 2, W + sLean + 4.4, ftIn(L), fs, C.ink, "ol")}
      <text
        x={PX(L + 4.6)}
        y={PX(W / 2)}
        fontSize={fs}
        fill={C.ink}
        textAnchor="middle"
        dominantBaseline="middle"
        style={mono}
        transform={`rotate(-90 ${PX(L + 4.6)} ${PX(W / 2)})`}
      >
        {ftIn(W)}
      </text>
    </g>
  ) : null;

  /* ---------- lean-tos ---------- */
  const leanEls = (spec.leanTos ?? []).map((lt, i) => {
    const ya = lt.side === "N" ? -lt.depth : W;
    const yb = lt.side === "N" ? 0 : W + lt.depth;
    const xa = lt.x;
    const xb = lt.x + lt.len;
    const cy = (ya + yb) / 2;
    if (lt.open) {
      const outerY = lt.side === "N" ? ya : yb;
      const posts = frames.filter((x) => x >= xa - 0.01 && x <= xb + 0.01);
      return (
        <g key={`lt${i}`}>
          <rect x={PX(xa)} y={PX(ya)} width={PX(lt.len)} height={PX(lt.depth)} fill={url("hatch")} opacity={0.35} />
          <polyline
            points={ppts(lt.side === "N" ? [[xa, 0], [xa, ya], [xb, ya], [xb, 0]] : [[xa, W], [xa, yb], [xb, yb], [xb, W]])}
            fill="none"
            stroke={C.ink}
            strokeWidth={sw(1)}
            {...dash}
          />
          {posts.map((x) => (
            <rect
              key={x}
              x={PX(Math.min(Math.max(x, xa + 0.35), xb - 0.35) - 0.35)}
              y={PX(outerY + (lt.side === "N" ? 0.1 : -0.8))}
              width={PX(0.7)}
              height={PX(0.7)}
              fill={C.ink}
            />
          ))}
          {lt.label && text((xa + xb) / 2, cy, lt.label, fs * 0.85, C.graphite)}
        </g>
      );
    }
    const inner =
      lt.side === "N"
        ? `M${PX(xa + T)} ${PX(ya + T)}H${PX(xb - T)}V${PX(0.02)}H${PX(xa + T)}Z`
        : `M${PX(xa + T)} ${PX(W - 0.02)}H${PX(xb - T)}V${PX(yb - T)}H${PX(xa + T)}Z`;
    return (
      <g key={`lt${i}`}>
        <path
          d={`M${PX(xa)} ${PX(ya)}H${PX(xb)}V${PX(yb)}H${PX(xa)}Z${inner}`}
          fillRule="evenodd"
          fill={url("poche")}
          stroke={C.ink}
          strokeWidth={sw(1.1)}
        />
        {lt.label && text((xa + xb) / 2, cy, lt.label, fs * 0.85, C.ink)}
      </g>
    );
  });

  /* ---------- columns ---------- */
  const cols: ReactNode[] = [];
  frames.forEach((x, i) => {
    const cx = Math.min(Math.max(x, T + 0.4), L - T - 0.4);
    const ys = [T + 0.7, W - T - 0.7, ...(spec.colRows ?? [])];
    ys.forEach((y, j) => {
      cols.push(<rect key={`c${i}-${j}`} x={PX(cx - 0.4)} y={PX(y - 0.7)} width={PX(0.8)} height={PX(1.4)} fill={C.ink} />);
    });
  });
  const m = Math.max(1, Math.ceil(W / 25));
  for (let j = 1; j < m; j++) {
    const y = (W * j) / m;
    cols.push(<rect key={`ew${j}`} x={PX(T + 0.05)} y={PX(y - 0.4)} width={PX(1.3)} height={PX(0.8)} fill={C.ink} />);
    cols.push(<rect key={`ee${j}`} x={PX(L - T - 1.35)} y={PX(y - 0.4)} width={PX(1.3)} height={PX(0.8)} fill={C.ink} />);
  }

  const hatchS = sw(4.5);

  return (
    <svg
      viewBox={`${PX(x0)} ${PX(y0)} ${r2(vbW)} ${r2(vbH)}`}
      className={className}
      style={style}
      role="img"
      aria-label="Steel building floor plan"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={id("poche")} width={hatchS} height={hatchS} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={hatchS} height={hatchS} fill={C.paper} />
          <line x1={0} y1={0} x2={0} y2={hatchS} stroke={C.ink} strokeWidth={sw(0.8)} />
        </pattern>
        <pattern id={id("hatch")} width={hatchS * 1.6} height={hatchS * 1.6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={hatchS * 1.6} stroke={C.graphite} strokeWidth={sw(0.5)} />
        </pattern>
      </defs>

      {gridEls}
      {leanEls}
      <rect x={PX(T)} y={PX(T)} width={PX(L - 2 * T)} height={PX(W - 2 * T)} fill={C.paper} fillOpacity={0.6} />
      {(spec.fixtures ?? []).map(fixture)}
      {(spec.rooms ?? []).map(roomWalls)}
      {(spec.rooms ?? []).map(roomDoor)}
      {(spec.rooms ?? []).map(roomLabel)}
      <path
        d={`M${PX(0)} ${PX(0)}H${PX(L)}V${PX(W)}H${PX(0)}ZM${PX(T)} ${PX(T)}V${PX(W - T)}H${PX(L - T)}V${PX(T)}Z`}
        fillRule="evenodd"
        fill={url("poche")}
        stroke={C.ink}
        strokeWidth={sw(1.3)}
      />
      {cols}
      {spec.openings.map(opening)}
      {(spec.labels ?? []).map((l, i) => text(l.x, l.y, l.text, l.big ? fs * 1.15 : fs * 0.9, l.big ? C.ink : C.graphite, `lab${i}`))}
    </svg>
  );
}
