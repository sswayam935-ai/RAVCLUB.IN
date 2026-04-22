"use client";

import homeData from "@/data/home.json";

export default function MarqueeSection() {
  const { marquee } = homeData;
  // Duplicate for seamless loop
  const items = [...marquee.items, ...marquee.items];

  return (
    <div className="relative py-10 overflow-hidden border-y border-white/5">
      {/* Top track */}
      <div className="relative overflow-hidden mb-4">
        <div className="marquee-track">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-6 font-display font-black text-2xl md:text-3xl tracking-tight text-text-primary/10 whitespace-nowrap uppercase"
            >
              {item}
              <span className="text-accent-cyan text-lg">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom track — reverse */}
      <div className="relative overflow-hidden">
        <div className="marquee-track-reverse">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-6 font-display font-black text-2xl md:text-3xl tracking-tight text-accent-cyan/10 whitespace-nowrap uppercase"
            >
              {item}
              <span className="text-accent-orange text-lg">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
