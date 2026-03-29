"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeInUp from "./FadeInUp";

// ── Pricing data ──────────────────────────────────────────────────────────────

type RepairRow = {
  id: string;
  icon: string;
  service: string;
  description: string;
  time: string;
  apple: string;
  samsung: string;
};

const REPAIRS: RepairRow[] = [
  {
    id: "screen",
    icon: "📱",
    service: "Screen Replacement",
    description: "Cracked, shattered, or unresponsive display",
    time: "45–90 min",
    apple: "From $89",
    samsung: "From $79",
  },
  {
    id: "battery",
    icon: "🔋",
    service: "Battery Replacement",
    description: "Fast drain, won't charge, or swollen battery",
    time: "30–60 min",
    apple: "From $59",
    samsung: "From $55",
  },
  {
    id: "water",
    icon: "💧",
    service: "Water Damage",
    description: "Liquid exposure, corrosion, or dead after drop",
    time: "Same day",
    apple: "From $99",
    samsung: "From $89",
  },
  {
    id: "camera",
    icon: "📷",
    service: "Camera Repair",
    description: "Blurry, black screen, autofocus failure",
    time: "60–90 min",
    apple: "From $79",
    samsung: "From $69",
  },
  {
    id: "charging",
    icon: "⚡",
    service: "Charging Port",
    description: "Won't charge, loose connector, bent pins",
    time: "45–75 min",
    apple: "From $49",
    samsung: "From $45",
  },
  {
    id: "back-glass",
    icon: "🔲",
    service: "Back Glass",
    description: "Cracked rear glass panel replacement",
    time: "60–120 min",
    apple: "From $99",
    samsung: "From $79",
  },
  {
    id: "speaker",
    icon: "🔊",
    service: "Speaker / Mic",
    description: "No sound, muffled audio, or mic issues",
    time: "30–60 min",
    apple: "From $49",
    samsung: "From $45",
  },
];

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Huawei", "Other"];

// ── Repair Table ──────────────────────────────────────────────────────────────

function RepairTable() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
    >
      {/* Table header */}
      <div
        className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#aeaeb2]"
        style={{ background: "#f5f5f7", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div>Service</div>
        <div className="hidden sm:block text-center">Time</div>
        <div className="text-center">Apple</div>
        <div className="text-center">Samsung</div>
      </div>

      {/* Rows */}
      {REPAIRS.map((r, i) => {
        const isActive = activeId === r.id;
        return (
          <div key={r.id}>
            <button
              onClick={() => setActiveId(isActive ? null : r.id)}
              className="w-full grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-4 text-left transition-colors duration-150"
              style={{
                background: isActive ? "rgba(0,113,227,0.04)" : i % 2 === 0 ? "#ffffff" : "rgba(0,0,0,0.013)",
                borderBottom: "1px solid rgba(0,0,0,0.055)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[20px] sm:text-[22px] shrink-0">{r.icon}</span>
                <div>
                  <div className="text-[13px] font-semibold text-[#1d1d1f]">{r.service}</div>
                  <div className="text-[11px] text-[#6e6e73] hidden sm:block mt-0.5">{r.description}</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center justify-center text-[12px] text-[#6e6e73] font-medium">{r.time}</div>
              <div className="flex items-center justify-center text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f]">{r.apple}</div>
              <div className="flex items-center justify-center text-[12px] sm:text-[13px] font-semibold text-[#0071e3]">{r.samsung}</div>
            </button>

            {/* Expanded row on mobile */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden sm:hidden"
                >
                  <div
                    className="px-5 py-3 text-[12px] text-[#6e6e73]"
                    style={{ background: "rgba(0,113,227,0.04)", borderBottom: "1px solid rgba(0,0,0,0.055)" }}
                  >
                    <span className="font-medium text-[#1d1d1f]">Description: </span>{r.description}
                    <br />
                    <span className="font-medium text-[#1d1d1f] mt-1 block">Typical time: </span>{r.time}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Table footer */}
      <div
        className="px-5 py-3 text-[11px] text-[#aeaeb2]"
        style={{ background: "#f5f5f7", borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        * Final price confirmed after free diagnostic. Tap a row for details.
      </div>
    </div>
  );
}

// ── Booking Form ──────────────────────────────────────────────────────────────

function BookingForm() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const activeIssue = REPAIRS.find((r) => r.id === selectedIssue);

  return (
    <FadeInUp delay={0.1}>
      <div
        className="rounded-[24px] p-6 sm:p-8"
        style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
      >
        <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-6">Book a Repair</h3>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28 }}
              className="flex flex-col items-center text-center py-10 gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-[24px]">✓</div>
              <div className="text-[17px] font-semibold text-[#1d1d1f]">Booking Confirmed!</div>
              <div className="text-[14px] text-[#6e6e73]">We&apos;ll confirm your slot within minutes.</div>
              <button
                onClick={() => { setSubmitted(false); setSelectedIssue(null); setSelectedBrand(null); }}
                className="mt-2 text-[13px] font-semibold text-[#0071e3]"
              >
                Book another
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Name + phone */}
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {[
                  { label: "Your Name", type: "text", ph: "John Appleseed" },
                  { label: "Phone Number", type: "tel", ph: "+1 (555) 000-0000" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-[12px] font-medium text-[#6e6e73] mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.ph}
                      className="w-full px-4 py-3.5 rounded-xl text-[14px] text-[#1d1d1f] placeholder-[#aeaeb2] outline-none transition-all"
                      style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.08)" }}
                      onFocus={(e) => (e.target.style.border = "1px solid #0071e3")}
                      onBlur={(e) => (e.target.style.border = "1px solid rgba(0,0,0,0.08)")}
                    />
                  </div>
                ))}
              </div>

              {/* Brand pills */}
              <div className="mb-5">
                <label className="block text-[12px] font-medium text-[#6e6e73] mb-2">Device Brand</label>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b === selectedBrand ? null : b)}
                      className="px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150"
                      style={
                        selectedBrand === b
                          ? { background: "#1d1d1f", color: "#fff", border: "1px solid #1d1d1f" }
                          : { background: "#f5f5f7", color: "#1d1d1f", border: "1px solid rgba(0,0,0,0.08)" }
                      }
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Issue selector */}
              <div className="mb-5">
                <label className="block text-[12px] font-medium text-[#6e6e73] mb-2">Issue Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {REPAIRS.slice(0, 4).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedIssue(r.id === selectedIssue ? null : r.id)}
                      className="rounded-xl p-3 text-left transition-all duration-150"
                      style={
                        selectedIssue === r.id
                          ? { background: "#1d1d1f", border: "1px solid #1d1d1f" }
                          : { background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.07)" }
                      }
                    >
                      <div className="text-[18px] mb-1">{r.icon}</div>
                      <div
                        className="text-[11px] font-semibold"
                        style={{ color: selectedIssue === r.id ? "#fff" : "#1d1d1f" }}
                      >
                        {r.service}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary strip */}
              <AnimatePresence>
                {activeIssue && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 px-4 py-3 rounded-xl flex flex-wrap items-center gap-2 text-[12px]"
                    style={{ background: "rgba(0,113,227,0.06)", border: "1px solid rgba(0,113,227,0.12)" }}
                  >
                    <span>{activeIssue.icon}</span>
                    <span className="font-semibold text-[#0071e3]">{activeIssue.service}</span>
                    <span className="text-[#6e6e73]">·</span>
                    <span className="text-[#6e6e73]">{activeIssue.time}</span>
                    <span className="text-[#6e6e73]">·</span>
                    <span className="font-semibold text-[#1d1d1f]">
                      {selectedBrand === "Samsung" ? activeIssue.samsung : activeIssue.apple}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-4 rounded-full text-[15px] font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#006ad5] transition-colors duration-150"
                style={{ boxShadow: "0 4px 16px rgba(0,113,227,0.28)" }}
              >
                Confirm Booking
              </button>
              <p className="text-center text-[11px] text-[#aeaeb2] mt-3">
                Free diagnostic · Pay only after repair · 90-day warranty included
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeInUp>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function RepairSection() {
  return (
    <section id="repairs" className="py-24 px-5 sm:px-8" style={{ background: "#f5f5f7" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <FadeInUp className="mb-12 max-w-2xl">
          <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#0071e3] block mb-2">Repair Hub</span>
          <h2 className="text-[30px] sm:text-[36px] font-bold tracking-tight text-[#1d1d1f] mb-3">
            Expert Repairs for All Models
          </h2>
          <p className="text-[15px] font-light text-[#6e6e73]">
            Certified technicians, genuine parts, most repairs completed same-day.
            Walk in anytime — no appointment needed.
          </p>
        </FadeInUp>

        {/* Pricing table */}
        <FadeInUp delay={0.07} className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Repair Pricing</h3>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1d1d1f] inline-block" /> Apple
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0071e3] inline-block" /> Samsung
              </span>
            </div>
          </div>
          <RepairTable />
        </FadeInUp>

        {/* Booking form */}
        <BookingForm />

        {/* Guarantee cards */}
        <FadeInUp delay={0.12} className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "🛡️", title: "90-Day Warranty", desc: "All parts and labour fully covered." },
              { icon: "🔬", title: "Genuine Parts", desc: "OEM and certified replacements only." },
              { icon: "⚡", title: "Same-Day Service", desc: "Most repairs done while you wait." },
            ].map((g) => (
              <div
                key={g.title}
                className="rounded-[18px] p-5 flex gap-4 items-start bg-white"
                style={{ border: "1px solid rgba(0,0,0,0.08)" }}
              >
                <span className="text-[22px] shrink-0">{g.icon}</span>
                <div>
                  <div className="text-[13px] font-semibold text-[#1d1d1f]">{g.title}</div>
                  <div className="text-[12px] text-[#6e6e73] mt-0.5">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeInUp>

      </div>
    </section>
  );
}
