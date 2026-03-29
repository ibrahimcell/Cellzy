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

// Brand logos — Apple, Samsung, Google, Motorola, Huawei, OnePlus
const BRANDS = [
  {
    name: "Apple",
    svg: (
      <svg viewBox="0 0 814 1000" width="14" height="14" fill="currentColor">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 71 0 130.1 46.4 174.4 46.4 42.7 0 109.2-49 192.3-49 33.4 0 135.7 3.2 213.4 106.3zm-174.4-92.9c-7.7 35.8-29.4 71.3-56.7 95.5-29.4 26.6-65.8 47.3-102.2 47.3-3.2 0-6.4-.3-9.6-.7-1.3-36.4 11.6-73.7 33-100.6 22.6-28.3 60.7-52.6 103.5-65.3 3.5-.9 6.4-1.3 9.3-1.3.6 0 1.3.1 1.9.1 1.2 8.4 1.9 16.4 1.9 24.3z"/>
      </svg>
    ),
  },
  {
    name: "Samsung",
    svg: (
      <svg viewBox="0 0 190 28" width="76" height="11" fill="currentColor">
        <path d="M15.7 0C7 0 0 7 0 15.7v-3.3C0 5.6 5.6 0 12.4 0h165.2C184.4 0 190 5.6 190 12.4v3.3C190 7 183 0 174.3 0H15.7zM0 12.4C0 5.6 5.6 0 12.4 0h165.2C184.4 0 190 5.6 190 12.4v3.2C190 21.7 184.4 27.2 177.6 27.2H12.4C5.6 27.2 0 21.7 0 15.6v-3.2zM14 6.2h10.8c3.2 0 5.6 2 5.6 5 0 2.1-1.1 3.6-2.8 4.3 2.1.7 3.4 2.3 3.4 4.5 0 3.3-2.5 5.4-6 5.4H14V6.2zm4.2 7.7h5.7c1.2 0 2-.7 2-1.9 0-1.1-.8-1.9-2-1.9h-5.7v3.8zm0 7.7h6.2c1.4 0 2.3-.8 2.3-2.1 0-1.2-.9-2-2.3-2h-6.2v4.1zm22.5-15.4h4.2l7.5 13.1V6.2h4.1v19.2h-4.2l-7.6-12.8v12.8h-4V6.2zm34.6-.3c4.9 0 8.3 3 8.6 7.5h-4.1c-.3-2.2-2-3.6-4.4-3.6-2.8 0-4.6 2.1-4.6 5.6s1.8 5.6 4.6 5.6c2.4 0 4.1-1.4 4.4-3.6h4.1c-.3 4.5-3.7 7.5-8.6 7.5-5.3 0-9-3.7-9-9.5s3.7-9.5 9-9.5zm13.9.3h4.2v19.2h-4.2V6.2zm9.7 13.8h4c.4 1.7 1.7 2.7 3.8 2.7 2 0 3.2-.9 3.2-2.2 0-1.2-.8-1.9-3.3-2.4l-2-.4c-4-1-5.9-2.8-5.9-5.8 0-3.5 2.9-6 7.1-6 4.3 0 7.1 2.4 7.4 6H109c-.3-1.5-1.5-2.5-3.5-2.5-1.8 0-3 .9-3 2.1 0 1.1.9 1.8 3 2.2l2 .4c4.2.9 6.2 2.8 6.2 6 0 3.7-3 6.2-7.5 6.2-4.6 0-7.5-2.4-7.7-6.3zm20.4-13.8h15.2v3.8h-5.5v15.4h-4.2V10h-5.5V6.2zm21.9 0h15v3.6h-10.8v4.2h10v3.5h-10v4.3h10.8v3.6H141V6.2zm20.5 0h10.8c3.2 0 5.6 2 5.6 5 0 2.1-1.1 3.6-2.8 4.3 2.1.7 3.4 2.3 3.4 4.5 0 3.3-2.5 5.4-6 5.4h-11V6.2zm4.1 7.7h5.7c1.2 0 2-.7 2-1.9 0-1.1-.8-1.9-2-1.9h-5.7v3.8zm0 7.7h6.2c1.4 0 2.3-.8 2.3-2.1 0-1.2-.9-2-2.3-2h-6.2v4.1z"/>
      </svg>
    ),
  },
  {
    name: "Google",
    svg: (
      <svg viewBox="0 0 272 92" width="52" height="16" fill="currentColor">
        <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44zM163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44zM209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36zM224 3v65h-9.5V3h9.5zM262.67 54.7l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93zM35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.67H35.29z"/>
      </svg>
    ),
  },
  {
    name: "Motorola",
    svg: (
      <svg viewBox="0 0 100 100" width="14" height="14" fill="currentColor">
        <path d="M50 4C24.6 4 4 24.6 4 50s20.6 46 46 46 46-20.6 46-46S75.4 4 50 4zm0 8.5c10.1 0 19.3 3.7 26.3 9.8L63.2 35.4c-3.5-2.6-7.8-4.2-12.5-4.2h-.7c-4.7.1-9 1.6-12.5 4.2L24.4 22.4C31.4 16.3 40.2 12.5 50 12.5zM50 87.5C29.2 87.5 12.5 70.8 12.5 50c0-7.9 2.5-15.3 6.8-21.3l13.2 13.2c-2 2.5-3.2 5.7-3.2 9.1 0 8.1 6.6 14.7 14.7 14.7S58.7 59.1 58.7 51c0-3.4-1.2-6.6-3.2-9.1l13.2-13.2c4.3 6 6.8 13.4 6.8 21.3 0 20.8-16.7 37.5-37.5 37.5z"/>
      </svg>
    ),
  },
  {
    name: "Huawei",
    svg: (
      <svg viewBox="-50 -50 100 100" width="14" height="14" fill="currentColor">
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(0)"/>
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(45)"/>
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(90)"/>
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(135)"/>
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(180)"/>
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(225)"/>
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(270)"/>
        <path d="M0,-4 C3,-10 3,-28 0,-35 C-3,-28 -3,-10 0,-4z" transform="rotate(315)"/>
      </svg>
    ),
  },
  {
    name: "OnePlus",
    svg: (
      <svg viewBox="0 0 130 40" width="52" height="14" fill="currentColor">
        <path d="M10.2 0C4.6 0 0 4.6 0 10.2v19.6C0 35.4 4.6 40 10.2 40h109.6c5.6 0 10.2-4.6 10.2-10.2V10.2C130 4.6 125.4 0 119.8 0H10.2zM24 10h8.3v7.3h5.1V10h8.4v20H37.4v-5.8h-5.1v5.8H24V10zm23.2 0h8.3v13.3h7.2V30H47.2V10zm15.3 0h24.4v3.2l-16.2 9.6h16.2V30H62.5v-3.2L78.6 17H62.5v-7zm26.5 3.8V10h8.3v3.8h3.4v6.2h-3.4v5.4c0 1.1.4 1.5 1.5 1.5h1.9V30h-2.8c-2.7 0-4.7-1.2-4.7-4.2v-5.8H92v-6.2h2.1-.1z"/>
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
