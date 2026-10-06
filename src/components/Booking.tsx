import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { IMG, px } from "../data/images";
import { EASE, Magnetic, ParallaxImage, RevealLines, SectionLabel } from "./ui/motion";

const SERVICES = ["Hair", "Makeup", "Skin", "Nails", "Bridal", "Transformations", "Aura Look (from quiz)"];
const TIMES = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];
const WA = "919999999999";

function Field({ label, n, children }: { label: string; n: string; children: React.ReactNode }) {
  return (
    <label className="group relative block border-b border-ink/25 pb-3 pt-6 transition-colors focus-within:border-ink">
      <span className="flex items-baseline gap-3 label text-ink-soft">
        <span className="text-rose-deep">{n}</span>
        {label}
      </span>
      {children}
      <span className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-[var(--ease-cine)] group-focus-within:scale-x-100" />
    </label>
  );
}

const inputCls = "mt-2 min-w-0 w-full max-w-full bg-transparent font-display text-[clamp(1.6rem,8vw,2.25rem)] outline-none placeholder:text-ink/25 md:text-4xl";

export default function Booking() {
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "" });
  const [note, setNote] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ aura: string; recs: string[] }>).detail;
      setForm((f) => ({ ...f, service: "Aura Look (from quiz)" }));
      setNote(`${d.aura} — ${d.recs.join(", ")}`);
    };
    window.addEventListener("aura:book", on);
    return () => window.removeEventListener("aura:book", on);
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.phone.replace(/\D/g, "").length < 10 || !form.service) {
      setErr("Please add your name, a 10-digit phone number and a service.");
      return;
    }
    setErr("");
    setDone(true);
  };

  const waText = encodeURIComponent(
    `Hi Demo Aura! I'd like to book${form.service ? ` ${form.service}` : " an appointment"}${note ? ` (${note})` : ""}${form.date ? ` on ${form.date}` : ""}${form.time ? ` at ${form.time}` : ""}.${form.name ? ` — ${form.name}` : ""}`
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="book" className="relative py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <SectionLabel index="09">Reservations</SectionLabel>
          <RevealLines
            as="h2"
            className="mt-8 font-display text-[15vw] uppercase leading-[0.84] md:text-[7vw] min-[1700px]:text-[7.5rem]"
            lines={["Let's create", <em className="text-rose-deep">your look.</em>]}
          />
          <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Tell us a little about you. A studio host will confirm your slot within the hour — or message us instantly on WhatsApp.
          </p>
          <div className="relative mt-12 hidden md:block">
            <ParallaxImage src={px(IMG.interior1, 900, 700)} alt="Inside Demo Aura studio" className="aspect-[4/3] w-[80%] rounded-tl-[120px]" speed={40} />
            <div className="mt-4 flex gap-10 label text-ink-soft">
              <span>Tue — Sun</span>
              <span>10am — 8pm</span>
              <span>Indiranagar, BLR</span>
            </div>
          </div>
        </div>

        <div className="relative md:col-span-6 md:col-start-7">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.form
                key="form"
                onSubmit={submit}
                exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative"
                noValidate
              >
                {note && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-start justify-between gap-4 rounded-full bg-peach/60 px-5 py-3">
                    <span className="text-sm">
                      <span className="label">Your aura · </span>
                      {note}
                    </span>
                    <button type="button" onClick={() => setNote(null)} aria-label="Remove aura look" className="text-sm">
                      ✕
                    </button>
                  </motion.div>
                )}
                <Field label="Name" n="01">
                  <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" />
                </Field>
                <Field label="Phone" n="02">
                  <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" inputMode="tel" autoComplete="tel" />
                </Field>
                <Field label="Service" n="03">
                  <select className={`${inputCls} appearance-none cursor-pointer ${form.service ? "" : "text-ink/25"}`} value={form.service} onChange={set("service")}>
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="text-base text-ink">
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-1 gap-x-6 min-[460px]:grid-cols-2">
                  <Field label="Date" n="04">
                    <input type="date" min={today} className={`${inputCls} text-xl min-[390px]:text-2xl md:text-3xl`} value={form.date} onChange={set("date")} />
                  </Field>
                  <Field label="Time" n="05">
                    <select className={`${inputCls} cursor-pointer appearance-none text-xl min-[390px]:text-2xl md:text-3xl ${form.time ? "" : "text-ink/25"}`} value={form.time} onChange={set("time")}>
                      <option value="" disabled>
                        --:--
                      </option>
                      {TIMES.map((t) => (
                        <option key={t} value={t} className="text-base text-ink">
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {err && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-rose-deep" role="alert">
                    {err}
                  </motion.p>
                )}

                <div className="mt-12 flex flex-col-reverse flex-wrap items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={`https://wa.me/${WA}?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-3 rounded-full border border-ink/25 px-5 py-3 transition-colors hover:border-ink"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.6-.2Z" />
                    </svg>
                    <span className="label">Book via WhatsApp</span>
                  </a>
                  <Magnetic strength={0.4}>
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.94 }}
                      className="group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-ink text-ivory min-[390px]:h-40 min-[390px]:w-40 md:h-48 md:w-48"
                    >
                      <span className="absolute inset-0 origin-bottom scale-0 rounded-full bg-rose-deep transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-100" />
                      <span className="relative text-center font-display text-3xl uppercase leading-[0.95] md:text-4xl">
                        Book
                        <br />
                        <span className="italic">now</span> <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                      </span>
                    </motion.button>
                  </Magnetic>
                </div>
              </motion.form>
            ) : (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex min-h-[520px] flex-col justify-center">
                <motion.svg viewBox="0 0 120 120" className="h-24 w-24 text-rose-deep" aria-hidden>
                  <motion.circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE }} />
                  <motion.path d="M38 62 L54 76 L84 44" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: EASE, delay: 0.9 }} />
                </motion.svg>
                <h3 className="mt-10 font-display text-[14vw] uppercase leading-[0.84] md:text-[6vw]">
                  {["You're on", "the list."].map((l, k) => (
                    <span key={l} className="block overflow-hidden">
                      <motion.span className={`block ${k ? "italic text-rose-deep" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 + k * 0.12 }}>
                        {l}
                      </motion.span>
                    </span>
                  ))}
                </h3>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  Your appointment request has been received, {form.name.split(" ")[0]}. We'll confirm your {form.service.toLowerCase()} slot
                  {form.date ? ` on ${form.date}` : ""} shortly at {form.phone}.
                </motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-10 flex flex-wrap gap-6">
                  <a href={`https://wa.me/${WA}?text=${waText}`} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-6 py-3 label text-ivory">
                    Confirm on WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setDone(false);
                      setForm({ name: "", phone: "", service: "", date: "", time: "" });
                    }}
                    className="label underline underline-offset-4"
                  >
                    Book another
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
