"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import ImageCarousel from "./ImageCarousel";
import { useModal } from "./ModalProvider";

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE SETS
// ─────────────────────────────────────────────────────────────────────────────

const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=1800&q=88&fit=crop&auto=format`;

const AIRPODS_MAX_IMGS = [
  { src: "https://www.apple.com/v/airpods-max/k/images/overview/welcome/max-loop_startframe__c0vn1ukmh7ma_xlarge.jpg", alt: "AirPods Max" },
  { src: "https://www.apple.com/v/airpods-max/k/images/overview/media-card/hifi_static__fbsq0dr3be2q_xlarge.jpg",      alt: "AirPods Max Hi-Fi" },
  { src: "https://www.apple.com/v/airpods-max/k/images/overview/media-card/anc_endframe__c4dezlznnsmu_xlarge.jpg",     alt: "AirPods Max ANC" },
];

const AIRPODS_PRO_IMGS = [
  { src: "https://www.apple.com/v/airpods-pro/r/images/overview/welcome/hero__b0eal3mn03ua_large.jpg",                alt: "AirPods Pro 2" },
  { src: "https://www.apple.com/v/airpods-pro/r/images/overview/welcome/hero_endframe__vzawkxxoc72u_large.jpg",       alt: "AirPods Pro 2 case" },
  { src: "https://www.apple.com/v/airpods-pro/r/images/overview/highlights/highlights_noise_cancellation__cxd50c0etw4m_large.jpg", alt: "AirPods Pro ANC" },
];

const JBL_HEADPHONES_IMGS = [
  { src: U("photo-1583373351761-fa9e3a19c99d"), alt: "JBL headphones" },
  { src: U("photo-1595582693131-fd8df824174a"), alt: "Over-ear headphones" },
  { src: U("photo-1563882300207-835d544896ba"), alt: "Premium headphones" },
  { src: U("photo-1505740420928-5e560c06d30e"), alt: "Studio headphones" },
];

const GALAXY_BUDS_IMGS = [
  { src: U("photo-1618213520536-ce37aabcd9e5"), alt: "Samsung Galaxy Buds" },
  { src: U("photo-1546435770-a3e426bf472b"),    alt: "Wireless earbuds case" },
  { src: U("photo-1609081219090-a6d81d3085bf"), alt: "Wireless earbuds" },
  { src: U("photo-1588156979435-379b9d365296"), alt: "Earbuds close-up" },
];

const SPEAKERS_MAIN_IMGS = [
  { src: U("photo-1690455422058-156a39f18a0a"), alt: "JBL Flip 5 speaker" },
  { src: U("photo-1598034989845-48532781987e"), alt: "Ultimate Ears WONDERBOOM waterproof" },
  { src: U("photo-1643901102317-b430b45e4cce"), alt: "Marshall Emberton speaker" },
  { src: U("photo-1623732900752-75cb69c5963a"), alt: "Bluetooth speaker" },
];

const SPEAKERS_SECONDARY_IMGS = [
  { src: U("photo-1768618506508-2575a80f4461"), alt: "Bose SoundLink speaker" },
  { src: U("photo-1549400854-b4300f444934"), alt: "Portable speaker" },
  { src: U("photo-1767796529694-cb668573dcd5"), alt: "Wireless Bluetooth speaker" },
];

const WIRELESS_CHARGER_IMGS = [
  { src: U("photo-1598978465764-7db2b679c694"), alt: "Wireless charging pad" },
  { src: U("photo-1542222216855-78ff1bcf9252"), alt: "MagSafe charging" },
  { src: U("photo-1617975426095-f073792aef15"), alt: "Wireless charger" },
];

const CAR_CHARGER_IMGS = [
  { src: U("photo-1666459956903-f71d44a5e927"), alt: "Car USB charger" },
  { src: U("photo-1558618666-fcd25c85cd64"),    alt: "Charging cable USB-C" },
  { src: U("photo-1585771724684-38269d6639fd"), alt: "Tech accessories" },
];

const MULTIPORT_CHARGER_IMGS = [
  { src: U("photo-1653617748434-7dc143f8223e"), alt: "Multi-port USB-C charger" },
  { src: U("photo-1624272673361-335d488ef9f7"), alt: "GaN wall charger" },
  { src: U("photo-1603899122911-27c0cb85824a"), alt: "USB charger hub" },
];

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

// Combined section-hero image arrays — all products in the category rotate together
const AUDIO_ALL = [
  ...AIRPODS_MAX_IMGS,
  ...AIRPODS_PRO_IMGS,
  JBL_HEADPHONES_IMGS[0],
  GALAXY_BUDS_IMGS[0],
  GALAXY_BUDS_IMGS[1],
];

const SPEAKERS_ALL = [
  ...SPEAKERS_MAIN_IMGS,
  ...SPEAKERS_SECONDARY_IMGS,
];

const CHARGERS_ALL = [
  ...WIRELESS_CHARGER_IMGS,
  ...CAR_CHARGER_IMGS,
  ...MULTIPORT_CHARGER_IMGS,
];

const CASES_ALL = [
  ...OTTERBOX_IMGS,
  ...IPAD_CASE_IMGS,
  BELKIN_ANKER_IMGS[0],
  BELKIN_ANKER_IMGS[1],
];

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

// Parallax — reduced inset to avoid over-cropping images
function Parallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const y   = useSpring(raw, { stiffness: 60, damping: 20, mass: 0.7 });
  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <motion.div style={{ y, position: "absolute", inset: "-5%", width: "100%", height: "110%" }}>
        {children}
      </motion.div>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D TILT PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────

function TiltCard({
  images, label, sub, interval = 3500, index = 0, tall = false, objectPosition = "center center",
}: {
  images: { src: string; alt: string }[];
  label: string;
  sub?: string;
  interval?: number;
  index?: number;
  tall?: boolean;
  objectPosition?: string;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [ 4, -4]), { stiffness: 200, damping: 25 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-4,  4]), { stiffness: 200, damping: 25 });

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
      onMouseMove={move}
      onMouseLeave={reset}
    >
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          position: "relative",
          overflow: "hidden",
          borderRadius: 22,
          minHeight: tall ? 480 : 360,
          cursor: "pointer",
        }}
        whileHover={{ scale: 1.025 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <ImageCarousel images={images} interval={interval} objectPosition={objectPosition} />
        </div>

        {/* Soft vignette — lets image color bleed through */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 45%)",
        }} />

        {/* Frosted glass label — text feels the image color behind it */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "clamp(16px, 2.5vw, 28px)",
          background: "rgba(0,0,0,0.26)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          zIndex: 3,
        }}>
          <p style={{ fontSize: "clamp(17px, 2vw, 26px)", fontWeight: 700, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.97)", marginBottom: 4, lineHeight: 1.2 }}>
            {label}
          </p>
          {sub && (
            <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>
              {sub}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL CATEGORY HERO
// ─────────────────────────────────────────────────────────────────────────────

function CategoryHero({
  images, eyebrow, headline, sub, cta, onCTA, align = "left", interval = 3000,
}: {
  images: { src: string; alt: string }[];
  eyebrow: string;
  headline: React.ReactNode;
  sub: string;
  cta?: string;
  onCTA?: () => void;
  align?: "left" | "right";
  interval?: number;
}) {
  const right = align === "right";
  return (
    <>
      {/* Parallax hero image — all category products rotate here */}
      <div
        className="img-hover"
        style={{ height: "clamp(300px, 48vw, 600px)", width: "100%", overflow: "hidden", position: "relative" }}
      >
        <Parallax>
          <ImageCarousel images={images} interval={interval} objectPosition="center center" />
        </Parallax>
      </div>

      {/* Text reveal */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 7vw, 104px) clamp(24px, 6vw, 96px)",
        display: "flex",
        flexDirection: "column",
        alignItems: right ? "flex-end" : "flex-start",
        textAlign: right ? "right" : "left",
      }}>
        <Reveal>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 20 }}>
            {eyebrow}
          </p>
          <h2 style={{ fontSize: "clamp(42px, 7vw, 88px)", fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.95, color: "#1d1d1f", marginBottom: 24 }}>
            {headline}
          </h2>
          <p style={{ fontSize: "clamp(15px, 1.7vw, 19px)", fontWeight: 300, color: "#6e6e73", maxWidth: 480, lineHeight: 1.7, marginBottom: cta ? 40 : 0 }}>
            {sub}
          </p>
          {cta && onCTA && (
            <button onClick={onCTA} className="btn btn-dark btn-lg">
              {cta} &nbsp;→
            </button>
          )}
        </Reveal>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

function AudioSection() {
  return (
    <section id="audio" style={{ background: "#fff" }}>
      <CategoryHero
        images={AUDIO_ALL}
        eyebrow="Audio"
        headline={<>Hear it<br />all.</>}
        sub="Premium earbuds, headphones, and over-ear cans from Apple, JBL, Samsung, and more."
        interval={3200}
      />

      <div style={{ padding: "0 clamp(12px, 2vw, 20px) clamp(64px, 10vw, 120px)" }}>
        <div
          id="audio-sub"
          style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)" }}
        >
          <TiltCard images={AIRPODS_PRO_IMGS}    label="AirPods Pro 2"              sub="Active noise cancellation. Hearing health." interval={3500} index={0} tall objectPosition="center top" />
          <TiltCard images={JBL_HEADPHONES_IMGS} label="JBL & Premium Headphones"   sub="Over-ear & on-ear. Every style, every budget." interval={3200} index={1} tall objectPosition="center 35%" />
          <TiltCard images={GALAXY_BUDS_IMGS}    label="Samsung Galaxy Buds & More" sub="True wireless. Adaptive sound."             interval={3800} index={2} tall objectPosition="center center" />
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { #audio-sub { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 520px) { #audio-sub { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section id="speakers" style={{ background: "#f5f5f7" }}>
      <CategoryHero
        images={SPEAKERS_ALL}
        eyebrow="Speakers"
        headline={<>Fill every<br />room.</>}
        sub="Waterproof, shockproof, go-anywhere portable speakers from JBL, Sony, Bose, and Ultimate Ears."
        align="right"
        interval={3400}
      />

      <div style={{ padding: "0 clamp(12px, 2vw, 20px) clamp(64px, 10vw, 120px)" }}>
        <div
          id="speakers-sub"
          style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)" }}
        >
          <TiltCard
            images={SPEAKERS_SECONDARY_IMGS}
            label="Home & Studio"
            sub="360° sound. Smart assistant. Room-filling bass."
            interval={4000}
            index={0}
            tall
            objectPosition="center center"
          />
          <TiltCard
            images={[SPEAKERS_MAIN_IMGS[1], SPEAKERS_SECONDARY_IMGS[0], SPEAKERS_MAIN_IMGS[2]]}
            label="Party Speakers"
            sub="JBL PartyBoost. Loud, bright, unstoppable."
            interval={3000}
            index={1}
            tall
            objectPosition="center center"
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 580px) { #speakers-sub { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function ChargersSection() {
  return (
    <section id="chargers" style={{ background: "#fff" }}>
      <CategoryHero
        images={CHARGERS_ALL}
        eyebrow="Power & Charging"
        headline={<>Always<br />charged.</>}
        sub="MagSafe, multi-port GaN, and car chargers from Anker, Belkin, and Apple."
        interval={3000}
      />

      <div style={{ padding: "0 clamp(12px, 2vw, 20px) clamp(64px, 10vw, 120px)" }}>
        <div
          id="chargers-sub"
          style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)" }}
        >
          <TiltCard images={CAR_CHARGER_IMGS}       label="Car Chargers"               sub="USB-C & Qi wireless. Fast charge on the go." interval={3200} index={0} objectPosition="center center" />
          <TiltCard images={MULTIPORT_CHARGER_IMGS} label="Multi-Port GaN Wall Chargers" sub="65W–200W. Anker & Belkin. Charge everything." interval={4000} index={1} objectPosition="center center" />
        </div>
      </div>

      <style>{`
        @media (max-width: 580px) { #chargers-sub { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function CasesAccessoriesSection() {
  const { open: openModal } = useModal();

  return (
    <section id="cases-accessories" style={{ background: "#f5f5f7" }}>
      <CategoryHero
        images={CASES_ALL}
        eyebrow="Cases & Accessories"
        headline={<>Protect.<br />Perfect.</>}
        sub="OtterBox, UAG, Belkin, and Anker — the world's best-selling protective cases and accessories."
        align="right"
        interval={3200}
      />

      <div style={{ padding: "0 clamp(12px, 2vw, 20px) clamp(80px, 12vw, 140px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            id="cases-sub"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1.2vw, 16px)" }}
          >
            <TiltCard images={IPAD_CASE_IMGS} label="iPad Cases" sub="OtterBox Defender, Smart Folio, keyboard cases." interval={4000} index={0} tall objectPosition="center top" />

            {/* Belkin & Anker card */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 900 }}
            >
              <motion.div
                style={{ position: "relative", overflow: "hidden", borderRadius: 22, minHeight: 480, cursor: "pointer" }}
                whileHover={{ scale: 1.025 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <div style={{ position: "absolute", inset: 0 }}>
                  <ImageCarousel images={BELKIN_ANKER_IMGS} interval={3200} objectPosition="center center" />
                </div>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
                  background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 45%)",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "clamp(24px, 4vw, 44px)",
                  background: "rgba(0,0,0,0.26)",
                  backdropFilter: "blur(28px) saturate(180%)",
                  WebkitBackdropFilter: "blur(28px) saturate(180%)",
                  zIndex: 3,
                  display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20,
                }}>
                  <div>
                    <p style={{ fontSize: "clamp(18px, 2.2vw, 30px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", marginBottom: 5 }}>
                      Belkin & Anker
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>
                      Cables · Power banks · Hubs · MagSafe
                    </p>
                  </div>
                  <button onClick={() => openModal("contact")} className="btn btn-white">
                    Ask us anything →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) { #cases-sub { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

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
