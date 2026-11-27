"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { rng } from "@/components/drawings/core";
import { prefersReducedMotion } from "@/lib/motion";

const COLS = 14;
const ROWS = 9;
const CELLS = (() => {
  const r = rng(9);
  const out: number[] = [];
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) {
      const dx = (x - (COLS - 1) / 2) / COLS;
      const dy = (y - (ROWS - 1) / 2) / ROWS;
      out.push(Math.round((Math.hypot(dx, dy) * 900 + r() * 260) * 1) / 1);
    }
  return out;
})();

const SHIELD =
  "M14 20 L27 20 L31 8 L69 8 L73 20 L86 20 L86 58 C86 78 70 94 50 106 C30 94 14 78 14 58 Z";

const COUNT_MS = 1450;

function finish() {
  document.documentElement.classList.remove("is-loading");
  window.__sccReady = true;
  window.dispatchEvent(new Event("scc:ready"));
}

export function Loader() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      finish();
      setPhase("done");
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / COUNT_MS);
      const e = 1 - (1 - t) ** 2.4;
      const v = Math.round(e * 100);
      if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${e})`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => {
      setPhase("out");
      finish();
    }, COUNT_MS + 250);
    const t2 = setTimeout(() => setPhase("done"), COUNT_MS + 1500);

    const move = (e: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
      if (xRef.current) xRef.current.textContent = String(Math.round(e.clientX)).padStart(4, "0");
      if (yRef.current) yRef.current.textContent = String(Math.round(e.clientY)).padStart(4, "0");
    };
    window.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  if (phase === "done") return null;
  const out = phase === "out";

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[200] cursor-crosshair"
      style={{ "--mx": "50vw", "--my": "50vh", pointerEvents: out ? "none" : "auto" } as CSSProperties}
    >
      {/* pixel dissolve cells */}
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS},1fr)` }}>
        {CELLS.map((d, i) => (
          <div
            key={i}
            className="border-b border-r border-rule/50 bg-paper"
            style={
              out
                ? { animation: `px-out .01s steps(1) ${d}ms forwards` }
                : undefined
            }
          />
        ))}
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: out ? 0 : 1 }}
      >
        {/* rulers */}
        <div className="absolute inset-x-0 top-0 h-6 border-b border-rule bg-paper-2/70 bg-[repeating-linear-gradient(to_right,var(--rule)_0_1px,transparent_1px_10px)] [background-size:10px_7px] bg-no-repeat bg-bottom" />
        <div className="absolute inset-y-0 left-0 w-6 border-r border-rule bg-paper-2/70 bg-[repeating-linear-gradient(to_bottom,var(--rule)_0_1px,transparent_1px_10px)] [background-size:7px_10px] bg-no-repeat bg-right" />

        {/* crosshair */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-scc/70" style={{ left: "var(--mx)" }} />
        <div className="pointer-events-none absolute inset-x-0 h-px bg-scc/70" style={{ top: "var(--my)" }} />
        <div
          className="mono-label pointer-events-none absolute flex gap-3 bg-ink px-2 py-1 text-[10px] text-paper"
          style={{ left: "calc(var(--mx) + 12px)", top: "calc(var(--my) + 12px)" }}
        >
          <span>
            X:<span ref={xRef}>0000</span>PX
          </span>
          <span>
            Y:<span ref={yRef}>0000</span>PX
          </span>
        </div>

        {/* centre mark */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <svg viewBox="0 0 100 114" className="h-28 w-28 overflow-visible sm:h-32 sm:w-32">
            <defs>
              <clipPath id="ld-clip">
                <path d={SHIELD} />
              </clipPath>
            </defs>
            <path
              d={SHIELD}
              fill="var(--scc)"
              className="[animation:ld-fill_.5s_ease-out_1s_both]"
            />
            <g clipPath="url(#ld-clip)" className="[animation:ld-fill_.4s_ease-out_1.2s_both]">
              <rect x="50" y="0" width="50" height="114" fill="#000" opacity=".14" />
              {[84, 91, 98].map((y) => (
                <rect key={y} x="0" y={y} width="100" height="3" fill="var(--paper)" />
              ))}
            </g>
            <path
              d={SHIELD}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.4"
              pathLength={1}
              strokeDasharray="1 1"
              className="[animation:ld-draw_1.1s_cubic-bezier(.6,.05,.3,1)_both]"
            />
            <text
              x="50"
              y="62"
              textAnchor="middle"
              fontSize="27"
              fontWeight="800"
              fill="var(--paper)"
              className="[animation:ld-fill_.4s_ease-out_1.25s_both]"
              style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "-1px" }}
            >
              SCC
            </text>
          </svg>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-tech text-[44px] font-bold leading-none tracking-tight text-ink">
              <span ref={countRef}>000</span>
            </span>
            <span className="mono-label text-pencil">%</span>
          </div>
          <div className="mt-3 h-px w-48 bg-rule">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-scc" />
          </div>
          <span className="mono-label mt-3 text-[10px] text-graphite">Plotting sheet A-001 · Steel Commander Corp</span>
        </div>

        <span className="mono-label absolute bottom-5 left-10 text-[10px] text-pencil">[0,0]</span>
        <span className="mono-label absolute bottom-5 right-6 text-[10px] text-pencil">Pre-engineered steel building kits</span>
      </div>
    </div>
  );
}
