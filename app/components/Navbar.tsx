"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useModal } from "./ModalProvider";

const LINKS = [
  { label: "Shop",        href: "#shop"        },
  { label: "Accessories", href: "#accessories" },
  { label: "Repairs",     href: "#repairs"     },
];

export default function Navbar() {
  const [open, setOpen]   = useState(false);
  const { open: openModal } = useModal();
  const { scrollY }       = useScroll();
  const bgOpacity         = useTransform(scrollY, [0, 60], [0, 1]);

  const close = () => setOpen(false);

  return (
    <>
      {/* ── Bar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 56,
        }}
      >
        {/* Glass background — fades in on scroll */}
        <motion.div
          style={{
            opacity: bgOpacity,
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.84)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        />

        <div
          style={{
            position: "relative",
            height: "100%",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 48px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <a
            href="#home"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1d1d1f",
              letterSpacing: "-0.05em",
              textDecoration: "none",
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            CELLZY
          </a>

          {/* Desktop nav — center */}
          <nav className="nav-desktop" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 1 }}>
            {/* Desktop CTA */}
            <button
              onClick={() => openModal("repair")}
              className="btn btn-dark btn-sm nav-desktop"
              style={{ padding: "10px 20px", fontSize: 13, letterSpacing: "-0.02em" }}
            >
              Book a Repair
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="nav-hamburger"
              style={{
                width: 44,
                height: 44,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span style={{ display: "block", width: 22, height: 1.5, background: "#1d1d1f", borderRadius: 999 }} />
              <span style={{ display: "block", width: 22, height: 1.5, background: "#1d1d1f", borderRadius: 999 }} />
              <span style={{ display: "block", width: 22, height: 1.5, background: "#1d1d1f", borderRadius: 999 }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
            style={{ position: "fixed", inset: 0, zIndex: 110, background: "rgba(0,0,0,0.22)" }}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 38 }}
            style={{
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              zIndex: 120,
              width: 300,
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              borderLeft: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 56, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f" }}>CELLZY</span>
              <button
                onClick={close}
                style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav style={{ padding: "32px 28px 0", display: "flex", flexDirection: "column", gap: 4 }}>
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={close}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: 0.05 + i * 0.06, ease: "easeOut" }}
                  style={{ display: "block", padding: "18px 0", fontSize: 26, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.04em", textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ marginTop: "auto", padding: "0 28px 48px" }}>
              <button
                onClick={() => { close(); openModal("repair"); }}
                className="btn btn-dark"
                style={{ width: "100%", justifyContent: "center" }}
              >
                Book a Repair →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
