import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useState } from "react";
import { IMG, px } from "../data/images";
import { cn } from "../utils/cn";
import { EASE, MaskReveal, RevealLines, SectionLabel, useIsMobile } from "./ui/motion";

const TEAM = [
  { n: "01", name: "Maya Sharma", role: "Hair Artist", img: IMG.team1, desc: "Lived-in colour and soft, undone texture. 9 years behind the chair, trained in London.", offset: "md:mt-0" },
  { n: "02", name: "Ananya Rao", role: "Makeup Artist", img: IMG.team3, desc: "Skin-first artistry. Known for bridal looks that photograph like editorials.", offset: "md:mt-40" },
  { n: "03", name: "Sofia Mehta", role: "Skin Specialist", img: IMG.team2, desc: "Certified aesthetician obsessed with barrier health and that inside-out glow.", offset: "md:mt-16" },
  { n: "04", name: "Kiara Kapoor", role: "Nail Artist", img: IMG.team4, desc: "Hand-painted micro art, chrome and minimalist sets with couture precision.", offset: "md:mt-56" },
];

function Portrait({ m, i }: { m: (typeof TEAM)[number]; i: number }) {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });
  const show = hover;

  return (
    <motion.article
      className={cn("group relative", m.offset, i % 2 === 1 && "mt-16")}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        setHover(false);
        x.set(0);
        y.set(0);
      }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 22);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 22);
      }}
      onClick={() => isMobile && setHover((v) => !v)}
    >
      <MaskReveal delay={i * 0.1}>
        <button type="button" aria-expanded={show} aria-label={`${m.name}, ${m.role}`} className="relative block aspect-[3/4.2] w-full overflow-hidden bg-ivory-deep text-left">
          <motion.img
            src={px(m.img, 700, 980)}
            alt={`${m.name}, ${m.role}`}
            loading="lazy"
            style={{ x: sx, y: sy }}
            animate={{ scale: show ? 1.14 : 1.04 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="h-full w-full object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent"
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <AnimatePresence>
            {show && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute inset-x-4 bottom-4 text-sm leading-relaxed text-ivory md:inset-x-5 md:bottom-5"
              >
                {m.desc}
              </motion.p>
            )}
          </AnimatePresence>
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/80 text-sm backdrop-blur md:hidden">
            {show ? "–" : "+"}
          </span>
        </button>
      </MaskReveal>
      <motion.div animate={{ x: show ? 14 : 0 }} transition={{ duration: 0.7, ease: EASE }} className="mt-4">
        <p className="label text-rose-deep">{m.n}</p>
        <h3 className="mt-1 font-display text-[clamp(1.45rem,7vw,1.875rem)] uppercase leading-none md:text-[2.6vw]">
          {m.name.split(" ")[0]} <em className="text-ink-soft">{m.name.split(" ")[1]}</em>
        </h3>
        <p className="mt-2 label text-ink-soft">{m.role}</p>
      </motion.div>
    </motion.article>
  );
}

export default function Team() {
  return (
    <section id="team" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index="05">The Artists</SectionLabel>
            <RevealLines
              as="h2"
              className="mt-8 font-display text-[14vw] uppercase leading-[0.85] md:text-[8vw] min-[1700px]:text-[8.5rem]"
              lines={["Meet the", <em className="text-rose-deep">hands</em>, "behind it."]}
            />
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">
            Fifteen artists, four disciplines, one shared obsession with detail. Here are the leads.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-4 gap-y-14 min-[390px]:grid-cols-2 md:mt-24 md:gap-x-8 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Portrait key={m.n} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
