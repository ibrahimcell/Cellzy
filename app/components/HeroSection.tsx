"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useModal } from "./ModalProvider";
import CinematicHero from "./CinematicHero";

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
        background: "#0a0a0a",
      }}
    >
      {/* Cinematic zoom hero */}
      <div style={{ position: "absolute", inset: 0 }}>
        <CinematicHero />
      </div>

      {/* Top fade — navbar bleed */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto",
          height: 200,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Bottom fade — text area */}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0",
          height: "60%",
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 28%, rgba(0,0,0,0.3) 60%, transparent 100%)",
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
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(64px, 17vw, 140px)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.94,
            background: "linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.68) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 22,
          }}
        >
          CELLZY.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
          style={{
            fontSize: "clamp(18px, 3vw, 26px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.35,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 38,
            maxWidth: 380,
          }}
        >
          Your device, perfected.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          <a href="#shop" className="btn btn-white btn-lg">Explore</a>
          <button onClick={() => openModal("repair")} className="btn btn-ghost btn-lg">
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
        <span style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
          style={{ width: 1, height: 32, borderRadius: 999, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
        />
      </motion.div>
    </section>
  );
}
