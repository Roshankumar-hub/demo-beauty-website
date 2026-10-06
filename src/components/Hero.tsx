import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { IMG, px } from "../data/images";
import { CircleText, EASE, Magnetic } from "./ui/motion";
import { cn } from "../utils/cn";

function Letter({ ch, i, progress, base, drift }: { ch: string; i: number; progress: MotionValue<number>; base: number; drift: number }) {
  const reduce = useReducedMotion();
  const dir = (i % 3) - 1; // -1, 0, 1 rhythm
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, dir * drift + (i % 2 ? 30 : -20)]);
  const r = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, dir * 6]);
  return (
    <span className="inline-block overflow-hidden align-top pb-[0.06em]">
      <motion.span style={{ y, rotate: r }} className="inline-block will-change-transform">
        <motion.span
          className="inline-block"
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 1.3, ease: EASE, delay: base + i * 0.05 }}
        >
          {ch}
        </motion.span>
      </motion.span>
    </span>
  );
}

function Word({
  text,
  progress,
  x,
  base,
  className,
  drift = 50,
}: {
  text: string;
  progress: MotionValue<number>;
  x: MotionValue<string>;
  base: number;
  className?: string;
  drift?: number;
}) {
  return (
    <motion.span style={{ x }} className={cn("block whitespace-nowrap will-change-transform", className)} aria-hidden>
      {text.split("").map((c, i) => (
        <Letter key={i} ch={c} i={i} progress={progress} base={base} drift={drift} />
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const z = (a: number | string, b: number | string) => (reduce ? [a, a] : [a, b]);

  const x1 = useTransform(scrollYProgress, [0, 1], z("0vw", "-18vw") as string[]);
  const x2 = useTransform(scrollYProgress, [0, 1], z("0vw", "14vw") as string[]);
  const x3 = useTransform(scrollYProgress, [0, 1], z("0vw", "-9vw") as string[]);
  const imgY = useTransform(scrollYProgress, [0, 1], z(0, -140) as number[]);
  const imgScale = useTransform(scrollYProgress, [0, 1], z(1, 1.18) as number[]);
  const floatY = useTransform(scrollYProgress, [0, 1], z(0, -320) as number[]);
  const circleY = useTransform(scrollYProgress, [0, 1], z(0, -60) as number[]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const blobRot = useTransform(scrollYProgress, [0, 1], z(0, 40) as number[]);

  return (
    <section id="top" ref={ref} className="hero-shell relative h-[100svh] min-h-[560px] max-h-[1100px] overflow-hidden supports-[height:100dvh]:h-[100dvh] min-[1800px]:max-h-none" aria-label="Your Aura Matters">
      <h1 className="sr-only">Demo Aura Beauty — Your Aura Matters. Your Beauty. Your Aura.</h1>

      {/* organic background shape */}
      <motion.svg
        aria-hidden
        viewBox="0 0 600 600"
        style={{ rotate: blobRot }}
        className="pointer-events-none absolute -right-[20vw] top-[5vh] w-[90vw] max-w-[1100px] text-peach/45 md:-right-[8vw] md:w-[60vw]"
      >
        <motion.path
          fill="currentColor"
          animate={
            reduce
              ? {}
              : {
                  d: [
                    "M421,317Q393,384,331,423Q269,462,198,436Q127,410,111,335Q95,260,141,196Q187,132,265,121Q343,110,396,170Q449,230,421,317Z",
                    "M444,329Q404,408,327,436Q250,464,184,418Q118,372,121,297Q124,222,176,170Q228,118,302,128Q376,138,430,204Q484,270,444,329Z",
                    "M421,317Q393,384,331,423Q269,462,198,436Q127,410,111,335Q95,260,141,196Q187,132,265,121Q343,110,396,170Q449,230,421,317Z",
                  ],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          d="M421,317Q393,384,331,423Q269,462,198,436Q127,410,111,335Q95,260,141,196Q187,132,265,121Q343,110,396,170Q449,230,421,317Z"
        />
      </motion.svg>

      {/* top meta row */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 top-20 z-20 mx-auto flex max-w-[1600px] items-start justify-between px-5 md:top-24 md:px-10"
      >
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1, ease: EASE }} className="label text-ink-soft">
          Demo Beauty Studio <span className="text-rose-deep">/</span> 2026
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1, ease: EASE }}
          className="hidden text-right label text-ink-soft md:block"
        >
          Your beauty.
          <br />
          Your aura.
        </motion.p>
      </motion.div>

      {/* main arched portrait */}
      <motion.div
        style={{ y: imgY }}
        className="hero-portrait absolute right-3 top-[18%] z-10 w-[55vw] max-w-[290px] min-[390px]:right-4 min-[390px]:w-[54vw] md:right-[9vw] md:top-[13%] md:w-[29vw] md:max-w-[460px]"
      >
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.25 }}
          className="relative aspect-[3/4.3] overflow-hidden rounded-t-full bg-ivory-deep"
        >
          <motion.img
            src={px(IMG.heroMain, 900, 1290)}
            alt="Editorial beauty portrait with soft rose eye makeup"
            fetchPriority="high"
            style={{ scale: imgScale }}
            initial={{ scale: 1.35 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: EASE, delay: 0.25 }}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* rotating ring */}
        <motion.div
          style={{ y: circleY }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 1.3 }}
          className="absolute -left-10 -top-6 text-ink md:-left-20 md:-top-10"
        >
          <div className="relative">
            <CircleText text="BEAUTY • STYLE • CONFIDENCE • BEAUTY • STYLE • CONFIDENCE • " size={180} className="h-28 w-28 md:h-44 md:w-44" duration={26} />
            <span className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-peach font-display text-lg italic md:h-14 md:w-14 md:text-2xl">
              a
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-3 hidden justify-between label text-ink-soft md:flex"
        >
          <span>Look 00</span>
          <span>Rose / Editorial</span>
        </motion.p>
      </motion.div>

      {/* small floating image */}
      <motion.div
        style={{ y: floatY }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 1.1 }}
        className="hero-float absolute right-[52vw] top-[50%] z-30 w-[25vw] max-w-[120px] md:right-[36vw] md:top-[58%] md:w-[11vw] md:max-w-[190px]"
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -14, 0], rotate: [-3, 2, -3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="aspect-[3/4] overflow-hidden rounded-[999px] border-4 border-ivory shadow-[0_30px_60px_-30px_rgba(29,26,23,0.5)]"
        >
          <img src={px(IMG.heroFloat, 400, 540)} alt="Close-up of statement earrings and makeup" className="h-full w-full object-cover" />
        </motion.div>
      </motion.div>

      {/* giant type */}
      <div className="hero-title absolute inset-x-0 bottom-[14%] z-20 mx-auto max-w-[1600px] px-3 min-[390px]:bottom-[16%] min-[390px]:px-4 md:bottom-[7%] md:px-10" aria-hidden>
        <div className="font-display uppercase leading-[0.8] tracking-[-0.02em] text-[23vw] md:text-[16.5vw] min-[1700px]:text-[17rem]">
          <Word text="Your" progress={scrollYProgress} x={x1} base={0.45} />
          <Word text="Aura" progress={scrollYProgress} x={x2} base={0.6} className="pl-[8vw] italic text-rose-deep md:pl-[22vw] mix-blend-multiply" drift={70} />
          <Word text="Matters." progress={scrollYProgress} x={x3} base={0.75} />
        </div>
      </div>

      {/* CTA */}
      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="hero-discover safe-bottom absolute left-4 z-30 min-[390px]:left-5 md:bottom-auto md:left-auto md:right-10 md:top-[46%]"
      >
        <Magnetic>
          <a
            href="#studio"
            className="group flex items-center gap-3 rounded-full border border-ink/30 bg-ivory/60 px-5 py-3 backdrop-blur transition-colors duration-500 hover:bg-ink hover:text-ivory md:[writing-mode:vertical-rl] md:px-3 md:py-6"
          >
            <span className="label">Discover the studio</span>
            <motion.span animate={reduce ? {} : { y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="inline-block">
              ↓
            </motion.span>
          </a>
        </Magnetic>
      </motion.div>

      <motion.p
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="hero-location safe-bottom absolute right-4 z-30 label text-ink-soft max-[350px]:hidden min-[390px]:right-5 md:bottom-8 md:right-10"
      >
        Bengaluru — IN
      </motion.p>
    </section>
  );
}
