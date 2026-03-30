"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// iPhone 17 Pro Max camera system — confirmed Apple CDN paths
const CAMERA_SRC = "https://www.apple.com/v/iphone-17-pro/e/images/overview/cameras/intro/hero_camera__f42igewygpqy_xlarge.jpg";
const PHONE_SRC  = "https://www.apple.com/v/iphone-17-pro/e/images/overview/product-viewer/initial__d2ghrz27b54y_large.jpg";

type Phase = "camera" | "phone" | "exit";

export default function CinematicIntro() {
  // Lazy init: read sessionStorage on first client render — avoids SSR/hydration flash
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("cellzy-intro-v1");
  });
  const [phase, setPhase] = useState<Phase>("camera");

  useEffect(() => {
    if (!visible) return;

    // Mark as seen so it won't replay this session
    sessionStorage.setItem("cellzy-intro-v1", "1");

    // Prevent background scroll while intro is running
    document.body.style.overflow = "hidden";

    // ── Timeline ──────────────────────────────────────────────────────────────
    // 0ms      → camera at scale(2.5) begins zooming out
    // 2 700ms  → camera exits, full phone fades in
    // 4 400ms  → phase "exit" — phone fades out, black screen
    // 5 300ms  → entire overlay fades out (0.9s ease), site revealed
    const t1 = setTimeout(() => setPhase("phone"),  2700);
    const t2 = setTimeout(() => setPhase("exit"),   4400);
    const t3 = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 5300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cellzy-intro"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#000",
            overflow: "hidden",
          }}
          // Exit: fade entire overlay to reveal hero behind it
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        >

          {/* ── Phase 1: Camera close-up zooms out dramatically ── */}
          <AnimatePresence>
            {phase === "camera" && (
              <motion.div
                key="cam-frame"
                style={{ position: "absolute", inset: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.65, ease: "easeInOut" } }}
              >
                <motion.img
                  src={CAMERA_SRC}
                  alt="iPhone 17 Pro Max camera system"
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                    display: "block",
                    userSelect: "none",
                  }}
                  // Starts at 2.5× zoom — only the lens cluster fills screen
                  // Decelerates into full composition, brightness lifts with the zoom
                  initial={{ scale: 2.5, filter: "brightness(0.5)" }}
                  animate={{ scale: 1.0, filter: "brightness(1.0)" }}
                  transition={{ duration: 2.7, ease: [0.12, 0.8, 0.18, 1] }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Phase 2: Full phone rises into frame ── */}
          <AnimatePresence>
            {phase === "phone" && (
              <motion.div
                key="phone-frame"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#000",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
              >
                <motion.img
                  src={PHONE_SRC}
                  alt="iPhone 17 Pro"
                  draggable={false}
                  style={{
                    maxHeight: "82vh",
                    maxWidth: "68vw",
                    objectFit: "contain",
                    userSelect: "none",
                  }}
                  // Rises from slightly below, scale punches in softly
                  initial={{ scale: 0.88, opacity: 0, y: 32 }}
                  animate={{ scale: 1.0,  opacity: 1, y: 0  }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CELLZY wordmark — fades in early, persists through both phases ── */}
          <motion.p
            style={{
              position: "absolute",
              bottom: "clamp(28px, 5vh, 56px)",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 10,
              fontSize: "clamp(9px, 1vw, 12px)",
              fontWeight: 600,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              margin: 0,
              pointerEvents: "none",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ delay: 0.6, duration: 0.9 }}
          >
            CELLZY
          </motion.p>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
