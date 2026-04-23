"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import homeData from "@/data/home.json";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function WhatWeDoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const { whatWeDo } = homeData;

  return (
    <section ref={sectionRef} id="what-we-do" className="relative section-padding">
      {/* Big BG text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-display font-black text-[20vw] text-white/[0.015] uppercase whitespace-nowrap select-none"
        >
          INNOVATE
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-accent-orange" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent-orange">
              Our Focus
            </span>
            <span className="h-px w-10 bg-accent-orange" />
          </div>
          <h2
            className="font-display font-black text-5xl md:text-7xl leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            {whatWeDo.heading}
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {whatWeDo.areas.map((area, i) => (
            <motion.div
              key={area.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.97 }}
              className="glass rounded-2xl p-7 group border border-white/5 hover:border-accent-cyan/20 transition-all duration-300"
            >
              <div className="text-4xl mb-5">{area.icon}</div>
              <h3 className="font-display font-bold text-xl mb-3 group-hover:text-accent-cyan transition-colors duration-300">
                {area.title}
              </h3>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                {area.description}
              </p>
              <div className="mt-5 h-px w-8 bg-accent-cyan/30 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
