"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ImageCarousel from "./ImageCarousel";
import { useModal } from "./ModalProvider";

// ─────────────────────────────────────────────────────────────
// IMAGE SETS
// ─────────────────────────────────────────────────────────────

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=1800&q=88&fit=crop&auto=format`;

// Audio ── Headphones & Earbuds
const AIRPODS_MAX_IMGS = [
  { src: "https://www.apple.com/v/airpods-max/k/images/overview/welcome/max-loop_startframe__c0vn1ukmh7ma_xlarge.jpg", alt: "AirPods Max" },
  { src: "https://www.apple.com/v/airpods-max/k/images/overview/media-card/hifi_static__fbsq0dr3be2q_xlarge.jpg",      alt: "AirPods Max — Hi-Fi" },
  { src: "https://www.apple.com/v/airpods-max/k/images/overview/media-card/anc_endframe__c4dezlznnsmu_xlarge.jpg",     alt: "AirPods Max — ANC" },
  { src: "https://www.apple.com/v/airpods-max/k/images/overview/product-stories/anc/anc_airpod_max_lifestyle__duzobvqwpz42_large.jpg", alt: "AirPods Max lifestyle" },
];

const AIRPODS_PRO_IMGS = [
  { src: "https://www.apple.com/v/airpods-pro/r/images/overview/welcome/hero__b0eal3mn03ua_large.jpg",                alt: "AirPods Pro 2" },
  { src: "https://www.apple.com/v/airpods-pro/r/images/overview/welcome/hero_endframe__vzawkxxoc72u_large.jpg",       alt: "AirPods Pro 2 — case" },
  { src: "https://www.apple.com/v/airpods-pro/r/images/overview/highlights/highlights_noise_cancellation__cxd50c0etw4m_large.jpg", alt: "AirPods Pro — ANC" },
];

const JBL_HEADPHONES_IMGS = [
  { src: U("photo-1583373351761-fa9e3a19c99d"), alt: "JBL headphones" },
  { src: U("photo-1595582693131-fd8df824174a"), alt: "Over-ear headphones" },
  { src: U("photo-1563882300207-835d544896ba"), alt: "Premium headphones" },
  { src: U("photo-1505740420928-5e560c06d30e"), alt: "Studio headphones" },
];

const GALAXY_BUDS_IMGS = [
  { src: U("photo-1618213520536-ce37aabcd9e5"), alt: "Samsung Galaxy Buds" },
  { src: U("photo-1546435770-a3e426bf472b"),    alt: "Wireless earbuds in case" },
  { src: U("photo-1609081219090-a6d81d3085bf"), alt: "AirPods Max — color" },
  { src: U("photo-1588156979435-379b9d365296"), alt: "AirPods Pro earbuds" },
];

// Speakers
const SPEAKERS_MAIN_IMGS = [
  { src: U("photo-1662647343354-5a03bbbd1d45"), alt: "Waterproof speaker outdoors" },
  { src: U("photo-1643385958950-8f0b8852171a"), alt: "Bluetooth speaker — water" },
  { src: U("photo-1545454675-3531b543be5d"),    alt: "Portable Bluetooth speaker" },
  { src: U("photo-1628329567705-f8f7150c3cff"), alt: "Wireless speaker" },
];

const SPEAKERS_SECONDARY_IMGS = [
  { src: U("photo-1484704849700-f032a568e944"), alt: "Premium audio setup" },
  { src: U("photo-1583394838336-acd977736f90"), alt: "Audio equipment" },
  { src: U("photo-1608043152269-423dbba4e7e1"), alt: "Wireless audio" },
];

// Chargers
const WIRELESS_CHARGER_IMGS = [
  { src: U("photo-1598978465764-7db2b679c694"), alt: "Wireless charging pad" },
  { src: U("photo-1542222216855-78ff1bcf9252"), alt: "MagSafe charging" },
  { src: U("photo-1617975426095-f073792aef15"), alt: "Wireless charger" },
];

const CAR_CHARGER_IMGS = [
  { src: U("photo-1666459956903-f71d44a5e927"), alt: "Car USB charger" },
  { src: U("photo-1558618666-fcd25c85cd64"),    alt: "Charging cable USB-C" },
  { src: U("photo-1585771724684-38269d6639fd"), alt: "Tech accessories charging" },
];

const MULTIPORT_CHARGER_IMGS = [
  { src: U("photo-1653617748434-7dc143f8223e"), alt: "Multi-port USB-C charger" },
  { src: U("photo-1624272673361-335d488ef9f7"), alt: "GaN wall charger" },
  { src: U("photo-1603899122911-27c0cb85824a"), alt: "USB charger hub" },
];

// Cases & Accessories
const OTTERBOX_IMGS = [
  { src: U("photo-1603145733146-ae562a55031e"), alt: "Premium phone case" },
  { src: U("photo-1565849904461-04a58ad377e0"), alt: "OtterBox rugged case" },
  { src: U("photo-1512054502232-10a0a035d672"), alt: "Phone protection" },
];

const IPAD_CASE_IMGS = [
  { src: U("photo-1585789217603-8307a18afb84"), alt: "iPad case" },
  { src: U("photo-1585786463773-adca330cf805"), alt: "iPad Pro case" },
];

const BELKIN_ANKER_IMGS = [
  { src: U("photo-1591536939620-a930ecb9e92c"), alt: "Belkin cable" },
  { src: U("photo-1632156752398-2b2cb4e6c907"), alt: "Anker power bank" },
  { src: U("photo-1566793474285-2decf0fc182a"), alt: "Anker charger" },
  { src: U("photo-1676116777245-1cc40079cd38"), alt: "Portable power bank" },
];

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 60px)" }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 16 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#1d1d1f", marginBottom: sub ? 18 : 0 }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", fontWeight: 300, color: "#6e6e73", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

function ProductCard({
  images, label, sub, interval = 3500, index = 0, tall = false,
}: {
  images: { src: string; alt: string }[];
  label: string;
  sub?: string;
  interval?: number;
  index?: number;
  tall?: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });

  return (
    <motion.div
      ref={ref}
      className="img-hover"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        minHeight: tall ? 560 : 420,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <ImageCarousel images={images} interval={interval} />
      </div>

      {/* gradient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 38%, transparent 65%)",
      }} />

      {/* label */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(18px, 3vw, 32px)", zIndex: 3 }}>
        <p style={{ fontSize: "clamp(18px, 2.2vw, 26px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>
          {label}
        </p>
        {sub && (
          <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────

function AudioSection() {
  return (
    <section id="audio" style={{ background: "#fff", padding: "clamp(64px, 10vw, 120px) clamp(12px, 2vw, 20px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Audio"
          title="Hear it all."
          sub="Premium earbuds, headphones, and over-ear cans from Apple, JBL, Samsung, and more."
        />

        {/* Row 1: AirPods Max (wide) + AirPods Pro */}
        <div id="audio-grid-1" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "clamp(8px, 1.2vw, 16px)", marginBottom: "clamp(8px, 1.2vw, 16px)" }}>
          <ProductCard
            images={AIRPODS_MAX_IMGS}
            label="AirPods Max"
            sub="Over-ear luxury. Computational audio."
            interval={4000}
            index={0}
            tall
          />
          <ProductCard
            images={AIRPODS_PRO_IMGS}
            label="AirPods Pro 2"
            sub="Active noise cancellation. Hearing health."
            interval={3500}
            index={1}
            tall
          />
        </div>

        {/* Row 2: JBL headphones + Galaxy Buds */}
        <div id="audio-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)" }}>
          <ProductCard
            images={JBL_HEADPHONES_IMGS}
            label="JBL & Premium Headphones"
            sub="Over-ear & on-ear. Every style, every budget."
            interval={3200}
            index={2}
          />
          <ProductCard
            images={GALAXY_BUDS_IMGS}
            label="Samsung Galaxy Buds & More"
            sub="True wireless. Adaptive sound."
            interval={3800}
            index={3}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          #audio-grid-1, #audio-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section id="speakers" style={{ background: "#f5f5f7", padding: "clamp(64px, 10vw, 120px) clamp(12px, 2vw, 20px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Speakers"
          title="Fill the room."
          sub="Waterproof, shockproof, go-anywhere portable speakers from JBL, Sony, Bose, and Ultimate Ears."
        />

        <div id="speakers-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)" }}>
          <ProductCard
            images={SPEAKERS_MAIN_IMGS}
            label="Waterproof Bluetooth"
            sub="IP67 rated. Drop-proof. Adventure-ready."
            interval={3500}
            index={0}
            tall
          />
          <ProductCard
            images={SPEAKERS_SECONDARY_IMGS}
            label="Home & Studio"
            sub="360° sound. Smart assistant. Room-filling bass."
            interval={4000}
            index={1}
            tall
          />
          <ProductCard
            images={[SPEAKERS_MAIN_IMGS[1], SPEAKERS_SECONDARY_IMGS[0], SPEAKERS_MAIN_IMGS[2]]}
            label="Party Speakers"
            sub="JBL PartyBoost. Loud, bright, unstoppable."
            interval={3000}
            index={2}
            tall
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #speakers-grid { grid-template-columns: 1fr 1fr !important; }
          #speakers-grid > div:last-child { display: none; }
        }
        @media (max-width: 600px) {
          #speakers-grid { grid-template-columns: 1fr !important; }
          #speakers-grid > div:last-child { display: block; }
        }
      `}</style>
    </section>
  );
}

function ChargersSection() {
  return (
    <section id="chargers" style={{ background: "#fff", padding: "clamp(64px, 10vw, 120px) clamp(12px, 2vw, 20px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Power & Charging"
          title="Always charged."
          sub="MagSafe, multi-port GaN, and car chargers from Anker, Belkin, and Apple."
        />

        <div id="chargers-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)" }}>
          <ProductCard
            images={WIRELESS_CHARGER_IMGS}
            label="MagSafe & Wireless Pads"
            sub="Apple MagSafe. Qi2. Belkin 3-in-1."
            interval={3500}
            index={0}
          />
          <ProductCard
            images={CAR_CHARGER_IMGS}
            label="Car Chargers"
            sub="USB-C & Qi wireless. Fast charge on the go."
            interval={3200}
            index={1}
          />
          <ProductCard
            images={MULTIPORT_CHARGER_IMGS}
            label="Multi-Port GaN Wall Chargers"
            sub="65W–200W. Anker & Belkin. Charge everything at once."
            interval={4000}
            index={2}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #chargers-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          #chargers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function CasesAccessoriesSection() {
  const { open: openModal } = useModal();

  return (
    <section id="cases-accessories" style={{ background: "#f5f5f7", padding: "clamp(64px, 10vw, 120px) clamp(12px, 2vw, 20px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHeader
          eyebrow="Cases & Accessories"
          title="Protect. Organise. Power."
          sub="OtterBox, UAG, Belkin, and Anker — the world's best-selling protective cases and accessories."
        />

        {/* Row 1: Otterbox (wide) + iPad cases */}
        <div id="cases-grid-1" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "clamp(8px, 1.2vw, 16px)", marginBottom: "clamp(8px, 1.2vw, 16px)" }}>
          <ProductCard
            images={OTTERBOX_IMGS}
            label="OtterBox & UAG Cases"
            sub="Military-grade drop protection. Every iPhone, every Samsung."
            interval={3500}
            index={0}
            tall
          />
          <ProductCard
            images={IPAD_CASE_IMGS}
            label="iPad Cases"
            sub="OtterBox Defender, Smart Folio, keyboard cases."
            interval={4000}
            index={1}
            tall
          />
        </div>

        {/* Row 2: Belkin & Anker (full width) */}
        <div id="cases-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(8px, 1.2vw, 16px)" }}>
          <motion.div
            className="img-hover"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", overflow: "hidden", borderRadius: 18, minHeight: 380 }}
          >
            <div style={{ position: "absolute", inset: 0 }}>
              <ImageCarousel images={BELKIN_ANKER_IMGS} interval={3200} />
            </div>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 35%, transparent 65%)",
            }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(24px, 4vw, 48px)", zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
              <div>
                <p style={{ fontSize: "clamp(22px, 3vw, 38px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", marginBottom: 6 }}>
                  Belkin & Anker Accessories
                </p>
                <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>
                  Cables · Power banks · Hubs · MagSafe accessories
                </p>
              </div>
              <button
                onClick={() => openModal("contact")}
                className="btn btn-white btn-lg"
              >
                Ask us anything →
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          #cases-grid-1 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────

export default function AccessoriesHub() {
  return (
    <>
      <AudioSection />
      <SpeakersSection />
      <ChargersSection />
      <CasesAccessoriesSection />
    </>
  );
}
