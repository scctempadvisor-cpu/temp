"use client";

import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { LINKS } from "@/lib/buildings";
import { cn } from "@/lib/utils";
import { Arrow, Idx, Label, Section } from "./kit";
import { InView, RevealHeading } from "./motion";

const ISO = "matrix(0.866 0.5 -0.866 0.5 100 0)";

type Motif = "rings" | "cost" | "crack" | "flame" | "cycle";

function MotifArt({ kind }: { kind: Motif }) {
  const ink = { fill: "none", stroke: "var(--ink)", strokeWidth: 1.6 };
  const red = { fill: "none", stroke: "var(--scc)", strokeWidth: 2 };
  switch (kind) {
    case "rings":
      return (
        <g>
          <path d="M50 12 C74 12 90 28 88 50 C86 74 70 90 48 88 C26 86 12 70 13 48 C14 27 30 12 50 12Z" {...ink} />
          <path d="M50 24 C67 23 78 35 77 51 C75 67 64 77 49 76 C33 75 24 64 25 49 C26 34 36 24 50 24Z" {...ink} />
          <path d="M51 35 C60 35 66 42 65 51 C64 60 57 66 49 65 C40 64 35 58 36 49 C37 41 43 35 51 35Z" {...ink} />
          <circle cx="50" cy="50" r="5" {...ink} />
          <path d="M52 50 L62 56 L70 52 L80 61 L90 60" {...red} />
        </g>
      );
    case "cost":
      return (
        <g>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={14 + c * 25} y={14 + r * 25} width="20" height="20" {...ink} strokeDasharray={r === 1 && c === 1 ? undefined : "3 2"} />
            )),
          )}
          <text x="50" y="58" textAnchor="middle" fontSize="30" fontWeight="800" fill="var(--scc)" style={{ fontFamily: "var(--font-montserrat)" }}>
            $
          </text>
        </g>
      );
    case "crack":
      return (
        <g>
          <rect x="12" y="32" width="76" height="36" {...ink} />
          {[40, 48, 56].map((y) => (
            <path key={y} d={`M14 ${y} C30 ${y - 3} 44 ${y + 3} 60 ${y} S80 ${y - 2} 86 ${y}`} fill="none" stroke="var(--graphite)" strokeWidth="0.9" />
          ))}
          <path d="M42 32 L47 42 L41 50 L49 58 L45 68" {...red} />
          {[
            [22, 76],
            [28, 80],
            [70, 22],
            [76, 26],
            [64, 78],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="var(--ink)" />
          ))}
        </g>
      );
    case "flame":
      return (
        <g>
          <path d="M20 86 L20 50 L50 26 L80 50 L80 86 Z" {...ink} strokeDasharray="3 2" />
          <path
            d="M50 30 C60 44 70 52 67 66 C65 78 58 84 50 84 C41 84 33 78 33 67 C33 57 40 52 43 44 C45 54 48 57 51 59 C53 50 52 40 50 30Z"
            {...red}
            fill="var(--scc)"
            fillOpacity=".18"
          />
        </g>
      );
    case "cycle":
      return (
        <g>
          <path d="M50 16 L84 76 L16 76 Z" {...ink} strokeDasharray="4 3" />
          {[
            [50, 16, 0],
            [84, 76, 120],
            [16, 76, 240],
          ].map(([x, y, r]) => (
            <path key={r} d="M-6 6 L0 -2 L6 6" transform={`translate(${x} ${y}) rotate(${r})`} {...red} />
          ))}
          <path d="M34 62 L44 50 L52 58 L62 44 L70 60" {...red} />
        </g>
      );
  }
}

function IsoStack({ motif, active }: { motif: Motif; active: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const layers = [0, 1, 2, 3, 4];
  const fills = [`url(#d-${uid})`, `url(#h-${uid})`, `url(#g-${uid})`, `url(#l-${uid})`, "var(--paper)"];
  return (
    <svg viewBox="0 -40 200 260" className="h-auto w-full overflow-visible" aria-hidden>
      <defs>
        <pattern id={`d-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="var(--paper)" />
          <circle cx="4" cy="4" r="1" fill="var(--graphite)" />
        </pattern>
        <pattern id={`h-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="var(--paper)" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--graphite)" strokeWidth="0.8" />
        </pattern>
        <pattern id={`g-${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="var(--paper)" />
          <path d="M10 0H0V10" fill="none" stroke="var(--graphite)" strokeWidth="0.6" />
        </pattern>
        <pattern id={`l-${uid}`} width="100" height="7" patternUnits="userSpaceOnUse">
          <rect width="100" height="7" fill="var(--paper)" />
          <line x1="0" y1="3.5" x2="100" y2="3.5" stroke="var(--graphite)" strokeWidth="0.7" />
        </pattern>
      </defs>
      {layers.map((k) => {
        const base = 112 - k * 17;
        const top = k === 4;
        return (
          <g
            key={k}
            className="iso-l"
            style={{ "--k": k, "--base": `${base}px` } as CSSProperties}
          >
            {/* plate thickness */}
            <polygon points="13.4,50 100,100 100,106 13.4,56" fill="var(--paper-3)" stroke="var(--ink)" strokeWidth="1" />
            <polygon points="100,100 186.6,50 186.6,56 100,106" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1" />
            <g transform={ISO}>
              <rect
                width="100"
                height="100"
                fill={fills[k]}
                stroke={top && active ? "var(--scc)" : "var(--ink)"}
                strokeWidth={top ? 1.6 : 1.1}
                style={{ transition: "stroke .4s" }}
              />
              {top && <MotifArt kind={motif} />}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

const ITEMS: { tag: string; title: [string, string, string]; body: string; motif: Motif }[] = [
  {
    tag: "Consistency",
    title: ["No two", "trees are", "the same"],
    body: "Wood is made by nature. Even cut to the same spec, grain density, strength, straightness and resistance vary from tree to tree and region to region.",
    motif: "rings",
  },
  {
    tag: "Cost",
    title: ["More trades,", "more parts,", "more money"],
    body: "Traditional builds need more workers and more specialized trades for drywall, roofing and more. More materials and components mean higher material and assembly costs.",
    motif: "cost",
  },
  {
    tag: "Maintenance",
    title: ["Wood splits,", "rots and", "warps"],
    body: "Wood beams age. They crack, creep, rot and warp, attract termites, mold and mildew, and swell with humidity, so upkeep is costly and labor-intensive.",
    motif: "crack",
  },
  {
    tag: "Insurance",
    title: ["Fire, flood", "and pests", "raise premiums"],
    body: "Traditional materials are prone to fire, flood, wind and insect damage, so insurance costs swing widely, making long-term operating costs unpredictable.",
    motif: "flame",
  },
  {
    tag: "Sustainability",
    title: ["Most of it", "ends up in", "a landfill"],
    body: "Traditional building waste is rarely recycled. Mixed materials make reuse and recycling expensive and labor-intensive at the end of a building's life.",
    motif: "cycle",
  },
];

export function Problems() {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const on = () => {
      const w = el.firstElementChild?.clientWidth ?? 1;
      setPage(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);

  const go = (i: number) => {
    const el = rail.current;
    const w = el?.firstElementChild?.clientWidth ?? 0;
    el?.scrollTo({ left: i * w, behavior: "smooth" });
  };

  return (
    <Section id="problems" className="bg-grid">
      <div className="grid gap-8 px-4 pb-12 pt-16 sm:px-6 lg:grid-cols-12 lg:pb-16 lg:pt-24">
        <div className="lg:col-span-7">
          <Label>Problems</Label>
          <RevealHeading
            text="The problem with *traditional* building materials"
            className="h-display mt-6 text-[clamp(36px,5vw,80px)] text-ink"
          />
        </div>
        <InView className="flex flex-col justify-end gap-6 lg:col-span-4 lg:col-start-9">
          <p className="fu text-[17px] leading-relaxed text-graphite">
            Wood and stick-built construction look cheaper on paper. Over the life of a building, the costs show up
            everywhere else. Hover a card to pull the layers apart.
          </p>
          <div className="fu flex items-center gap-2 lg:hidden" style={{ "--d": ".1s" } as CSSProperties}>
            {ITEMS.map((it, i) => (
              <button
                type="button"
                key={it.tag}
                onClick={() => go(i)}
                aria-label={`Show ${it.tag}`}
                className={cn("h-1.5 transition-all duration-500", page === i ? "w-10 bg-scc" : "w-5 bg-rule")}
              />
            ))}
          </div>
        </InView>
      </div>

      <InView>
        <div
          ref={rail}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto border-t border-rule lg:grid lg:grid-cols-5 lg:overflow-visible"
        >
          {ITEMS.map((it, i) => (
            <article
              key={it.tag}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(-1)}
              className={cn(
                "iso-card group relative flex w-[82%] shrink-0 snap-start flex-col border-r border-rule bg-paper/70 px-5 pb-8 pt-5 transition-colors duration-500 sm:w-[46%] lg:w-auto lg:last:border-r-0",
                active === i && "bg-paper",
              )}
              style={{ "--d": `${i * 0.12}s` } as CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span className="mono-label text-[11px] text-ink">{it.tag}</span>
                <Idx n={i + 1} />
              </div>
              <div className="relative mx-auto mt-6 w-[78%] max-w-[240px]">
                <IsoStack motif={it.motif} active={active === i} />
              </div>
              <h3 className="mt-6 font-display text-[clamp(22px,1.9vw,30px)] font-bold uppercase leading-[0.98] tracking-[-0.025em] text-ink">
                {it.title.map((l, j) => (
                  <span key={l} className={cn("block", j === 2 && "text-scc")}>
                    {l}
                  </span>
                ))}
              </h3>
              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-graphite">{it.body}</p>
              <a
                href={LINKS.quote}
                className="mono-label mt-6 inline-flex items-center gap-3 text-[11px] text-ink transition-colors hover:text-scc"
              >
                Explore more <Arrow className="transition-transform group-hover:translate-x-1" />
              </a>
              <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-scc transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </InView>
    </Section>
  );
}
