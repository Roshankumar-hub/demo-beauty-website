import { motion } from "framer-motion";
import { Counter, DrawLine, DriftWord, EASE } from "./ui/motion";

const STATS = [
  { to: 8, pad: 2, suffix: "+", unit: "Years", text: "of beauty artistry" },
  { to: 5, pad: 0, suffix: "K+", unit: "Clients", text: "beautiful transformations" },
  { to: 20, pad: 2, suffix: "+", unit: "Services", text: "crafted for you" },
  { to: 15, pad: 2, suffix: "+", unit: "Artists", text: "creative professionals" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-label="Studio in numbers">
      <DriftWord className="font-display text-[16vw] uppercase leading-none text-champagne/40" distance={200} reverse>
        In numbers — in numbers — in numbers
      </DriftWord>
      <div className="mx-auto mt-10 max-w-[1600px] px-5 md:px-10">
        <DrawLine />
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.unit}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.1, ease: EASE, delay: i * 0.12 }}
              className={`relative py-10 md:py-14 ${i % 2 === 1 ? "pl-5 md:pl-8" : "pr-5 md:pr-8"} ${i > 1 ? "md:pl-8" : ""}`}
            >
              {i > 0 && (
                <motion.span
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-px origin-top bg-ink/15 ${i === 2 ? "hidden md:block" : ""}`}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.3 + i * 0.1 }}
                />
              )}
              <p className="label text-rose-deep">0{i + 1}</p>
              <p className="mt-6 font-display text-[19vw] leading-[0.8] tracking-tight md:text-[9vw] min-[1700px]:text-[10rem]">
                <Counter to={s.to} pad={s.pad} suffix={s.suffix} />
              </p>
              <p className="mt-4 label">{s.unit}</p>
              <p className="mt-1 font-display text-xl italic text-ink-soft md:text-2xl">{s.text}</p>
            </motion.div>
          ))}
        </div>
        <DrawLine origin="right" delay={0.3} />
      </div>
    </section>
  );
}
