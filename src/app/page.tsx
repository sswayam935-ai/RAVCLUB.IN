"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import HorizontalScrollSection from "@/components/sections/HorizontalScrollSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <AboutSection />
      <MarqueeSection />
      <HorizontalScrollSection />
      <CTASection />
    </motion.div>
  );
}
