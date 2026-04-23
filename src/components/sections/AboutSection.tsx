"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import homeData from "@/data/home.json";

const accentColors = ["#C0E1D2", "#DC9B9B", "#C0E1D2", "#DC9B9B"];
const accentRgba   = [
  "rgba(192,225,210,",
  "rgba(220,155,155,",
  "rgba(192,225,210,",
  "rgba(220,155,155,",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const { about } = homeData;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative section-padding overflow-hidden"
    >
      {/* Subtle background accent */}
      <motion.div
        style={{
          y: yParallax,
          background: "radial-gradient(circle, rgba(192,225,210,0.14) 0%, transparent 70%)",
        }}
        className="absolute -right-48 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start lg:items-center">

          {/* ── Left — Text column ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-10" style={{ background: "rgba(192,225,210,0.6)" }} />
              <span
                className="font-mono text-xs tracking-[0.32em] uppercase"
                style={{ color: "#C0E1D2" }}
              >
                About Us
              </span>
            </div>

            {/* Heading — split into editorial stacked lines */}
            <h2
              className="font-display font-black leading-none mb-8"
              style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", letterSpacing: "-0.03em" }}
            >
              <motion.span
                className="block text-text-primary"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Who
              </motion.span>
              <motion.span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #5FA58F, #1A2320)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                We Are
              </motion.span>
            </h2>

            {/* Divider */}
            <motion.div
              className="h-px mb-8 origin-left"
              style={{ background: "linear-gradient(90deg, rgba(192,225,210,0.5), transparent)" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="font-body leading-relaxed text-base md:text-lg"
              style={{ color: "#6E837D", maxWidth: "42ch" }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {about.body}
            </motion.p>
          </motion.div>

          {/* ── Right — Stats grid ── */}
          <div className="grid grid-cols-2 gap-4">
            {about.highlights.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="relative rounded-2xl p-6 overflow-hidden group cursor-default"
                style={{
                  background: "#EDF0EC",
                  border: `1px solid ${accentRgba[i]}0.15)`,
                  boxShadow: "0 2px 16px rgba(26,35,32,0.04)",
                  transition: "box-shadow 0.35s ease, border-color 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${accentRgba[i]}0.18)`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${accentRgba[i]}0.45)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(26,35,32,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = `${accentRgba[i]}0.15)`;
                }}
              >
                {/* Colored top accent bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 origin-left"
                  style={{ height: "3px", background: accentColors[i], borderRadius: "16px 16px 0 0" }}
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Index */}
                <span
                  className="absolute top-4 right-5 font-mono"
                  style={{ fontSize: "0.58rem", letterSpacing: "0.16em", color: `${accentRgba[i]}0.3)` }}
                >
                  0{i + 1}
                </span>

                {/* Stat number */}
                <div
                  className="font-display font-black mb-1 leading-none"
                  style={{
                    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                    letterSpacing: "-0.04em",
                    background: `linear-gradient(135deg, ${accentColors[i]}, #1A2320)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>

                {/* Thin separator */}
                <div
                  className="w-8 mb-3"
                  style={{ height: "1.5px", background: `${accentRgba[i]}0.35)` }}
                />

                {/* Label */}
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "0.62rem", letterSpacing: "0.18em", color: "#6E837D" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
