"use client";

import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  stagger?: number;
}

/**
 * Splits text into individual words, each rising from a clipped container.
 * Creates the premium "magazine reveal" effect seen on Lenis, Awwwards sites.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  duration = 0.8,
  once = true,
  stagger = 0.07,
}: SplitTextProps) {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            paddingBottom: "0.12em",   // prevent descender clip
            marginRight: "0.28em",
            verticalAlign: "bottom",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "115%", opacity: 0, skewY: 4 }}
            whileInView={{ y: "0%", opacity: 1, skewY: 0 }}
            viewport={{ once, amount: 0.4 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
