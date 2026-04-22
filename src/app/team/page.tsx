"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import teamData from "@/data/team.json";
import SubPageFooter from "@/components/layout/SubPageFooter";
import s from "./TeamCard.module.css";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AlternatingTitle } from "@/components/ui/AlternatingTitle";

type Member = (typeof teamData.members)[number];


/* ─── Node network decoration ─── */
function NodeNetwork() {
  const nodes = [
    { cx: "15%", cy: "30%" }, { cx: "50%", cy: "15%" },
    { cx: "80%", cy: "35%" }, { cx: "25%", cy: "65%" },
    { cx: "70%", cy: "70%" }, { cx: "45%", cy: "55%" },
  ];
  const links = [
    [0, 1], [1, 2], [0, 3], [3, 5], [5, 4], [1, 5], [2, 4],
  ];

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 1.2 }}
    >
      {/* Lines */}
      {links.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(201,153,107,0.07)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.8 + i * 0.1 }}
        />
      ))}
      {/* Dots */}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx} cy={n.cy}
          r={3}
          fill="rgba(201,153,107,0.18)"
          animate={{ r: [3, 5, 3], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}
    </motion.svg>
  );
}

/* ─── Member Card (weather-expand mechanic preserved) ─── */
function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: 320 }}
      className="flex items-start"
    >
      <div className={s.cardm}>
        {/* ── Front Card ── */}
        <div className={s.card}>
          <div className={s.initialsBox}>{member.initials}</div>
          <div className={s.cardInfo}>
            <span className={s.memberName}>{member.name}</span>
            <span className={s.memberRole}>{member.role}</span>
          </div>
        </div>

        {/* ── Expandable Panel ── */}
        <div className={s.card2}>
          <div className={s.upper}>
            <div className={s.colItem}>
              <span className={s.colIcon}>⚙</span>
              <span>{member.department}<br />Dept.</span>
            </div>
            <div className={s.colItem}>
              <span className={s.colIcon}>★</span>
              <span>Skills<br />{member.skills.length}</span>
            </div>
          </div>
          <div className={s.lower}>
            <p className={s.bioText}>{member.bio}</p>
            <div className={s.skillTags}>
              {member.skills.map((skill) => (
                <span key={skill} className={s.skillTag}>{skill}</span>
              ))}
            </div>
            <div className={s.card3}>{member.department}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Team Page ─── */
export default function TeamPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const { meta, departments, members } = teamData;
  const filtered =
    activeFilter === "All" ? members : members.filter((m) => m.department === activeFilter);

  return (
    <div>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex items-center justify-center overflow-hidden grid-bg pt-24"
      >
        {/* Ghost "TEAM" */}
        <motion.div
          style={{ y: ghostY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-black leading-none"
            style={{
              fontSize: "clamp(8rem, 32vw, 30rem)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(192,225,210,0.35)",
              letterSpacing: "-0.05em",
            }}
          >
            UNITY
          </span>
        </motion.div>

        {/* Node network */}
        <NodeNetwork />

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
            <span className="h-px w-12" style={{ background: "rgba(220,155,155,0.45)" }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: "#DC9B9B" }}>
              The People
            </span>
            <span className="h-px w-12" style={{ background: "rgba(220,155,155,0.45)" }} />
          </motion.div>

          {/* Alternating slide heading */}
          <AlternatingTitle text={meta.heading} />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="font-body text-text-muted max-w-lg mx-auto"
          >
            {meta.subheading}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Department Filter — Magnetic ── */}
      <section className="px-6 py-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3">
          {departments.map((dept) => (
            <MagneticButton key={dept} strength={16}>
              <motion.button
                onClick={() => setActiveFilter(dept)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 ${activeFilter === dept
                    ? "text-background"
                    : "border border-white/10 text-text-muted hover:border-accent-cyan/40 hover:text-text-primary"
                  }`}
                style={
                  activeFilter === dept
                    ? { background: "#5C766D" }
                    : {}
                }
              >
                {dept}
              </motion.button>
            </MagneticButton>
          ))}

          {/* Member count badge */}
          <AnimatePresence mode="wait">
            <motion.span
              key={activeFilter + filtered.length}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="font-mono text-xs text-text-muted/50 ml-2"
            >
              {filtered.length} member{filtered.length !== 1 ? "s" : ""}
            </motion.span>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Members Grid ── */}
      <section className="section-padding px-6">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-mono text-xs text-text-muted/40 mb-10 tracking-widest uppercase"
          >
            ↓ Hover to reveal
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap justify-center gap-6"
            >
              {filtered.map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center py-20 text-text-muted font-mono text-sm">
              No members in this department.
            </p>
          )}
        </div>
      </section>

      <SubPageFooter pageName="UNITY" />
    </div>
  );
}
