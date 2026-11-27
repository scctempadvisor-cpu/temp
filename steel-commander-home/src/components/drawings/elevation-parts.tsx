import type { ReactNode } from "react";
import { C, EX, EY, U, r2 } from "./core";
import type { Opening } from "./elevation-geom";

export interface Ctx {
  sw: (px: number) => number;
  url: (name: string) => string;
}

export function R(
  x: number,
  y: number,
  w: number,
  h: number,
  props: Record<string, unknown> = {},
  key?: string | number,
) {
  return (
    <rect key={key} x={EX(x)} y={EY(y + h)} width={r2(w * U)} height={r2(h * U)} {...props} />
  );
}

function L(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  width: number,
  key?: string | number,
  extra: Record<string, unknown> = {},
) {
  return (
    <line
      key={key}
      x1={EX(x1)}
      y1={EY(y1)}
      x2={EX(x2)}
      y2={EY(y2)}
      stroke={stroke}
      strokeWidth={width}
      {...extra}
    />
  );
}

export function walkDoor(c: Ctx, x: number, key?: string | number) {
  const { sw, url } = c;
  return (
    <g key={key}>
      {R(x - 0.3, 0, 3.6, 7.4, { fill: C.paper, stroke: C.ink, strokeWidth: sw(0.8) })}
      {R(x, 0, 3, 7, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1) })}
      {R(x + 0.45, 4.2, 2.1, 2.3, { fill: "none", stroke: C.graphite, strokeWidth: sw(0.5) })}
      {R(x + 0.45, 0.6, 2.1, 3.2, { fill: "none", stroke: C.graphite, strokeWidth: sw(0.5) })}
      <circle cx={EX(x + 2.55)} cy={EY(3.6)} r={sw(1.6)} fill={C.ink} />
      {R(x, 6.45, 3, 0.55, { fill: url("hatchD") })}
      {L(x - 0.7, 8, x + 3.7, 8, C.ink, sw(1.3))}
      {R(x - 0.7, 7.4, 4.4, 0.6, { fill: url("hatchD"), opacity: 0.6 })}
    </g>
  );
}

export function drawOpening(c: Ctx, o: Opening, ox: number, key: number): ReactNode {
  const { sw, url } = c;
  switch (o.kind) {
    case "rollup":
    case "dock": {
      const x = o.x + ox;
      const y0 = o.kind === "dock" ? 4 : 0;
      return (
        <g key={key}>
          {o.kind === "dock" && R(x - 1.2, 0, o.w + 2.4, y0, { fill: url("hatch"), opacity: 0.55 })}
          {R(x - 0.45, y0, o.w + 0.9, o.h + 0.55, { fill: C.paper, stroke: C.ink, strokeWidth: sw(0.8) })}
          {R(x, y0, o.w, o.h, { fill: C.paper })}
          {R(x, y0, o.w, o.h, { fill: url("slat") })}
          {R(x, y0, o.w, o.h, { fill: "none", stroke: C.ink, strokeWidth: sw(1.1) })}
          {R(x, y0 + o.h - 0.95, o.w, 0.95, { fill: url("hatchD"), opacity: 0.85 })}
          {L(x, y0 + 0.35, x + o.w, y0 + 0.35, C.ink, sw(0.8))}
          {R(x + o.w / 2 - 0.45, y0 + 1.3, 0.9, 0.2, { fill: C.ink })}
          {o.kind === "dock" && (
            <>
              {R(x - 0.35, y0 - 1.1, 0.7, 1.4, { fill: C.ink })}
              {R(x + o.w - 0.35, y0 - 1.1, 0.7, 1.4, { fill: C.ink })}
            </>
          )}
        </g>
      );
    }
    case "walk":
      return walkDoor(c, o.x + ox, key);
    case "window": {
      const x = o.x + ox;
      const w = o.w ?? 3;
      const h = o.h ?? 3;
      const y = o.y;
      const mull = Math.max(1, Math.round(w / 3.4) - 1);
      return (
        <g key={key}>
          {R(x - 0.28, y - 0.15, w + 0.56, h + 0.43, { fill: C.paper, stroke: C.ink, strokeWidth: sw(0.8) })}
          {R(x - 0.5, y - 0.38, w + 1, 0.26, { fill: C.paper, stroke: C.ink, strokeWidth: sw(0.7) })}
          {R(x, y, w, h, { fill: C.paper2, stroke: C.ink, strokeWidth: sw(0.9) })}
          {w >= 4 &&
            Array.from({ length: mull }, (_, j) => {
              const vx = x + (w * (j + 1)) / (mull + 1);
              return L(vx, y, vx, y + h, C.ink, sw(0.7), `m${j}`);
            })}
          {L(x, y + h * 0.5, x + w, y + h * 0.5, C.ink, sw(0.6))}
          {L(x + w * 0.12, y + h * 0.12, x + w * 0.42, y + h * 0.88, C.pencil, sw(0.6))}
          {L(x + w * 0.3, y + h * 0.1, x + w * 0.52, y + h * 0.6, C.pencil, sw(0.5))}
          {R(x, y + h - 0.4, w, 0.4, { fill: url("hatchD") })}
        </g>
      );
    }
    case "louver": {
      const x = o.x + ox;
      const lines: ReactNode[] = [];
      for (let yy = o.y + 0.3; yy < o.y + o.h - 0.1; yy += 0.32)
        lines.push(L(x + 0.15, yy, x + o.w - 0.15, yy, C.ink, sw(0.55), yy));
      return (
        <g key={key}>
          {R(x - 0.25, o.y - 0.25, o.w + 0.5, o.h + 0.5, { fill: C.paper, stroke: C.ink, strokeWidth: sw(0.9) })}
          {R(x, o.y, o.w, o.h, { fill: C.paper2, stroke: C.ink, strokeWidth: sw(0.6) })}
          {lines}
        </g>
      );
    }
    case "hangar": {
      const x = o.x + ox;
      const parts: ReactNode[] = [];
      for (let yy = 2.25; yy < o.h - 0.5; yy += 2.25)
        parts.push(L(x, yy, x + o.w, yy, C.graphite, sw(0.55), `p${yy}`));
      const n = Math.max(4, Math.round(o.w / 7.5));
      for (let i = 1; i < n; i++) {
        const vx = x + (o.w * i) / n;
        parts.push(L(vx, 0, vx, o.h, C.graphite, sw(0.4), `v${i}`, { strokeOpacity: 0.6 }));
      }
      for (let i = 0; i < n; i++) {
        const cx = x + (o.w * (i + 0.5)) / n;
        parts.push(
          R(cx - 1.6, o.h * 0.62, 3.2, 1.3, { fill: C.paper2, stroke: C.ink, strokeWidth: sw(0.6) }, `w${i}`),
        );
      }
      return (
        <g key={key}>
          {R(x - 0.7, 0, o.w + 1.4, o.h + 1, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1) })}
          {R(x, 0, o.w, o.h, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1.2) })}
          {parts}
          {R(x, o.h - 1.2, o.w, 1.2, { fill: url("hatchD"), opacity: 0.85 })}
          {walkDoor(c, x + o.w * 0.08)}
        </g>
      );
    }
    case "slider": {
      const x = o.x + ox;
      const half = o.w / 2;
      const leaf = (lx: number, kk: string) => (
        <g key={kk}>
          {R(lx, 0.15, half, o.h - 0.15, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1.1) })}
          {R(lx + 0.55, 0.7, half - 1.1, o.h - 1.4, { fill: "none", stroke: C.ink, strokeWidth: sw(0.7) })}
          {L(lx + 0.55, 0.7, lx + half - 0.55, o.h - 0.7, C.ink, sw(0.7))}
          {L(lx + 0.55, o.h - 0.7, lx + half - 0.55, 0.7, C.ink, sw(0.7))}
          {L(lx + 0.55, o.h / 2, lx + half - 0.55, o.h / 2, C.ink, sw(0.6))}
        </g>
      );
      return (
        <g key={key}>
          {R(x - 0.4, 0, o.w + 0.8, o.h + 0.3, { fill: url("hatchD"), opacity: 0.8 })}
          {leaf(x, "a")}
          {leaf(x + half, "b")}
          {R(x - 1.2, o.h + 0.25, o.w + 2.4, 0.75, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1) })}
        </g>
      );
    }
    case "storefront": {
      const x = o.x + ox;
      const n = Math.max(2, Math.round(o.w / 4));
      const pw = o.w / n;
      const doorI = Math.floor(n / 2);
      const items: ReactNode[] = [];
      for (let i = 0; i < n; i++) {
        const px = x + i * pw;
        items.push(
          <g key={i}>
            {R(px, 0, pw, o.h - 2.2, { fill: C.paper2, stroke: C.ink, strokeWidth: sw(0.9) })}
            {R(px, o.h - 2.2, pw, 2.2, { fill: C.paper2, stroke: C.ink, strokeWidth: sw(0.9) })}
            {L(px + pw * 0.2, 1, px + pw * 0.55, o.h - 3, C.pencil, sw(0.5))}
            {i === doorI && L(px + 0.5, 3.5, px + pw - 0.5, 3.5, C.ink, sw(1.4))}
          </g>,
        );
      }
      return (
        <g key={key}>
          {items}
          {R(x - 1, o.h + 0.5, o.w + 2, 0.8, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1) })}
          {R(x, o.h - 0.9, o.w, 0.9, { fill: url("hatchD"), opacity: 0.8 })}
        </g>
      );
    }
    default:
      return null;
  }
}
