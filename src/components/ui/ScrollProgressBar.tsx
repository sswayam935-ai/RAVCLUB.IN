"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin springy progress bar fixed at top-of-viewport, tracks page scroll. */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[200] origin-left"
      style={{
        height: 2,
        scaleX,
        background: "linear-gradient(90deg, #C9996B 0%, #EDE9E6 50%, #5C766D 100%)",
      }}
    />
  );
}
