"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  MotionValue,
} from "framer-motion";

const panels = [
  {
    number: "01",
    word: "BUILD",
    sub: "Robots & AV Systems",
    desc: "We design and engineer complete systems from scratch — PCBs, mechanical assemblies, firmware, and AV integration.",
    accent: "#C9996B",
  },
  {
    number: "02",
    word: "COMPETE",
    sub: "State & National Stage",
    desc: "We take our innovations to competitions across the country, testing against the best student engineering teams.",
    accent: "#5C766D",
  },
  {
    number: "03",
    word: "LEARN",
    sub: "Real Skills, Real Projects",
    desc: "Every build is a classroom — hardware, code, design thinking, and collaboration under real-world pressure.",
    accent: "#EDE9E6",
  },
  {
    number: "04",
    word: "INSPIRE",
    sub: "The Next Engineers",
    desc: "We mentor younger members and welcome curious minds into our lab — planting seeds for the next generation.",
    accent: "#C9996B",
  },
];

const N = panels.length;
const SCROLL_END = 0.75; // horizontal scroll completes at 75%, rest is dwell time on last panel

/* ── Individual panel — owns its scroll-driven entrance animation ── */
function Panel({
  panel,
  index,
  scrollYProgress,
}: {
  panel: (typeof panels)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const enter = (index / (N - 1)) * SCROLL_END;
  const opacity = useTransform(
    scrollYProgress,
    [enter - 0.14, enter - 0.04, enter + 0.2],
    [0, 1, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [enter - 0.14, enter - 0.04],
    [40, 0]
  );
  const lineW = useTransform(
    scrollYProgress,
    [enter - 0.08, enter + 0.08],
    ["0%", "100%"]
  );

  return (
    <div
      className="flex-shrink-0 w-screen h-screen flex flex-col justify-center px-10 sm:px-20 lg:px-32 relative"
      style={{
        borderRight: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,153,107,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,153,107,0.025) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Panel number */}
      <motion.span
        style={{ opacity, color: "rgba(154,128,112,0.45)" }}
        className="font-mono text-xs tracking-[0.4em] uppercase mb-8 block"
        aria-hidden
      >
        <span style={{ color: "rgba(154,128,112,0.5)" }}>
          {panel.number} &mdash; {String(N).padStart(2, "0")}
        </span>
      </motion.span>

      {/* Big word */}
      <div style={{ overflow: "hidden" }}>
        <motion.h2
          style={{ opacity, y, color: panel.accent, letterSpacing: "-0.04em" }}
          className="font-display font-black leading-none block"
          aria-label={panel.word}
        >
          <span
            style={{
              display: "block",
              fontSize: "clamp(5rem, 16vw, 14rem)",
              letterSpacing: "-0.04em",
              color: panel.accent,
            }}
          >
            {panel.word}
          </span>
        </motion.h2>
      </div>

      {/* Sub-label */}
      <motion.p
        style={{ opacity }}
        className="font-mono text-sm tracking-widest uppercase mt-4 mb-6"
        transition={{ delay: 0.1 }}
      >
        <span style={{ color: panel.accent, opacity: 0.7 }}>{panel.sub}</span>
      </motion.p>

      {/* Description */}
      <motion.p
        style={{ opacity, y, color: "#9A8070" }}
        className="font-body text-base md:text-lg leading-relaxed max-w-md"
      >
        <span style={{ color: "#9A8070" }}>{panel.desc}</span>
      </motion.p>

      {/* Decorative line */}
      <div
        className="mt-10 h-px overflow-hidden"
        style={{ width: "8rem", background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="h-full"
          style={{ width: lineW, background: panel.accent }}
        />
      </div>
    </div>
  );
}

export default function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* translate X: 0vw → -(N-1)*100vw — finishes early to give last panel dwell time */
  const x = useTransform(
    scrollYProgress,
    [0, SCROLL_END],
    ["0vw", `${-(N - 1) * 100}vw`]
  );

  /* Progress dots opacity + scale */
  const dotProgress = (i: number) =>
    useTransform(
      scrollYProgress,
      [(i / N) * SCROLL_END - 0.06, (i / N) * SCROLL_END + 0.06],
      [0.25, 1]
    );

  return (
    <section
      ref={containerRef}
      style={{ height: `${(N + 1) * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="absolute top-8 left-10 sm:left-20 z-10 flex items-center gap-3"
        >
          <span className="h-px w-8" style={{ background: "#C9996B" }} />
          <span
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: "#C9996B", fontFamily: "var(--font-mono)" }}
          >
            What we do
          </span>
        </motion.div>

        {/* Horizontal track */}
        <motion.div style={{ x }} className="flex h-full will-change-transform">
          {panels.map((panel, i) => (
            <Panel
              key={i}
              panel={panel}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Bottom progress dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {panels.map((p, i) => (
            <motion.div
              key={i}
              style={{ opacity: dotProgress(i), scale: dotProgress(i) }}
              className="rounded-full"
              aria-hidden
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: p.accent,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Scroll hint — fades out as you scroll */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]),
          }}
          className="absolute bottom-10 right-10 sm:right-20 flex items-center gap-2 z-10"
        >
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "rgba(154,128,112,0.5)" }}
          >
            Scroll
          </span>
          <motion.div
            className="w-8 h-px"
            style={{ background: "rgba(154,128,112,0.4)" }}
            animate={{ scaleX: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
