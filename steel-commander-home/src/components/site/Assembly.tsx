"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { Elevation } from "@/components/drawings/Elevation";
import { type Layer, elevationBox } from "@/components/drawings/elevation-geom";
import { layerPlotter } from "@/components/drawings/plot";
import { CtaLink } from "@/components/ui/button";
import { ASSEMBLY, LINKS } from "@/lib/buildings";
import { clamp01, useScrollProgress } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Cross, Label } from "./kit";

const PAD = 1.4;

const STEPS: { title: string; body: string; layers: Layer[] }[] = [
  {
    title: "Foundation & anchor bolts",
    body: "Every kit starts on paper. Your plans include column reactions and an anchor bolt layout so your concrete contractor can pour with confidence.",
    layers: ["ground", "trees", "foundation"],
  },
  {
    title: "Primary frames",
    body: "Red-iron rigid frames (or C-channel on smaller kits) arrive fabricated and pre-punched. They bolt together on site, so there's no field welding.",
    layers: ["ghost", "primary"],
  },
  {
    title: "Secondary framing",
    body: "Z-purlins and girts tie the frames together, brace the building and carry the roof and wall sheeting.",
    layers: ["secondary"],
  },
  {
    title: "Sheeting & trim",
    body: "Roll-formed steel roof and wall panels, trim, gutters and downspouts close it in. Everything is cut to length at the factory.",
    layers: ["sheeting"],
  },
  {
    title: "Doors & openings",
    body: "Roll-up doors, walk doors, windows and louvers are framed in exactly where your layout needs them.",
    layers: ["openings"],
  },
  {
    title: "Stamped & delivered",
    body: "Engineered to your state's building codes and your site's wind and snow loads, then shipped factory direct.",
    layers: ["dims"],
  },
];

const CAD: { layer: Layer; name: string }[] = [
  { layer: "foundation", name: "S-FNDN" },
  { layer: "primary", name: "S-FRAM" },
  { layer: "secondary", name: "S-PURL" },
  { layer: "sheeting", name: "A-SHTG" },
  { layer: "openings", name: "A-OPNG" },
  { layer: "dims", name: "A-DIMS" },
];

const CALLOUTS = [
  {
    id: "A",
    x: 20,
    y: 23.4,
    code: "IBC 1608 · ASCE 7",
    title: "Roof snow load",
    body: "Frames and purlins are sized for your site's ground snow load, plus any collateral load for lights, sprinklers or HVAC.",
  },
  {
    id: "B",
    x: 1.2,
    y: 11,
    code: "IBC 1609 · ASCE 7",
    title: "Wind speed & exposure",
    body: "Your county's design wind speed and exposure category set the frame size, bracing and panel fastening.",
  },
  {
    id: "C",
    x: 1.4,
    y: -2.3,
    code: "A.B. PLAN",
    title: "Anchor bolts & reactions",
    body: "Column reactions and an anchor bolt plan come with your drawings so the foundation can be designed for your soil.",
  },
  {
    id: "D",
    x: 47,
    y: 5.6,
    code: "LT-14",
    title: "Enclosed lean-to",
    body: "Lean-tos, wainscot, doors and windows are engineered into the same package. Add what you need, skip what you don't.",
  },
];

const MANIFEST = [
  { label: "Pieces", to: 386, from: 0, until: 5 },
  { label: "Bolts", to: 1240, from: 1, until: 3 },
  { label: "Panels", to: 112, from: 3, until: 4 },
  { label: "Lbs steel", to: 21400, from: 0, until: 5 },
];

const HOLD = 0.88; // fraction of the scroll used for drawing; the rest holds the finished sheet

function Stamp({ on }: { on: boolean }) {
  const txt = "ENGINEERED FOR YOUR STATE · STEEL COMMANDER CORP · ";
  return (
    <div
      className="pointer-events-none absolute right-[3%] top-[4%] w-[17%] min-w-[84px] max-w-[150px]"
      style={{ opacity: on ? 1 : 0, animation: on ? "stamp-in .55s cubic-bezier(.2,.8,.2,1) both" : undefined }}
      aria-hidden
    >
      <svg viewBox="0 0 120 120" className="h-auto w-full text-scc">
        <defs>
          <path id="stamp-ring" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="60" cy="60" r="37" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <text fontSize="8.6" fill="currentColor" style={{ fontFamily: "var(--font-plex-mono)", letterSpacing: "1.2px" }}>
          <textPath href="#stamp-ring">{txt}</textPath>
        </text>
        <text x="60" y="56" textAnchor="middle" fontSize="18" fontWeight="800" fill="currentColor" style={{ fontFamily: "var(--font-montserrat)" }}>
          SCC
        </text>
        <text x="60" y="70" textAnchor="middle" fontSize="7" fill="currentColor" style={{ fontFamily: "var(--font-plex-mono)", letterSpacing: "1px" }}>
          CODE CHECKED
        </text>
      </svg>
    </div>
  );
}

export function Assembly() {
  const wrap = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const carriage = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const manRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const plotters = useRef<Partial<Record<Layer, (p: number) => void>>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [callout, setCallout] = useState("A");

  const box = useMemo(() => elevationBox(ASSEMBLY, { dims: true, pad: PAD }), []);
  const ratio = box.w / box.h;

  const drawing = useMemo(
    () => (
      <Elevation
        spec={ASSEMBLY}
        dims
        plot
        pad={PAD}
        basePx={900}
        className="absolute inset-0 h-full w-full"
        title="Steel building erection sequence drawing"
      />
    ),
    [],
  );

  useEffect(() => {
    const svg = sheet.current?.querySelector("svg");
    if (!svg) return;
    for (const s of STEPS)
      for (const l of s.layers) {
        const g = svg.querySelector<SVGGElement>(`[data-layer="${l}"]`);
        if (g) plotters.current[l] = layerPlotter(g, l === "trees" ? 0.3 : 0.6);
      }
  }, []);

  useScrollProgress(wrap, (p) => {
    const n = STEPS.length;
    const q = clamp01(p / HOLD) * n;
    STEPS.forEach((s, i) => {
      const lp = clamp01((q - i) / 0.82);
      s.layers.forEach((l, j) => {
        // ground lands first inside step 1
        const off = s.layers.length > 1 ? j * 0.12 : 0;
        plotters.current[l]?.(clamp01((lp - off) / (1 - off)));
      });
    });
    const cur = Math.min(n - 1, Math.floor(q));
    setStep(cur);
    setDone(p >= HOLD - 0.005);
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    if (carriage.current) {
      const local = q - Math.floor(q);
      const vis = q > 0.01 && q < n && local < 0.82;
      carriage.current.style.opacity = vis ? "1" : "0";
      carriage.current.style.left = `${(clamp01(local / 0.82) * 100).toFixed(2)}%`;
    }
    CAD.forEach((c, i) => {
      const el = chipRefs.current[i];
      if (!el) return;
      const si = STEPS.findIndex((s) => s.layers.includes(c.layer));
      const v = clamp01((q - si) / 0.82);
      el.textContent = `${String(Math.round(v * 100)).padStart(3, "0")}%`;
      el.parentElement?.setAttribute("data-on", v > 0 ? (v >= 1 ? "2" : "1") : "0");
    });
    MANIFEST.forEach((m, i) => {
      const el = manRefs.current[i];
      if (!el) return;
      const v = clamp01((q - m.from) / (m.until - m.from));
      el.textContent = Math.round(m.to * v).toLocaleString("en-US");
    });
  });

  const active = CALLOUTS.find((c) => c.id === callout) ?? CALLOUTS[0];
  const pos = (x: number, y: number) => ({
    left: `${((x - box.x0) / box.w) * 100}%`,
    top: `${((box.top - y) / box.h) * 100}%`,
  });

  return (
    <section ref={wrap} id="assembly" className="relative h-[560vh] border-t border-rule lg:h-[640vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col border-x border-rule pt-[68px]">
          <Cross className="-left-[6px] top-[62px]" />
          <Cross className="-right-[6px] top-[62px]" />
          {/* top bar */}
          <div className="relative flex items-center justify-between border-b border-rule px-4 py-2.5 sm:px-6">
            <Label>Erection sequence</Label>
            <div className="mono-label hidden items-center gap-5 text-[10.5px] text-graphite md:flex">
              <span>Sheet S-201</span>
              <span>Sample kit · 40' × 60' × 16' + 14' lean-to</span>
            </div>
            <span className="mono-label text-[10.5px] text-ink">
              {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </span>
            <div className="absolute inset-x-0 -bottom-px h-[2px] bg-transparent">
              <div ref={bar} className="h-full origin-left scale-x-0 bg-scc" />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] lg:grid-cols-12 lg:grid-rows-1">
            {/* left: steps */}
            <div className="flex flex-col border-b border-rule px-4 py-4 sm:px-6 lg:col-span-4 lg:border-b-0 lg:border-r lg:py-8">
              <h2 className="h-display text-[clamp(26px,3vw,46px)] text-ink">
                From stamped drawing to <span className="text-scc">standing steel</span>
              </h2>
              <ol className="mt-8 hidden space-y-0 border-t border-rule lg:block">
                {STEPS.map((s, i) => (
                  <li
                    key={s.title}
                    className={cn(
                      "flex items-center gap-4 border-b border-rule py-2.5 transition-colors duration-300",
                      i === step ? "text-ink" : i < step ? "text-graphite" : "text-pencil/70",
                    )}
                  >
                    <span className="mono w-7 text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-tech text-[17px] font-semibold uppercase tracking-[0.04em]">{s.title}</span>
                    <span
                      className={cn(
                        "h-2 w-2 transition-colors duration-300",
                        i < step || (i === step && done) ? "bg-ink" : i === step ? "bg-scc" : "border border-pencil/60",
                      )}
                    />
                  </li>
                ))}
              </ol>
              <div className="relative mt-3 min-h-[92px] lg:mt-8 lg:min-h-[150px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.title}
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      opacity: i === step ? 1 : 0,
                      transform: `translateY(${i === step ? 0 : i < step ? -12 : 12}px)`,
                    }}
                    aria-hidden={i !== step}
                  >
                    <span className="mono-label text-[10.5px] text-scc lg:hidden">
                      Step {String(i + 1).padStart(2, "0")} · {s.title}
                    </span>
                    <p className="mt-1 text-[14px] leading-relaxed text-graphite lg:mt-0 lg:text-[16px]">{s.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto hidden items-center justify-between pt-4 lg:flex">
                <span className="mono-label text-[10.5px] text-pencil">
                  {done ? "[Click a callout]" : "[Scroll to continue]"}
                  <span className="animate-blink">_</span>
                </span>
                <CtaLink href={LINKS.quote} size="sm" variant="outline">
                  Quote this kit
                </CtaLink>
              </div>
            </div>

            {/* right: drafting sheet */}
            <div className="relative flex min-h-0 flex-col lg:col-span-8">
              {/* CAD layer manager */}
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-rule px-3 py-2 sm:px-4">
                <span className="mono-label mr-2 shrink-0 text-[10px] text-pencil">Layers</span>
                {CAD.map((c, i) => (
                  <span
                    key={c.name}
                    data-on="0"
                    className="group/chip mono-label flex shrink-0 items-center gap-1.5 border border-rule px-2 py-1 text-[10px] text-pencil transition-colors data-[on=1]:border-scc data-[on=1]:text-scc data-[on=2]:border-ink data-[on=2]:text-ink"
                  >
                    <span className="h-1.5 w-1.5 border border-current group-data-[on=2]/chip:bg-ink group-data-[on=1]/chip:bg-scc" />
                    {c.name}
                    <span
                      ref={(n) => {
                        chipRefs.current[i] = n;
                      }}
                      className="text-pencil"
                    >
                      000%
                    </span>
                  </span>
                ))}
              </div>

              {/* drawing */}
              <div className="relative min-h-0 flex-1 bg-grid px-3 py-4 sm:px-6" style={{ containerType: "size" } as CSSProperties}>
                <div
                  ref={sheet}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: `min(calc(100cqw - 24px), calc((100cqh - 24px) * ${ratio.toFixed(4)}))`,
                    aspectRatio: `${box.w} / ${box.h}`,
                  }}
                >
                  {drawing}
                  <div
                    ref={carriage}
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 w-px bg-scc opacity-0"
                    style={{ left: 0 }}
                  >
                    <span className="mono-label absolute -top-1 left-1.5 whitespace-nowrap bg-scc px-1 text-[9px] text-paper">
                      Plotting
                    </span>
                  </div>
                  <Stamp on={done} />

                  {/* callouts */}
                  {CALLOUTS.map((c, i) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCallout(c.id)}
                      aria-label={`${c.title} callout`}
                      className={cn(
                        "absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-[10px] transition-all duration-500",
                        done ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
                        callout === c.id ? "bg-scc text-paper" : "border border-scc bg-paper text-scc hover:bg-scc hover:text-paper",
                      )}
                      style={{ ...pos(c.x, c.y), transitionDelay: done ? `${i * 0.08}s` : "0s" }}
                    >
                      {callout !== c.id && <span className="absolute inset-0 rounded-full border border-scc animate-ping-soft" />}
                      {c.id}
                    </button>
                  ))}
                </div>

                {/* callout card */}
                <div
                  className={cn(
                    "absolute bottom-3 left-3 z-20 w-[min(340px,calc(100%-24px))] border border-ink bg-paper transition-all duration-500 sm:bottom-5 sm:left-5",
                    done ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                  )}
                >
                  <div className="mono-label flex items-center justify-between bg-scc px-3 py-1.5 text-[10px] text-paper">
                    <span>{active.code}</span>
                    <span>Callout {active.id}</span>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="font-display text-[14px] font-bold uppercase tracking-[-0.01em] text-ink">{active.title}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-graphite">{active.body}</p>
                  </div>
                </div>
              </div>

              {/* title block */}
              <div className="grid grid-cols-2 border-t border-rule sm:grid-cols-4">
                {MANIFEST.map((m, i) => (
                  <div key={m.label} className="border-r border-rule px-3 py-2 last:border-r-0 sm:px-4 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r">
                    <span className="mono-label block text-[9.5px] text-pencil">
                      {m.label}
                      <span className="hidden sm:inline"> · sample</span>
                    </span>
                    <span
                      ref={(n) => {
                        manRefs.current[i] = n;
                      }}
                      className="font-tech text-[20px] font-bold tabular-nums tracking-[0.02em] text-ink sm:text-[24px]"
                    >
                      0
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
