"use client";

import { useState } from "react";
import { Elevation } from "@/components/drawings/Elevation";
import { CtaLink } from "@/components/ui/button";
import { BUILDINGS, LINKS, USES } from "@/lib/buildings";
import { cn } from "@/lib/utils";
import { Arrow, Label, Section } from "./kit";
import { Plotted, RevealHeading } from "./motion";

const META: { id: string; desc: string }[] = [
  { id: "ag", desc: "Machine sheds, hay storage and equipment barns with wide clear spans for combines and trucks." },
  { id: "storage", desc: "Self-storage runs plus RV and boat storage that you can expand as occupancy grows." },
  { id: "hangar", desc: "Clear-span hangars with room for big hydraulic doors, a pilot lounge and a parts room." },
  { id: "workshop", desc: "Drive-through bays, office lean-tos and room for every tool and project you own." },
  { id: "commercial", desc: "Retail, office and light-industrial buildings with storefronts, dock doors and drive-ins." },
  { id: "garage", desc: "One-car to multi-bay garages with no wood to rot and nothing for termites to eat." },
  { id: "ag", desc: "Barns and shelters for cattle and livestock, with open lean-tos and great airflow." },
  { id: "commercial", desc: "Warehouses and plants with tall eaves for pallet racking, mezzanines and cranes." },
  { id: "horse", desc: "Stalls, tack and wash rooms, raised center aisles, and full covered riding arenas." },
  { id: "home", desc: "Gyms, community centers and event spaces under one clear-span roof." },
  { id: "commercial", desc: "Indoor courts, training facilities and practice spaces with no interior columns." },
  { id: "home", desc: "Barndominiums and steel homes with open floor plans and an attached shop." },
];

export function Uses() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="uses">
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-rule lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="px-4 py-14 sm:px-6 lg:sticky lg:top-[68px] lg:py-16">
            <Label>Use cases</Label>
            <RevealHeading
              text="Let our experts help you get the *ultimate* steel building"
              className="h-display mt-6 text-[clamp(32px,3.8vw,60px)] text-ink"
            />
            <p className="mt-6 text-[16px] leading-relaxed text-graphite">
              Steel Commander Corp will create a detailed engineering plan that is custom to your property while
              adhering to your state&apos;s specifications. Every state has its own building codes, and working with a
              steel building expert takes the headaches out of building a new structure.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-graphite">
              When you purchase a steel building, it&apos;s an investment that will last a lifetime. Popular uses for
              our steel building kits include:
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href={LINKS.quote}>Get a Free Quote</CtaLink>
              <CtaLink href={LINKS.phone} variant="outline" arrow={false}>
                {LINKS.phoneLabel}
              </CtaLink>
            </div>
          </div>
        </div>

        <ul className="lg:col-span-7">
          {USES.map((u, i) => {
            const isOpen = open === i;
            const m = META[i];
            const b = BUILDINGS.find((x) => x.id === m.id) ?? BUILDINGS[0];
            return (
              <li key={u.label} className="border-b border-rule last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className={cn(
                    "group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-300 sm:px-6 sm:py-5",
                    isOpen ? "bg-ink text-paper" : "hover:bg-paper-2",
                  )}
                >
                  <span className={cn("mono w-8 text-[11px]", isOpen ? "text-paper/55" : "text-pencil")}>
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="flex-1 font-display text-[clamp(18px,2vw,28px)] font-bold uppercase leading-none tracking-[0.005em]">
                    {u.label.replace(" Steel Buildings", "").replace(" Steel Building", "").replace(" Steel buildings", "")}
                  </span>
                  <span
                    className={cn(
                      "relative flex h-8 w-8 shrink-0 items-center justify-center border transition-all duration-500",
                      isOpen ? "rotate-45 border-scc bg-scc" : "border-ink/60 group-hover:border-scc group-hover:text-scc",
                    )}
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current" />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(.7,0,.2,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-5 px-4 pb-6 pt-5 sm:grid-cols-5 sm:px-6 sm:pl-[72px]">
                      <div className="sm:col-span-3">
                        <p className="text-[15.5px] leading-relaxed text-graphite">{m.desc}</p>
                        <a
                          href={u.url}
                          className="mono-label mt-5 inline-flex items-center gap-3 text-[11px] text-ink hover:text-scc"
                        >
                          Explore {u.label.toLowerCase()} <Arrow />
                        </a>
                      </div>
                      <div className="relative h-[120px] border border-rule bg-grid sm:col-span-2">
                        {isOpen && (
                          <Plotted start className="h-full w-full p-2" opts={{ total: 0.9, dur: 0.7, delay: 0.2 }}>
                            <Elevation spec={b.elev} basePx={300} pad={0.8} className="h-full w-full" />
                          </Plotted>
                        )}
                        <span className="mono-label absolute bottom-1 right-2 text-[9px] text-pencil">Typ. {b.tab}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
