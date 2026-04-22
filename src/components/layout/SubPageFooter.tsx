"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const navLinks = [
  { index: "01", label: "Home",         href: "/" },
  { index: "02", label: "Projects",     href: "/projects" },
  { index: "03", label: "Achievements", href: "/achievements" },
  { index: "04", label: "Team",         href: "/team" },
];

interface SubPageFooterProps {
  pageName?: string;
}

export default function SubPageFooter({ pageName }: SubPageFooterProps) {
  const ref   = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <footer ref={ref} className="relative" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>

      {/* ── Main grid ── */}
      <div className="grid md:grid-cols-[1fr_1px_1fr] gap-0 px-10 md:px-20 py-20">

        {/* Left — brand block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pr-0 md:pr-16 pb-14 md:pb-0"
        >
          <p
            className="font-display font-black text-text-primary mb-3 leading-tight"
            style={{ fontSize: "clamp(1.15rem, 2vw, 1.5rem)", letterSpacing: "-0.02em" }}
          >
            Robotics &amp; AV Club
          </p>
          <p
            className="font-mono uppercase mb-10"
            style={{ fontSize: "0.625rem", letterSpacing: "0.28em", color: "rgba(154,128,112,0.38)" }}
          >
            Est. 2019 — Engineering Tomorrow, Today.
          </p>
          <ul className="flex flex-col gap-2.5">
            {["roboticsavclub@school.edu", "@roboticsavclub", "Engineering Block, Room 204"].map((item) => (
              <li
                key={item}
                className="font-mono"
                style={{ fontSize: "0.688rem", color: "rgba(154,128,112,0.4)", letterSpacing: "0.03em" }}
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Vertical rule */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="hidden md:block origin-top self-stretch"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* Right — navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
          className="pl-0 md:pl-16"
        >
          <p
            className="font-mono uppercase mb-8"
            style={{ fontSize: "0.625rem", letterSpacing: "0.28em", color: "rgba(154,128,112,0.3)" }}
          >
            Navigate
          </p>
          <ul className="flex flex-col" style={{ gap: "1.75rem" }}>
            {navLinks.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.28 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={link.href} className="group flex items-baseline gap-5" style={{ color: "rgba(154,128,112,0.45)" }}>
                  <span
                    className="font-mono shrink-0 transition-colors duration-300 group-hover:text-accent-cyan"
                    style={{ fontSize: "0.625rem", letterSpacing: "0.15em", color: "rgba(154,128,112,0.22)", width: "1.5rem" }}
                  >
                    {link.index}
                  </span>
                  <span
                    className="font-display font-bold transition-colors duration-300 group-hover:text-text-primary"
                    style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1 }}
                  >
                    {link.label}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="flex items-center justify-between px-10 md:px-20 py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span className="font-mono" style={{ fontSize: "0.625rem", letterSpacing: "0.18em", color: "rgba(154,128,112,0.22)" }}>
          © 2024 ROBOTICS &amp; AV CLUB
        </span>
        <span className="font-mono" style={{ fontSize: "0.625rem", letterSpacing: "0.12em", color: "rgba(154,128,112,0.16)" }}>
          BUILT WITH PRECISION
        </span>
      </div>
    </footer>
  );
}
