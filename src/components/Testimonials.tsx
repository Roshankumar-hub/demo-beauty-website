import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE, SectionLabel } from "./ui/motion";

const QUOTES = [
  { q: ["I walked in wanting a new look.", "I walked out feeling", "completely different."], who: "Priya", what: "Transformation, 2025" },
  { q: ["My bridal makeup looked", "like me — just the most", "radiant version of me."], who: "Meera", what: "Bridal Edit" },
  { q: ["The facial was a ritual.", "My skin hasn't glowed", "like this in years."], who: "Aisha", what: "Glow Skin" },
  { q: ["They listened before", "they touched a single", "strand. Rare. Beautiful."], who: "Nandini", what: "Signature Hair" },
];

export default function Testimonials() {
  const [[i, dir], set] = useState<[number, number]>([0, 1]);
  const reduce = useReducedMotion();
  const go = (d: number) => set(([c]) => [(c + d + QUOTES.length) % QUOTES.length, d]);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [i, reduce]);

  const q = QUOTES[i];

  return (
    <section className="relative overflow-hidden bg-ivory-deep/70 py-24 md:py-36" aria-roledescription="carousel" aria-label="Client stories">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex items-center justify-between">
          <SectionLabel index="08">Client Stories</SectionLabel>
          <span className="font-display text-[18vw] leading-none text-rose/30 md:text-[10vw]" aria-hidden>
            "
          </span>
        </div>

        <div className="relative min-h-[300px] md:min-h-[420px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={i}
              custom={dir}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              className="cursor-grab active:cursor-grabbing"
              aria-live="polite"
            >
              <p className="font-display text-[9vw] leading-[0.98] md:text-[5.4vw] min-[1700px]:text-[6rem]">
                {q.q.map((line, li) => (
                  <span key={li} className="block overflow-hidden">
                    <motion.span
                      className={`block ${li === q.q.length - 1 ? "italic text-rose-deep" : ""}`}
                      initial={{ x: dir * 120, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -dir * 120, opacity: 0 }}
                      transition={{ duration: 0.9, ease: EASE, delay: li * 0.08 }}
                    >
                      {li === 0 ? "“" : ""}
                      {line}
                      {li === q.q.length - 1 ? "”" : ""}
                    </motion.span>
                  </span>
                ))}
              </p>
              <motion.footer initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="mt-10 flex items-center gap-4">
                <span className="h-px w-12 bg-ink" />
                <cite className="not-italic label">— {q.who}</cite>
                <span className="label text-ink-soft">{q.what}</span>
              </motion.footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-ink/15 pt-6">
          <p className="font-display text-3xl tabular-nums">
            <span className="inline-block overflow-hidden align-bottom">
              <AnimatePresence mode="wait">
                <motion.span key={i} className="inline-block" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5, ease: EASE }}>
                  0{i + 1}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-ink/30"> / 0{QUOTES.length}</span>
          </p>
          <div className="flex items-center gap-4">
            <div className="hidden gap-2 md:flex">
              {QUOTES.map((_, k) => (
                <button key={k} onClick={() => set([k, k > i ? 1 : -1])} aria-label={`Show story ${k + 1}`} className="relative h-px w-14 bg-ink/15 py-2 bg-clip-content">
                  {k === i && (
                    <motion.span
                      className="absolute left-0 top-1/2 h-px bg-ink"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: reduce ? 0 : 7, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => go(-1)} aria-label="Previous story" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-ivory">
              ←
            </button>
            <button onClick={() => go(1)} aria-label="Next story" className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-ivory">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
