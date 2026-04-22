"use client";

import { motion } from "framer-motion";

interface AlternatingTitleProps {
  text: string;
  className?: string;
  fontSize?: string;
  letterSpacing?: string;
  color?: string;
}

/**
 * Splits text into words that alternately slide in from the left and right,
 * creating the layered Framer Motion reveal seen on the Team page.
 */
export function AlternatingTitle({
  text,
  className,
  fontSize = "clamp(3rem, 10vw, 8rem)",
  letterSpacing = "-0.03em",
  color,
}: AlternatingTitleProps) {
  const words = text.split(" ");

  return (
    <h1
      className={`font-display font-black leading-none mb-6 ${className ?? ""}`}
      style={{ fontSize, letterSpacing, ...(color ? { color } : {}) }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            marginRight: "0.3em",
            verticalAlign: "bottom",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ x: i % 2 === 0 ? "-110%" : "110%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{
              duration: 0.95,
              delay: 0.1 + i * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
