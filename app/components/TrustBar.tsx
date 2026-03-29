"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "90-Day Warranty",
    sub: "Parts & labour covered",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    label: "Genuine Parts",
    sub: "OEM & certified only",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    label: "Same-Day Repair",
    sub: "Most jobs under 90 min",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20,6 9,17 4,12" />
      </svg>
    ),
    label: "Certified Technicians",
    sub: "Apple & Samsung trained",
  },
];

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <div
      ref={ref}
      className="border-y border-black/[0.07] bg-white"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/[0.06]">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
              className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[#0071e3]"
                style={{ background: "rgba(0,113,227,0.08)" }}
              >
                {item.icon}
              </div>
              <div>
                <div className="text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#6e6e73] mt-0.5 hidden sm:block">
                  {item.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
