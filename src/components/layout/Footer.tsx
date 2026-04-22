"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
  { label: "Team", href: "/team" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
                <span className="text-accent-cyan text-sm font-mono font-bold">R</span>
              </div>
              <span className="font-display font-bold tracking-widest uppercase text-sm">
                Robotics & AV Club
              </span>
            </div>
            <p className="font-body text-sm text-text-muted leading-relaxed">
              Engineering Tomorrow, Today.<br />
              Where circuits meet creativity.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.3em] uppercase text-text-muted mb-5">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-text-muted hover:text-accent-cyan transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs tracking-[0.3em] uppercase text-text-muted mb-5">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="font-mono text-xs text-text-muted">roboticsavclub@school.edu</li>
              <li className="font-mono text-xs text-text-muted">@roboticsavclub</li>
              <li className="font-mono text-xs text-text-muted">Engineering Block, Room 204</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <span className="font-mono text-xs text-text-muted/50">
            © 2024 Robotics & AV Club. All rights reserved.
          </span>
          <span className="font-mono text-xs text-text-muted/30">
            Built with ❤️ and circuits
          </span>
        </div>
      </div>
    </footer>
  );
}
