import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "./ui/motion";
import { cn } from "../utils/cn";

const LINKS = [
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Team", href: "#team" },
  { label: "Book", href: "#book" },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const [pill, setPill] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setPill(v > 120));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.8 }}
        className="safe-nav fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none md:pt-5"
      >
        <motion.nav
          layout
          transition={{ layout: { duration: 0.7, ease: EASE } }}
          aria-label="Primary"
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-4 transition-colors duration-700 sm:gap-8",
            pill
              ? "w-auto rounded-full border border-ink/10 bg-ivory/75 px-3 py-2 pl-5 shadow-[0_10px_40px_-20px_rgba(29,26,23,0.35)] backdrop-blur-xl"
              : "w-full max-w-[1600px] py-2 md:px-6"
          )}
        >
          <motion.a layout="position" href="#top" className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-display text-lg tracking-tight min-[360px]:text-xl">DEMO</span>
            <span className="font-display text-lg italic text-rose-deep min-[360px]:text-xl">aura</span>
          </motion.a>

          <motion.ul layout="position" className="hidden items-center gap-1 md:flex">
            {LINKS.map((l, i) => (
              <li key={l.href} className="flex items-center">
                <a
                  href={l.href}
                  className={cn(
                    "group relative px-3 py-1.5 label text-ink/80 hover:text-ink",
                    l.label === "Book" && pill && "rounded-full bg-ink px-4 text-ivory hover:text-ivory"
                  )}
                >
                  {l.label}
                  {!(l.label === "Book" && pill) && (
                    <span className="absolute inset-x-3 bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-x-100" />
                  )}
                </a>
                {i < LINKS.length - 1 && !pill && <span className="text-ink/25">/</span>}
              </li>
            ))}
          </motion.ul>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden flex h-11 min-w-11 items-center gap-2 rounded-full border border-ink/15 bg-ivory/70 pl-3 pr-3 backdrop-blur min-[360px]:gap-3 min-[360px]:pl-4"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="label">Menu</span>
            <span className="flex flex-col gap-1">
              <span className="block h-px w-5 bg-ink" />
              <span className="block h-px w-3 bg-ink self-end" />
            </span>
          </button>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-ink text-ivory md:hidden"
            initial={{ clipPath: "circle(0% at 90% 4%)" }}
            animate={{ clipPath: "circle(150% at 90% 4%)" }}
            exit={{ clipPath: "circle(0% at 90% 4%)" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="safe-menu flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl">
                  DEMO <em className="text-peach">aura</em>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25"
                  aria-label="Close menu"
                >
                  <span className="relative block h-4 w-4">
                    <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-ivory" />
                    <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-ivory" />
                  </span>
                </button>
              </div>
              <ul className="mt-10 flex flex-1 flex-col justify-center gap-1 min-[390px]:mt-16 min-[390px]:justify-start min-[390px]:gap-2">
                {LINKS.map((l, i) => (
                  <li key={l.href} className="overflow-hidden border-b border-ivory/10">
                    <motion.a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-3"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.07 }}
                    >
                      <span className="font-display text-[clamp(2.8rem,15vw,4rem)]">{l.label}</span>
                      <span className="label text-ivory/40">0{i + 1}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-between label text-ivory/60"
              >
                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">WhatsApp</a>
                <span>Bengaluru</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
