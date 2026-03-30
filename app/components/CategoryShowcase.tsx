"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import ImageCarousel from "./ImageCarousel";

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=1400&q=85&fit=crop&auto=format`;

const CATEGORIES = [
  {
    id: "phones",
    href: "#shop",
    label: "Phones",
    sub: "iPhone · Samsung · Google",
    images: [
      { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/welcome/hero__bsveixlwbms2_xlarge.jpg", alt: "iPhone 17 Pro" },
      { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/welcome/hero_endframe__gb7f6nb06rau_xlarge.jpg", alt: "iPhone angle" },
    ],
    interval: 4500,
    pos: "center 28%",
  },
  {
    id: "audio",
    href: "#audio",
    label: "Audio",
    sub: "AirPods · JBL · Samsung",
    images: [
      { src: "https://www.apple.com/v/airpods-max/k/images/overview/welcome/max-loop_startframe__c0vn1ukmh7ma_xlarge.jpg", alt: "AirPods Max" },
      { src: "https://www.apple.com/v/airpods-pro/r/images/overview/welcome/hero__b0eal3mn03ua_large.jpg", alt: "AirPods Pro" },
      { src: U("photo-1583373351761-fa9e3a19c99d"), alt: "JBL headphones" },
    ],
    interval: 3200,
    pos: "center center",
  },
  {
    id: "speakers",
    href: "#speakers",
    label: "Speakers",
    sub: "JBL · Bose · Marshall · UE",
    images: [
      { src: U("photo-1690455422058-156a39f18a0a"), alt: "JBL Flip 5" },
      { src: U("photo-1598034989845-48532781987e"), alt: "UE WONDERBOOM" },
      { src: U("photo-1643901102317-b430b45e4cce"), alt: "Marshall Emberton" },
    ],
    interval: 3500,
    pos: "center center",
  },
  {
    id: "cases",
    href: "#cases-accessories",
    label: "Cases",
    sub: "OtterBox · UAG · iPad · Folio",
    images: [
      { src: U("photo-1603145733146-ae562a55031e"), alt: "Phone case" },
      { src: U("photo-1565849904461-04a58ad377e0"), alt: "OtterBox case" },
      { src: U("photo-1585789217603-8307a18afb84"), alt: "iPad case" },
    ],
    interval: 3800,
    pos: "center center",
  },
  {
    id: "chargers",
    href: "#chargers",
    label: "Charging",
    sub: "MagSafe · GaN · Car · Multi-port",
    images: [
      { src: U("photo-1598978465764-7db2b679c694"), alt: "Wireless charging pad" },
      { src: U("photo-1666459956903-f71d44a5e927"), alt: "Car charger" },
      { src: U("photo-1653617748434-7dc143f8223e"), alt: "Multi-port charger" },
    ],
    interval: 3600,
    pos: "center center",
  },
  {
    id: "repairs",
    href: "#repairs",
    label: "Repairs",
    sub: "Same-day · 90-day warranty",
    images: [
      { src: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1400&q=85&fit=crop&auto=format", alt: "Device repair" },
      { src: U("photo-1581092335397-9583eb92d232"), alt: "Phone repair" },
    ],
    interval: 4200,
    pos: "center center",
  },
];

// ─── Single category tile ─────────────────────────────────────────────────────

function CategoryTile({
  cat,
  index,
  tall = false,
}: {
  cat: (typeof CATEGORIES)[0];
  index: number;
  tall?: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [ 4, -4]), { stiffness: 200, damping: 26 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-4,  4]), { stiffness: 200, damping: 26 });

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
      onMouseMove={move}
      onMouseLeave={reset}
    >
      <motion.a
        href={cat.href}
        style={{
          display: "block",
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          minHeight: tall ? 480 : 360,
          textDecoration: "none",
          cursor: "pointer",
          rotateX: rotX,
          rotateY: rotY,
        }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Rotating product images */}
        <div style={{ position: "absolute", inset: 0 }}>
          <ImageCarousel
            images={cat.images}
            interval={cat.interval}
            objectPosition={cat.pos}
          />
        </div>

        {/* Soft vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 45%)",
        }} />

        {/* Frosted glass label */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "clamp(16px, 2.5vw, 26px)",
          background: "rgba(0,0,0,0.28)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          zIndex: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <p style={{ fontSize: "clamp(17px, 1.8vw, 22px)", fontWeight: 700, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.97)", lineHeight: 1.2, marginBottom: 3 }}>
              {cat.label}
            </p>
            <p style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,0.58)", letterSpacing: "0.01em" }}>
              {cat.sub}
            </p>
          </div>
          <span style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            fontSize: 16,
            color: "rgba(255,255,255,0.85)",
          }}>
            →
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function Header() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: "center", marginBottom: "clamp(28px, 4vw, 52px)" }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 16 }}>
        Shop by Category
      </p>
      <h2 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#1d1d1f" }}>
        Everything you need.
      </h2>
    </motion.div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function CategoryShowcase() {
  return (
    <section style={{ background: "#fff", padding: "clamp(56px, 9vw, 112px) clamp(12px, 2vw, 20px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <Header />

        {/* Row 1 — phones wide, audio, speakers */}
        <div
          id="cat-row1"
          style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)", marginBottom: "clamp(8px, 1.2vw, 16px)" }}
        >
          <CategoryTile cat={CATEGORIES[0]} index={0} tall />
          <CategoryTile cat={CATEGORIES[1]} index={1} tall />
          <CategoryTile cat={CATEGORIES[2]} index={2} tall />
        </div>

        {/* Row 2 — cases, charging, repairs */}
        <div
          id="cat-row2"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: "clamp(8px, 1.2vw, 16px)" }}
        >
          <CategoryTile cat={CATEGORIES[3]} index={3} />
          <CategoryTile cat={CATEGORIES[4]} index={4} />
          <CategoryTile cat={CATEGORIES[5]} index={5} />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #cat-row1, #cat-row2 { grid-template-columns: 1fr 1fr !important; }
          #cat-row1 > div:last-child { display: none; }
        }
        @media (max-width: 560px) {
          #cat-row1, #cat-row2 { grid-template-columns: 1fr !important; }
          #cat-row1 > div:last-child { display: block; }
        }
      `}</style>
    </section>
  );
}
