"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeInUp from "./FadeInUp";

// ── Types ─────────────────────────────────────────────────────────────────────

type Condition = "New" | "Refurbished" | "Pre-Owned";

type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  condition: Condition;
  badge?: string;
  accent: string;
  bgGrad: string;
  icon?: string;
  compat?: string[]; // model IDs this product fits
  category: "phones" | "cases" | "accessories";
};

// ── Compatibility map ─────────────────────────────────────────────────────────

const IPHONE_MODELS = [
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15",
  "iPhone 14 Pro Max",
  "iPhone 14",
];

const SAMSUNG_MODELS = [
  "Galaxy S25 Ultra",
  "Galaxy S25+",
  "Galaxy S25",
  "Galaxy S24 Ultra",
  "Galaxy S24",
  "Galaxy A55",
  "Galaxy A35",
];

// ── Products ──────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  // Phones
  {
    id: "ip16pm",
    name: "iPhone 16 Pro Max",
    subtitle: "256GB · Titanium Black",
    price: "$1,199",
    condition: "New",
    badge: "New",
    accent: "#1d1d1f",
    bgGrad: "linear-gradient(145deg, #e8e8ec 0%, #d4d4da 100%)",
    category: "phones",
  },
  {
    id: "s25ultra",
    name: "Galaxy S25 Ultra",
    subtitle: "512GB · Phantom Titanium",
    price: "$1,299",
    condition: "New",
    badge: "New",
    accent: "#0071e3",
    bgGrad: "linear-gradient(145deg, #dce8f8 0%, #c8dcf5 100%)",
    category: "phones",
  },
  {
    id: "ip15pm",
    name: "iPhone 15 Pro Max",
    subtitle: "256GB · Natural Titanium",
    price: "$849",
    originalPrice: "$1,099",
    condition: "Refurbished",
    badge: "Refurb Deal",
    accent: "#ff9500",
    bgGrad: "linear-gradient(145deg, #fdf0df 0%, #f8e0c4 100%)",
    category: "phones",
  },
  {
    id: "s24u",
    name: "Galaxy S24 Ultra",
    subtitle: "256GB · Titanium Gray",
    price: "$699",
    originalPrice: "$1,199",
    condition: "Pre-Owned",
    badge: "Pre-Owned",
    accent: "#5856d6",
    bgGrad: "linear-gradient(145deg, #eae8f8 0%, #d8d6f0 100%)",
    category: "phones",
  },
  // Cases
  {
    id: "case-leather",
    name: "Leather Folio Case",
    subtitle: "Full-grain · MagSafe",
    price: "$79",
    condition: "New",
    badge: "Premium",
    accent: "#a2845e",
    bgGrad: "linear-gradient(145deg, #f5ede3 0%, #ecddd0 100%)",
    category: "cases",
    compat: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 15 Pro Max"],
  },
  {
    id: "case-clear",
    name: "Clear Shield Pro",
    subtitle: "Military-grade · Anti-yellow",
    price: "$39",
    condition: "New",
    accent: "#8e8e93",
    bgGrad: "linear-gradient(145deg, #f0f0f5 0%, #e4e4ec 100%)",
    category: "cases",
    compat: ["iPhone 16 Pro Max", "iPhone 16", "Galaxy S25 Ultra", "Galaxy S25"],
  },
  {
    id: "case-silicone",
    name: "Silicone Grip Case",
    subtitle: "Liquid silicone · 12 colors",
    price: "$49",
    condition: "New",
    badge: "Popular",
    accent: "#5856d6",
    bgGrad: "linear-gradient(145deg, #e8e7f8 0%, #d8d7f2 100%)",
    category: "cases",
    compat: ["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S24 Ultra"],
  },
  {
    id: "case-rugged",
    name: "Rugged Armor Case",
    subtitle: "Dual-layer · Drop-tested 20ft",
    price: "$55",
    condition: "New",
    accent: "#34c759",
    bgGrad: "linear-gradient(145deg, #e0f5e8 0%, #ccecd8 100%)",
    category: "cases",
    compat: ["iPhone 14 Pro Max", "iPhone 14", "Galaxy S24 Ultra", "Galaxy A55"],
  },
  // Accessories
  {
    id: "charger-65w",
    name: "65W GaN Charger",
    subtitle: "USB-C PD · Foldable plug",
    price: "$49",
    condition: "New",
    icon: "⚡",
    accent: "#f0b429",
    bgGrad: "linear-gradient(145deg, #fff8e1 0%, #fef3cc 100%)",
    category: "accessories",
  },
  {
    id: "glass-pro",
    name: "Tempered Glass Pro",
    subtitle: "9H · 2-pack · Dust-free kit",
    price: "$24",
    condition: "New",
    badge: "Essential",
    icon: "🛡️",
    accent: "#0071e3",
    bgGrad: "linear-gradient(145deg, #e8f4fd 0%, #d5ecfa 100%)",
    category: "accessories",
  },
  {
    id: "magsafe-wallet",
    name: "MagSafe Wallet",
    subtitle: "3-card · Genuine leather",
    price: "$59",
    condition: "New",
    icon: "💳",
    accent: "#34c759",
    bgGrad: "linear-gradient(145deg, #f0f5e8 0%, #e4edda 100%)",
    category: "accessories",
  },
  {
    id: "cable-2m",
    name: "USB-C Cable 2m",
    subtitle: "240W · Braided nylon",
    price: "$19",
    condition: "New",
    icon: "🔌",
    accent: "#5856d6",
    bgGrad: "linear-gradient(145deg, #f5f0f8 0%, #ece4f2 100%)",
    category: "accessories",
  },
];

// ── Condition badge colours ───────────────────────────────────────────────────

const CONDITION_STYLE: Record<Condition, { bg: string; text: string; label: string }> = {
  New:          { bg: "rgba(52,199,89,0.12)",  text: "#1a7a35", label: "New" },
  Refurbished:  { bg: "rgba(255,149,0,0.12)",  text: "#b06000", label: "Refurbished" },
  "Pre-Owned":  { bg: "rgba(88,86,214,0.12)",  text: "#3634a3", label: "Pre-Owned" },
};

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ p }: { p: Product }) {
  const cond = CONDITION_STYLE[p.condition];
  return (
    <div
      className="relative rounded-[20px] overflow-hidden flex flex-col bg-white"
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.055)",
        transition: "box-shadow 0.18s ease, transform 0.18s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.055)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: 148, background: p.bgGrad }}
      >
        {/* Promo badge */}
        {p.badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-[4px] rounded-full text-[10px] font-semibold"
            style={{ background: p.accent, color: "#fff" }}
          >
            {p.badge}
          </div>
        )}
        {p.icon ? (
          <span className="text-[48px]">{p.icon}</span>
        ) : (
          /* Phone silhouette */
          <div
            className="relative w-[52px] h-[90px] rounded-[12px]"
            style={{
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.75)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
            }}
          >
            <div className="absolute inset-[3px] rounded-[9px]" style={{ background: "rgba(29,29,31,0.75)" }}>
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-white/20" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Condition pill */}
        <div
          className="self-start px-2 py-[3px] rounded-full text-[9px] font-semibold mb-2"
          style={{ background: cond.bg, color: cond.text }}
        >
          {cond.label}
        </div>

        <div className="text-[13px] font-semibold text-[#1d1d1f] leading-tight">{p.name}</div>
        <div className="text-[11px] text-[#6e6e73] mt-0.5 mb-3">{p.subtitle}</div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-[15px] font-bold text-[#1d1d1f]">{p.price}</span>
            {p.originalPrice && (
              <span className="text-[11px] text-[#aeaeb2] line-through ml-1.5">{p.originalPrice}</span>
            )}
          </div>
          <button
            className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006ad5] transition-colors duration-150"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <FadeInUp className="mb-7">
      <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#0071e3] block mb-2">{eyebrow}</span>
      <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-[#1d1d1f]">{title}</h2>
      {sub && <p className="text-[15px] font-light text-[#6e6e73] mt-1.5">{sub}</p>}
    </FadeInUp>
  );
}

// ── Compatibility Filter ──────────────────────────────────────────────────────

function CompatibilityFilter({ onFilter }: { onFilter: (model: string | null) => void }) {
  const [brand, setBrand] = useState<"iPhone" | "Samsung" | null>(null);
  const [model, setModel] = useState<string | null>(null);

  const models = brand === "iPhone" ? IPHONE_MODELS : brand === "Samsung" ? SAMSUNG_MODELS : [];

  function selectBrand(b: "iPhone" | "Samsung") {
    const next = brand === b ? null : b;
    setBrand(next);
    setModel(null);
    onFilter(null);
  }

  function selectModel(m: string) {
    const next = model === m ? null : m;
    setModel(next);
    onFilter(next);
  }

  return (
    <FadeInUp delay={0.05} className="mb-10">
      <div
        className="rounded-[20px] p-5 sm:p-6"
        style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[13px] font-semibold text-[#1d1d1f]">Find Your Fit</span>
          <span className="text-[12px] text-[#6e6e73]">— filter cases &amp; accessories by your device</span>
        </div>

        {/* Brand toggle */}
        <div className="flex gap-2 mb-4">
          {(["iPhone", "Samsung"] as const).map((b) => (
            <button
              key={b}
              onClick={() => selectBrand(b)}
              className="px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-150"
              style={
                brand === b
                  ? { background: "#1d1d1f", color: "#fff", border: "1px solid #1d1d1f" }
                  : { background: "#fff", color: "#1d1d1f", border: "1px solid rgba(0,0,0,0.10)" }
              }
            >
              {b === "iPhone" ? "🍎 " : "📱 "}{b}
            </button>
          ))}
          {(brand || model) && (
            <button
              onClick={() => { setBrand(null); setModel(null); onFilter(null); }}
              className="px-4 py-2 rounded-full text-[12px] font-medium text-[#6e6e73] border border-black/[0.08] bg-white transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {/* Model select */}
        <AnimatePresence>
          {brand && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-1">
                <label className="block text-[11px] font-medium text-[#6e6e73] mb-2 uppercase tracking-wider">
                  Select model
                </label>
                <div className="relative">
                  <select
                    value={model ?? ""}
                    onChange={(e) => selectModel(e.target.value || "")}
                    className="w-full appearance-none px-4 py-3 rounded-xl text-[13px] font-medium text-[#1d1d1f] outline-none cursor-pointer"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.10)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <option value="">Choose {brand} model…</option>
                    {models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e6e73]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6,9 12,15 18,9" /></svg>
                  </div>
                </div>
                {model && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-[12px] text-[#0071e3] font-medium"
                  >
                    Showing compatible items for {model}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeInUp>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ShopSection() {
  const [filterModel, setFilterModel] = useState<string | null>(null);

  const phones = PRODUCTS.filter((p) => p.category === "phones");
  const cases = PRODUCTS.filter((p) => {
    if (p.category !== "cases") return false;
    if (!filterModel) return true;
    return p.compat?.includes(filterModel) ?? true;
  });
  const accessories = PRODUCTS.filter((p) => p.category === "accessories");

  const casesEmpty = cases.length === 0;

  return (
    <section id="shop" className="bg-white py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ── Phones ── */}
        <div>
          <SectionHeading
            eyebrow="Category 01"
            title="New &amp; Pre-Owned Phones"
            sub="Every device tested, certified, and ready for you."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {phones.map((p, i) => (
              <FadeInUp key={p.id} delay={i * 0.07}>
                <ProductCard p={p} />
              </FadeInUp>
            ))}
          </div>
        </div>

        {/* ── Stats bento ── */}
        <FadeInUp>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { val: "200+", label: "Phones in Stock", color: "#0071e3" },
              { val: "12",   label: "Brands Covered",  color: "#5856d6" },
              { val: "10k+", label: "Happy Customers", color: "#34c759" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-[20px] p-4 sm:p-6 text-center"
                style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="text-[28px] sm:text-[36px] font-bold leading-none" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[11px] sm:text-[13px] font-medium text-[#6e6e73] mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeInUp>

        {/* ── Cases ── */}
        <div>
          <SectionHeading
            eyebrow="Category 02"
            title="Premium Cases"
            sub="Precision-fit protection without compromising style."
          />
          <CompatibilityFilter onFilter={setFilterModel} />

          <AnimatePresence mode="wait">
            {casesEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-14 text-[14px] text-[#6e6e73]"
              >
                No cases found for that model — try a different selection.
              </motion.div>
            ) : (
              <motion.div
                key={filterModel ?? "all"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
              >
                {cases.map((p, i) => (
                  <FadeInUp key={p.id} delay={i * 0.07}>
                    <ProductCard p={p} />
                  </FadeInUp>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Accessories ── */}
        <div>
          <SectionHeading
            eyebrow="Category 03"
            title="Essential Accessories"
            sub="Chargers, protectors, and more — done right."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {accessories.map((p, i) => (
              <FadeInUp key={p.id} delay={i * 0.07}>
                <ProductCard p={p} />
              </FadeInUp>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
