"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

/* ─── Mouse-tracking hook ─── */
function useMouseParallax(strength = 30) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 40, damping: 18 });
  const y = useSpring(rawY, { stiffness: 40, damping: 18 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = (
      currentTarget as HTMLElement
    ).getBoundingClientRect();
    rawX.set(((clientX - left - width / 2) / width) * strength);
    rawY.set(((clientY - top - height / 2) / height) * strength);
  };

  return { x, y, onMouseMove };
}

export default function AnimatedBackground({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  /* ── Scroll parallax ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const ghostY   = useTransform(scrollYProgress, [0, 1], ["0%",  "55%"]);
  const orb1ScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const orb2ScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const ringScrollY = useTransform(scrollYProgress, [0, 1], ["0%",  "20%"]);

  /* ── Mouse parallax ── */
  const { x: m1x, y: m1y, onMouseMove } = useMouseParallax(28);
  const m2x = useTransform(m1x, v => -v * 0.7);
  const m2y = useTransform(m1y, v => -v * 0.7);
  const m3x = useTransform(m1x, v =>  v * 0.4);
  const m3y = useTransform(m1y, v =>  v * 0.4);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      // @ts-ignore — onMouseMove forwarded from section
      onMouseMove={onMouseMove}
      style={{ pointerEvents: "none" }}
    >
      {/* ── 1. Huge ghost / outline title (scroll-driven) ── */}
      <motion.div
        style={{ y: ghostY }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className="font-black leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(6rem, 22vw, 22rem)",
            letterSpacing: "-0.05em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(201,153,107,0.07)",
            userSelect: "none",
          }}
        >
          ROBOTICS
        </span>
      </motion.div>

      {/* ── 2. Second ghost word, offset below ── */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["6rem", "80%"]) }}
        className="absolute inset-0 flex items-end justify-center pb-32"
      >
        <span
          className="font-black leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(4rem, 14vw, 14rem)",
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(92,118,109,0.06)",
            userSelect: "none",
          }}
        >
          &amp; AV CLUB
        </span>
      </motion.div>

      {/* ── 3. Primary orb — golden (outer: scroll, inner: mouse) ── */}
      <motion.div
        style={{ y: orb1ScrollY }}
        className="absolute top-[-10%] left-[-5%]"
      >
        <motion.div style={{ x: m1x, y: m1y }}>
          <motion.div
            className="rounded-full"
            style={{
              width: 700,
              height: 700,
              background:
                "radial-gradient(circle at 40% 40%, rgba(201,153,107,0.22) 0%, rgba(201,153,107,0.08) 45%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{
              borderRadius: [
                "50%",
                "48% 52% 56% 44%",
                "60% 40% 44% 56%",
                "44% 56% 48% 52%",
                "50%",
              ],
              scale: [1, 1.06, 0.97, 1.04, 1],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* ── 4. Secondary orb — sage green ── */}
      <motion.div
        style={{ y: orb2ScrollY }}
        className="absolute bottom-[-15%] right-[-8%]"
      >
        <motion.div style={{ x: m2x, y: m2y }}>
          <motion.div
            className="rounded-full"
            style={{
              width: 600,
              height: 600,
              background:
                "radial-gradient(circle at 60% 60%, rgba(92,118,109,0.2) 0%, rgba(92,118,109,0.07) 45%, transparent 70%)",
              filter: "blur(70px)",
            }}
            animate={{
              borderRadius: [
                "50%",
                "55% 45% 52% 48%",
                "42% 58% 45% 55%",
                "58% 42% 55% 45%",
                "50%",
              ],
              scale: [1.05, 1, 1.1, 0.98, 1.05],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </motion.div>
      </motion.div>

      {/* ── 5. Accent orb — warm cream centre glow ── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div style={{ x: m3x, y: m3y }}>
          <motion.div
            className="rounded-full"
            style={{
              width: 400,
              height: 400,
              background:
                "radial-gradient(circle, rgba(237,233,230,0.04) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.2, 0.9, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
      </motion.div>

      {/* ── 6. Rotating outer ring ── */}
      <motion.div
        style={{ y: ringScrollY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.svg
          width={900}
          height={900}
          viewBox="0 0 900 900"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx={450}
            cy={450}
            r={420}
            fill="none"
            stroke="rgba(201,153,107,0.05)"
            strokeWidth={1}
            strokeDasharray="12 24"
          />
          <circle
            cx={450}
            cy={450}
            r={380}
            fill="none"
            stroke="rgba(92,118,109,0.04)"
            strokeWidth={0.5}
          />
        </motion.svg>
      </motion.div>

      {/* ── 7. Counter-rotating inner ring ── */}
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.svg
          width={500}
          height={500}
          viewBox="0 0 500 500"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx={250}
            cy={250}
            r={230}
            fill="none"
            stroke="rgba(201,153,107,0.06)"
            strokeWidth={1}
            strokeDasharray="4 20"
          />
        </motion.svg>
      </motion.div>

      {/* ── 8. Floating particles ── */}
      {[
        { cx: "20%", cy: "30%", delay: 0,   dur: 6  },
        { cx: "75%", cy: "20%", delay: 1.2, dur: 8  },
        { cx: "60%", cy: "70%", delay: 0.5, dur: 7  },
        { cx: "10%", cy: "65%", delay: 2,   dur: 9  },
        { cx: "85%", cy: "50%", delay: 0.8, dur: 6.5},
        { cx: "40%", cy: "85%", delay: 1.6, dur: 8.5},
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.cx,
            top: p.cy,
            width: 3,
            height: 3,
            background: i % 2 === 0 ? "rgba(201,153,107,0.5)" : "rgba(92,118,109,0.4)",
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* ── 9. Film grain overlay ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
