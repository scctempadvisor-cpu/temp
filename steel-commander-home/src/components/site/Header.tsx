"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CtaLink } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LINKS } from "@/lib/buildings";
import { cn } from "@/lib/utils";
import { Wordmark } from "./kit";

type NavItem = { label: string; href: string; children?: { label: string; href: string }[]; mega?: boolean };

const SCC = "https://steelcommandercorp.com";

export const NAV: NavItem[] = [
  {
    label: "About Us",
    href: `${SCC}/about-us-steel-building-kits/`,
    children: [
      { label: "About Steel Commander", href: `${SCC}/about-us-steel-building-kits/` },
      { label: "Steel Commander Racing Team", href: `${SCC}/steel-commander-racing/` },
      { label: "Office in Nashua, New Hampshire", href: `${SCC}/steel-commander-office-in-nashua-new-hampshire/` },
      { label: "Reviews", href: LINKS.reviews },
    ],
  },
  {
    label: "Steel Buildings",
    href: "#plan-room",
    mega: true,
    children: [
      { label: "Commercial Steel Buildings", href: `${SCC}/commercial-steel-buildings-prefab-american-metal-building-kits/` },
      { label: "Steel Building Homes", href: `${SCC}/steel-building-homes/` },
      { label: "Steel Building Kits", href: `${SCC}/steel-building-kits/` },
      { label: "Steel Garage Buildings", href: `${SCC}/steel-buildings/garage-steel-buildings/` },
      { label: "Steel Farm Buildings", href: `${SCC}/livestock-steel-buildings/` },
      { label: "Steel Aircraft Hangars", href: `${SCC}/metal-hangar-buildings/` },
      { label: "Metal Horse Barns", href: `${SCC}/metal-horse-barns/` },
      { label: "Agriculture Steel Buildings", href: `${SCC}/agriculture-steel-buildings/` },
      { label: "Steel Warehouse Buildings", href: `${SCC}/steel-warehouse-buildings/` },
      { label: "Recreational Steel Buildings", href: `${SCC}/recreational-steel-buildings/` },
      { label: "Steel Self Storage Building Kits", href: `${SCC}/self-storage-building-kits/` },
    ],
  },
  {
    label: "Products",
    href: "#products",
    children: [
      { label: "C-Channel vs Rigid Frame", href: "#products" },
      { label: "Metal Buildings by State", href: `${SCC}/buildings-by-state/` },
      { label: "Metal Buildings by Size", href: `${SCC}/browse-metal-buildings-by-size/` },
    ],
  },
  {
    label: "Learning Center",
    href: `${SCC}/?page_id=124`,
    children: [
      { label: "Learning Center", href: `${SCC}/?page_id=124` },
      { label: "Financing", href: `${SCC}/financing/` },
      { label: "FAQs", href: LINKS.faq },
    ],
  },
  { label: "Design Your Building", href: LINKS.design },
  { label: "Blog", href: `${SCC}/blog/` },
];

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 6" className={cn("h-1.5 w-2.5", className)} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M1 1l4 4 4-4" />
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 600);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-rule bg-paper transition-[transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(.7,0,.2,1)]",
        scrolled && "shadow-[0_1px_0_0_var(--rule),0_10px_24px_-18px_rgba(29,29,27,.55)]",
        hidden && "-translate-y-full",
      )}
    >
      <div className="relative mx-auto flex h-[68px] max-w-[1440px] items-center justify-between border-x border-rule px-4 sm:px-6">
        <Link href="/" aria-label="Steel Commander Corp home">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden h-full items-center xl:flex">
          {NAV.map((n, i) => (
            <div key={n.label} className={cn("group/nav h-full", !n.mega && "relative")}>
              <a
                href={n.href}
                target={n.href.startsWith("http") && n.label === "Design Your Building" ? "_blank" : undefined}
                rel={n.label === "Design Your Building" ? "noreferrer" : undefined}
                className="relative flex h-full items-center gap-1.5 px-3 font-tech text-[15px] font-semibold uppercase leading-none tracking-[0.05em] text-ink transition-colors group-hover/nav:text-scc"
              >
                <span className="mono self-center text-[10px] font-normal leading-none text-pencil">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[9.5em] text-left leading-[0.95] 2xl:max-w-none">{n.label}</span>
                {n.children && <Chevron className="transition-transform duration-300 group-hover/nav:rotate-180" />}
                <span className="absolute inset-x-3 bottom-0 h-[2px] origin-left scale-x-0 bg-scc transition-transform duration-300 group-hover/nav:scale-x-100" />
              </a>

              {n.children && (
                <div
                  className={cn(
                    "invisible absolute top-full z-50 translate-y-1 opacity-0 transition-all duration-300 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100",
                    n.mega ? "inset-x-0" : "left-0 w-[300px]",
                  )}
                >
                  <div className="border border-t-0 border-rule bg-paper shadow-[0_18px_40px_-24px_rgba(29,29,27,.45)]">
                    {n.mega ? (
                      <div className="grid grid-cols-12">
                        <div className="col-span-8 grid grid-cols-2 border-r border-rule p-3">
                          {n.children.map((c, j) => (
                            <a
                              key={c.label}
                              href={c.href}
                              className="group/item flex items-center justify-between border-b border-dashed border-rule px-3 py-3 font-tech text-[15px] font-semibold uppercase tracking-[0.04em] text-ink transition-colors hover:bg-ink hover:text-paper"
                            >
                              <span>
                                <span className="mono mr-3 text-[10px] font-normal text-pencil group-hover/item:text-paper/60">
                                  {String(j + 1).padStart(2, "0")}
                                </span>
                                {c.label}
                              </span>
                              <span className="text-scc transition-transform group-hover/item:translate-x-1">→</span>
                            </a>
                          ))}
                        </div>
                        <div className="col-span-4 flex flex-col justify-between bg-grid p-6">
                          <div>
                            <span className="mono-label text-[10px] text-scc">Plan room</span>
                            <p className="mt-3 font-display text-[24px] font-bold uppercase leading-[1] tracking-[0.005em] text-ink">
                              Browse 8 sample plan sheets with elevations + floor plans
                            </p>
                          </div>
                          <div className="mt-6 flex flex-wrap gap-2">
                            <CtaLink href="#plan-room" size="sm" variant="ink">
                              Open plan room
                            </CtaLink>
                            <CtaLink href={LINKS.design} size="sm" variant="outline" target="_blank" rel="noreferrer" arrow={false}>
                              3D designer
                            </CtaLink>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2">
                        {n.children.map((c, j) => (
                          <a
                            key={c.label}
                            href={c.href}
                            className="group/item flex items-center justify-between px-3 py-2.5 font-tech text-[14px] font-semibold uppercase tracking-[0.04em] text-ink transition-colors hover:bg-ink hover:text-paper"
                          >
                            <span>
                              <span className="mono mr-3 text-[10px] font-normal text-pencil group-hover/item:text-paper/60">
                                {String(i + 1).padStart(2, "0")}.{j + 1}
                              </span>
                              {c.label}
                            </span>
                            <span className="text-scc">→</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={LINKS.phone} className="hidden flex-col items-end leading-none 2xl:flex">
            <span className="mono-label text-[10px] text-pencil">Call a steel expert</span>
            <span className="mt-1 font-tech text-[19px] font-bold tracking-[0.02em] text-ink">{LINKS.phoneLabel}</span>
          </a>
          <a
            href={LINKS.phone}
            aria-label={`Call ${LINKS.phoneLabel}`}
            className="hidden h-9 items-center gap-2 border border-ink/70 px-3 font-tech text-[15px] font-bold text-ink transition-colors hover:bg-ink hover:text-paper md:flex 2xl:hidden"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 1.5h3l1.2 3.4-1.8 1.2a8 8 0 0 0 4.5 4.5l1.2-1.8 3.4 1.2v3a1.5 1.5 0 0 1-1.6 1.5A12.5 12.5 0 0 1 1.5 3.1 1.5 1.5 0 0 1 3 1.5z" />
            </svg>
            <span className="hidden lg:inline">{LINKS.phoneLabel}</span>
          </a>
          <CtaLink href={LINKS.quote} size="sm" className="hidden sm:inline-flex">
            Get a Free Quote
          </CtaLink>
          <Sheet>
            <SheetTrigger
              className="flex h-10 w-10 items-center justify-center border border-ink/70 xl:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 6h16M2 14h16" />
              </svg>
            </SheetTrigger>
            <SheetContent
              side="right"
              data-lenis-prevent
              className="flex w-[88%] flex-col overflow-y-auto border-l border-rule bg-paper p-0 sm:max-w-sm"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-[68px] shrink-0 items-center border-b border-rule px-5">
                <Wordmark />
              </div>
              <nav aria-label="Mobile" className="flex flex-col">
                {NAV.map((n, i) =>
                  n.children ? (
                    <details key={n.label} className="group/d border-b border-rule">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-tech text-lg font-semibold uppercase tracking-[0.05em] [&::-webkit-details-marker]:hidden">
                        <span>
                          <span className="mono mr-3 text-[11px] text-pencil">{String(i + 1).padStart(2, "0")}</span>
                          {n.label}
                        </span>
                        <span className="text-scc transition-transform group-open/d:rotate-45">+</span>
                      </summary>
                      <div className="border-t border-dashed border-rule bg-paper-2/60 py-1">
                        {n.children.map((c) => (
                          <SheetClose asChild key={c.label}>
                            <a href={c.href} className="block px-5 py-2.5 pl-12 font-tech text-[15px] font-semibold uppercase tracking-[0.04em] text-graphite hover:text-scc">
                              {c.label}
                            </a>
                          </SheetClose>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <SheetClose asChild key={n.label}>
                      <a
                        href={n.href}
                        className="flex items-center justify-between border-b border-rule px-5 py-4 font-tech text-lg font-semibold uppercase tracking-[0.05em] hover:text-scc"
                      >
                        <span>
                          <span className="mono mr-3 text-[11px] text-pencil">{String(i + 1).padStart(2, "0")}</span>
                          {n.label}
                        </span>
                        <span className="text-scc">→</span>
                      </a>
                    </SheetClose>
                  ),
                )}
              </nav>
              <div className="mt-auto flex flex-col gap-3 p-5">
                <span className="mono-label text-[10px] text-pencil">Give us a call today</span>
                <a href={LINKS.phone} className="font-tech text-3xl font-bold">
                  {LINKS.phoneLabel}
                </a>
                <CtaLink href={LINKS.quote}>Get a Free Quote</CtaLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
