"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
  { label: "Team", href: "/team" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

/* ── Framer Motion Variants ── */
const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      type: "spring" as const,
      damping: 22,
      stiffness: 280,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring" as const,
      damping: 22,
      stiffness: 280,
      when: "afterChildren",
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -20,
    rotate: -90,
    transition: { duration: 0.25 },
  },
};

const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -15,
    scale: 0.92,
    transition: { duration: 0.18 },
  },
};

const menuIconVariants = {
  expanded: { opacity: 0, scale: 0.7, transition: { duration: 0.18 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 15, stiffness: 300, delay: 0.15 },
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const [isExpanded, setExpanded] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollOnCollapse = React.useRef(0);

  /* Close mobile menu on route change */
  React.useEffect(() => {
    setMobileOpen(false);
    setExpanded(true); // always expand on nav
  }, [pathname]);

  /* Collapse pill when scrolling down, expand when scrolling up enough */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollY.current;
    if (isExpanded && latest > prev && latest > 150) {
      setExpanded(false);
      scrollOnCollapse.current = latest;
    } else if (!isExpanded && latest < prev && scrollOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD) {
      setExpanded(true);
    }
    lastScrollY.current = latest;
  });

  const handleCollapsedClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <>
      {/* ── Desktop Animated Pill Nav ── */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden sm:block">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded ? { scale: 1.08 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleCollapsedClick}
          className={cn(
            "flex items-center overflow-hidden rounded-full h-12 shadow-lg",
            "border border-[rgba(201,153,107,0.20)]",
            "bg-[rgba(28,23,20,0.82)] backdrop-blur-xl",
            !isExpanded && "cursor-pointer justify-center"
          )}
        >
          {/* Logo — hidden when collapsed */}
          <motion.div variants={logoVariants} className="flex-shrink-0 flex items-center pl-4 pr-1 select-none">
            <span
              className="text-[#EDE9E6] font-bold text-xs tracking-widest uppercase hidden sm:block whitespace-nowrap"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Robotics & AV
            </span>
          </motion.div>

          {/* Nav links — stagger out when collapsed */}
          <motion.div
            className={cn("flex items-center gap-1 px-2", !isExpanded && "pointer-events-none")}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={(e) => e.stopPropagation()}
                    className="relative px-3 py-1 rounded-full text-xs tracking-widest uppercase transition-colors duration-200 group whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: isActive ? "#C9996B" : "#9A8070",
                    }}
                  >
                    <span className="relative z-10 group-hover:text-[#EDE9E6] transition-colors duration-200">
                      {link.label}
                    </span>
                    {/* Active underline */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                        style={{ background: "#C9996B" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Join Us CTA */}
          <motion.div variants={itemVariants} className={cn("pr-2", !isExpanded && "pointer-events-none")}>
            <Link
              href="/contact"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex items-center px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap"
              style={{
                fontFamily: "var(--font-mono)",
                color: "#1C1714",
                background: "#C9996B",
              }}
            >
              Join Us
            </Link>
          </motion.div>

          {/* Collapsed state — Menu icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div variants={menuIconVariants} animate={isExpanded ? "expanded" : "collapsed"}>
              <Menu className="h-5 w-5" style={{ color: "#C9996B" }} />
            </motion.div>
          </div>
        </motion.nav>
      </div>

      {/* ── Mobile Header ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 sm:hidden h-16 flex items-center justify-between px-4 border-b border-white/5"
        style={{
          background: "rgba(28,23,20,0.85)",
          backdropFilter: "blur(8px)",
        }}
        initial={{ y: 0 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-sm font-bold tracking-widest uppercase text-[#EDE9E6]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          RAV Club
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-[#EDE9E6]"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-[#EDE9E6]"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-[#EDE9E6]"
          />
        </button>
      </motion.header>

      {/* ── Mobile Full-screen Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-16 left-0 right-0 z-40 sm:hidden flex flex-col gap-1 px-4 py-6 border-b border-white/5"
            style={{ background: "rgba(28,23,20,0.95)", backdropFilter: "blur(8px)" }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg font-mono text-sm tracking-widest uppercase transition-all"
                  style={{
                    color: pathname === link.href ? "#C9996B" : "#9A8070",
                    background: pathname === link.href ? "rgba(201,153,107,0.1)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              className="mt-4 pt-4 border-t border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24 }}
            >
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg font-mono tracking-widest uppercase text-sm font-bold text-center"
                style={{ background: "#C9996B", color: "#1C1714" }}
              >
                Join Us
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Original Mobile Full-screen Menu (keeping for reference) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 sm:hidden"
            style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
