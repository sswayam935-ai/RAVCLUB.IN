"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import projectsData from "@/data/projects.json";
import { AlternatingTitle } from "@/components/ui/AlternatingTitle";
import { MagneticButton } from "@/components/ui/MagneticButton";
import SubPageFooter from "@/components/layout/SubPageFooter";
import s from "./ProjectCard.module.css";

type Project = (typeof projectsData.projects)[number];

/* ─── Flip Card ─── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={project.highlight ? "sm:col-span-2" : ""}
    >
      <div className={s.card}>
        {/* Colored top accent bar unique to each project */}
        <div className={s.colorBar} style={{ background: project.color }} />

        {/* ── Front ── */}
        <div className={s.cardFront}>
          <div className={s.metaRow}>
            <span className={s.yearBadge}>{project.year}</span>
            <span
              className={s.categoryBadge}
              style={{
                color: project.color,
                borderColor: `${project.color}50`,
                background: `${project.color}12`,
              }}
            >
              {project.category}
            </span>
          </div>

          <svg className={s.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z" />
          </svg>

          <p className={s.frontTitle}>{project.title}</p>
          {project.status === "In Progress" && (
            <span className={s.liveDot}>● Live</span>
          )}
        </div>

        {/* ── Back — flips up from bottom on hover ── */}
        <div className={s.cardContent}>
          <div>
            <p className={s.cardTitle}>{project.title}</p>
            <p className={s.cardDescription}>{project.description}</p>
            <div className={s.techRow}>
              {project.tech.slice(0, 5).map((t) => (
                <span key={t} className={s.techTag}>{t}</span>
              ))}
            </div>
          </div>
          <div className={s.buttonRow}>
            <button className={s.cardButton}>Live Demo</button>
            <button className={`${s.cardButton} ${s.secondary}`}>Source Code</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Floating symbol decoration ─── */
const symbols = ["</>", "{}", "//", "[ ]", "=>", "01"];
function FloatingSymbols() {
  return (
    <>
      {symbols.map((sym, i) => (
        <motion.span
          key={i}
          className="absolute font-mono text-xs select-none pointer-events-none"
          style={{
            color: "rgba(192,225,210,0.35)",
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.5, 1, 0.5],
            rotate: [0, i % 2 === 0 ? 6 : -6, 0],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {sym}
        </motion.span>
      ))}
    </>
  );
}

export default function ProjectsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax  = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const ghostY     = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const ghostRot   = useTransform(scrollYProgress, [0, 1], ["-3deg", "3deg"]);

  const { meta, categories, projects } = projectsData;
  const filtered =
    activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex items-center justify-center grid-bg pt-24"
      >
        {/* Ghost word */}
        <motion.div
          style={{ y: ghostY, rotate: ghostRot }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-black leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(4rem, 16vw, 14rem)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(192,225,210,0.35)",
              letterSpacing: "-0.05em",
            }}
          >
            INNOVATION
          </span>
        </motion.div>

        <FloatingSymbols />

        <motion.div
          style={{ y: yParallax, opacity: opacityHero }}
          className="text-center px-6 z-10 relative"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-12" style={{ background: "rgba(192,225,210,0.5)" }} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-accent-cyan">
              Our Work
            </span>
            <span className="h-px w-12" style={{ background: "rgba(192,225,210,0.5)" }} />
          </motion.div>

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

      {/* ── Filter Bar ── */}
      <section className="px-6 py-10" style={{ borderBottom: "1px solid rgba(26,35,32,0.07)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <MagneticButton key={cat} strength={14}>
              <motion.button
                onClick={() => setActiveFilter(cat)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-accent-cyan text-background"
                    : "text-text-muted hover:text-text-primary"
                }`}
                style={
                  activeFilter === cat
                    ? {}
                    : { border: "1px solid rgba(26,35,32,0.12)" }
                }
              >
                {cat}
              </motion.button>
            </MagneticButton>
          ))}

          {/* Live count */}
          <AnimatePresence mode="wait">
            <motion.span
              key={activeFilter + filtered.length}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="font-mono text-xs text-text-muted/50 ml-2"
            >
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </motion.span>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section className="section-padding px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-text-muted font-mono text-sm">
              No projects found in this category.
            </div>
          )}
        </div>
      </section>

      <SubPageFooter />
    </div>
  );
}
