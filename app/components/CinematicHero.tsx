"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=2400&q=90&fit=crop&auto=format`;

// Every product category the store sells — rotates in the hero
const SLIDES = [
  {
    src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/welcome/hero__bsveixlwbms2_xlarge.jpg",
    label: "Phones",
    sub: "iPhone · Samsung · Google",
    pos: "center 28%",
  },
  {
    src: "https://www.apple.com/v/airpods-max/k/images/overview/welcome/max-loop_startframe__c0vn1ukmh7ma_xlarge.jpg",
    label: "Audio",
    sub: "AirPods · JBL · Samsung",
    pos: "center center",
  },
  {
    src: U("photo-1662647343354-5a03bbbd1d45"),
    label: "Speakers",
    sub: "Waterproof · Portable · Party",
    pos: "center center",
  },
  {
    src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/cameras/intro/hero_camera__f42igewygpqy_xlarge.jpg",
    label: "iPhone 17 Pro",
    sub: "Camera system — in store now",
    pos: "center center",
  },
  {
    src: U("photo-1583373351761-fa9e3a19c99d"),
    label: "Headphones",
    sub: "JBL · Over-ear · On-ear",
    pos: "center 40%",
  },
  {
    src: U("photo-1598978465764-7db2b679c694"),
    label: "Charging",
    sub: "MagSafe · GaN · Car chargers",
    pos: "center center",
  },
  {
    src: U("photo-1603145733146-ae562a55031e"),
    label: "Cases",
    sub: "OtterBox · UAG · iPad cases",
    pos: "center center",
  },
  {
    src: U("photo-1632156752398-2b2cb4e6c907"),
    label: "Accessories",
    sub: "Belkin · Anker · Cables · Hubs",
    pos: "center center",
  },
  {
    src: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=2400&q=90&fit=crop&auto=format",
    label: "Repairs",
    sub: "Same-day · 90-day warranty",
    pos: "center center",
  },
];

const SLIDE_DURATION = 5400; // ms each slide stays

export default function CinematicHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex(i => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0a0a0a" }}>

      {/* Sliding product images */}
      <AnimatePresence mode="sync">
        <motion.img
          key={index}
          src={slide.src}
          alt={slide.label}
          draggable={false}
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 1, scale: 1.09 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.3, ease: "easeInOut" },
            scale:   { duration: SLIDE_DURATION / 1000 + 1.3, ease: "linear" },
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: slide.pos,
          }}
        />
      </AnimatePresence>

      {/* Category label — bottom-left pill, animates with each slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${index}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            bottom: "clamp(100px, 20vw, 180px)",
            left: "clamp(24px, 6vw, 96px)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "flex-start",
          }}
        >
          <span style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 999,
            padding: "6px 16px",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
          }}>
            {slide.label}
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.5)",
            paddingLeft: 4,
          }}>
            {slide.sub}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{
        position: "absolute",
        bottom: "clamp(90px, 18vw, 162px)",
        right: "clamp(24px, 6vw, 96px)",
        zIndex: 10,
        display: "flex",
        gap: 6,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 24 : 6,
              height: 6,
              borderRadius: 999,
              background: i === index ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.3)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.25s ease",
            }}
            aria-label={`Go to ${SLIDES[i].label}`}
          />
        ))}
      </div>

    </div>
  );
}
