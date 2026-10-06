import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { IMG, px } from "../data/images";
import { EASE, RevealLines, SectionLabel, useIsMobile } from "./ui/motion";
import { cn } from "../utils/cn";

const SERVICES = [
  { n: "01", name: "Hair", price: "From ₹999", img: IMG.hairBlow, tint: "#efe4d9", desc: "Precision cuts, glossing, colour and blow-outs shaped around your face and lifestyle.", tags: ["Cut & Style", "Colour", "Keratin"] },
  { n: "02", name: "Makeup", price: "From ₹1,499", img: IMG.glam, tint: "#f3dfd6", desc: "From barely-there soft glam to statement editorial looks built to last all night.", tags: ["Soft Glam", "Editorial", "Party"] },
  { n: "03", name: "Skin", price: "From ₹1,299", img: IMG.facial2, tint: "#f1e6dc", desc: "Clinical-grade facials and rituals for glass-like, deeply nourished skin.", tags: ["Hydra Facial", "Glow Peel", "Rituals"] },
  { n: "04", name: "Nails", price: "From ₹799", img: IMG.nailsRed, tint: "#f2dcd6", desc: "Gel, extensions and hand-painted nail art finished with obsessive detail.", tags: ["Gel", "Extensions", "Art"] },
  { n: "05", name: "Bridal", price: "From ₹4,999", img: IMG.bride1, tint: "#efdccb", desc: "A complete bridal journey — trials, timeline planning and day-of artistry.", tags: ["Trials", "HD Bridal", "Family"] },
  { n: "06", name: "Transformations", price: "By consultation", img: IMG.drape, tint: "#ebe1d8", desc: "Head-to-toe makeovers designed with you for a new chapter, a new feeling.", tags: ["Full Look", "Styling", "Shoot-ready"] },
];

export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(0);
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (!box.current || reduce) return;
    const r = box.current.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    // keep image in the right half, nudged by cursor
    mx.set(r.width * 0.62 + (cx - r.width / 2) * 0.18);
    my.set(cy - 190);
  };

  const tint = active !== null ? SERVICES[active].tint : "#f4eee6";

  return (
    <motion.section
      id="services"
      animate={{ backgroundColor: isMobile ? "#f4eee6" : tint }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="02">Services / Menu</SectionLabel>
            <RevealLines
              as="h2"
              className="mt-8 font-display text-[14vw] uppercase leading-[0.85] md:text-[8vw] min-[1700px]:text-[8.5rem]"
              lines={["The art of", <em className="text-rose-deep">you, refined.</em>]}
            />
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft md:col-span-4 md:col-start-9">
            Six disciplines, one philosophy. {isMobile ? "Tap" : "Hover"} a service to preview the craft behind it.
          </p>
        </div>

        <div ref={box} className="relative mt-16 md:mt-24" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
          {/* cursor-following preview (desktop) */}
          {!isMobile && (
            <motion.div
              aria-hidden
              style={{ x: sx, y: sy }}
              className="pointer-events-none absolute left-0 top-0 z-20 h-[380px] w-[290px]"
            >
              <AnimatePresence mode="popLayout">
                {active !== null && (
                  <motion.div
                    key={active}
                    initial={{ clipPath: "inset(100% 0 0 0 round 160px 160px 0 0)", scale: 1.1, rotate: -4 }}
                    animate={{ clipPath: "inset(0% 0 0 0 round 160px 160px 0 0)", scale: 1, rotate: 0 }}
                    exit={{ clipPath: "inset(0 0 100% 0 round 160px 160px 0 0)", opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="absolute inset-0 overflow-hidden"
                  >
                    <img src={px(SERVICES[active].img, 600, 800)} alt="" className="h-full w-full object-cover" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-ivory/85 px-3 py-1 label backdrop-blur">{SERVICES[active].price}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          <ul className="border-t border-ink/15">
            {SERVICES.map((s, i) => {
              const isActive = active === i;
              const isOpen = open === i;
              return (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
                  className="relative border-b border-ink/15"
                >
                  <button
                    type="button"
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => isMobile && setOpen(isOpen ? null : i)}
                    aria-expanded={isMobile ? isOpen : undefined}
                    className="group flex w-full items-center gap-4 py-5 text-left md:gap-10 md:py-7"
                  >
                    <span className="relative h-4 w-8 overflow-hidden label text-ink-soft">
                      <motion.span className="absolute inset-0" animate={{ y: isActive || (isMobile && isOpen) ? "-100%" : "0%" }} transition={{ duration: 0.5, ease: EASE }}>
                        {s.n}
                      </motion.span>
                      <motion.span className="absolute inset-0 text-rose-deep" initial={{ y: "100%" }} animate={{ y: isActive || (isMobile && isOpen) ? "0%" : "100%" }} transition={{ duration: 0.5, ease: EASE }}>
                        {s.n}
                      </motion.span>
                    </span>
                    <span className="hidden text-ink/30 md:inline">—</span>
                    <motion.span
                      animate={{
                        x: isActive ? 24 : 0,
                        opacity: active === null || isActive ? 1 : 0.28,
                      }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className={cn(
                        "origin-left font-display uppercase leading-none transition-[font-size] duration-700 ease-[var(--ease-cine)]",
                        "text-[11vw] md:text-[5.2vw] min-[1700px]:text-[5.5rem]",
                        s.name.length > 12 && "service-long",
                        isActive && "md:text-[6.6vw] min-[1700px]:text-[7rem] italic"
                      )}
                    >
                      {s.name}
                    </motion.span>
                    <span className="ml-auto flex items-center gap-6">
                      <span className="hidden label text-ink-soft md:inline">{s.price}</span>
                      <motion.span
                        animate={{ x: isActive ? 8 : 0, rotate: isActive ? 0 : -45, backgroundColor: isActive ? "#1d1a17" : "rgba(0,0,0,0)", color: isActive ? "#f4eee6" : "#1d1a17" }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className={cn("flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 md:h-12 md:w-12", isMobile && isOpen && "rotate-90")}
                      >
                        →
                      </motion.span>
                    </span>
                  </button>

                  {/* desktop description slides in under active */}
                  {!isMobile && (
                    <motion.div
                      initial={false}
                      animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="flex max-w-xl gap-10 pb-8 pl-[7.5rem]">
                        <p className="text-[15px] leading-relaxed text-ink-soft">{s.desc}</p>
                        <ul className="flex shrink-0 flex-col gap-1 label text-ink-soft">
                          {s.tags.map((t) => (
                            <li key={t}>· {t}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* mobile accordion */}
                  {isMobile && (
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-5 gap-4 pb-6">
                            <motion.div
                              initial={{ clipPath: "inset(100% 0 0 0)" }}
                              animate={{ clipPath: "inset(0% 0 0 0)" }}
                              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                              className="col-span-2 aspect-[3/4] overflow-hidden rounded-t-full"
                            >
                              <img src={px(s.img, 400, 540)} alt={`${s.name} service`} loading="lazy" className="h-full w-full object-cover" />
                            </motion.div>
                            <div className="col-span-3 flex flex-col justify-between">
                              <p className="text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                              <div>
                                <p className="font-display text-2xl">{s.price}</p>
                                <a href="#book" className="mt-2 inline-block border-b border-ink pb-0.5 label">
                                  Book {s.name} →
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
