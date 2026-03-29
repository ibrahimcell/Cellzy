"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useModal } from "./ModalProvider";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { open: openModal } = useModal();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgY        = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY       = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: 640,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Background photo — parallax */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          y: imgY,
          scale: 1.14,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=2400&q=90&fit=crop&auto=format"
          alt="Premium smartphone"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          draggable={false}
        />
      </motion.div>

      {/* Top fade — navbar area */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto",
          height: 180,
          background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Bottom fade — text area */}
      <div
        style={{
          position: "absolute",
          inset: "auto 0 0",
          height: "65%",
          background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 28%, rgba(255,255,255,0.6) 55%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Text content */}
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
          padding: "0 24px clamp(56px, 10vw, 96px)",
        }}
      >
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#aeaeb2",
            marginBottom: 20,
          }}
        >
          Premium Retail &amp; Expert Repairs
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(64px, 17vw, 140px)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.94,
            color: "#1d1d1f",
            marginBottom: 24,
          }}
        >
          CELLZY.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          style={{
            fontSize: "clamp(18px, 3vw, 26px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.35,
            color: "#6e6e73",
            marginBottom: 40,
            maxWidth: 380,
          }}
        >
          Your device, perfected.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}
        >
          <a href="#shop" className="btn btn-dark btn-lg">
            Explore
          </a>
          <button
            onClick={() => openModal("repair")}
            className="btn btn-outline btn-lg"
          >
            Book Repair
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
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
        <span style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#c7c7cc" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 32,
            borderRadius: 999,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.22), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
