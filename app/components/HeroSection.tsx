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

// Brand names
const BRANDS = ["Apple", "Samsung", "Google", "Motorola", "Huawei", "OnePlus"];

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
          {BRANDS.map((brand, i) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.12 + i * 0.07 }}
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {brand}
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
