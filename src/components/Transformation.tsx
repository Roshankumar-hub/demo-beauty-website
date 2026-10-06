import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IMG, px } from "../data/images";
import { EASE, FadeUp, MaskReveal, RevealLines, SectionLabel } from "./ui/motion";

export default function Transformation() {
  const wrap = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(50);
  const smooth = useSpring(pos, { stiffness: 300, damping: 35 });
  const clip = useTransform(smooth, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(smooth, (v) => `${v}%`);
  const [dragging, setDragging] = useState(false);
  const [pct, setPct] = useState(50);
  const inView = useInView(wrap, { once: true, margin: "0px 0px -30% 0px" });
  const reduce = useReducedMotion();
  const touched = useRef(false);

  useMotionValueEvent(pos, "change", (v) => setPct(Math.round(v)));

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(pos, [50, 22, 78, 50], { duration: 2.6, ease: "easeInOut", delay: 0.6 });
    return () => c.stop();
  }, [inView, reduce, pos]);

  const setFromEvent = (clientX: number) => {
    if (!wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const v = Math.min(98, Math.max(2, ((clientX - r.left) / r.width) * 100));
    pos.set(v);
  };

  return (
    <section className="relative overflow-hidden bg-ivory-deep/60 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="03">The Transformation</SectionLabel>
            <RevealLines
              as="h2"
              className="mt-8 font-display text-[12.5vw] uppercase leading-[0.86] md:text-[7.2vw] min-[1700px]:text-[8rem]"
              lines={["One look.", <>A <em className="text-rose-deep">completely</em></>, "new feeling."]}
            />
          </div>
          <FadeUp className="md:col-span-3 md:col-start-10">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              Signature Glow treatment + editorial makeup. 2 hours, one artist, zero filters on the after.
            </p>
            <p className="mt-6 font-display text-5xl tabular-nums">
              {pct < 50 ? "Before" : "After"} <span className="text-rose-deep italic">{pct}%</span>
            </p>
          </FadeUp>
        </div>

        <MaskReveal className="mt-14 md:mt-20">
          <div
            ref={wrap}
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison. Use arrow keys to transform."
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") pos.set(Math.max(2, pos.get() - 5));
              if (e.key === "ArrowRight") pos.set(Math.min(98, pos.get() + 5));
            }}
            onPointerDown={(e) => {
              touched.current = true;
              setDragging(true);
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              setFromEvent(e.clientX);
            }}
            onPointerMove={(e) => dragging && setFromEvent(e.clientX)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            className="relative aspect-[4/5] w-full cursor-ew-resize select-none overflow-hidden touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-rose sm:aspect-[16/10] md:aspect-[16/8]"
          >
            {/* AFTER (base) */}
            <img
              src={px(IMG.feathers, 1800, 1400)}
              alt="After: luminous skin and soft editorial makeup"
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
            />
            {/* BEFORE (clipped) */}
            <motion.div style={{ clipPath: clip }} className="absolute inset-0">
              <img
                src={px(IMG.feathers, 1800, 1400)}
                alt="Before: natural bare skin"
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover object-[50%_30%] [filter:grayscale(0.75)_contrast(0.82)_brightness(0.95)_saturate(0.5)_blur(0.6px)]"
              />
              <div className="absolute inset-0 bg-ivory/10" />
            </motion.div>

            <span className="absolute left-4 top-4 rounded-full bg-ivory/85 px-3 py-1.5 label backdrop-blur md:left-6 md:top-6">Before</span>
            <span className="absolute right-4 top-4 rounded-full bg-ink/80 px-3 py-1.5 label text-ivory backdrop-blur md:right-6 md:top-6">After</span>

            {/* divider */}
            <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 -translate-x-1/2">
              <div className="mx-auto h-full w-px bg-ivory shadow-[0_0_20px_rgba(0,0,0,0.25)]" />
              <motion.div
                animate={{ scale: dragging ? 0.85 : 1 }}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/80 bg-ivory/25 text-ivory backdrop-blur-md md:h-20 md:w-20"
              >
                <span className="text-lg">←&nbsp;→</span>
              </motion.div>
              <motion.span
                animate={{ y: dragging ? -6 : [0, -6, 0], opacity: 1 }}
                transition={dragging ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-[calc(50%+56px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-2 label text-ivory md:top-[calc(50%+64px)]"
              >
                Drag to transform
              </motion.span>
            </motion.div>
          </div>
        </MaskReveal>

        <div className="mt-6 flex flex-wrap justify-between gap-4 label text-ink-soft">
          <span>Client — R. / 29</span>
          <span>Artist — Ananya Rao</span>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, ease: EASE }}>
            Signature Glow + Soft Glam
          </motion.span>
        </div>
      </div>
    </section>
  );
}
