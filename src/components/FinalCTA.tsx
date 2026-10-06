import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG, px } from "../data/images";
import { EASE, Magnetic, RevealLines } from "./ui/motion";

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const clip = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduce ? ["inset(0% 0% 0% 0% round 0px)", "inset(0% 0% 0% 0% round 0px)"] : ["inset(22% 30% 22% 30% round 400px)", "inset(0% 0% 0% 0% round 0px)"]
  );
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.4, 1]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden supports-[height:100dvh]:h-[100dvh] min-[390px]:min-h-[640px]" aria-label="Book your experience">
      <motion.div style={{ clipPath: clip }} className="absolute inset-0">
        <motion.img
          style={{ scale }}
          src={px(IMG.floral, 1800, 1300)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-ink/45" />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-5 text-ivory md:px-10">
        <p className="label text-peach">The final chapter</p>
        <div className="mt-6 flex items-end justify-between gap-6">
          <RevealLines
            as="h2"
            className="font-display text-[16vw] uppercase leading-[0.82] md:text-[10vw] min-[1700px]:text-[11rem]"
            lines={["Ready to", <em className="text-peach">find your</em>, "aura?"]}
          />
          <motion.svg
            viewBox="0 0 100 100"
            className="hidden h-[18vw] w-[18vw] shrink-0 text-peach md:block"
            aria-hidden
            animate={reduce ? {} : { x: [0, 14, 0], y: [0, 14, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.path
              d="M10 10 L90 90 M90 30 L90 90 L30 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: EASE, delay: 0.4 }}
            />
          </motion.svg>
        </div>
        <div className="mt-12">
          <Magnetic>
            <a href="#book" className="group inline-flex max-w-full items-center gap-3 rounded-full bg-ivory py-3 pl-5 pr-3 text-ink min-[350px]:gap-5 min-[350px]:pl-7">
              <span className="label whitespace-nowrap">Book your experience</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ivory transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
