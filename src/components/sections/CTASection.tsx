"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import homeData from "@/data/home.json";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AlternatingTitle } from "@/components/ui/AlternatingTitle";

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);

  const { cta, contact } = homeData;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative section-padding overflow-hidden"
    >
      {/* Parallax BG */}
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-orange/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-orange/40 to-transparent" />
      </motion.div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-10" style={{ background: "rgba(192,225,210,0.55)" }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#C0E1D2" }}>
              Join The Club
            </span>
            <span className="h-px w-10" style={{ background: "rgba(192,225,210,0.55)" }} />
          </div>

          <AlternatingTitle
            text={cta.heading}
            fontSize="clamp(2.5rem, 7vw, 7rem)"
            letterSpacing="-0.03em"
            color="#E8F4F0"
          />

          <p className="font-body text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "#B8D4CC" }}>
            {cta.body}
          </p>

          <MagneticButton strength={22}>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 font-display font-bold text-lg rounded-full transition-all duration-300"
              style={{ background: "#C0E1D2", color: "#1A2320", boxShadow: "0 8px 32px rgba(192,225,210,0.3)" }}
            >
              {cta.button.label}
              <span className="text-xl">→</span>
            </motion.a>
          </MagneticButton>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-text-muted"
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "#C0E1D2" }}>✉</span>
            <span className="font-mono text-sm" style={{ color: "#A8C8BF" }}>{contact.email}</span>
          </div>
          <div className="hidden sm:block h-4 w-px" style={{ background: "rgba(192,225,210,0.2)" }} />
          <div className="flex items-center gap-2">
            <span style={{ color: "#DC9B9B" }}>◈</span>
            <span className="font-mono text-sm" style={{ color: "#A8C8BF" }}>{contact.instagram}</span>
          </div>
          <div className="hidden sm:block h-4 w-px" style={{ background: "rgba(192,225,210,0.2)" }} />
          <div className="flex items-center gap-2">
            <span style={{ color: "#7BB5A0" }}>⌖</span>
            <span className="font-mono text-sm" style={{ color: "#A8C8BF" }}>{contact.location}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
