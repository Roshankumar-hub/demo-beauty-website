import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IMG, px } from "../data/images";
import { EASE, FadeUp, ParallaxImage, RevealLines, SectionLabel } from "./ui/motion";

function useSectionScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const r = (a: number, b: number) => (reduce ? [a, a] : [a, b]);
  return { ref, p: scrollYProgress, r };
}

function Features({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className={`mt-6 ${light ? "border-ivory/30" : "border-ink/20"} border-t`}>
      {items.map((t, i) => (
        <motion.li
          key={t}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.1 }}
          className={`flex justify-between border-b ${light ? "border-ivory/30" : "border-ink/20"} py-3`}
        >
          <span className="font-display text-2xl italic">{t}</span>
          <span className="label opacity-60">0{i + 1}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function SoftGlow() {
  const { ref, p, r } = useSectionScroll();
  const scale = useTransform(p, [0, 1], r(1.25, 1));
  const textY = useTransform(p, [0, 1], r(120, -120));
  const smallY = useTransform(p, [0, 1], r(200, -220));
  return (
    <div ref={ref} className="relative mx-auto grid max-w-[1600px] gap-10 px-5 md:grid-cols-12 md:px-10">
      <div className="relative md:col-span-7">
        <div className="relative aspect-[4/5] overflow-hidden rounded-tr-[45%] md:aspect-[5/6]">
          <motion.img style={{ scale }} src={px(IMG.drape, 1100, 1320)} alt="The Soft Glow look" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <motion.div style={{ y: smallY }} className="absolute -bottom-10 -right-4 w-[38%] md:-right-[12%] md:w-[34%]">
          <div className="aspect-[3/4] overflow-hidden rounded-full border-[6px] border-ivory">
            <img src={px(IMG.eyePatch, 500, 660)} alt="Skin prep with eye patches" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </motion.div>
      </div>
      <motion.div style={{ y: textY }} className="relative self-center md:col-span-4 md:col-start-9">
        <p className="label text-rose-deep">Look I</p>
        <RevealLines as="h3" className="mt-4 font-display text-[16vw] uppercase leading-[0.82] md:text-[6.5vw]" lines={["The", <em>soft</em>, "glow"]} />
        <Features items={["Natural skin", "Soft makeup", "Effortless hair"]} />
        <p className="mt-6 label text-ink-soft">2.5 hrs · From ₹3,999</p>
      </motion.div>
    </div>
  );
}

function Statement() {
  const { ref, p, r } = useSectionScroll();
  const scale = useTransform(p, [0, 1], r(1.3, 1.02));
  const x1 = useTransform(p, [0, 1], r(200, -260));
  const x2 = useTransform(p, [0, 1], r(-220, 200));
  const clip = useTransform(p, [0, 0.35], reduce(r) ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(12% 10% 12% 10%)", "inset(0% 0% 0% 0%)"]);
  return (
    <div ref={ref} className="relative">
      <motion.div style={{ clipPath: clip }} className="relative h-[110vh] min-h-[640px] overflow-hidden">
        <motion.img style={{ scale }} src={px(IMG.darkFeather, 1800, 1500)} alt="The Statement look" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_25%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30" />
        <div className="absolute inset-0 flex flex-col justify-end overflow-hidden pb-10 text-ivory md:pb-16">
          <motion.p style={{ x: x1 }} className="whitespace-nowrap font-display text-[24vw] uppercase leading-[0.8] md:text-[15vw]">
            The statement
          </motion.p>
          <motion.p style={{ x: x2 }} className="whitespace-nowrap pl-[20vw] font-display text-[24vw] italic leading-[0.8] text-peach md:text-[15vw]">
            — bold, always.
          </motion.p>
          <div className="mt-10 grid gap-6 px-5 md:grid-cols-12 md:px-10">
            <p className="label md:col-span-3">Look II</p>
            <div className="md:col-span-4 md:col-start-9">
              <Features light items={["Bold makeup", "Luxury styling", "Confident finish"]} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
// helper to detect reduced motion via range function
function reduce(r: (a: number, b: number) => number[]) {
  const t = r(0, 1);
  return t[0] === t[1];
}

function Bridal() {
  const { ref, p, r } = useSectionScroll();
  const yL = useTransform(p, [0, 1], r(160, -100));
  const yR = useTransform(p, [0, 1], r(240, -160));
  const textY = useTransform(p, [0, 1], r(-60, 80));
  return (
    <div ref={ref} className="relative mx-auto max-w-[1600px] px-5 md:px-10">
      <motion.div style={{ y: textY }} className="relative z-10 text-center">
        <p className="label text-rose-deep">Look III</p>
        <RevealLines as="h3" className="mt-4 font-display text-[15vw] uppercase leading-[0.82] md:text-[8vw]" lines={[<>The <em className="text-rose-deep">bridal</em></>, "edit"]} />
      </motion.div>
      <div className="relative mt-10 grid grid-cols-12 items-start gap-3 md:-mt-10 md:gap-6">
        <motion.div style={{ y: yL }} className="col-span-4 mt-24 md:col-span-3 md:col-start-1">
          <div className="aspect-[3/4.4] overflow-hidden rounded-t-full">
            <img src={px(IMG.bride3, 600, 880)} alt="Bridal jewellery detail" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </motion.div>
        <div className="col-span-4 md:col-span-5 md:col-start-4">
          <ParallaxImage src={px(IMG.bride1, 900, 1300)} alt="The Bridal Edit look" className="aspect-[3/4.4] rounded-t-full" speed={50} scale={[1.3, 1]} />
        </div>
        <motion.div style={{ y: yR }} className="col-span-4 mt-40 md:col-span-3 md:col-start-10">
          <div className="aspect-[3/4.4] overflow-hidden rounded-t-full">
            <img src={px(IMG.bride4, 600, 880)} alt="Bride with mehndi" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </motion.div>
      </div>
      <div className="mx-auto mt-16 max-w-md text-center md:mt-10">
        <Features items={["Timeless makeup", "Elegant hair", "Complete bridal styling"]} />
        <FadeUp>
          <a href="#book" className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-1 label">
            Plan your bridal trial →
          </a>
        </FadeUp>
      </div>
    </div>
  );
}

export default function Signature() {
  return (
    <section className="relative py-24 md:py-36" aria-labelledby="sig-title">
      <div className="mx-auto mb-16 max-w-[1600px] px-5 md:mb-24 md:px-10">
        <SectionLabel index="07">Signature Looks</SectionLabel>
        <h2 id="sig-title" className="sr-only">Signature Looks</h2>
      </div>
      <div className="flex flex-col gap-32 md:gap-48">
        <SoftGlow />
        <Statement />
        <Bridal />
      </div>
    </section>
  );
}
