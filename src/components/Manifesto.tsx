import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { IMG, px } from "../data/images";
import { DriftWord, EASE, FadeUp, ParallaxImage, RevealLines, SectionLabel } from "./ui/motion";

function InlinePill({ id, alt }: { id: number; alt: string }) {
  return (
    <span className="relative mx-[0.12em] inline-block h-[0.72em] w-[1.5em] translate-y-[0.04em] overflow-hidden rounded-full align-baseline">
      <img src={px(id, 320, 160)} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </span>
  );
}

export default function Manifesto() {
  const lineRef = useRef<SVGSVGElement>(null);
  const inView = useInView(lineRef, { once: true, margin: "0px 0px -10% 0px" });
  const sec = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sec, offset: ["start end", "end start"] });
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [160, -160]);

  return (
    <section id="studio" ref={sec} className="relative pt-28 pb-24 md:pt-44 md:pb-36">
      <DriftWord className="font-display text-[28vw] leading-none outline-text opacity-30 select-none" distance={260}>
        aura · aura · aura
      </DriftWord>

      <div className="relative mx-auto -mt-[10vw] max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="01">The Aura Experience</SectionLabel>

        <RevealLines
          as="h2"
          className="mt-10 font-display text-[11.5vw] uppercase leading-[0.9] tracking-[-0.015em] md:text-[7.4vw] min-[1700px]:text-[8rem]"
          stagger={0.14}
          lines={[
            <>Beauty isn't about</>,
            <>
              <em className="text-rose-deep">changing</em> who
              <InlinePill id={IMG.lipstick} alt="Red lipstick close-up" /> you are.
            </>,
            <>
              It's about <InlinePill id={IMG.hairWavy} alt="Wavy hair" /> revealing
            </>,
            <>
              more of <em className="text-rose-deep">you.</em>
            </>,
          ]}
        />

        {/* hand-drawn underline */}
        <svg ref={lineRef} viewBox="0 0 1200 40" className="mt-6 w-full max-w-[1100px] text-rose" fill="none" preserveAspectRatio="none" aria-hidden>
          <motion.path
            d="M2 28 C 200 8, 380 36, 600 20 S 1000 6, 1198 22"
            stroke="currentColor"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 2.4, ease: EASE, delay: 0.6 }}
          />
        </svg>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
          <FadeUp className="md:col-span-4 md:col-start-2">
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
              Demo Aura is a slow-beauty studio in the heart of Bengaluru. We don't follow trends — we study your features, your mood
              and your moment, then craft a look that feels like the most confident version of you.
            </p>
            <a href="#services" className="group mt-8 inline-flex items-center gap-3 label">
              <span className="border-b border-ink pb-1">Explore services</span>
              <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
            </a>
          </FadeUp>

          <div className="relative md:col-span-6 md:col-start-7 h-[70vw] md:h-[34vw]">
            <ParallaxImage
              src={px(IMG.interior2, 1000, 760)}
              alt="Bright reception of the Demo Aura studio"
              className="absolute left-0 top-0 h-[80%] w-[72%] rounded-[2px]"
              speed={40}
            />
            <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 h-[62%] w-[42%] overflow-hidden rounded-t-full border-[6px] border-ivory">
              <img src={px(IMG.makeupApply, 500, 700)} alt="Makeup being applied" loading="lazy" className="h-full w-full object-cover" />
            </motion.div>
            <span className="absolute -bottom-6 left-0 label text-ink-soft">The studio — Indiranagar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
