"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ImageCarousel from "./ImageCarousel";
import { useModal, ModalType } from "./ModalProvider";

// Portrait product-viewer images — full phone visible, no crop
const PHONE_IMGS = [
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/initial__d2ghrz27b54y_large.jpg",        alt: "iPhone 17 Pro"        },
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_silver__eb8fu7zfvwmu_large.jpg",  alt: "iPhone 17 Pro Silver" },
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_blue__li170wg4gkae_large.jpg",    alt: "iPhone 17 Pro Blue"   },
  { src: "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/colors_orange__cr2oq3n1dwk2_large.jpg",  alt: "iPhone 17 Pro Orange" },
];

const CASE_IMGS = [
  { src: "https://images.unsplash.com/photo-1603145733146-ae562a55031e?w=2400&q=90&fit=crop&auto=format", alt: "Premium amber case" },
  { src: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=2400&q=90&fit=crop&auto=format", alt: "Cases collection" },
  { src: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=2400&q=90&fit=crop&auto=format", alt: "Phone accessories" },
];

type CTA = { label: string; href?: string; modal?: ModalType; primary: boolean };

const CARDS: {
  id: string;
  eyebrow: string;
  headline: string;
  sub: string;
  ctas: CTA[];
  carousel?: { src: string; alt: string }[];
  img?: string;
  interval?: number;
  span: "half" | "full";
  imgFit?: "cover" | "contain";
  imgBg?: string;
}[] = [
  {
    id: "phones",
    eyebrow: "New Arrivals",
    headline: "The latest\nflagships.",
    sub: "Apple · Samsung · Google",
    ctas: [
      { label: "Shop now",    href: "#accessories-phones", primary: true  },
      { label: "Learn more", href: "#accessories-phones", primary: false },
    ],
    span: "half",
    carousel: PHONE_IMGS,
    interval: 3500,
    imgFit: "contain",
    imgBg: "#0a0a0a",
  },
  {
    id: "cases",
    eyebrow: "Accessories",
    headline: "Protection\nperfected.",
    sub: "Cases for every model.",
    ctas: [
      { label: "Shop cases",  href: "#accessories", primary: true  },
      { label: "Learn more", href: "#accessories",  primary: false },
    ],
    span: "half",
    carousel: CASE_IMGS,
    interval: 3000,
  },
  {
    id: "repairs-card",
    eyebrow: "Repair Hub",
    headline: "Expert repair.\nDone right.",
    sub: "Most jobs completed same day. 90-day guarantee.",
    ctas: [
      { label: "Book a repair", modal: "repair", primary: true  },
      { label: "See services",  href: "#repairs",  primary: false },
    ],
    span: "full",
    img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=2400&q=90&fit=crop&auto=format",
  },
];

function Card({ card, index }: { card: (typeof CARDS)[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const { open: openModal } = useModal();
  const isHalf = card.span === "half";

  return (
    <motion.div
      ref={ref}
      className="img-hover"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        minHeight: isHalf ? 560 : 500,
        gridColumn: card.span === "full" ? "1 / -1" : undefined,
      }}
    >
      {/* Image / Carousel */}
      {card.carousel ? (
        <div style={{ position: "absolute", inset: 0 }}>
          <ImageCarousel
            images={card.carousel}
            interval={card.interval ?? 3500}
            objectFit={card.imgFit ?? "cover"}
            background={card.imgBg ?? "transparent"}
          />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.img}
          alt={card.headline.replace("\n", " ")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          draggable={false}
        />
      )}

      {/* Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.44) 40%, rgba(0,0,0,0) 68%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(24px, 5vw, 52px)",
          zIndex: 3,
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
          {card.eyebrow}
        </p>

        <h3 style={{ fontSize: "clamp(30px, 4.5vw, 58px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#fff", whiteSpace: "pre-line", marginBottom: 14 }}>
          {card.headline}
        </h3>

        <p style={{ fontSize: "clamp(14px, 1.5vw, 17px)", fontWeight: 300, color: "rgba(255,255,255,0.65)", marginBottom: 30, lineHeight: 1.55 }}>
          {card.sub}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {card.ctas.map(cta =>
            cta.modal ? (
              <button
                key={cta.label}
                onClick={() => openModal(cta.modal!)}
                className={`btn btn-sm ${cta.primary ? "btn-white" : "btn-ghost"}`}
              >
                {cta.label}
              </button>
            ) : (
              <a
                key={cta.label}
                href={cta.href}
                className={`btn btn-sm ${cta.primary ? "btn-white" : "btn-ghost"}`}
              >
                {cta.label}
              </a>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductGrid() {
  return (
    <section
      id="shop"
      style={{ background: "#f5f5f7", padding: "clamp(6px, 1vw, 12px)" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "clamp(6px, 1vw, 12px)",
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        {CARDS.map((card, i) => (
          <Card key={card.id} card={card} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 680px) {
          #shop > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
