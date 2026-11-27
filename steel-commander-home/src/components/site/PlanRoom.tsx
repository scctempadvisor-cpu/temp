"use client";

import { type CSSProperties, useState } from "react";
import { Elevation } from "@/components/drawings/Elevation";
import { FloorPlan } from "@/components/drawings/FloorPlan";
import { CtaLink } from "@/components/ui/button";
import { BUILDINGS, LINKS } from "@/lib/buildings";
import { cn } from "@/lib/utils";
import { Label, Section } from "./kit";
import { InView, Plotted, RevealHeading } from "./motion";

export function PlanRoom() {
  const [i, setI] = useState(0);
  const b = BUILDINGS[i];

  const specs: [string, string][] = [
    ["Size", b.size],
    ["Frame", b.frame],
    ["Roof", b.roof],
    ["Doors", b.doors],
    ["Ideal for", b.ideal],
  ];

  return (
    <Section id="plan-room" className="bg-paper-2/40">
      <div className="grid gap-8 px-4 pb-10 pt-16 sm:px-6 lg:grid-cols-12 lg:pb-14 lg:pt-24">
        <div className="lg:col-span-7">
          <Label>Plan room · Steel buildings</Label>
          <RevealHeading
            text="A steel building for *every* use"
            className="h-display mt-6 text-[clamp(36px,5vw,80px)] text-ink"
          />
        </div>
        <InView className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
          <p className="fu text-[17px] leading-relaxed text-graphite">
            Flip through sample plan sheets for our most-requested buildings. Every one is a starting point: your
            kit is engineered around your size, doors, lean-tos and local loads.
          </p>
        </InView>
      </div>

      <div className="grid border-t border-rule lg:grid-cols-12">
        {/* tabs */}
        <div
          role="tablist"
          aria-label="Building types"
          className="no-scrollbar flex overflow-x-auto border-b border-rule lg:col-span-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
        >
          {BUILDINGS.map((t, j) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === j}
              onClick={() => setI(j)}
              className={cn(
                "group relative flex shrink-0 items-center gap-3 border-r border-rule px-4 py-3 text-left transition-colors lg:border-b lg:border-r-0 lg:px-6 lg:py-4",
                i === j ? "bg-ink text-paper" : "text-ink hover:bg-paper",
              )}
            >
              <span className={cn("mono text-[10px]", i === j ? "text-paper/60" : "text-pencil")}>
                P-{String(101 + j)}
              </span>
              <span className="flex flex-col">
                <span className="font-tech text-[16px] font-bold uppercase leading-tight tracking-[0.04em] lg:text-[18px]">{t.tab}</span>
                <span className={cn("mono hidden text-[10px] lg:block", i === j ? "text-paper/55" : "text-pencil")}>{t.size}</span>
              </span>
              <span
                className={cn(
                  "ml-auto hidden text-scc transition-transform duration-300 lg:block",
                  i === j ? "translate-x-0" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                )}
              >
                →
              </span>
            </button>
          ))}
        </div>

        {/* sheet */}
        <div className="lg:col-span-9">
          <div className="mono-label flex items-center justify-between border-b border-rule px-4 py-2.5 text-[10.5px] text-graphite sm:px-6">
            <span>
              Sheet P-{101 + i} · <span className="text-ink">{b.name}</span>
            </span>
            <span className="hidden sm:inline">Front elevation + floor plan · NTS</span>
            <span>
              {String(i + 1).padStart(2, "0")}/{String(BUILDINGS.length).padStart(2, "0")}
            </span>
          </div>

          <div className="grid lg:grid-cols-12">
            <div className="relative h-[220px] border-b border-rule bg-grid p-3 sm:h-[280px] lg:col-span-7 lg:h-[310px] lg:border-r">
              <span className="mono-label absolute left-3 top-2 z-10 text-[9.5px] text-pencil">A · Front elevation</span>
              <Plotted key={`e-${b.id}`} className="h-full w-full" opts={{ total: 1.3, dur: 0.85 }}>
                <Elevation spec={b.elev} basePx={640} pad={1.2} className="h-full w-full" title={`${b.name} front elevation`} />
              </Plotted>
            </div>

            <InView key={`s-${b.id}`} margin="0px" className="flex flex-col border-b border-rule px-4 py-6 sm:px-6 lg:col-span-5">
              <h3 className="font-display text-[clamp(26px,2.4vw,36px)] font-bold uppercase leading-[0.95] tracking-[-0.025em] text-ink">
                <span className="rv-word">
                  <span>{b.name}</span>
                </span>
              </h3>
              <p className="fu mt-3 text-[14.5px] leading-relaxed text-graphite" style={{ "--d": ".1s" } as CSSProperties}>
                {b.blurb}
              </p>
              <dl className="mt-5 space-y-2">
                {specs.map(([k, v], j) => (
                  <div key={k} className="fu flex items-end gap-2" style={{ "--d": `${0.15 + j * 0.05}s` } as CSSProperties}>
                    <dt className="mono-label shrink-0 text-[10px] text-pencil">{k}</dt>
                    <span className="leader" />
                    <dd className="max-w-[62%] text-right font-tech text-[14.5px] font-semibold uppercase leading-tight tracking-[0.03em] text-ink">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <CtaLink href={b.url} size="sm" variant="ink">
                  Explore {b.tab}
                </CtaLink>
                <CtaLink href={LINKS.quote} size="sm">
                  Quote this building
                </CtaLink>
              </div>
            </InView>

            <div className="relative h-[300px] bg-paper p-3 sm:h-[380px] lg:col-span-12 lg:h-[420px]">
              <span className="mono-label absolute left-3 top-2 z-10 text-[9.5px] text-pencil">B · Floor plan</span>
              <Plotted key={`p-${b.id}`} className="h-full w-full" opts={{ total: 1.8, dur: 0.8, delay: 0.25 }}>
                <FloorPlan spec={b.plan} basePx={900} className="h-full w-full" />
              </Plotted>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
