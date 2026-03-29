"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function MobileActionBar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [100, 200], [0, 1]);
  const y = useTransform(scrollY, [100, 200], [20, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Frosted base */}
      <div
        className="mx-3 mb-3 rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.09)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex gap-2 p-2">
          {/* Call Now */}
          <a
            href="tel:+15550001234"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[15px] font-semibold text-[#1d1d1f] transition-colors duration-150 active:bg-black/[0.05]"
            style={{ background: "#f5f5f7" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.26 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.17 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Now
          </a>

          {/* Book Repair */}
          <a
            href="#repairs"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[15px] font-semibold text-white transition-colors duration-150 active:opacity-90"
            style={{ background: "#0071e3" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            Book Repair
          </a>
        </div>
      </div>
    </motion.div>
  );
}
