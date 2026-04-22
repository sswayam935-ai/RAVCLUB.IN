"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { AlternatingTitle } from "@/components/ui/AlternatingTitle";
import contactData from "@/data/contact.json";
import s from "./SocialCard.module.css";

/* ── Types ── */
type CardLink = { href: string; label: string; hoverTitle?: string };
type Card     = typeof contactData.socialCards[0];

/* ── Icons ── */
const InstagramIcon = () => (
  <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} fill="none"
    stroke="currentColor" viewBox="0 0 24 24" className={s.btnIcon}>
    <rect ry={5} rx={5} y={2} x={2} height={20} width={20} />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line y2="6.5" y1="6.5" x2="17.51" x1="17.5" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={s.btnIcon}>
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg strokeLinejoin="round" strokeLinecap="round" strokeWidth={2}
    stroke="currentColor" fill="none" viewBox="0 0 24 24" className={s.btnIcon}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width={4} height={12} x={2} y={9} />
    <circle cx={4} cy={4} r={2} />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const SpinnerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" style={{ width: 18, height: 18, animation: "spin 0.8s linear infinite" }}>
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

const btnIcons = [<InstagramIcon key="ig" />, <XIcon key="x" />, <LinkedInIcon key="li" />];

/* ── SocialCard ── */
function SocialCard({ card, index }: { card: Card; index: number }) {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const isMiddle = card.isMiddle ?? false;
  const displayTitle = isMiddle ? (hoveredTitle ?? "") : card.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`${s.card} ${!isMiddle ? s.noHover : ""}`}
        style={{ "--c": card.color, "--cd": card.darkColor, "--cg": card.glowColor } as React.CSSProperties}
      >
        <div className={s.boxshadow} />
        <div className={s.main}>
          <div className={s.top} />
          <div className={`${s.left} ${s.side}`} />
          <div className={`${s.right} ${s.side}`} />
          <div
            className={s.title}
            style={{ opacity: isMiddle && hoveredTitle ? 1 : isMiddle ? 0 : undefined }}
          >
            {displayTitle}
          </div>
          <div className={s.buttonContainer}>
            {(card.links as CardLink[]).map((link, i) => (
              <button
                key={i}
                className={s.btn}
                onClick={() => window.open(link.href, "_blank")}
                aria-label={link.label}
                style={{ color: card.color }}
                onMouseEnter={() => isMiddle && setHoveredTitle(link.hoverTitle ?? link.label)}
                onMouseLeave={() => isMiddle && setHoveredTitle(null)}
              >
                {btnIcons[i]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Form state type ── */
type Status = "idle" | "loading" | "success" | "error";

/* ── Contact Page ── */
export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax   = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const ghostY      = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const ghostRot    = useTransform(scrollYProgress, [0, 1], ["-3deg", "3deg"]);

  /* Form state */
  const [status, setStatus]       = useState<Status>("idle");
  const [formData, setFormData]   = useState({
    name: "", email: "", department: "", message: "",
  });

  const { form, hero, infoItems, socialCards } = contactData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    try {
      const scriptUrl = contactData.googleScriptUrl;
      if (!scriptUrl || scriptUrl === "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
        // Dev fallback — log to console, simulate success
        console.table({ ...formData, timestamp: new Date().toISOString() });
        await new Promise((r) => setTimeout(r, 800));
        setStatus("success");
        setFormData({ name: "", email: "", department: "", message: "" });
        return;
      }

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // Apps Script requires no-cors
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, timestamp: new Date().toISOString() }),
      });

      setStatus("success");
      setFormData({ name: "", email: "", department: "", message: "" });
    } catch {
      setStatus("error");
    }

    // Reset status after 4 s
    setTimeout(() => setStatus("idle"), 4000);
  };

  const inputBase: React.CSSProperties = {
    background: "#F6F4E8",
    border: "1px solid rgba(26,35,32,0.1)",
    color: "#1A2320",
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div>

        {/* ── Hero ── */}
        <section
          ref={heroRef}
          className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-24"
        >
          <motion.div
            style={{ y: ghostY, rotate: ghostRot }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          >
            <span
              className="font-black leading-none whitespace-nowrap"
              style={{
                fontSize: "clamp(5rem, 20vw, 24rem)",
                color: "transparent",
                WebkitTextStroke: "1px rgba(192,225,210,0.35)",
                letterSpacing: "-0.04em",
              }}
            >
              CONNECT
            </span>
          </motion.div>

          <motion.div
            style={{ y: yParallax, opacity: opacityHero }}
            className="text-center px-6 z-10 relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <span className="h-px w-12" style={{ background: "rgba(192,225,210,0.5)" }} />
              <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#C0E1D2" }}>
                {hero.eyebrow}
              </span>
              <span className="h-px w-12" style={{ background: "rgba(192,225,210,0.5)" }} />
            </motion.div>

            <AlternatingTitle text={hero.heading} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-body text-text-muted max-w-md mx-auto"
            >
              {hero.subheading}
            </motion.p>
          </motion.div>
        </section>

        {/* ── Social Cards ── */}
        <section className="section-padding px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-14"
            >
              <span className="h-px w-8" style={{ background: "rgba(192,225,210,0.5)" }} />
              <span className="font-mono text-xs tracking-[0.28em] uppercase" style={{ color: "#C0E1D2" }}>
                Find Us Online
              </span>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-10 lg:gap-16">
              {socialCards.map((card, i) => (
                <SocialCard key={i} card={card} index={i} />
              ))}
            </div>

            <p className="text-center font-mono text-xs mt-10"
              style={{ color: "rgba(26,35,32,0.3)", letterSpacing: "0.12em" }}>
              HOVER MIDDLE CARD TO REVEAL
            </p>
          </div>
        </section>

        {/* ── Contact Info + Join Form ── */}
        <section className="section-padding px-6" style={{ borderTop: "1px solid rgba(26,35,32,0.07)" }}>
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

            {/* Left — info */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="font-display font-black mb-3 leading-none"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em", color: "#1A2320" }}
                >
                  Get In{" "}
                  <span style={{
                    background: "linear-gradient(135deg,#5FA58F,#1A2320)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Touch
                  </span>
                </h2>
                <p className="font-body mb-10" style={{ color: "#6E837D", maxWidth: "36ch", lineHeight: 1.7 }}>
                  Whether you want to join, collaborate, or just follow along — we&apos;d love to hear from you.
                </p>

                <div className="flex flex-col gap-5">
                  {infoItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ background: "#EDF0EC", border: "1px solid rgba(26,35,32,0.06)" }}
                    >
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-lg flex-shrink-0"
                        style={{ background: `${item.color}22`, color: item.color }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-0.5"
                          style={{ color: item.color }}>
                          {item.label}
                        </div>
                        <div className="font-body text-sm font-medium" style={{ color: "#1A2320" }}>
                          {item.value}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — join form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-3xl p-8" style={{ background: "#EDF0EC", border: "1px solid rgba(26,35,32,0.07)" }}>
                {/* Form header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-6" style={{ background: "rgba(192,225,210,0.6)" }} />
                  <span className="font-mono text-xs tracking-[0.28em] uppercase" style={{ color: "#C0E1D2" }}>
                    {form.heading}
                  </span>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                  {/* Name */}
                  <div>
                    <label className="block font-mono text-[0.62rem] tracking-widest uppercase mb-1.5"
                      style={{ color: "#6E837D" }}>
                      {form.fields.name.label}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={form.fields.name.placeholder}
                      required
                      className="w-full rounded-xl px-4 py-3 font-body text-sm outline-none transition-all duration-200"
                      style={inputBase}
                      onFocus={(e) => (e.target.style.borderColor = "#C0E1D2")}
                      onBlur={(e)  => (e.target.style.borderColor = "rgba(26,35,32,0.1)")}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-mono text-[0.62rem] tracking-widest uppercase mb-1.5"
                      style={{ color: "#6E837D" }}>
                      {form.fields.email.label}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={form.fields.email.placeholder}
                      required
                      className="w-full rounded-xl px-4 py-3 font-body text-sm outline-none transition-all duration-200"
                      style={inputBase}
                      onFocus={(e) => (e.target.style.borderColor = "#C0E1D2")}
                      onBlur={(e)  => (e.target.style.borderColor = "rgba(26,35,32,0.1)")}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block font-mono text-[0.62rem] tracking-widest uppercase mb-1.5"
                      style={{ color: "#6E837D" }}>
                      {form.fields.department.label}
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 font-body text-sm outline-none transition-all duration-200"
                      style={{ ...inputBase, appearance: "none" } as React.CSSProperties}
                      onFocus={(e) => (e.target.style.borderColor = "#C0E1D2")}
                      onBlur={(e)  => (e.target.style.borderColor = "rgba(26,35,32,0.1)")}
                    >
                      <option value="">{form.fields.department.placeholder}</option>
                      {form.fields.department.options.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-mono text-[0.62rem] tracking-widest uppercase mb-1.5"
                      style={{ color: "#6E837D" }}>
                      {form.fields.message.label}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder={form.fields.message.placeholder}
                      required
                      className="w-full rounded-xl px-4 py-3 font-body text-sm outline-none resize-none transition-all duration-200"
                      style={inputBase}
                      onFocus={(e) => (e.target.style.borderColor = "#C0E1D2")}
                      onBlur={(e)  => (e.target.style.borderColor = "rgba(26,35,32,0.1)")}
                    />
                  </div>

                  {/* Submit button */}
                  <motion.button
                    whileHover={status === "idle" ? { scale: 1.02 } : {}}
                    whileTap={status === "idle" ? { scale: 0.97 } : {}}
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase font-bold mt-1 transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background:
                        status === "success" ? "#7BB5A0"
                        : status === "error"  ? "#DC9B9B"
                        : "#C0E1D2",
                      color: "#1A2320",
                      boxShadow: "0 4px 20px rgba(192,225,210,0.3)",
                      cursor: status === "loading" || status === "success" ? "not-allowed" : "pointer",
                      opacity: status === "loading" ? 0.8 : 1,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {status === "loading" && (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-2">
                          <SpinnerIcon /> Sending…
                        </motion.span>
                      )}
                      {status === "success" && (
                        <motion.span key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-2">
                          <CheckIcon /> {form.successMessage}
                        </motion.span>
                      )}
                      {status === "error" && (
                        <motion.span key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {form.errorMessage}
                        </motion.span>
                      )}
                      {status === "idle" && (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {form.submitLabel}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                </form>
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </>
  );
}
