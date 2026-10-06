import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function useIsMobile(bp = 768) {
  const read = () => {
    if (typeof window === "undefined") return false;
    const touchPrimary = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    return window.innerWidth < bp || touchPrimary;
  };
  const [m, setM] = useState(read);
  useEffect(() => {
    const width = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)");
    const on = () => setM(width.matches || touch.matches);
    on();
    width.addEventListener("change", on);
    touch.addEventListener("change", on);
    return () => {
      width.removeEventListener("change", on);
      touch.removeEventListener("change", on);
    };
  }, [bp]);
  return m;
}

/** Masked line-by-line reveal. Each line slides up from behind a mask. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
  as: Tag = "div",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "div" | "h1" | "h2" | "h3" | "p" | "blockquote";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            initial={{ y: "110%", rotate: 2 }}
            animate={inView ? { y: "0%", rotate: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Simple fade-up on enter */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Horizontal line that draws itself */
export function DrawLine({ className, delay = 0, origin = "left" }: { className?: string; delay?: number; origin?: "left" | "right" | "center" }) {
  return (
    <motion.span
      aria-hidden
      className={cn("block h-px bg-ink/25", className)}
      style={{ transformOrigin: origin }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.6, ease: EASE, delay }}
    />
  );
}

/** Scroll-linked parallax value for a target element */
export function useParallax(ref: React.RefObject<HTMLElement | null>, distance = 120): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [distance, -distance]);
}

/** Image inside a masked frame that drifts + scales on scroll */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  speed = 60,
  scale = [1.18, 1],
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  speed?: number;
  scale?: [number, number];
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-speed, speed]);
  const s = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : scale);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ y, scale: s }}
        className={cn("absolute inset-0 h-[115%] -top-[7.5%] w-full object-cover will-change-transform", imgClassName)}
      />
    </div>
  );
}

/** Clip-path mask reveal when entering viewport */
export function MaskReveal({
  children,
  className,
  delay = 0,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right" | "top";
}) {
  const start = {
    bottom: "inset(100% 0% 0% 0%)",
    top: "inset(0% 0% 100% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];
  return (
    <motion.div
      className={className}
      initial={{ clipPath: start }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Magnetic wrapper — pulls child toward cursor */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 15, mass: 0.4 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Number counter that animates on enter */
export function Counter({ to, pad = 0, suffix = "", className }: { to: number; pad?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const c = animate(0, to, { duration: 2.2, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {String(val).padStart(pad, "0")}
      {suffix}
    </span>
  );
}

/** Large word that drifts horizontally while scrolling */
export function DriftWord({ children, className, distance = 300, reverse = false }: { children: ReactNode; className?: string; distance?: number; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : reverse ? [-distance, distance] : [distance, -distance]);
  return (
    <div ref={ref} className="overflow-hidden" aria-hidden>
      <motion.div style={{ x }} className={cn("whitespace-nowrap will-change-transform", className)}>
        {children}
      </motion.div>
    </div>
  );
}

/** Rotating circular text */
export function CircleText({ text, size = 180, className, duration = 24 }: { text: string; size?: number; className?: string; duration?: number }) {
  const id = useRef(`c${Math.random().toString(36).slice(2, 8)}`).current;
  const r = size / 2 - 14;
  return (
    <motion.svg
      aria-hidden
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      <defs>
        <path id={id} d={`M ${size / 2},${size / 2} m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`} />
      </defs>
      <text fontSize={size * 0.066} letterSpacing={size * 0.022} fill="currentColor" style={{ fontFamily: "Manrope", fontWeight: 500 }}>
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </motion.svg>
  );
}

export function SectionLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <FadeUp className={cn("flex items-center gap-4", className)} y={12}>
      {index && <span className="label text-rose-deep">{index}</span>}
      <span className="h-px w-10 bg-ink/30" />
      <span className="label text-ink-soft">{children}</span>
    </FadeUp>
  );
}
