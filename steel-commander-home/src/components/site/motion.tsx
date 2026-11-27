"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  type CSSProperties,
  type ReactNode,
  createElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { type AutoPlotOpts, autoPlot } from "@/components/drawings/plot";
import {
  clamp01,
  prefersReducedMotion,
  useInView,
  useIsoLayoutEffect,
  useScrollProgress,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* InView: adds `.in` to itself when scrolled into view                */
/* ------------------------------------------------------------------ */
export function InView({
  as = "div",
  className,
  children,
  margin,
  style,
  id,
}: {
  as?: "div" | "section" | "ul" | "ol" | "h2" | "h3" | "p" | "span";
  className?: string;
  children: ReactNode;
  margin?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const [ref, inView] = useInView<HTMLElement>({ margin });
  return createElement(as, { ref, id, style, className: cn(className, inView && "in") }, children);
}

/* ------------------------------------------------------------------ */
/* Words: masked word-by-word rise. *word* renders in SCC red.         */
/* ------------------------------------------------------------------ */
export function Words({
  text,
  delay = 0,
  step = 0.045,
  redClass = "text-scc",
}: {
  text: string;
  delay?: number;
  step?: number;
  redClass?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const red = w.includes("*");
        const clean = w.replace(/\*/g, "");
        return (
          <span key={`${w}-${i}`}>
            <span className="rv-word">
              <span className={red ? redClass : undefined} style={{ "--d": `${delay + i * step}s` } as CSSProperties}>
                {clean}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </>
  );
}

/** Heading that reveals word by word when it enters the viewport */
export function RevealHeading({
  text,
  as = "h2",
  className,
  delay,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLHeadingElement>();
  return createElement(
    as,
    { ref, className: cn(className, inView && "in"), "aria-label": text.replace(/\*/g, "") },
    <span aria-hidden>
      <Words text={text} delay={delay} />
    </span>,
  );
}

/* ------------------------------------------------------------------ */
/* ScrubWords: words ink in as the paragraph scrolls through           */
/* ------------------------------------------------------------------ */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  useScrollProgress(
    ref,
    (p) => {
      const el = ref.current;
      if (!el) return;
      const spans = el.children;
      const n = spans.length;
      const q = clamp01((p - 0.12) / 0.5) * (n + 4);
      for (let i = 0; i < n; i++) {
        const s = spans[i] as HTMLElement;
        const v = clamp01(q - i);
        s.style.opacity = String(0.16 + v * 0.84);
      }
    },
    { mode: "through" },
  );
  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, "")}>
      {words.map((w, i) => {
        const red = w.includes("*");
        return (
          <span key={`${w}-${i}`} aria-hidden className={cn(red && "text-scc")} style={{ opacity: 0.16 }}>
            {w.replace(/\*/g, "")}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp                                                             */
/* ------------------------------------------------------------------ */
export function CountUp({
  to,
  dur = 1.8,
  decimals = 0,
  className,
  pad = 0,
}: {
  to: number;
  dur?: number;
  decimals?: number;
  className?: string;
  pad?: number;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (prefersReducedMotion()) {
      el.textContent = to.toFixed(decimals);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / (dur * 1000));
      const e = t === 1 ? 1 : 1 - 2 ** (-10 * t);
      el.textContent = (to * e).toFixed(decimals).padStart(pad, "0");
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, dur, decimals, pad, ref]);
  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals).padStart(pad, "0")}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Plotted: children SVG draws itself once `start` (or in view)        */
/* ------------------------------------------------------------------ */
export function Plotted({
  children,
  className,
  style,
  start,
  opts,
  onDone,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** if undefined, starts when scrolled into view */
  start?: boolean;
  opts?: AutoPlotOpts;
  onDone?: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ margin: "0px 0px -18% 0px" });
  const go = start ?? inView;
  const [shown, setShown] = useState(false);
  const optsRef = useRef(opts);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!go || !el) return;
    if (prefersReducedMotion()) {
      setShown(true);
      doneRef.current?.();
      return;
    }
    const o = optsRef.current ?? {};
    const cancel = autoPlot(el, o);
    setShown(true);
    const t = setTimeout(
      () => doneRef.current?.(),
      ((o.delay ?? 0) + (o.total ?? 1.6) + (o.dur ?? 0.9)) * 1000,
    );
    return () => {
      clearTimeout(t);
      cancel();
    };
  }, [go]);

  return (
    <div ref={ref} data-plot="" className={className} style={{ ...style, opacity: shown ? 1 : 0 }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* InkImage: photo revealed through an ink-bleed mask                  */
/* ------------------------------------------------------------------ */
export function InkImage({
  src,
  alt,
  w = 400,
  h = 300,
  className,
  print = true,
  seed = 3,
  pos = "xMidYMid",
}: {
  src: string;
  alt: string;
  w?: number;
  h?: number;
  className?: string;
  print?: boolean;
  seed?: number;
  pos?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [ref, inView] = useInView<SVGSVGElement>({ margin: "0px 0px -20% 0px" });
  const blobs = useRef<(SVGCircleElement | null)[]>([]);
  const seeds = [
    [0.28, 0.35, 0],
    [0.72, 0.62, 0.18],
    [0.5, 0.9, 0.32],
  ];

  useEffect(() => {
    if (!inView) return;
    const R = Math.hypot(w, h) * 0.78;
    if (prefersReducedMotion()) {
      for (const b of blobs.current) b?.setAttribute("r", String(R));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      let running = false;
      seeds.forEach(([, , d], i) => {
        const t = clamp01((now - t0 - d * 1000) / 1500);
        if (t < 1) running = true;
        const e = 1 - (1 - t) ** 3;
        blobs.current[i]?.setAttribute("r", String(R * e));
      });
      if (running) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, w, h]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${w} ${h}`}
      className={cn("block h-auto w-full", print && "print-photo", className)}
      role="img"
      aria-label={alt}
    >
      <defs>
        <filter id={`ink-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={Math.min(w, h) * 0.32} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={`m-${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
          <g filter={`url(#ink-${uid})`}>
            {seeds.map(([x, y], i) => (
              <circle
                key={i}
                ref={(n) => {
                  blobs.current[i] = n;
                }}
                cx={x * w}
                cy={y * h}
                r={0}
                fill="#fff"
              />
            ))}
          </g>
        </mask>
      </defs>
      <image
        href={src}
        width={w}
        height={h}
        preserveAspectRatio={`${pos} slice`}
        mask={`url(#m-${uid})`}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* VideoDialog: YouTube in a drafting-sheet modal                      */
/* ------------------------------------------------------------------ */
export function VideoDialog({
  videoId,
  title,
  children,
}: {
  videoId: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-ink/80 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          data-lenis-prevent
          className="fixed left-1/2 top-1/2 z-[160] w-[min(1100px,94vw)] -translate-x-1/2 -translate-y-1/2 border border-ink bg-paper p-2 shadow-[10px_10px_0_0_var(--scc)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:p-3"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <Dialog.Title className="mono-label text-[11px] text-ink">{title}</Dialog.Title>
            <Dialog.Close className="mono-label flex items-center gap-2 border border-ink px-2 py-1 text-[10px] text-ink transition-colors hover:bg-ink hover:text-paper">
              Close <span aria-hidden>×</span>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Steel Commander Corp video</Dialog.Description>
          <div className="relative aspect-video w-full bg-ink">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** play button glyph used on video thumbnails */
export function PlayMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-16 w-16 items-center justify-center", className)}>
      <span className="absolute inset-0 rounded-full border border-paper/70 animate-ping-soft" />
      <span className="absolute inset-0 rounded-full bg-scc transition-transform duration-500 group-hover:scale-110" />
      <svg viewBox="0 0 16 16" className="relative ml-1 h-5 w-5" fill="var(--paper)">
        <path d="M3 1.5v13l11-6.5z" />
      </svg>
    </span>
  );
}
