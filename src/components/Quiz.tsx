import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { IMG, px } from "../data/images";
import { cn } from "../utils/cn";
import { EASE, Magnetic, RevealLines, SectionLabel } from "./ui/motion";

const MOODS = [
  { key: "SOFT", word: "Soft", hint: "Airy, natural, barely-there", color: "#efc3a6", img: IMG.whiteDress, skin: "Luxury Facial", vibe: "quiet confidence and skin that looks like you, only rested" },
  { key: "BOLD", word: "Bold", hint: "Graphic, sculpted, dramatic", color: "#a46a63", img: IMG.lipstick, skin: "Brow Sculpt & Tint", vibe: "presence — the look people remember long after you leave" },
  { key: "GLOW", word: "Golden", hint: "Dewy, lit-from-within", color: "#d7c09a", img: IMG.feathers, skin: "Hydra Glow Facial", vibe: "radiance — luminous skin that catches every light" },
  { key: "CLASSIC", word: "Classic", hint: "Timeless, polished, refined", color: "#c48d86", img: IMG.lipstickBW, skin: "Signature Cleanup Ritual", vibe: "elegance — polished, timeless, impossible to date" },
] as const;

const OCCASIONS = [
  { key: "EVERYDAY", word: "Glow", hint: "Coffee, work, weekends", makeup: "Soft Glam Makeup", hair: "Signature Hair Styling" },
  { key: "DATE NIGHT", word: "Velvet", hint: "Candlelight & conversation", makeup: "Smoky Evening Makeup", hair: "Glossy Blow-out" },
  { key: "EVENT", word: "Statement", hint: "Parties, galas, shoots", makeup: "HD Party Makeup", hair: "Hollywood Waves" },
  { key: "BRIDAL", word: "Bride", hint: "Your day, your aura", makeup: "HD Bridal Makeup", hair: "Bridal Hair Sculpting" },
] as const;

type Mood = (typeof MOODS)[number];
type Occ = (typeof OCCASIONS)[number];

function Option({ label, hint, i, onClick, selected }: { label: string; hint: string; i: number; onClick: () => void; selected: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.08 }}
      className={cn(
        "group relative flex w-full items-center justify-between overflow-hidden border-b border-ink/20 py-4 text-left md:py-5",
        selected && "text-ivory"
      )}
    >
      <span className={cn("absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[var(--ease-cine)] group-hover:scale-y-100", selected && "scale-y-100")} />
      <span className="relative flex items-baseline gap-4 pl-2 md:gap-8 md:pl-4">
        <span className="label opacity-50">0{i + 1}</span>
        <span className="font-display text-[12vw] uppercase leading-none transition-colors duration-500 group-hover:text-ivory md:text-[5.5vw] min-[1700px]:text-[6rem]">
          {label}
        </span>
      </span>
      <span className="relative hidden pr-4 font-display text-xl italic opacity-70 transition-colors duration-500 group-hover:text-ivory md:block">{hint}</span>
      <span className="relative pr-3 text-xl transition-all duration-500 group-hover:translate-x-1 group-hover:text-ivory md:hidden">→</span>
    </motion.button>
  );
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [occ, setOcc] = useState<Occ | null>(null);
  const reduce = useReducedMotion();

  const restart = () => {
    setStep(0);
    setMood(null);
    setOcc(null);
  };

  const recs = mood && occ ? [mood.skin, occ.makeup, occ.hair] : [];
  const auraName = mood && occ ? `${mood.word} ${occ.word}` : "";

  const bookLook = () => {
    window.dispatchEvent(new CustomEvent("aura:book", { detail: { aura: auraName, recs } }));
    document.getElementById("book")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="quiz" className="relative overflow-hidden bg-[#f1dccd] py-24 md:py-36">
      {/* drifting aura orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[60vw] w-[60vw] rounded-full blur-3xl md:h-[40vw] md:w-[40vw]"
        animate={{ backgroundColor: mood ? mood.color : "#efc3a6", x: reduce ? 0 : [0, 60, 0], y: reduce ? 0 : [0, 40, 0] }}
        transition={{ backgroundColor: { duration: 1.2 }, x: { duration: 16, repeat: Infinity, ease: "easeInOut" }, y: { duration: 12, repeat: Infinity, ease: "easeInOut" } }}
        style={{ opacity: 0.5 }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="06">Interactive / Aura Finder</SectionLabel>
            <RevealLines
              as="h2"
              className="mt-8 font-display text-[15vw] uppercase leading-[0.82] md:text-[9vw] min-[1700px]:text-[10rem]"
              lines={["What's your", <em className="text-rose-deep">aura?</em>]}
            />
          </div>
          {/* progress */}
          <div className="flex items-center gap-3" aria-label={`Step ${Math.min(step + 1, 3)} of 3`}>
            {[0, 1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className={cn("label transition-colors duration-500", step >= s ? "text-ink" : "text-ink/30")}>0{s + 1}</span>
                {s < 2 && (
                  <span className="relative h-px w-10 bg-ink/20 md:w-16">
                    <motion.span className="absolute inset-y-0 left-0 bg-ink" animate={{ width: step > s ? "100%" : "0%" }} transition={{ duration: 0.8, ease: EASE }} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-14 min-h-[560px] md:mt-20">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="mood" exit={{ opacity: 0, x: -80, filter: "blur(8px)" }} transition={{ duration: 0.6, ease: EASE }}>
                <p className="mb-6 font-display text-3xl italic md:text-4xl">Choose your mood:</p>
                {MOODS.map((m, i) => (
                  <Option
                    key={m.key}
                    label={m.key}
                    hint={m.hint}
                    i={i}
                    selected={mood?.key === m.key}
                    onClick={() => {
                      setMood(m);
                      setTimeout(() => setStep(1), 350);
                    }}
                  />
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="occ"
                initial={{ opacity: 0, x: 80, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -80, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <div className="mb-6 flex items-baseline justify-between">
                  <p className="font-display text-3xl italic md:text-4xl">Choose your occasion:</p>
                  <button onClick={() => setStep(0)} className="label text-ink-soft underline-offset-4 hover:underline">
                    ← Back
                  </button>
                </div>
                {OCCASIONS.map((o, i) => (
                  <Option
                    key={o.key}
                    label={o.key}
                    hint={o.hint}
                    i={i}
                    selected={occ?.key === o.key}
                    onClick={() => {
                      setOcc(o);
                      setTimeout(() => setStep(2), 350);
                    }}
                  />
                ))}
              </motion.div>
            )}

            {step === 2 && mood && occ && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="grid items-center gap-10 md:grid-cols-12 md:gap-16"
              >
                {/* aura visual */}
                <div className="relative mx-auto w-full max-w-[460px] md:col-span-5">
                  <motion.div
                    className="absolute inset-[-12%] rounded-full blur-2xl"
                    style={{ backgroundColor: mood.color }}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: reduce ? 1 : [1, 1.08, 1], opacity: 0.75 }}
                    transition={{ scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1.2 } }}
                  />
                  <motion.div
                    initial={{ clipPath: "circle(0% at 50% 50%)" }}
                    animate={{ clipPath: "circle(50% at 50% 50%)" }}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
                    className="relative aspect-square overflow-hidden rounded-full"
                  >
                    <motion.img
                      src={px(mood.img, 800, 800)}
                      alt={`${auraName} inspiration`}
                      initial={{ scale: 1.4 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 2, ease: EASE }}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                  <motion.svg viewBox="0 0 200 200" className="absolute inset-[-6%] h-[112%] w-[112%] text-ink/40" animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} aria-hidden>
                    <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="2 4" />
                  </motion.svg>
                </div>

                <div className="md:col-span-7">
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: EASE }} className="label text-ink-soft">
                    Your aura
                  </motion.p>
                  <h3 className="mt-4 font-display text-[16vw] uppercase leading-[0.82] md:text-[7.5vw] min-[1700px]:text-[8rem]">
                    {auraName.split(" ").map((w, i) => (
                      <span key={w} className="block overflow-hidden">
                        <motion.span
                          className={cn("block", i === 1 && "italic text-rose-deep")}
                          initial={{ y: "110%" }}
                          animate={{ y: 0 }}
                          transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.12 }}
                        >
                          {w}
                        </motion.span>
                      </span>
                    ))}
                  </h3>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }} className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
                    Your aura is all about {mood.vibe}. Here's the ritual we'd build for your {occ.key.toLowerCase()} moment.
                  </motion.p>

                  <p className="mt-8 label">Recommended</p>
                  <ul className="mt-3 border-t border-ink/20">
                    {recs.map((r, i) => (
                      <motion.li
                        key={r}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 1 + i * 0.12 }}
                        className="flex items-baseline justify-between border-b border-ink/20 py-3"
                      >
                        <span className="font-display text-2xl md:text-3xl">{r}</span>
                        <span className="label text-ink-soft">0{i + 1}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8, ease: EASE }} className="mt-10 flex flex-wrap items-center gap-6">
                    <Magnetic>
                      <button onClick={bookLook} className="group flex items-center gap-4 rounded-full bg-ink py-4 pl-7 pr-4 text-ivory">
                        <span className="label">Book this look</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-peach text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
                      </button>
                    </Magnetic>
                    <button onClick={restart} className="label text-ink-soft underline underline-offset-4">
                      Retake quiz ↺
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
