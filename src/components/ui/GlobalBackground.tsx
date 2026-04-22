"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function GlobalBackground() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 25, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 25, damping: 20 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 48);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 48);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [rawX, rawY]);

  const o1x = useTransform(mouseX, v => v * 0.65);
  const o1y = useTransform(mouseY, v => v * 0.65);
  const o2x = useTransform(mouseX, v => -v * 0.45);
  const o2y = useTransform(mouseY, v => -v * 0.45);
  const o3x = useTransform(mouseX, v => v * 0.25);
  const o3y = useTransform(mouseY, v => v * 0.25);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: -1 }}
      aria-hidden
    >
      {/* ── Orb 1 — golden, top-left ── */}
      <motion.div style={{ x: o1x, y: o1y }} className="absolute -top-64 -left-64">
        <motion.div
          className="rounded-full"
          style={{
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle at 40% 35%, rgba(201,153,107,0.14) 0%, rgba(201,153,107,0.04) 50%, transparent 70%)",
            filter: "blur(90px)",
          }}
          animate={{ scale: [1, 1.08, 0.96, 1.04, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Orb 2 — sage green, bottom-right ── */}
      <motion.div style={{ x: o2x, y: o2y }} className="absolute -bottom-72 -right-72">
        <motion.div
          className="rounded-full"
          style={{
            width: 800,
            height: 800,
            background:
              "radial-gradient(circle at 60% 65%, rgba(92,118,109,0.12) 0%, rgba(92,118,109,0.03) 50%, transparent 70%)",
            filter: "blur(110px)",
          }}
          animate={{ scale: [1.06, 1, 1.12, 0.98, 1.06] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </motion.div>

      {/* ── Orb 3 — cream, centre ── */}
      <motion.div
        style={{ x: o3x, y: o3y }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          className="rounded-full"
          style={{
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(237,233,230,0.04) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}
          animate={{ scale: [1, 1.25, 0.9, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      {/* ── Film grain ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.022] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="gb-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gb-grain)" />
      </svg>
    </div>
  );
}
