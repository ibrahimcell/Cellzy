"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useModal } from "./ModalProvider";
import ImageCarousel from "./ImageCarousel";

const HERO_IMAGES = [
  {
    src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_orange__cr2oq3n1dwk2_large.jpg",
    alt: "iPhone 17 Pro Max — Cosmic Orange",
  },
  {
    src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_blue__li170wg4gkae_large.jpg",
    alt: "iPhone 17 Pro Max — Deep Blue",
  },
  {
    src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_silver__eb8fu7zfvwmu_large.jpg",
    alt: "iPhone 17 Pro Max — Silver",
  },
];

// Brand logos as minimal SVG paths
const BRANDS = [
  {
    name: "Apple",
    svg: (
      <svg viewBox="0 0 814 1000" width="15" height="15" fill="currentColor">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 71 0 130.1 46.4 174.4 46.4 42.7 0 109.2-49 192.3-49 33.4 0 135.7 3.2 213.4 106.3zm-174.4-92.9c-7.7 35.8-29.4 71.3-56.7 95.5-29.4 26.6-65.8 47.3-102.2 47.3-3.2 0-6.4-.3-9.6-.7-1.3-36.4 11.6-73.7 33-100.6 22.6-28.3 60.7-52.6 103.5-65.3 3.5-.9 6.4-1.3 9.3-1.3.6 0 1.3.1 1.9.1 1.2 8.4 1.9 16.4 1.9 24.3-.1 0 19.9 1-.1 1z"/>
      </svg>
    ),
  },
  {
    name: "Samsung",
    svg: (
      <svg viewBox="0 0 300 48" width="68" height="12" fill="currentColor">
        <path d="M11.8 0C5.3 0 0 5.3 0 11.8v24.4C0 42.7 5.3 48 11.8 48h276.4c6.5 0 11.8-5.3 11.8-11.8V11.8C300 5.3 294.7 0 288.2 0H11.8zm14.1 10.7h18.6c5.6 0 9.8 3.6 9.8 8.6 0 3.7-1.9 6.3-5 7.6 3.7 1.2 6 4 6 7.9 0 5.7-4.4 9.4-10.6 9.4H25.9V10.7zm7.3 13.5h10c2.2 0 3.5-1.3 3.5-3.3s-1.3-3.3-3.5-3.3h-10v6.6zm0 13.5h10.8c2.5 0 4-1.4 4-3.6s-1.5-3.6-4-3.6H33.2v7.2zm35.6-27h7.3l13.1 22.8V10.7h7.1v33.5h-7.3L76.1 21.8v22.4H69V10.7zm55.9-.5c8.5 0 14.4 5.3 14.9 13.1h-7.2c-.5-3.8-3.5-6.3-7.7-6.3-4.8 0-8 3.7-8 9.7s3.2 9.7 8 9.7c4.2 0 7.2-2.5 7.7-6.3h7.2c-.5 7.8-6.4 13.1-14.9 13.1-9.3 0-15.6-6.4-15.6-16.5s6.3-16.5 15.6-16.5zm24.4.5h7.3v33.5h-7.3V10.7zm16.9 24.1h7c.6 3 3 4.7 6.7 4.7 3.4 0 5.6-1.5 5.6-3.9 0-2.1-1.4-3.2-5.8-4.1l-3.5-.7c-6.9-1.4-10.3-4.8-10.3-10.1 0-6.1 5-10.5 12.4-10.5 7.6 0 12.4 4.1 13 10.5h-6.9c-.5-2.7-2.7-4.3-6.1-4.3-3.2 0-5.2 1.5-5.2 3.7 0 2 1.5 3.1 5.3 3.8l3.5.7c7.3 1.5 10.8 4.8 10.8 10.4 0 6.4-5.2 10.8-13 10.8-8.1 0-13.1-4.1-13.5-11zm35.5-24.1h26.5v6.6h-9.6v26.9h-7.3V17.3h-9.6v-6.6zm38.4 0h26.2v6.3h-18.9v7.4h17.4v6.1h-17.4v7.5h18.9v6.2h-26.2V10.7zm35.7 0h18.6c5.6 0 9.8 3.6 9.8 8.6 0 3.7-1.9 6.3-5 7.6 3.7 1.2 6 4 6 7.9 0 5.7-4.4 9.4-10.6 9.4h-18.8V10.7zm7.3 13.5h10c2.2 0 3.5-1.3 3.5-3.3s-1.3-3.3-3.5-3.3h-10v6.6zm0 13.5h10.8c2.5 0 4-1.4 4-3.6s-1.5-3.6-4-3.6h-10.8v7.2z"/>
      </svg>
    ),
  },
  {
    name: "Google",
    svg: (
      <svg viewBox="0 0 48 48" width="14" height="14" fill="currentColor">
        <path d="M43.6 20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.5-7.7 19.5-20 0-1.3-.1-2.7-.4-4h.5z"/>
      </svg>
    ),
  },
  {
    name: "Motorola",
    svg: (
      <svg viewBox="0 0 100 100" width="14" height="14" fill="currentColor">
        <path d="M50 5C25.1 5 5 25.1 5 50s20.1 45 45 45 45-20.1 45-45S74.9 5 50 5zm0 8c10.3 0 19.7 3.8 26.8 10L63 36.8c-3.5-2.7-7.9-4.3-12.7-4.4v-.1h-.6c-4.8 0-9.2 1.6-12.7 4.4L23.2 23C30.3 16.8 39.7 13 50 13zm0 74C29.6 87 13 70.4 13 50c0-8.1 2.6-15.6 7-21.7l13.5 13.5C31.4 44.4 30 47.1 30 50c0 11 9 20 20 20s20-9 20-20c0-2.9-1.4-5.6-3.5-8.2L80 28.3c4.4 6.1 7 13.6 7 21.7 0 20.4-16.6 37-37 37z"/>
      </svg>
    ),
  },
  {
    name: "OnePlus",
    svg: (
      <svg viewBox="0 0 60 24" width="48" height="12" fill="currentColor">
        <path d="M3.8 0C1.7 0 0 1.7 0 3.8v16.4C0 22.3 1.7 24 3.8 24h52.4c2.1 0 3.8-1.7 3.8-3.8V3.8C60 1.7 58.3 0 56.2 0H3.8zm8.6 6h3.1v5.4h3.8V6h3.1v12.1h-3.1v-4.3h-3.8v4.3h-3.1V6zm12.1 0h3.1v9.8h5.3v2.3H24.5V6zm11.3 0h9v2.3h-5.9v2.5h5.4v2.2h-5.4v2.8h6.1v2.3h-9.2V6zm12.6 2.8v-2.8h3.1v2.8h2.5v2.3h-2.5v4c0 .8.3 1.1 1.1 1.1h1.4v2.3h-2.1c-2 0-3.5-.9-3.5-3.1v-4.3h-1.6V8.8h1.6z"/>
      </svg>
    ),
  },
];

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { open: openModal } = useModal();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const textY       = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: 680,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Full-bleed phone colour carousel */}
      <div style={{ position: "absolute", inset: 0 }}>
        <ImageCarousel
          images={HERO_IMAGES}
          interval={3200}
          objectFit="cover"
          objectPosition="center 20%"
          background="#fff"
        />
      </div>

      {/* Top fade — navbar bleed */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto",
          height: 220,
          background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.65) 55%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Bottom fade — text area */}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0",
          height: "55%",
          background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.94) 28%, rgba(255,255,255,0.55) 58%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Text */}
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          y: textY,
          opacity: textOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px clamp(48px, 10vw, 92px)",
        }}
      >
        {/* Brand logos strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(18px, 3vw, 36px)",
            marginBottom: 26,
            color: "#c7c7cc",
          }}
        >
          {BRANDS.map((b, i) => (
            <motion.span
              key={b.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.12 + i * 0.07 }}
              title={b.name}
              style={{ display: "flex", alignItems: "center", opacity: 0.45 }}
            >
              {b.svg}
            </motion.span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: "clamp(64px, 17vw, 140px)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.94, color: "#1d1d1f", marginBottom: 22 }}
        >
          CELLZY.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
          style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.35, color: "#6e6e73", marginBottom: 38, maxWidth: 380 }}
        >
          Your device, perfected.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          <a href="#shop" className="btn btn-dark btn-lg">Explore</a>
          <button onClick={() => openModal("repair")} className="btn btn-outline btn-lg">
            Book Repair
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          opacity: hintOpacity,
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#c7c7cc" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
          style={{ width: 1, height: 32, borderRadius: 999, background: "linear-gradient(to bottom, rgba(0,0,0,0.18), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
