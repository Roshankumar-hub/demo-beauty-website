import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { IMG, px } from "../data/images";
import { cn } from "../utils/cn";
import { RevealLines, SectionLabel, useIsMobile } from "./ui/motion";

type Item = { id: number; ext?: "png"; cap: string; w: string; h: string; mt: string; ml?: string; z?: number; ratio: [number, number] };

const ITEMS: Item[] = [
  { id: IMG.hairComb, cap: "Look 01 / Signature Hair", w: "26vw", h: "68vh", mt: "6vh", ratio: [700, 1000] },
  { id: IMG.whiteDress, cap: "Look 02 / Soft Glam", w: "19vw", h: "46vh", mt: "38vh", ml: "-4vw", z: 2, ratio: [600, 900] },
  { id: IMG.bride2, cap: "Look 03 / Bridal Edit", w: "30vw", h: "76vh", mt: "2vh", ml: "3vw", ratio: [800, 1100] },
  { id: IMG.facial3, cap: "Look 04 / Glow Skin", w: "20vw", h: "50vh", mt: "26vh", ml: "-5vw", z: 2, ratio: [600, 900] },
  { id: IMG.nailsArt, ext: "png", cap: "Look 05 / Nail Atelier", w: "34vw", h: "44vh", mt: "10vh", ml: "4vw", ratio: [1000, 700] },
  { id: IMG.interior3, cap: "Look 06 / The Studio", w: "36vw", h: "54vh", mt: "30vh", ml: "-6vw", z: 2, ratio: [1100, 800] },
  { id: IMG.hairBraid, cap: "Look 07 / Braid Study", w: "22vw", h: "64vh", mt: "4vh", ml: "4vw", ratio: [600, 1000] },
  { id: IMG.redDress, cap: "Look 08 / Evening", w: "24vw", h: "58vh", mt: "20vh", ml: "3vw", ratio: [700, 1000] },
];

function Frame({ item, progress, i }: { item: Item; progress: MotionValue<number>; i: number }) {
  const reduce = useReducedMotion();
  const ix = useTransform(progress, [0, 1], reduce ? [0, 0] : [-50, 50]);
  const fy = useTransform(progress, [0, 1], reduce ? [0, 0] : [i % 2 ? 40 : -40, i % 2 ? -40 : 40]);
  return (
    <motion.figure
      style={{ width: item.w, marginTop: item.mt, marginLeft: item.ml, zIndex: item.z ?? 1, y: fy }}
      className="relative shrink-0"
    >
      <div style={{ height: item.h }} className={cn("relative overflow-hidden bg-ivory-deep", item.z && "outline outline-8 outline-ivory", i === 2 && "rounded-t-full")}>
        <motion.img
          src={px(item.id, item.ratio[0], item.ratio[1], item.ext)}
          alt={item.cap}
          loading="lazy"
          decoding="async"
          style={{ x: ix, scale: 1.18 }}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-3 flex justify-between label text-ink-soft">
        <span>{item.cap}</span>
        <span className="text-rose-deep">↗</span>
      </figcaption>
    </motion.figure>
  );
}

export default function Gallery() {
  const isMobile = useIsMobile();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useLayoutEffect(() => {
    if (isMobile) return;
    const measure = () => track.current && setDist(track.current.scrollWidth - window.innerWidth);
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section id="work" className="py-24">
        <div className="px-5">
          <SectionLabel index="04">Selected Work</SectionLabel>
          <RevealLines as="h2" className="mt-6 font-display text-[clamp(4rem,15vw,9rem)] uppercase leading-[0.85]" lines={["The", <em className="text-rose-deep">lookbook</em>]} />
          <p className="mt-4 label text-ink-soft">Swipe →</p>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {ITEMS.map((it, i) => (
            <figure key={it.id} className={cn("shrink-0 snap-center", i % 2 ? "mt-10 w-[62vw] max-w-[440px]" : "w-[74vw] max-w-[520px]")}>
              <div className={cn("overflow-hidden", i % 2 ? "aspect-[3/4]" : "aspect-[3/4.4]", i === 2 && "rounded-t-full")}>
                <img src={px(it.id, 600, 820, it.ext)} alt={it.cap} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <figcaption className="mt-3 label text-ink-soft">{it.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="work" ref={section} className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex h-full items-start pl-10 pr-[10vw] will-change-transform">
          <div className="flex h-full w-[34vw] shrink-0 flex-col justify-center pr-12">
            <SectionLabel index="04">Selected Work</SectionLabel>
            <RevealLines
              as="h2"
              className="mt-8 font-display text-[8.5vw] uppercase leading-[0.82]"
              lines={["The", <em className="text-rose-deep">look</em>, "book."]}
            />
            <p className="mt-8 max-w-xs text-[15px] leading-relaxed text-ink-soft">
              Eight looks from our studio chair — scroll to travel through the season's edit.
            </p>
          </div>
          {ITEMS.map((it, i) => (
            <Frame key={it.id} item={it} i={i} progress={smooth} />
          ))}
          <div className="flex h-full w-[30vw] shrink-0 flex-col items-center justify-center pl-[6vw]">
            <p className="font-display text-[6vw] italic leading-none text-rose-deep">& yours</p>
            <p className="font-display text-[6vw] uppercase leading-none">next.</p>
            <a href="#book" className="mt-8 rounded-full border border-ink px-6 py-3 label transition-colors hover:bg-ink hover:text-ivory">
              Book a look →
            </a>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-10 right-10 flex items-center gap-6">
          <span className="label text-ink-soft">01</span>
          <div className="relative h-px flex-1 bg-ink/15">
            <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-ink" />
          </div>
          <span className="label text-ink-soft">08</span>
        </div>
      </div>
    </section>
  );
}
