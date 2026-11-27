"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Elevation } from "@/components/drawings/Elevation";
import { FRAME_LAYERS, elevationBox } from "@/components/drawings/elevation-geom";
import { ftIn } from "@/components/drawings/core";
import { CtaLink } from "@/components/ui/button";
import { HERO, LINKS } from "@/lib/buildings";
import { useSiteReady } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Check, Cross } from "./kit";
import { Plotted } from "./motion";

const PAD = 1.5;

const TAGS = [
  { x: 30, y: 25, code: "Frame", text: "Rigid frame", pos: "ne" },
  { x: 14, y: 21.4, code: "Roof", text: "Purlins", pos: "nw" },
  { x: -8, y: 11.2, code: "Add-on", text: "Lean-to", pos: "nw" },
  { x: 59.4, y: -1.6, code: "Base", text: "Anchor bolts", pos: "se" },
] as const;

const STEPS = [
  "Site & load analysis",
  "Wind + snow load calcs",
  "Frame selection",
  "Stamped engineering",
  "State code review",
  "Fabricate primary steel",
  "Roll-form panels & trim",
  "Kit packaging",
  "Factory-direct delivery",
  "Ready to erect",
];

function fmt(v: number) {
  return `${v < 0 ? "−" : ""}${ftIn(Math.abs(v))}`;
}

export function Hero() {
  const box = useMemo(() => elevationBox(HERO, { pad: PAD }), []);
  const wrap = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const readX = useRef<HTMLSpanElement>(null);
  const readY = useRef<HTMLSpanElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [step, setStep] = useState(0);
  const ready = useSiteReady();
  const [drawn, setDrawn] = useState(false);

  // checklist ticker (starts once the sheet is plotting)
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setStep((s) => (s + 1) % (STEPS.length + 3)), 900);
    return () => clearInterval(t);
  }, [ready]);

  // lens loop
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let w = el.clientWidth;
    let h = el.clientHeight;
    const ro = new ResizeObserver(() => {
      w = el.clientWidth;
      h = el.clientHeight;
    });
    ro.observe(el);

    let hover = false;
    let px = 0;
    let py = 0;
    let cx = w * 0.5;
    let cy = h * 0.45;
    let t = 0;
    let last = performance.now();
    let raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      hover = true;
    };
    const leave = () => {
      hover = false;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) t += dt;
      const tx = hover ? px : w * (0.5 + 0.3 * Math.sin(t * 0.32));
      const ty = hover ? py : h * (0.5 + 0.2 * Math.sin(t * 0.55 + 1.2));
      const ease = hover ? 0.22 : 0.06;
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      const rad = Math.max(64, Math.min(150, w * 0.105));
      el.style.setProperty("--lx", `${cx.toFixed(1)}px`);
      el.style.setProperty("--ly", `${cy.toFixed(1)}px`);
      el.style.setProperty("--lr", `${rad.toFixed(1)}px`);
      if (ring.current)
        ring.current.style.transform = `translate3d(${(cx - rad).toFixed(1)}px, ${(cy - rad).toFixed(1)}px, 0)`;
      const fx = box.x0 + (cx / w) * box.w;
      const fy = box.top - (cy / h) * box.h;
      if (readX.current) readX.current.textContent = fmt(fx);
      if (readY.current) readY.current.textContent = fmt(fy);
      TAGS.forEach((tg, i) => {
        const node = tagRefs.current[i];
        if (!node) return;
        const ax = ((tg.x - box.x0) / box.w) * w;
        const ay = ((box.top - tg.y) / box.h) * h;
        const near = Math.hypot(ax - cx, ay - cy) < rad * 1.05;
        node.dataset.active = near ? "1" : "0";
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [box]);

  const meta = (
    <div>
      <p className="flex items-center gap-2.5 font-display text-[clamp(26px,2.3vw,34px)] font-extrabold uppercase leading-[0.9] tracking-[0.005em] text-ink">
        <span aria-hidden className="h-[0.8em] w-[5px] shrink-0 bg-scc" />
        <span>
          Welcome to <span className="text-scc">Steel Commander</span>
        </span>
      </p>
      <dl className="mono-label mt-3.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-t border-ink/70 pt-3 text-[10.5px] leading-[1.45] text-graphite">
        <dt className="text-pencil">Type:</dt>
        <dd>Pre-engineered steel building kits</dd>
        <dt className="text-pencil">Made:</dt>
        <dd>American-made · factory direct</dd>
        <dt className="text-pencil">Focus:</dt>
        <dd>Commercial · residential · agricultural · storage</dd>
        <dt className="text-pencil">HQ:</dt>
        <dd>
          <address className="not-italic">2200 Corporate Blvd NW Ste 402, Boca Raton, FL 33431</address>
        </dd>
      </dl>
    </div>
  );

  const checklist = (
    <ol className="mono-label space-y-[5px] text-[10.5px]">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li
            key={s}
            className={cn(
              "flex items-center gap-2 transition-colors duration-300",
              done ? "text-ink" : active ? "text-scc" : "text-pencil/70",
            )}
          >
            <span className="w-7 text-pencil">{String(i + 1).padStart(3, "0")}</span>
            <span className="flex h-3 w-3 items-center justify-center border border-current">
              {done && <Check className="h-2.5 w-2.5" />}
            </span>
            <span>{s}</span>
            {active && <span className="animate-blink">_</span>}
          </li>
        );
      })}
    </ol>
  );

  return (
    <section aria-label="Steel Commander Corp: the superior choice for steel building kits" className="relative">
      <div className="relative mx-auto max-w-[1440px] border-x border-rule">
        {/* drafting frame */}
        <div className="relative overflow-hidden border-b border-rule bg-grid">
          <div className="flex items-center justify-between border-b border-rule px-4 py-2.5 sm:px-6">
            <div className="mono-label flex items-center gap-4 text-[10.5px] text-graphite">
              <span className="border border-ink/60 px-1.5 py-0.5 text-ink">100%</span>
              <span className="hidden sm:inline">Sheet A-001 · Front elevation</span>
            </div>
            <div className="mono-label flex items-center gap-4 text-[10.5px] text-graphite">
              <span>
                X: <span ref={readX} className="inline-block min-w-[58px] text-ink">0'-0"</span>
              </span>
              <span>
                Y: <span ref={readY} className="inline-block min-w-[58px] text-ink">0'-0"</span>
              </span>
            </div>
          </div>

          <div className="relative px-3 pb-8 pt-6 sm:px-6 lg:pb-10 lg:pt-14">
            <div className="absolute left-6 top-6 z-20 hidden max-w-[300px] rise lg:block" style={{ animationDelay: ".2s" }}>
              {meta}
            </div>
            <div className="absolute right-6 top-6 z-20 hidden rise lg:block" style={{ animationDelay: ".35s" }}>
              {checklist}
            </div>

            <div
              ref={wrap}
              className="relative mx-auto w-full max-w-[1180px] cursor-crosshair touch-pan-y select-none lg:mt-24"
              style={{ aspectRatio: `${box.w} / ${box.h}`, animationDelay: ".05s" }}
            >
              <Plotted
                start={ready}
                className="absolute inset-0"
                opts={{ layers: ["ground", "sheeting", "openings", "trees"], total: 2.1, dur: 1.05, delay: 0.15 }}
                onDone={() => setDrawn(true)}
              >
                <Elevation
                  spec={HERO}
                  pad={PAD}
                  basePx={1100}
                  className="absolute inset-0 h-full w-full"
                  title="Steel Commander shop building with lean-tos, front elevation"
                />
              </Plotted>

              {/* crosshair guides */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                style={{ opacity: drawn ? 1 : 0 }}
              >
                <span
                  className="absolute -bottom-8 -top-16 w-px border-l border-dashed border-scc/50"
                  style={{ left: "var(--lx, 50%)" }}
                />
                <span
                  className="absolute -left-6 -right-6 h-px border-t border-dashed border-scc/50"
                  style={{ top: "var(--ly, 50%)" }}
                />
              </div>

              <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                  opacity: drawn ? 1 : 0,
                  background: "var(--paper)",
                  clipPath: "circle(var(--lr, 120px) at var(--lx, 50%) var(--ly, 50%))",
                }}
              >
                <div className="absolute inset-0 bg-grid-fine opacity-70" />
                <Elevation spec={HERO} pad={PAD} basePx={1100} layers={FRAME_LAYERS} className="absolute inset-0 h-full w-full" title="Steel frame x-ray" />
              </div>
              <div
                ref={ring}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 rounded-full border border-ink"
                style={{ width: "calc(var(--lr, 120px) * 2)", height: "calc(var(--lr, 120px) * 2)" }}
              >
                <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-ink" />
                <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-ink" />
                <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-ink" />
                <span className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-ink" />
                <span className="mono-label absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink px-1.5 py-0.5 text-[9.5px] text-paper">
                  Frame view
                </span>
              </div>

              {TAGS.map((tg, i) => {
                const left = ((tg.x - box.x0) / box.w) * 100;
                const top = ((box.top - tg.y) / box.h) * 100;
                return (
                  <div
                    key={tg.code}
                    ref={(n) => {
                      tagRefs.current[i] = n;
                    }}
                    data-active="0"
                    className="group/tag pointer-events-none absolute hidden transition-opacity duration-700 md:block"
                    style={{ left: `${left}%`, top: `${top}%`, opacity: drawn ? 1 : 0 }}
                  >
                    <span className="absolute -left-[4px] -top-[4px] h-2 w-2 rounded-full border border-ink bg-paper transition-colors group-data-[active=1]/tag:border-scc group-data-[active=1]/tag:bg-scc" />
                    <div
                      className={cn(
                        "absolute flex w-max flex-col opacity-0 transition-all duration-300 group-data-[active=1]/tag:opacity-100",
                        tg.pos === "ne" && "bottom-3 left-3 translate-y-1 group-data-[active=1]/tag:translate-y-0",
                        tg.pos === "nw" && "bottom-3 right-3 translate-y-1 group-data-[active=1]/tag:translate-y-0",
                        tg.pos === "se" && "left-3 top-3 -translate-y-1 group-data-[active=1]/tag:translate-y-0",
                      )}
                    >
                      <span className="mono-label bg-scc px-2 py-1 text-[10px] text-paper">{tg.code}</span>
                      <span className="border border-t-0 border-ink/80 bg-paper px-2 py-1 font-display text-[14px] font-bold uppercase leading-none tracking-[0.02em] text-ink">
                        {tg.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-5 flex max-w-[1180px] flex-wrap items-center justify-between gap-3">
              <span className="mono-label flex items-center gap-2 text-[10.5px] text-graphite">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M8 0v4M8 12v4M0 8h4M12 8h4" />
                </svg>
                Move your cursor to x-ray the steel frame
              </span>
              <span className="mono-label text-[10.5px] text-pencil">Scale: 1/8" = 1'-0" · Not for construction</span>
            </div>
          </div>
          <Cross className="-bottom-[6px] -left-[6px]" />
          <Cross className="-bottom-[6px] -right-[6px]" />
        </div>

        {/* mobile meta */}
        <div className="grid gap-6 border-b border-rule px-4 py-6 sm:grid-cols-2 sm:px-6 lg:hidden">
          {meta}
          {checklist}
        </div>

        {/* headline */}
        <div className="grid gap-8 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-14">
          <h1 className="h-display text-[clamp(42px,6.6vw,104px)] text-ink lg:col-span-8 rise" style={{ animationDelay: ".3s" }}>
            The superior choice for{" "}
            <span className="relative inline-block text-scc">
              steel
              <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-2.5 w-full">
                <path d="M2 8 Q 50 2 100 6 T 198 4" fill="none" stroke="var(--scc)" strokeWidth="2.5" />
              </svg>
            </span>{" "}
            building kits
          </h1>
          <div className="flex flex-col justify-end gap-6 lg:col-span-4 rise" style={{ animationDelay: ".45s" }}>
            <p className="text-[17px] leading-relaxed text-graphite" data-speakable>
              Tell us what you&apos;re building, and we&apos;ll help you plan the right steel structure for your
              project. Every kit is pre-engineered, stamped for your state and shipped factory direct.
            </p>
            <div className="flex flex-wrap gap-3">
              <CtaLink href={LINKS.quote} size="lg">
                Get Started
              </CtaLink>
              <CtaLink href={LINKS.design} size="lg" variant="outline" target="_blank" rel="noreferrer">
                Design Your Building
              </CtaLink>
            </div>
            <a href={LINKS.phone} className="mono-label flex items-center gap-2 text-[11px] text-graphite hover:text-scc">
              <span className="h-1.5 w-1.5 rounded-full bg-scc" /> Give us a call · 844.SCC.IRON · {LINKS.phoneLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
