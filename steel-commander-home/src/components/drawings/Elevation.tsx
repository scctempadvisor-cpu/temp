"use client";

import { type CSSProperties, type ReactNode, useId, useMemo } from "react";
import {
  C,
  EX,
  EY,
  type Pt,
  STIPPLE,
  U,
  epts,
  extendChain,
  ftIn,
  offsetChain,
  r2,
  treePaths,
  yAt,
} from "./core";
import {
  DRAWING_LAYERS,
  type ElevationSpec,
  type Layer,
  buildGeometry,
  elevationBox,
} from "./elevation-geom";
import { type Ctx, R, drawOpening } from "./elevation-parts";

export * from "./elevation-geom";

interface ElevationProps {
  spec: ElevationSpec;
  layers?: Layer[];
  dims?: boolean;
  pad?: number;
  /** expected render width in px; keeps line weights consistent */
  basePx?: number;
  /** render every layer and cross-fade with opacity (for sequencing) */
  keepAll?: boolean;
  /** render all layers hidden with data-layer hooks for a scroll plotter */
  plot?: boolean;
  className?: string;
  style?: CSSProperties;
  frameColor?: string;
  title?: string;
}

export function Elevation({
  spec,
  layers = DRAWING_LAYERS,
  dims = false,
  pad = 2,
  basePx = 900,
  keepAll = false,
  plot = false,
  className,
  style,
  frameColor = C.red,
  title,
}: ElevationProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `e${uid}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;

  const g = useMemo(() => buildGeometry(spec), [spec]);
  const box = useMemo(() => elevationBox(spec, { dims, pad }), [spec, dims, pad]);
  const trees = useMemo(
    () =>
      (spec.trees ?? []).map((t) => ({
        t,
        paths: treePaths(t.seed, t.x, t.h, t.ghost ? 6 : 7),
      })),
    [spec.trees],
  );

  const vbW = box.w * U;
  const vbH = box.h * U;
  const k = vbW / basePx;
  const sw = (px: number) => r2(px * k);
  const ctx: Ctx = { sw, url };
  const on = (l: Layer) => layers.includes(l) || (dims && l === "dims");
  const ribStep = k > 1.5 ? 2 * U : U;
  const W = g.W;
  const E = g.E;
  const ws = spec.wainscot ?? 0;
  const single = spec.roof === "single";
  const mono = { fontFamily: "var(--font-plex-mono), monospace" };
  const ink = (w: number) => ({ fill: "none", stroke: C.ink, strokeWidth: sw(w) });

  const layer = (name: Layer, children: ReactNode) => {
    if (plot) {
      // every layer rendered hidden; an external plotter reveals them
      return (
        <g key={name} data-layer={name} style={{ opacity: 0 }}>
          {children}
        </g>
      );
    }
    const visible = on(name);
    if (!visible && !keepAll) return null;
    return (
      <g
        key={name}
        data-layer={name}
        style={{
          opacity: visible ? 1 : 0,
          transition: keepAll ? "opacity .8s cubic-bezier(.2,.7,.1,1)" : undefined,
        }}
      >
        {children}
      </g>
    );
  };

  /* ---------- shared bits ---------- */

  const trimBand = (chain: Pt[], o0: number, o1: number, t = 0.7) => {
    const ext = extendChain(chain, o0, o1);
    const outer = offsetChain(ext, t);
    return (
      <>
        <polygon
          points={epts([...ext, ...[...outer].reverse()])}
          fill={C.paper}
          stroke={C.ink}
          strokeWidth={sw(1.2)}
          strokeLinejoin="round"
        />
        <polyline points={epts(offsetChain(ext, t * 0.42))} {...ink(0.5)} />
      </>
    );
  };

  const shadeBand = (chain: Pt[], clip: string, d = 1.3) => (
    <polygon
      points={epts([...chain, ...[...offsetChain(chain, -d)].reverse()])}
      fill={url("hatchD")}
      clipPath={url(clip)}
      opacity={0.85}
    />
  );

  const gutter = (p: Pt, dir: -1 | 1) => {
    const [gx, gy] = p;
    const pts: Pt[] = [
      [gx - 0.1 * dir, gy + 0.05],
      [gx + 0.55 * dir, gy + 0.05],
      [gx + 0.45 * dir, gy - 0.55],
      [gx - 0.1 * dir, gy - 0.55],
    ];
    return <polygon points={epts(pts)} fill={C.paper} stroke={C.ink} strokeWidth={sw(0.9)} />;
  };

  const downspout = (p: Pt, wallX: number, dir: -1 | 1) => {
    const [gx, gy] = p;
    const px = wallX + 0.38 * dir;
    const pts: Pt[] = [
      [gx + 0.2 * dir, gy - 0.5],
      [gx + 0.2 * dir, gy - 0.9],
      [px, gy - 1.7],
      [px, 0.75],
      [px + 0.55 * dir, 0.35],
    ];
    return (
      <>
        <polyline points={epts(pts)} fill="none" stroke={C.ink} strokeWidth={sw(4)} strokeLinejoin="round" />
        <polyline points={epts(pts)} fill="none" stroke={C.paper} strokeWidth={sw(2.2)} strokeLinejoin="round" />
      </>
    );
  };

  /* ---------- sheeting ---------- */

  const mainExt = extendChain(g.chain, 1, 1);

  const leanTos = g.leans.map((l, i) => {
    const left = l.spec.side === "left";
    const dir: -1 | 1 = left ? -1 : 1;
    const o0 = left ? 0.9 : 0;
    const o1 = left ? 0 : 0.9;
    const ext = extendChain(l.chain, o0, o1);
    const outerEnd = left ? ext[0] : ext[ext.length - 1];
    const outerX = left ? l.x0 : l.x1;
    if (l.spec.open) {
      const postX = left ? l.x0 + 0.15 : l.x1 - 0.85;
      const postTop = yAt(l.chain, postX + 0.35) - 0.65;
      const braceX = left ? postX + 0.7 : postX;
      const braceEnd = braceX - dir * 2.2;
      return (
        <g key={`lt${i}`}>
          <polygon points={epts(l.poly)} fill={C.paper} />
          <polygon points={epts(l.poly)} fill={url("hatch")} opacity={0.75} />
          <polyline points={epts(offsetChain(l.chain, -0.65))} {...ink(1)} />
          {R(postX, 0, 0.7, postTop, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1) })}
          <line
            x1={EX(braceX)}
            y1={EY(postTop - 2.2)}
            x2={EX(braceEnd)}
            y2={EY(yAt(l.chain, braceEnd) - 0.65)}
            stroke={C.ink}
            strokeWidth={sw(0.9)}
          />
          {trimBand(l.chain, o0, o1, 0.6)}
          {gutter(outerEnd, dir)}
        </g>
      );
    }
    return (
      <g key={`lt${i}`}>
        <polygon points={epts(l.poly)} fill={C.paper} />
        <polygon points={epts(l.poly)} fill={url("rib")} />
        {ws > 0 && ws < l.spec.low - 1 && (
          <>
            {R(l.x0, 0, l.spec.width, ws, { fill: C.paper })}
            {R(l.x0, 0, l.spec.width, ws, { fill: url("stip") })}
            <line x1={EX(l.x0)} x2={EX(l.x1)} y1={EY(ws)} y2={EY(ws)} stroke={C.ink} strokeWidth={sw(0.9)} />
          </>
        )}
        {shadeBand(l.chain, `clipL${i}`, 1)}
        {R(left ? l.x0 : l.x1 - 0.45, 0, 0.45, yAt(l.chain, outerX), ink(0.6))}
        <polygon points={epts(l.poly)} {...ink(1.4)} strokeLinejoin="round" />
        {trimBand(l.chain, o0, o1, 0.6)}
        {gutter(outerEnd, dir)}
        {downspout(outerEnd, outerX, dir)}
      </g>
    );
  });

  const cupola =
    spec.cupola && !single ? (
      <g>
        {R(W / 2 - 1.6, g.ridge - 1, 3.2, 2.9, { fill: C.paper, stroke: C.ink, strokeWidth: sw(1) })}
        {[0.1, 0.45, 0.8, 1.15, 1.5].map((dy) => (
          <line
            key={dy}
            x1={EX(W / 2 - 1.2)}
            x2={EX(W / 2 + 1.2)}
            y1={EY(g.ridge + dy)}
            y2={EY(g.ridge + dy)}
            stroke={C.ink}
            strokeWidth={sw(0.55)}
          />
        ))}
        <polygon
          points={epts([
            [W / 2 - 2.3, g.ridge + 1.8],
            [W / 2, g.ridge + 3.3],
            [W / 2 + 2.3, g.ridge + 1.8],
          ])}
          fill={C.paper}
          stroke={C.ink}
          strokeWidth={sw(1)}
        />
        <line
          x1={EX(W / 2)}
          x2={EX(W / 2)}
          y1={EY(g.ridge + 3.3)}
          y2={EY(g.ridge + 4.2)}
          stroke={C.ink}
          strokeWidth={sw(1)}
        />
        <circle cx={EX(W / 2)} cy={EY(g.ridge + 3.75)} r={sw(1.8)} fill={C.ink} />
      </g>
    ) : null;

  const sheeting = (
    <>
      {leanTos}
      <g>
        <polygon points={epts(g.wall)} fill={C.paper} />
        <polygon points={epts(g.wall)} fill={url("rib")} />
        {ws > 0 && (
          <>
            {R(0, 0, W, ws, { fill: C.paper })}
            {R(0, 0, W, ws, { fill: url("stip") })}
            <line x1={EX(0)} x2={EX(W)} y1={EY(ws)} y2={EY(ws)} stroke={C.ink} strokeWidth={sw(1)} />
            <line
              x1={EX(0)}
              x2={EX(W)}
              y1={EY(ws - 0.28)}
              y2={EY(ws - 0.28)}
              stroke={C.ink}
              strokeWidth={sw(0.45)}
            />
          </>
        )}
        {shadeBand(g.chain, "clipMain")}
        {R(0, 0, 0.45, E, ink(0.6))}
        {R(W - 0.45, 0, 0.45, single ? yAt(g.chain, W) : E, ink(0.6))}
        <line x1={EX(0)} x2={EX(W)} y1={EY(0.35)} y2={EY(0.35)} stroke={C.ink} strokeWidth={sw(0.6)} />
        {cupola}
        <polygon points={epts(g.wall)} {...ink(1.5)} strokeLinejoin="round" />
        {trimBand(g.chain, 1, 1)}
        {gutter(mainExt[0], -1)}
        {!single && gutter(mainExt[mainExt.length - 1], 1)}
        {!g.left && downspout(mainExt[0], 0, -1)}
        {!g.right && !single && downspout(mainExt[mainExt.length - 1], W, 1)}
      </g>
    </>
  );

  const openings = (
    <>
      {(spec.openings ?? []).map((o, i) => drawOpening(ctx, o, 0, i))}
      {g.leans.map((l, li) =>
        l.spec.open ? null : (l.spec.openings ?? []).map((o, i) => drawOpening(ctx, o, l.x0, 100 + li * 20 + i)),
      )}
    </>
  );

  /* ---------- structure (x-ray) ---------- */

  const fg = g.fg;
  const dashed = { strokeDasharray: `${sw(5)} ${sw(3.5)}` };

  const ghost = (
    <g fill="none" stroke={C.pencil} strokeWidth={sw(0.9)} {...dashed}>
      <polygon points={epts(g.wall)} />
      {g.leans.map((l, i) => (
        <polygon key={i} points={epts(l.poly)} />
      ))}
      {(spec.openings ?? []).map((o, i) => {
        if (o.kind === "walk") return R(o.x, 0, 3, 7, {}, i);
        if (o.kind === "window" || o.kind === "louver") return R(o.x, o.y, o.w ?? 3, o.h ?? 3, {}, i);
        return R(o.x, o.kind === "dock" ? 4 : 0, o.w, o.h, {}, i);
      })}
    </g>
  );

  const columnBases = [
    { x: fg.c0, w: fg.bc },
    { x: fg.c1 - fg.bc, w: fg.bc },
    ...g.leans.map((l) => ({ x: l.spec.side === "left" ? l.x0 + 0.3 : l.x1 - 1.0, w: 0.7 })),
  ];

  const foundation = (() => {
    const a = g.minX - 0.4;
    const b = g.maxX + 0.4;
    const slab: Pt[] = [
      [a, 0],
      [b, 0],
      [b, -1.7],
      [b - 1.1, -1.7],
      [b - 1.8, -0.5],
      [a + 1.8, -0.5],
      [a + 1.1, -1.7],
      [a, -1.7],
    ];
    return (
      <g>
        <polygon points={epts(slab)} fill={url("stip")} opacity={0.8} />
        <polygon points={epts(slab)} fill="none" stroke={C.graphite} strokeWidth={sw(0.9)} {...dashed} />
        {columnBases.map((c, i) => (
          <g key={i}>
            {R(c.x - 0.9, -3.4, c.w + 1.8, 2.9, {
              fill: C.paper,
              stroke: C.graphite,
              strokeWidth: sw(0.9),
              ...dashed,
            })}
            {[c.x + 0.15, c.x + c.w - 0.15].map((bx) => (
              <path
                key={bx}
                d={`M${EX(bx)} ${EY(0.45)}L${EX(bx)} ${EY(-2.7)}L${EX(bx + 0.45)} ${EY(-2.7)}`}
                {...ink(0.9)}
              />
            ))}
          </g>
        ))}
      </g>
    );
  })();

  const zPurlin = (x: number, yb: number, key: string | number) => (
    <path
      key={key}
      d={`M${EX(x + 0.3)} ${EY(yb + 0.72)}L${EX(x)} ${EY(yb + 0.72)}L${EX(x)} ${EY(yb)}L${EX(x - 0.3)} ${EY(yb)}`}
      {...ink(1.1)}
    />
  );
  const zGirt = (wx: number, h: number, dir: 1 | -1, key: string | number) => (
    <path
      key={key}
      d={`M${EX(wx + 0.03 * dir)} ${EY(h + 0.3)}L${EX(wx + 0.03 * dir)} ${EY(h)}L${EX(wx + 0.57 * dir)} ${EY(h)}L${EX(wx + 0.57 * dir)} ${EY(h - 0.3)}`}
      {...ink(1.1)}
    />
  );

  const kneeSegs: [Pt, Pt][] = [
    [
      [fg.c0, fg.top(fg.c0)],
      [fg.c0 + fg.tc, fg.bot(fg.c0 + fg.tc)],
    ],
    [
      [fg.c1, fg.top(fg.c1)],
      [fg.c1 - fg.tc, fg.bot(fg.c1 - fg.tc)],
    ],
  ];

  const primary = (
    <g>
      <polygon
        points={epts(fg.poly)}
        fill={url("rhatch")}
        stroke={frameColor}
        strokeWidth={sw(1.4)}
        strokeLinejoin="round"
      />
      <polyline
        points={epts(fg.topPts.map(([x, y]) => [x, y - 0.22] as Pt))}
        fill="none"
        stroke={frameColor}
        strokeWidth={sw(0.6)}
      />
      <polyline
        points={epts(fg.botPts.map(([x, y]) => [x, y + 0.22] as Pt))}
        fill="none"
        stroke={frameColor}
        strokeWidth={sw(0.6)}
      />
      {kneeSegs.map(([[ax, ay], [bx, by]], i) => (
        <g key={i}>
          <line x1={EX(ax)} y1={EY(ay)} x2={EX(bx)} y2={EY(by)} stroke={frameColor} strokeWidth={sw(1.1)} />
          {[0.25, 0.5, 0.75].map((t) => (
            <circle
              key={t}
              cx={EX(ax + (bx - ax) * t)}
              cy={EY(ay + (by - ay) * t)}
              r={sw(1.5)}
              fill={frameColor}
            />
          ))}
        </g>
      ))}
      {!single && (
        <line
          x1={EX(W / 2)}
          x2={EX(W / 2)}
          y1={EY(fg.top(W / 2))}
          y2={EY(fg.bot(W / 2))}
          stroke={frameColor}
          strokeWidth={sw(1.1)}
        />
      )}
      {[fg.c0, fg.c1 - fg.bc].map((x) => R(x - 0.3, 0, fg.bc + 0.6, 0.22, { fill: frameColor }, x))}
      {g.leans.map((l, i) => {
        const left = l.spec.side === "left";
        const postX = left ? l.x0 + 0.3 : l.x1 - 1.0;
        const a = left ? postX : W - 0.6;
        const b = left ? 0.6 : postX + 0.7;
        const t = (x: number) => yAt(l.chain, x) - 0.6;
        const raf: Pt[] = [
          [a, t(a)],
          [b, t(b)],
          [b, t(b) - 0.8],
          [a, t(a) - 0.8],
        ];
        return (
          <g key={i}>
            <polygon points={epts(raf)} fill={url("rhatch")} stroke={frameColor} strokeWidth={sw(1.2)} />
            {R(postX, 0, 0.7, t(postX + 0.35) - 0.8, {
              fill: url("rhatch"),
              stroke: frameColor,
              strokeWidth: sw(1.2),
            })}
          </g>
        );
      })}
    </g>
  );

  const secondary = (() => {
    const items: ReactNode[] = [];
    const n = Math.max(2, Math.round((fg.c1 - fg.c0) / 5));
    for (let i = 0; i <= n; i++) {
      const x = fg.c0 + 0.6 + ((fg.c1 - fg.c0 - 1.2) * i) / n;
      items.push(zPurlin(x, fg.top(x), `p${i}`));
      if (i % 2 === 1 && i < n) {
        const dx = x < W / 2 ? 1.7 : -1.7;
        items.push(
          <line
            key={`fb${i}`}
            x1={EX(x)}
            y1={EY(fg.top(x))}
            x2={EX(x + dx)}
            y2={EY(fg.bot(x + dx))}
            stroke={C.graphite}
            strokeWidth={sw(0.6)}
          />,
        );
      }
    }
    const eaveR = single ? yAt(g.chain, W) : E;
    for (let h = 3.2; h < E - 1.6; h += 6.6) items.push(zGirt(0, h, 1, `gl${h}`));
    for (let h = 3.2; h < eaveR - 1.6; h += 6.6) items.push(zGirt(W, h, -1, `gr${h}`));
    items.push(R(0.05, E - 0.95, 0.55, 0.8, ink(1), "es1"));
    items.push(R(W - 0.6, eaveR - 0.95, 0.55, 0.8, ink(1), "es2"));
    g.leans.forEach((l, li) => {
      const a = l.x0 + 1.4;
      const b = l.x1 - 1.4;
      const m = Math.max(1, Math.round((b - a) / 4));
      for (let i = 0; i <= m; i++) {
        const x = a + ((b - a) * i) / m;
        items.push(zPurlin(x, yAt(l.chain, x) - 0.75, `lp${li}-${i}`));
      }
      if (!l.spec.open) {
        const left = l.spec.side === "left";
        for (let h = 3.2; h < l.spec.low - 1.4; h += 6.6)
          items.push(zGirt(left ? l.x0 : l.x1, h, left ? 1 : -1, `lg${li}-${h}`));
      }
    });
    return <g>{items}</g>;
  })();

  /* ---------- dimensions ---------- */

  const fs = sw(10.5);
  const tick = sw(4);
  const hDim = (x1: number, x2: number, y: number, label: string, key: string) => (
    <g key={key} stroke={C.graphite} strokeWidth={sw(0.7)}>
      <line x1={EX(x1)} x2={EX(x2)} y1={EY(y)} y2={EY(y)} />
      {[x1, x2].map((x) => (
        <g key={x}>
          <line x1={EX(x)} x2={EX(x)} y1={EY(y + 0.8)} y2={EY(y - 0.5)} />
          <line x1={EX(x) - tick} y1={EY(y) + tick} x2={EX(x) + tick} y2={EY(y) - tick} strokeWidth={sw(1.2)} />
        </g>
      ))}
      <text
        x={EX((x1 + x2) / 2)}
        y={EY(y) + fs * 1.25}
        fontSize={fs}
        textAnchor="middle"
        fill={C.graphite}
        stroke="none"
        style={mono}
      >
        {label}
      </text>
    </g>
  );
  const vDim = (x: number, y1: number, y2: number, label: string, key: string) => {
    const tx = EX(x) - fs * 0.55;
    const ty = EY((y1 + y2) / 2);
    return (
      <g key={key} stroke={C.graphite} strokeWidth={sw(0.7)}>
        <line x1={EX(x)} x2={EX(x)} y1={EY(y1)} y2={EY(y2)} />
        {[y1, y2].map((y) => (
          <g key={y}>
            <line x1={EX(x - 0.5)} x2={EX(x + 0.8)} y1={EY(y)} y2={EY(y)} />
            <line x1={EX(x) - tick} y1={EY(y) + tick} x2={EX(x) + tick} y2={EY(y) - tick} strokeWidth={sw(1.2)} />
          </g>
        ))}
        <text
          x={tx}
          y={ty}
          fontSize={fs}
          textAnchor="middle"
          fill={C.graphite}
          stroke="none"
          style={mono}
          transform={`rotate(-90 ${tx} ${ty})`}
        >
          {label}
        </text>
      </g>
    );
  };

  const dimsLayer = (() => {
    const yD = -2.9;
    const els: ReactNode[] = [hDim(0, W, yD, ftIn(W), "w")];
    for (const l of g.leans) els.push(hDim(l.x0, l.x1, yD, ftIn(l.spec.width), `l${l.x0}`));
    els.push(vDim(g.minX - 3.4, 0, E, ftIn(E), "e"));
    if (g.ridge - E > 1.2) els.push(vDim(g.minX - 6.6, 0, g.ridge, ftIn(g.ridge), "r"));
    const px = single ? W * 0.55 : W * 0.22;
    const py = yAt(g.chain, px) + 2.4;
    els.push(
      <g key="pitch" stroke={C.graphite} strokeWidth={sw(0.8)} fill="none">
        <path
          d={`M${EX(px)} ${EY(py)}L${EX(px + 2.4)} ${EY(py)}L${EX(px + 2.4)} ${EY(py + (2.4 * spec.pitch) / 12)}Z`}
        />
        <text x={EX(px + 3)} y={EY(py) - sw(1)} fontSize={fs} fill={C.graphite} stroke="none" style={mono}>
          {`${spec.pitch}:12`}
        </text>
      </g>,
    );
    return <g>{els}</g>;
  })();

  /* ---------- ground + trees ---------- */

  const ground = (
    <g>
      <rect
        x={EX(g.minX - 3)}
        y={EY(0)}
        width={r2((g.maxX - g.minX + 6) * U)}
        height={r2(0.9 * U)}
        fill={url("stip")}
        opacity={0.55}
      />
      <line
        x1={EX(box.x0 + pad * 0.6)}
        x2={EX(box.x1 - pad * 0.6)}
        y1={EY(0)}
        y2={EY(0)}
        stroke={C.ink}
        strokeWidth={sw(1.4)}
      />
    </g>
  );

  const treeLayer = (
    <g strokeLinecap="round" fill="none">
      {trees.map(({ t, paths }, i) => (
        <g key={i} stroke={t.ghost ? C.pencil : C.ink} opacity={t.ghost ? 0.5 : 1}>
          {paths.map((p) => (
            <path key={p.depth} d={p.d} strokeWidth={sw(Math.max(0.35, 3.6 * 0.62 ** p.depth))} />
          ))}
        </g>
      ))}
    </g>
  );

  const hatchS = sw(5);
  const hatchDS = sw(2.8);
  const stipS = sw(26);
  const rS = sw(4.2);

  return (
    <svg
      viewBox={`${EX(box.x0)} ${EY(box.top)} ${r2(vbW)} ${r2(vbH)}`}
      className={className}
      style={style}
      role="img"
      aria-label={title ?? "Steel building elevation drawing"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={id("rib")} width={ribStep} height={U} patternUnits="userSpaceOnUse">
          <line x1={0} y1={0} x2={0} y2={U} stroke={C.graphite} strokeWidth={sw(0.6)} strokeOpacity={0.62} />
          <line
            x1={ribStep * 0.5}
            y1={0}
            x2={ribStep * 0.5}
            y2={U}
            stroke={C.graphite}
            strokeWidth={sw(0.4)}
            strokeOpacity={0.2}
          />
        </pattern>
        <pattern id={id("slat")} width={U} height={U * 0.5} patternUnits="userSpaceOnUse">
          <line x1={0} y1={0} x2={U} y2={0} stroke={C.graphite} strokeWidth={sw(0.55)} strokeOpacity={0.75} />
        </pattern>
        <pattern
          id={id("hatch")}
          width={hatchS}
          height={hatchS}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1={0} y1={0} x2={0} y2={hatchS} stroke={C.graphite} strokeWidth={sw(0.55)} strokeOpacity={0.8} />
        </pattern>
        <pattern
          id={id("hatchD")}
          width={hatchDS}
          height={hatchDS}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1={0} y1={0} x2={0} y2={hatchDS} stroke={C.ink} strokeWidth={sw(0.55)} strokeOpacity={0.75} />
        </pattern>
        <pattern id={id("stip")} width={stipS} height={stipS} patternUnits="userSpaceOnUse">
          {STIPPLE.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={r2(x * stipS)}
              cy={r2(y * stipS)}
              r={sw(r * 0.85)}
              fill={C.graphite}
              fillOpacity={0.6}
            />
          ))}
        </pattern>
        <pattern
          id={id("rhatch")}
          width={rS}
          height={rS}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width={rS} height={rS} fill={C.paper} />
          <line x1={0} y1={0} x2={0} y2={rS} stroke={frameColor} strokeWidth={sw(0.7)} strokeOpacity={0.6} />
        </pattern>
        <clipPath id={id("clipMain")}>
          <polygon points={epts(g.wall)} />
        </clipPath>
        {g.leans.map((l, i) => (
          <clipPath key={i} id={id(`clipL${i}`)}>
            <polygon points={epts(l.poly)} />
          </clipPath>
        ))}
      </defs>

      {layer("ground", ground)}
      {layer("trees", treeLayer)}
      {layer("foundation", foundation)}
      {layer("ghost", ghost)}
      {layer("primary", primary)}
      {layer("secondary", secondary)}
      {layer("sheeting", sheeting)}
      {layer("openings", openings)}
      {layer("dims", dimsLayer)}
    </svg>
  );
}
