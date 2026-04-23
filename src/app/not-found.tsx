"use client";

import { useEffect, useRef, useState } from "react"; // useRef kept — used in MagBtn
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ── Particle data ─────────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

function generateParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.05,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 6,
    dx: (Math.random() - 0.5) * 30,
    dy: (Math.random() - 0.5) * 30,
  }));
}

/* ── Glitch text ────────────────────────────────────────────── */
const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#█▓▒░⌖◈";
function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (i < iter) return ch;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
      if (iter >= text.length) { clearInterval(interval); setDisplay(text); }
      iter += 0.4;
    }, 30);
    return () => clearInterval(interval);
  }, [active, text]);
  return display;
}

/* ── Magnetic button ────────────────────────────────────────── */
function MagBtn({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
      className="not-found-btn"
    >
      {children}
    </motion.a>
  );
}

/* ── Cursor glow ────────────────────────────────────────────── */
function CursorGlow() {
  const cx = useMotionValue(-200);
  const cy = useMotionValue(-200);
  const sx = useSpring(cx, { stiffness: 80, damping: 18 });
  const sy = useSpring(cy, { stiffness: 80, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cx, cy]);

  return (
    <motion.div
      style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%" }}
      className="not-found-cursor-glow"
      aria-hidden
    />
  );
}

/* ── Main 404 page ──────────────────────────────────────────── */
export default function NotFound() {
  /* Defer random particle data to client only to prevent SSR hydration mismatch */
  const [mounted, setMounted] = useState(false);
  const [particles] = useState<Particle[]>(() => generateParticles(40));
  const [glitchActive, setGlitchActive] = useState(false);
  const glitchText = useGlitch("404", glitchActive);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Periodically trigger glitch */
  useEffect(() => {
    const fire = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 1200);
    };
    fire();
    const id = setInterval(fire, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        /* ── Layout ── */
        .not-found-root {
          position: fixed;
          inset: 0;
          background: #1C1714;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        /* ── Cursor glow ── */
        .not-found-cursor-glow {
          position: fixed;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,153,107,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Ambient rings ── */
        .not-found-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(201,153,107,0.06);
          pointer-events: none;
        }

        /* ── BIG 404 ── */
        .not-found-hero {
          position: relative;
          z-index: 2;
          text-align: center;
          user-select: none;
          padding: 0 2rem;
        }

        .not-found-numeral {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-weight: 900;
          font-size: clamp(9rem, 24vw, 22rem);
          line-height: 0.9;
          letter-spacing: -0.06em;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(201,153,107,0.35);
          position: relative;
          display: inline-block;
        }

        .not-found-numeral::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #C9996B 0%, #EDE9E6 45%, #C9996B 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.9;
          filter: blur(0px);
        }

        /* glitch layers */
        .not-found-numeral::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #5C766D, #C9996B);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          opacity: 0;
          animation: nf-glitch-slice 4.5s ease-in-out infinite;
        }

        @keyframes nf-glitch-slice {
          0%, 85%, 100% { opacity: 0; transform: none; }
          86% { opacity: 0.6; transform: translateX(-4px); clip-path: polygon(0 20%, 100% 20%, 100% 42%, 0 42%); }
          88% { opacity: 0.4; transform: translateX(4px); clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); }
          90% { opacity: 0; }
        }

        /* ── Scan line ── */
        .not-found-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(201,153,107,0.4), transparent);
          animation: nf-scan 6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes nf-scan {
          0%   { top: 0%;   opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* ── Horizontal rule ── */
        .not-found-rule {
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,153,107,0.5), transparent);
          margin: 1.5rem auto;
        }

        /* ── Label ── */
        .not-found-label {
          font-family: var(--font-mono, 'Courier New', monospace);
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(201,153,107,0.55);
          margin-bottom: 0.75rem;
        }

        /* ── Heading ── */
        .not-found-heading {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: clamp(1.2rem, 3vw, 2rem);
          letter-spacing: -0.03em;
          color: #EDE9E6;
          margin-bottom: 0.6rem;
        }

        /* ── Body ── */
        .not-found-body {
          font-family: var(--font-body, 'Inter', system-ui, sans-serif);
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(154,128,112,0.75);
          max-width: 380px;
          margin: 0 auto 2.5rem;
        }

        /* ── Button ── */
        .not-found-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2.4rem;
          border-radius: 100px;
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: -0.01em;
          background: #C9996B;
          color: #1C1714;
          text-decoration: none;
          box-shadow: 0 0 40px rgba(201,153,107,0.25), 0 4px 20px rgba(0,0,0,0.5);
          transition: box-shadow 0.3s ease, background 0.3s ease;
          cursor: pointer;
        }
        .not-found-btn:hover {
          background: #EDE9E6;
          box-shadow: 0 0 60px rgba(201,153,107,0.4), 0 8px 30px rgba(0,0,0,0.6);
        }

        .not-found-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2rem;
          border-radius: 100px;
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: -0.01em;
          background: transparent;
          color: rgba(201,153,107,0.7);
          border: 1px solid rgba(201,153,107,0.2);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .not-found-btn-ghost:hover {
          background: rgba(201,153,107,0.06);
          border-color: rgba(201,153,107,0.45);
          color: #C9996B;
        }

        /* ── Nav links row ── */
        .not-found-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem 2rem;
          margin-top: 3rem;
        }
        .not-found-nav a {
          font-family: var(--font-mono, 'Courier New', monospace);
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(154,128,112,0.4);
          text-decoration: none;
          transition: color 0.25s;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .not-found-nav a:hover { color: #C9996B; }
        .not-found-nav a span.idx { color: rgba(201,153,107,0.25); }

        /* ── Bottom code ── */
        .not-found-code {
          position: absolute;
          bottom: 1.6rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-mono, 'Courier New', monospace);
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          color: rgba(154,128,112,0.18);
          white-space: nowrap;
          z-index: 2;
        }

        /* ── Particle ── */
        .not-found-particle {
          position: absolute;
          border-radius: 50%;
          background: #C9996B;
          pointer-events: none;
        }

        /* ── Grid lines ── */
        .not-found-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,153,107,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,153,107,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%);
        }

        /* ── Corner decorations ── */
        .nf-corner {
          position: absolute;
          width: 40px;
          height: 40px;
          pointer-events: none;
          opacity: 0.35;
        }
        .nf-corner svg { width: 100%; height: 100%; }
        .nf-corner-tl { top: 1.5rem; left: 1.5rem; }
        .nf-corner-tr { top: 1.5rem; right: 1.5rem; transform: scaleX(-1); }
        .nf-corner-bl { bottom: 1.5rem; left: 1.5rem; transform: scaleY(-1); }
        .nf-corner-br { bottom: 1.5rem; right: 1.5rem; transform: scale(-1); }
      `}</style>

      <div className="not-found-root">
        {/* ── Cursor glow ── */}
        <CursorGlow />

        {/* ── Grid ── */}
        <div className="not-found-grid" aria-hidden />

        {/* ── Scanline ── */}
        <div className="not-found-scanline" aria-hidden />

        {/* ── Ambient rings ── */}
        {[600, 900, 1200].map((s, i) => (
          <motion.div
            key={s}
            className="not-found-ring"
            style={{ width: s, height: s, top: "50%", left: "50%", marginLeft: -s / 2, marginTop: -s / 2 }}
            animate={{ opacity: [0.3, 0.07, 0.3], scale: [1, 1.04, 1] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          />
        ))}

        {/* ── Floating particles — client only to avoid SSR hydration mismatch ── */}
        {mounted && particles.map((p) => (
          <motion.div
            key={p.id}
            className="not-found-particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
            }}
            animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}

        {/* ── Corner decorations ── */}
        {["tl", "tr", "bl", "br"].map((pos) => (
          <div key={pos} className={`nf-corner nf-corner-${pos}`} aria-hidden>
            <svg viewBox="0 0 40 40" fill="none" stroke="#C9996B" strokeWidth="1">
              <path d="M0 30 L0 0 L30 0" />
            </svg>
          </div>
        ))}

        {/* ── Main content ── */}
        <motion.div
          className="not-found-hero"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Label */}
          <motion.p
            className="not-found-label"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            ◈ &nbsp; Error &nbsp; ◈
          </motion.p>

          {/* Giant 404 */}
          <div
            className="not-found-numeral"
            data-text={glitchText}
            aria-label="404"
          >
            {glitchText}
          </div>

          <div className="not-found-rule" />

          {/* Heading */}
          <motion.h1
            className="not-found-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            Page Not Found
          </motion.h1>

          {/* Body */}
          <motion.p
            className="not-found-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            The circuit you&apos;re looking for doesn&apos;t exist — or has been
            disconnected. Let&apos;s route you back to safety.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagBtn href="/">
              <span>← Return Home</span>
            </MagBtn>
            <Link href="/contact" className="not-found-btn-ghost">
              Contact Us
            </Link>
          </motion.div>

          {/* Quick nav links */}
          <motion.nav
            className="not-found-nav"
            aria-label="Quick navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            {[
              { idx: "01", label: "Projects", href: "/projects" },
              { idx: "02", label: "Achievements", href: "/achievements" },
              { idx: "03", label: "Team", href: "/team" },
              { idx: "04", label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="idx">{link.idx}</span> {link.label}
              </Link>
            ))}
          </motion.nav>
        </motion.div>

        {/* ── Bottom code ── */}
        <p className="not-found-code" aria-hidden>
          RAV_CLUB // ERR_404 // PAGE_NOT_FOUND // ENGINEERING_TOMORROW_TODAY
        </p>
      </div>
    </>
  );
}
