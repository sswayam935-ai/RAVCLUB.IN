"use client";

import { useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

const panels = [
  {
    number: "01",
    word: "BUILD",
    sub: "Robots & AV Systems",
    desc:
      "We design and engineer complete systems from scratch - PCBs, mechanical assemblies, firmware, and AV integration.",
    accent: "#C9996B",
  },
  {
    number: "02",
    word: "COMPETE",
    sub: "State & National Stage",
    desc:
      "We take our innovations to competitions across the country, testing against the best student engineering teams.",
    accent: "#5C766D",
  },
  {
    number: "03",
    word: "LEARN",
    sub: "Real Skills, Real Projects",
    desc:
      "Every build is a classroom - hardware, code, design thinking, and collaboration under real-world pressure.",
    accent: "#EDE9E6",
  },
  {
    number: "04",
    word: "INSPIRE",
    sub: "The Next Engineers",
    desc:
      "We mentor younger members and welcome curious minds into our lab - planting seeds for the next generation.",
    accent: "#C9996B",
  },
];

const N = panels.length;
const PANEL_WIDTH_VW = 100;
const TRACK_WIDTH_VW = N * PANEL_WIDTH_VW;
const HORIZONTAL_TRAVEL_VW = (N - 1) * PANEL_WIDTH_VW;
const ENTRY_HOLD_VH = 100;
const EXIT_HOLD_VH = 160;
const SECTION_VH = N * 100 + ENTRY_HOLD_VH + EXIT_HOLD_VH;
const STICKY_SCROLL_VH = SECTION_VH - 100;
const TRACK_START = ENTRY_HOLD_VH / STICKY_SCROLL_VH;
const TRACK_END = TRACK_START + HORIZONTAL_TRAVEL_VW / STICKY_SCROLL_VH;

function DesktopPanel({
  panel,
  index,
  scrollYProgress,
}: {
  panel: (typeof panels)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const progressPoint =
    TRACK_START + (index / (N - 1)) * (TRACK_END - TRACK_START);
  const lineW = useTransform(
    scrollYProgress,
    [
      Math.max(TRACK_START, progressPoint - 0.08),
      Math.min(1, progressPoint + 0.08),
    ],
    ["0%", "100%"]
  );

  return (
    <div
      className="flex-shrink-0 h-screen flex flex-col justify-center px-10 sm:px-20 lg:px-32 relative"
      style={{
        width: `${PANEL_WIDTH_VW}vw`,
        borderRight: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span
        className="font-mono text-xs tracking-[0.4em] uppercase mb-8 block"
        style={{ color: "rgba(154,128,112,0.5)" }}
        aria-hidden
      >
        {panel.number} &mdash; {String(N).padStart(2, "0")}
      </span>

      <h2
        className="font-display font-black leading-none block"
        aria-label={panel.word}
        style={{
          color: panel.accent,
          fontSize: "clamp(5rem, 16vw, 14rem)",
          letterSpacing: "-0.04em",
        }}
      >
        {panel.word}
      </h2>

      <p
        className="font-mono text-sm tracking-widest uppercase mt-4 mb-6"
        style={{ color: panel.accent, opacity: 0.7 }}
      >
        {panel.sub}
      </p>

      <p
        className="font-body text-base md:text-lg leading-relaxed max-w-md"
        style={{ color: "#9A8070" }}
      >
        {panel.desc}
      </p>

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

function MobilePanel({
  panel,
  index,
}: {
  panel: (typeof panels)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full min-h-screen flex flex-col justify-center px-6 py-20 md:px-12 relative"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="relative z-10 mb-6">
        <span
          className="font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(154,128,112,0.6)" }}
        >
          {panel.number} &mdash; {String(N).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 mb-4 overflow-hidden">
        <h2
          style={{
            color: panel.accent,
            letterSpacing: "-0.04em",
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
          }}
          className="font-display font-black leading-none"
        >
          {panel.word}
        </h2>
      </div>

      <div className="relative z-10 mb-6">
        <p
          className="font-mono text-sm tracking-widest uppercase"
          style={{ color: panel.accent, opacity: 0.7 }}
        >
          {panel.sub}
        </p>
      </div>

      <div className="relative z-10 mb-8">
        <p
          className="font-body text-base leading-relaxed max-w-md"
          style={{ color: "#9A8070" }}
        >
          {panel.desc}
        </p>
      </div>

      <div
        className="relative z-10 h-px w-20 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div className="h-full w-full" style={{ background: panel.accent }} />
      </div>
    </motion.div>
  );
}

export default function HorizontalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, TRACK_START, TRACK_END],
    ["0vw", "0vw", `-${HORIZONTAL_TRAVEL_VW}vw`]
  );

  const T = TRACK_END;
  const segment = (TRACK_END - TRACK_START) / (N - 1);
  const dot0 = useTransform(
    scrollYProgress,
    [0, TRACK_START + segment / 2],
    [1, 0.25]
  );
  const dot1 = useTransform(
    scrollYProgress,
    [TRACK_START + segment - 0.06, TRACK_START + segment, TRACK_START + segment + 0.06],
    [0.25, 1, 0.25]
  );
  const dot2 = useTransform(
    scrollYProgress,
    [
      TRACK_START + 2 * segment - 0.06,
      TRACK_START + 2 * segment,
      TRACK_START + 2 * segment + 0.06,
    ],
    [0.25, 1, 0.25]
  );
  const dot3 = useTransform(scrollYProgress, [T - 0.06, T, 1], [0.25, 1, 1]);
  const dotMotionValues = [dot0, dot1, dot2, dot3];

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  if (!isLargeScreen) {
    return (
      <section className="relative w-full block lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="sticky top-20 z-10 flex items-center gap-3 px-6 py-4 md:px-12 bg-background/80 backdrop-blur-sm"
        >
          <span className="h-px w-8" style={{ background: "#C9996B" }} />
          <span
            className="font-mono text-xs tracking-[0.3em] uppercase"
            style={{ color: "#C9996B", fontFamily: "var(--font-mono)" }}
          >
            What we do
          </span>
        </motion.div>

        <div className="w-full">
          {panels.map((panel, i) => (
            <MobilePanel key={i} panel={panel} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      style={{ minHeight: `${SECTION_VH}vh` }}
      className="relative hidden lg:block"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
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

        <motion.div
          style={{ x, width: `${TRACK_WIDTH_VW}vw` }}
          className="flex h-full will-change-transform"
        >
          {panels.map((panel, i) => (
            <DesktopPanel
              key={i}
              panel={panel}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {panels.map((p, i) => (
            <motion.div
              key={i}
              style={{ opacity: dotMotionValues[i], scale: dotMotionValues[i] }}
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

        <motion.div
          style={{ opacity: scrollHintOpacity }}
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
