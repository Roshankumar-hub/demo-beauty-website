import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG, px } from "../data/images";
import { cn } from "../utils/cn";
import { Magnetic, RevealLines, SectionLabel, useIsMobile } from "./ui/motion";

const SHOTS = [
  { id: IMG.hairClips, cls: "left-[2%] top-[4%] w-[30%] md:w-[17%] aspect-[3/4]", speed: 80, rot: -4 },
  { id: IMG.nailsProc, cls: "left-[60%] top-[0%] w-[34%] md:left-[72%] md:w-[15%] aspect-[3/4] rounded-t-full", speed: 140, rot: 3 },
  { id: IMG.glam, cls: "left-[8%] top-[60%] w-[36%] md:left-[18%] md:top-[56%] md:w-[14%] aspect-square rounded-full", speed: 200, rot: 0 },
  { id: IMG.facialMask, ratio: [700, 500], cls: "left-[52%] top-[66%] w-[44%] md:left-[60%] md:top-[60%] md:w-[20%] aspect-[4/3]", speed: 60, rot: 2 },
  { id: IMG.crown, cls: "hidden md:block md:left-[88%] md:top-[38%] md:w-[11%] aspect-[3/4]", speed: 240, rot: -3 },
  { id: IMG.hairColor, ratio: [700, 500], cls: "hidden md:block md:left-[0%] md:top-[34%] md:w-[13%] aspect-[4/3]", speed: 170, rot: 4 },
];

function Shot({ s, p }: { s: (typeof SHOTS)[number]; p: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const travel = mobile ? s.speed * 0.42 : s.speed;
  const y = useTransform(p, [0, 1], reduce ? [0, 0] : [travel, -travel]);
  const ratio = (s as { ratio?: number[] }).ratio ?? [500, 660];
  return (
    <motion.a
      href="https://instagram.com"
      target="_blank"
      rel="noreferrer"
      style={{ y, rotate: s.rot }}
      whileHover={{ scale: 1.06, rotate: 0, zIndex: 20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn("absolute block overflow-hidden shadow-[0_30px_60px_-35px_rgba(29,26,23,0.6)]", s.cls)}
      aria-label="View on Instagram"
    >
      <img src={px(s.id, ratio[0], ratio[1])} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
    </motion.a>
  );
}

export default function Social() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="10">Social / Instagram</SectionLabel>
      </div>
      <div className="relative mx-auto mt-10 h-[170vw] min-h-[560px] max-h-[760px] max-w-[1600px] md:h-[100vh] md:min-h-[720px] md:max-h-none">
        {SHOTS.map((s) => (
          <Shot key={s.id} s={s} p={scrollYProgress} />
        ))}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
          <RevealLines
            as="h2"
            className="font-display text-[13vw] uppercase leading-[0.86] md:text-[7.5vw] min-[1700px]:text-[8rem]"
            lines={["See what's", <em className="text-rose-deep">happening</em>, "at Demo Aura"]}
          />
          <div className="pointer-events-auto mt-8">
            <Magnetic>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-ivory/80 px-6 py-3 backdrop-blur border border-ink/20 transition-colors hover:bg-ink hover:text-ivory">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
                <span className="font-display text-xl italic">@demoaurabeauty</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
