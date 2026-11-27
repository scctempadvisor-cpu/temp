"use client";

import type { CSSProperties, ReactNode } from "react";
import { Elevation } from "@/components/drawings/Elevation";
import { DRAWING_LAYERS, FRAME_LAYERS } from "@/components/drawings/elevation-geom";
import { CtaLink } from "@/components/ui/button";
import { BUILDINGS, LINKS } from "@/lib/buildings";
import { Idx, Label, Section } from "./kit";
import { InView, Plotted, RevealHeading } from "./motion";

const mono = { fontFamily: "var(--font-plex-mono), monospace" };

function DimV({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  const my = (y1 + y2) / 2;
  return (
    <g stroke="var(--graphite)" strokeWidth="0.7" fill="none">
      <line x1={x} x2={x} y1={y1} y2={y2} />
      <line x1={x - 4} x2={x + 4} y1={y1} y2={y1} />
      <line x1={x - 4} x2={x + 4} y1={y2} y2={y2} />
      <line x1={x - 3} y1={y1 + 3} x2={x + 3} y2={y1 - 3} strokeWidth="1.1" />
      <line x1={x - 3} y1={y2 + 3} x2={x + 3} y2={y2 - 3} strokeWidth="1.1" />
      <text x={x - 6} y={my} fontSize="7.5" fill="var(--graphite)" stroke="none" textAnchor="middle" transform={`rotate(-90 ${x - 6} ${my})`} style={mono}>
        {label}
      </text>
    </g>
  );
}
function DimH({ y, x1, x2, label }: { y: number; x1: number; x2: number; label: string }) {
  return (
    <g stroke="var(--graphite)" strokeWidth="0.7" fill="none">
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <line x1={x1} x2={x1} y1={y - 4} y2={y + 4} />
      <line x1={x2} x2={x2} y1={y - 4} y2={y + 4} />
      <line x1={x1 - 3} y1={y + 3} x2={x1 + 3} y2={y - 3} strokeWidth="1.1" />
      <line x1={x2 - 3} y1={y + 3} x2={x2 + 3} y2={y - 3} strokeWidth="1.1" />
      <text x={(x1 + x2) / 2} y={y - 5} fontSize="7.5" fill="var(--graphite)" stroke="none" textAnchor="middle" style={mono}>
        {label}
      </text>
    </g>
  );
}

function SectionDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="4" height="4" fill="var(--paper)" />
        <line x1="0" y1="0" x2="0" y2="4" stroke="var(--scc)" strokeWidth="0.8" />
      </pattern>
    </defs>
  );
}

function CSection() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="C-channel cross section">
      <SectionDefs id="cs-h" />
      <path
        d="M140 52 V30 H70 V170 H140 V148 H134 V164 H76 V36 H134 V52 Z"
        fill="url(#cs-h)"
        stroke="var(--scc)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line x1="73" x2="73" y1="20" y2="180" stroke="var(--pencil)" strokeWidth="0.6" strokeDasharray="5 3 1 3" />
      <line x1="56" x2="154" y1="100" y2="100" stroke="var(--pencil)" strokeWidth="0.6" strokeDasharray="5 3 1 3" />
      <DimV x={50} y1={30} y2={170} label="DEPTH" />
      <DimH y={18} x1={70} x2={140} label="FLANGE" />
      <DimV x={158} y1={148} y2={170} label="LIP" />
      <text x="104" y="104" fontSize="7" textAnchor="middle" fill="var(--graphite)" style={mono}>
        COLD-FORMED
      </text>
      <text x="104" y="190" fontSize="8" textAnchor="middle" fill="var(--ink)" style={mono}>
        SECTION A-A
      </text>
    </svg>
  );
}

function ISection() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="I-beam cross section">
      <SectionDefs id="is-h" />
      <path
        d="M52 30 H148 V40 H103 V160 H148 V170 H52 V160 H97 V40 H52 Z"
        fill="url(#is-h)"
        stroke="var(--scc)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line x1="100" x2="100" y1="20" y2="180" stroke="var(--pencil)" strokeWidth="0.6" strokeDasharray="5 3 1 3" />
      <line x1="40" x2="160" y1="100" y2="100" stroke="var(--pencil)" strokeWidth="0.6" strokeDasharray="5 3 1 3" />
      {/* bending stress diagram */}
      <path d="M168 30 L186 30 L168 100 L150 170 L168 170" fill="none" stroke="var(--ink)" strokeWidth="0.9" />
      {[44, 58, 72, 86, 114, 128, 142, 156].map((y) => {
        const w = Math.abs(100 - y) * (18 / 70);
        const dir = y < 100 ? 1 : -1;
        return <line key={y} x1={168} x2={168 + w * dir} y1={y} y2={y} stroke="var(--ink)" strokeWidth="0.5" />;
      })}
      <text x="176" y="24" fontSize="6.5" textAnchor="middle" fill="var(--graphite)" style={mono}>
        σ MAX
      </text>
      <DimV x={36} y1={30} y2={170} label="DEPTH" />
      <DimH y={18} x1={52} x2={148} label="FLANGE" />
      <text x="112" y="96" fontSize="6.5" fill="var(--graphite)" style={mono}>
        WEB
      </text>
      <text x="100" y="190" fontSize="8" textAnchor="middle" fill="var(--ink)" style={mono}>
        SECTION B-B
      </text>
    </svg>
  );
}

type Prod = {
  n: number;
  name: string;
  tag: string;
  section: ReactNode;
  elevation: ReactNode;
  body: string;
  specs: [string, string][];
};

const garage = BUILDINGS.find((b) => b.id === "garage") ?? BUILDINGS[0];
const workshop = BUILDINGS.find((b) => b.id === "workshop") ?? BUILDINGS[0];

const PRODUCTS: Prod[] = [
  {
    n: 1,
    name: "C-Channel",
    tag: "Most economical",
    section: <CSection />,
    elevation: (
      <Elevation spec={{ ...garage.elev, trees: [] }} layers={DRAWING_LAYERS} basePx={420} pad={1} className="h-full w-full" />
    ),
    body: "A C-Channel building is by far the simplest and most economical steel building system, with the same conventional look as a rigid frame at a more affordable cost. Less engineering time, no welding during manufacturing, and thinner gauge steel keep costs down.",
    specs: [
      ["Best for", "Garages · shops · storage"],
      ["Engineering", "Less design time"],
      ["Welding", "None in manufacturing"],
      ["Note", "Large / complex jobs may not qualify"],
    ],
  },
  {
    n: 2,
    name: "Rigid Frame / I-Beam",
    tag: "Most popular",
    section: <ISection />,
    elevation: (
      <Elevation spec={{ ...workshop.elev, trees: [] }} layers={FRAME_LAYERS} basePx={420} pad={1} className="h-full w-full" />
    ),
    body: "I-beams are strong because of how they're built: most of the material sits along the axial fibers that see the most stress. The shape naturally resists bending and shear, so a rigid frame handles extremely heavy loads and lasts a lifetime.",
    specs: [
      ["Best for", "Commercial · hangars · homes · ag"],
      ["Strength", "Resists bending + shear"],
      ["Loads", "Heavy snow, wind + collateral"],
      ["Frame", "Red iron, clear span"],
    ],
  },
];

export function Products() {
  return (
    <Section id="products" className="theme-ink">
      <div className="grid gap-8 px-4 pb-12 pt-16 sm:px-6 lg:grid-cols-12 lg:pb-16 lg:pt-24">
        <div className="lg:col-span-7">
          <Label>Product offering</Label>
          <RevealHeading
            text="Two frame systems. *One* lifetime investment."
            className="h-display mt-6 text-[clamp(36px,4.8vw,76px)] text-ink"
          />
        </div>
        <InView className="flex flex-col justify-end gap-4 lg:col-span-4 lg:col-start-9">
          <p className="fu text-[17px] leading-relaxed text-graphite">
            Every Steel Commander kit is built on one of two proven structural systems. Not sure which fits your
            project? A specialist can walk you through it.
          </p>
          <a href={LINKS.phone} className="fu mono-label text-[11px] text-ink hover:text-scc" style={{ "--d": ".1s" } as CSSProperties}>
            Talk to a specialist · {LINKS.phoneLabel}
          </a>
        </InView>
      </div>

      <div className="grid border-t border-rule lg:grid-cols-2">
        {PRODUCTS.map((p) => (
          <InView
            key={p.name}
            className="group flex flex-col border-b border-rule last:border-b-0 lg:border-b-0 lg:[&:first-child]:border-r"
          >
            <div className="flex items-center justify-between border-b border-rule px-4 py-3 sm:px-6">
              <span className="flex items-center gap-3">
                <Idx n={p.n} />
                <span className="font-tech text-[20px] font-bold uppercase tracking-[0.03em] text-ink">{p.name}</span>
              </span>
              <span className="mono-label bg-ink px-2 py-1 text-[10px] text-paper">{p.tag}</span>
            </div>
            <div className="theme-paper grid grid-cols-5 border-b border-[#3b3b37] bg-paper">
              <div className="relative col-span-2 aspect-square border-r border-rule bg-grid-fine p-3">
                <Plotted className="h-full w-full" opts={{ total: 1.1, dur: 1 }}>
                  {p.section}
                </Plotted>
              </div>
              <div className="relative col-span-3 flex items-center bg-grid p-3">
                <Plotted className="h-full w-full" opts={{ total: 1.6, dur: 0.9, delay: 0.5 }}>
                  {p.elevation}
                </Plotted>
                <span className="mono-label absolute bottom-2 right-3 text-[9.5px] text-pencil">
                  {p.n === 1 ? "Typ. garage kit" : "Frame x-ray · typ. workshop"}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col px-4 py-8 sm:px-6">
              <p className="fu text-[15.5px] leading-relaxed text-graphite">{p.body}</p>
              <dl className="fu mt-6 space-y-2.5" style={{ "--d": ".1s" } as CSSProperties}>
                {p.specs.map(([k, v]) => (
                  <div key={k} className="flex items-end gap-2">
                    <dt className="mono-label shrink-0 text-[10.5px] text-pencil">{k}</dt>
                    <span className="leader" />
                    <dd className="shrink-0 font-tech text-[16px] font-semibold uppercase tracking-[0.03em] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaLink href={LINKS.kits} variant={p.n === 1 ? "ink" : "default"}>
                  Explore More
                </CtaLink>
                <CtaLink href={LINKS.quote} variant="outline" arrow={false}>
                  Quote a {p.n === 1 ? "C-Channel" : "Rigid Frame"} kit
                </CtaLink>
              </div>
            </div>
          </InView>
        ))}
      </div>
    </Section>
  );
}
