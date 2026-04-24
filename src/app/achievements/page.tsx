"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  animate,
} from "framer-motion";
import achievementsData from "@/data/achievements.json";
import Footer from "@/components/layout/Footer";
import { AlternatingTitle } from "@/components/ui/AlternatingTitle";

type TimelineEntry = (typeof achievementsData.timeline)[number];

/* ─── Animated number counter ─── */
function AnimatedCounter({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numStr = raw.replace(/[^0-9.]/g, "");
    const suffix = raw.replace(/[0-9.]/g, ""); // e.g. "+" or "x"
    const num = parseFloat(numStr);
    const isFloat = numStr.includes(".");

    const ctrl = animate(0, num, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) =>
        setDisplay(`${isFloat ? v.toFixed(1) : Math.round(v)}${suffix}`),
    });
    return () => ctrl.stop();
  }, [inView, raw]);

  return <span ref={ref}>{display}</span>;
}

/* ─── Glowing center dot for timeline ─── */
function TimelineDot({ color = "#C9996B" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: color, opacity: 0.25 }}
          animate={inView ? { scale: [1, 2.4, 1], opacity: [0.25, 0, 0.25] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <div
          className="w-4 h-4 rounded-full border-2 relative z-10"
          style={{ borderColor: color, background: "#1C1714" }}
        />
      </motion.div>
    </div>
  );
}

const accentColor: Record<string, string> = {
  Competition: "#C9996B",
  AV: "#5C766D",
  Innovation: "#EDE9E6",
  Recognition: "#C9996B",
  Milestone: "#5C766D",
};

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const isLeft = index % 2 === 0;
  const color = accentColor[entry.category] ?? "#C9996B";

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass rounded-2xl p-6 border border-white/5 transition-all duration-300 group"
      style={{
        "--hover-border": `${color}30`,
        borderColor: "rgba(255,255,255,0.05)",
      } as React.CSSProperties}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = `${color}30`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")
      }
    >
      {/* Top accent line */}
      <motion.div
        className="h-px mb-4 origin-left"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      />

      <div className="flex items-start justify-between mb-3">
        <span
          className="font-mono text-xs tracking-wider uppercase px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: `${color}30`, background: `${color}10` }}
        >
          {entry.category}
        </span>
        <span className="font-mono text-xs text-text-muted">{entry.year}</span>
      </div>

      <h3 className="font-display font-bold text-lg mb-2 group-hover:text-accent-cyan transition-colors duration-300">
        {entry.title}
      </h3>
      <p className="font-body text-sm text-text-muted leading-relaxed mb-3">
        {entry.description}
      </p>
      <span
        className="font-mono text-xs uppercase tracking-widest"
        style={{ color, opacity: 0.7 }}
      >
        {entry.badge}
      </span>
    </motion.div>
  );

  return (
    <div className="relative pl-10 md:pl-0 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 md:items-center">
      {/* Left slot */}
      <div className="hidden md:block">{isLeft ? cardContent : null}</div>

      {/* Centre dot */}
      <div className="absolute left-0 top-8 md:static">
        <TimelineDot color={accentColor[entry.category]} />
      </div>

      {/* Right slot */}
      <div className="md:hidden">{cardContent}</div>
      <div className="hidden md:block">{!isLeft ? cardContent : null}</div>
    </div>
  );
}

export default function AchievementsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const spineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const { meta, stats, timeline } = achievementsData;

  return (
    <div>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex items-center justify-center overflow-hidden grid-bg pt-24"
      >
        {/* Ghost "LEGACY" */}
        <motion.div
          style={{ y: ghostY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-black leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(4rem, 17vw, 26rem)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(192,225,210,0.35)",
              letterSpacing: "-0.04em",
            }}
          >
            DOMINANCE
          </span>
        </motion.div>

        {/* Decorative arcs */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {[200, 320, 440].map((r, i) => (
            <motion.circle
              key={r}
              cx="50%"
              cy="50%"
              r={r}
              fill="none"
              stroke="rgba(192,225,210,0.3)"
              strokeWidth="1"
              strokeDasharray="6 20"
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 60 + i * 15,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformOrigin: "50% 50%" }}
            />
          ))}
        </motion.svg>

        {/* Content */}
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
            <span className="h-px w-12" style={{ background: "rgba(92,118,109,0.5)" }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#5C766D" }}>
              Our Record
            </span>
            <span className="h-px w-12" style={{ background: "rgba(92,118,109,0.5)" }} />
          </motion.div>

          {/* Alternating slide heading */}
          <AlternatingTitle text={meta.heading} />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-body text-text-muted max-w-lg mx-auto"
          >
            {meta.subheading}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Animated Stats ── */}
      <section className="border-y border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center group"
            >
              <div
                className="font-display font-black text-4xl md:text-5xl mb-2"
                style={{ color: "#C9996B", letterSpacing: "-0.04em" }}
              >
                <AnimatedCounter raw={stat.value} />
              </div>
              <div className="font-mono text-xs text-text-muted tracking-widest uppercase">
                {stat.label}
              </div>
              {/* Growing underline on hover */}
              <div className="mt-3 h-px overflow-hidden mx-auto" style={{ width: "40px" }}>
                <motion.div
                  className="h-full origin-left"
                  style={{ background: "#C9996B" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section-padding px-6 relative">
        {/* Animated spine */}
        <div className="absolute left-12 md:left-1/2 top-0 bottom-0 w-px overflow-hidden pointer-events-none">
          <motion.div
            className="w-full h-full origin-top"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(201,153,107,0.25) 20%, rgba(201,153,107,0.25) 80%, transparent)",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>

        <div className="max-w-5xl mx-auto flex flex-col gap-14">
          {timeline.map((entry, i) => (
            <TimelineCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
