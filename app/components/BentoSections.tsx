"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import ImageCarousel from "./ImageCarousel";
import { useModal, ModalType } from "./ModalProvider";

// ── Image sets ────────────────────────────────────────────────────────────────
const PHONE_IMAGES = [
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/welcome/hero__bsveixlwbms2_xlarge.jpg",              alt: "iPhone 17 Pro"        },
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_silver__eb8fu7zfvwmu_large.jpg", alt: "iPhone 17 Pro Silver" },
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_blue__li170wg4gkae_large.jpg",   alt: "iPhone 17 Pro Blue"   },
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/cameras/intro/hero_camera__f42igewygpqy_xlarge.jpg",   alt: "iPhone 17 Pro Camera" },
];

const CASE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=2400&q=90&fit=crop&auto=format", alt: "iPhone in amber case" },
  { src: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=2400&q=90&fit=crop&auto=format", alt: "Cases collection" },
  { src: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=2400&q=90&fit=crop&auto=format", alt: "Accessories flatlay" },
];

const REPAIR_IMAGES = [
  { src: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=2400&q=90&fit=crop&auto=format", alt: "Phone repair technician" },
  { src: "https://images.unsplash.com/photo-1616628188550-808682f3926d?w=2400&q=90&fit=crop&auto=format", alt: "iPhone screen repair"    },
];

// ── Parallax ──────────────────────────────────────────────────────────────────
function Parallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const y   = useSpring(raw, { stiffness: 60, damping: 20, mass: 0.7 });
  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <motion.div style={{ y, position: "absolute", inset: "-6%", width: "100%", height: "112%" }}>
        {children}
      </motion.div>
    </div>
  );
}

// ── Reveal ────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const STATS = [
    { val: "200+",   label: "Devices in stock" },
    { val: "10k+",   label: "Happy customers"  },
    { val: "45min",  label: "Avg repair time"  },
    { val: "90-day", label: "Repair warranty"  },
  ];

  return (
    <div ref={ref} style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      <div
        id="stats-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: i * 0.1, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(36px, 5vw, 60px) 20px",
              textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(0,0,0,0.07)" : undefined,
            }}
          >
            <div style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, letterSpacing: "-0.05em", color: "#1d1d1f", lineHeight: 1, marginBottom: 10 }}>
              {s.val}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#6e6e73", letterSpacing: "0.02em" }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 600px) {
          #stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          #stats-grid > div:nth-child(2) { border-right: none !important; }
          #stats-grid > div:nth-child(odd) { border-right: 1px solid rgba(0,0,0,0.07) !important; }
          #stats-grid > div:nth-child(1),
          #stats-grid > div:nth-child(2) { border-bottom: 1px solid rgba(0,0,0,0.07); }
        }
      `}</style>
    </div>
  );
}

// ── Bento block ───────────────────────────────────────────────────────────────
function BentoBlock({
  id, carousel, eyebrow, headline, sub, cta, href, modal, align = "left", bg = "white",
}: {
  id: string;
  carousel: React.ReactNode;
  eyebrow: string;
  headline: React.ReactNode;
  sub: string;
  cta: string;
  href: string;
  modal?: ModalType;
  align?: "left" | "right";
  bg?: "white" | "gray";
}) {
  const right = align === "right";
  const { open: openModal } = useModal();

  return (
    <section id={id} style={{ background: bg === "white" ? "#fff" : "#f5f5f7" }}>

      {/* Image */}
      <div
        className="img-hover"
        style={{ height: "clamp(300px, 55vw, 700px)", width: "100%", overflow: "hidden", position: "relative" }}
      >
        <Parallax>{carousel}</Parallax>
      </div>

      {/* Text */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(56px, 9vw, 120px) clamp(24px, 6vw, 96px)",
          display: "flex",
          flexDirection: "column",
          alignItems: right ? "flex-end" : "flex-start",
          textAlign: right ? "right" : "left",
        }}
      >
        <Reveal>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 22 }}>
            {eyebrow}
          </p>

          <h2 style={{ fontSize: "clamp(44px, 8vw, 96px)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.96, color: "#1d1d1f", marginBottom: 28 }}>
            {headline}
          </h2>

          <p style={{ fontSize: "clamp(16px, 1.8vw, 21px)", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.65, color: "#6e6e73", maxWidth: 500, marginBottom: 44 }}>
            {sub}
          </p>

          {modal ? (
            <button onClick={() => openModal(modal)} className={`btn btn-lg ${right ? "btn-outline" : "btn-dark"}`}>
              {cta} &nbsp;→
            </button>
          ) : (
            <a href={href} className={`btn btn-lg ${right ? "btn-outline" : "btn-dark"}`}>
              {cta} &nbsp;→
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function BentoSections() {
  return (
    <>
      <StatsStrip />

      <BentoBlock
        id="accessories-phones"
        carousel={<ImageCarousel images={PHONE_IMAGES} interval={3500} />}
        eyebrow="New Arrivals — Phones"
        headline={<>The latest<br />flagships.</>}
        sub="Every device tested, certified, and unlocked. New and certified-refurbished models from Apple, Samsung, Google, and more."
        cta="Shop Phones"
        href="#shop"
        align="left"
        bg="white"
      />

      <BentoBlock
        id="accessories"
        carousel={<ImageCarousel images={CASE_IMAGES} interval={3000} />}
        eyebrow="Premium Cases"
        headline={<>Protection<br />perfected.</>}
        sub="Military-grade clear and leather cases precision-fit for every model. Tested to 2,000 drops. Available in 14 finishes."
        cta="Shop Cases"
        href="#accessories"
        align="right"
        bg="gray"
      />

      <BentoBlock
        id="repairs"
        carousel={<ImageCarousel images={REPAIR_IMAGES} interval={4000} />}
        eyebrow="Repair Hub"
        headline={<>Expert repair<br />for all models.</>}
        sub="Certified technicians. Genuine OEM parts. Screen, battery, water damage and more — most jobs completed same day with a 90-day warranty."
        cta="Book a Repair"
        href="#repairs"
        modal="repair"
        align="left"
        bg="white"
      />
    </>
  );
}
