"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import homeData from "@/data/home.json";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const ySubtitle = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const springY = useSpring(yTitle, { stiffness: 100, damping: 30 });


  const { hero } = homeData;

  // Split club name for stagger animation
  const words = hero.clubName.split(" ");

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* ── Animated background layers ── */}
      <AnimatedBackground sectionRef={containerRef} />

      {/* Scroll-driven content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 text-center px-6 max-w-7xl mx-auto pt-20"
      >
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="h-px w-12 bg-accent-cyan/50" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent-cyan">
            Est. 2022
          </span>
          <span className="h-px w-12 bg-accent-cyan/50" />
        </motion.div>

        {/* Big Title Reveal */}
        <motion.div style={{ y: springY }} className="mb-6">
          <div className="overflow-hidden">
            {words.map((word, wi) => (
              <motion.span
                key={wi}
                className="inline-block font-display font-black leading-none mr-4 last:mr-0"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 9rem)",
                  letterSpacing: "-0.02em",
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + wi * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {wi === 0 || wi === 2 ? (
                  <span className="gradient-text-cyan">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div style={{ y: ySubtitle }}>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-xl md:text-3xl font-light text-text-muted mb-4"
          >
            {hero.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-sm md:text-base text-text-muted/70 max-w-xl mx-auto leading-relaxed"
          >
            {hero.subTagline}
          </motion.p>
        </motion.div>



      </motion.div>


    </section>
  );
}
