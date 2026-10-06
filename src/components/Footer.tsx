import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { DrawLine, EASE } from "./ui/motion";

const LINKS = [
  ["Studio", "#studio"],
  ["Services", "#services"],
  ["Work", "#work"],
  ["Team", "#team"],
  ["Book", "#book"],
];

export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 1200));
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.5, ease: EASE }}
          whileHover={{ y: -4 }}
          aria-label="Back to top"
          className="safe-bottom fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ivory/80 shadow-sm backdrop-blur md:bottom-8 md:right-8"
        >
          <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(29,26,23,0.12)" strokeWidth="1" />
            <motion.circle cx="28" cy="28" r="26" fill="none" stroke="#1d1a17" strokeWidth="1" style={{ pathLength: scrollYProgress }} />
          </svg>
          <span className="text-lg">↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-ivory pt-20 pb-8">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-4xl">
              DEMO <em className="text-rose-deep">aura</em> BEAUTY
            </p>
            <p className="mt-3 label text-ink-soft">Beauty studio / Bengaluru</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-soft">12th Main, Indiranagar, Bengaluru 560038 · Tue–Sun, 10am–8pm</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="label text-ink-soft">Explore</p>
            <ul className="mt-4 space-y-1">
              {LINKS.map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="group inline-flex items-center gap-2 font-display text-2xl">
                    <span className="inline-block w-0 overflow-hidden text-rose-deep transition-all duration-500 group-hover:w-5">→</span>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="label text-ink-soft">Follow</p>
            <ul className="mt-4 space-y-1">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="font-display text-2xl hover:italic">
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="font-display text-2xl hover:italic">
                  WhatsApp ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p aria-hidden className="mt-20 select-none whitespace-nowrap text-center font-display text-[21vw] uppercase leading-[0.8] tracking-tight text-ink">
          Demo <em className="text-rose">aura</em>
        </p>
        <DrawLine className="mt-6" />
        <div className="mt-6 flex flex-col justify-between gap-2 label text-ink-soft sm:flex-row">
          <span>© 2026 Demo Aura Beauty</span>
          <span>Your beauty. Your aura.</span>
        </div>
      </div>
    </footer>
  );
}
