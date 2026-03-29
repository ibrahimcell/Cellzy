"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

// Wide dramatic iPhone shot → zoom toward camera region, then reveal camera close-up
const WIDE_SRC   = "https://www.apple.com/v/iphone-17-pro/e/images/overview/welcome/hero__bsveixlwbms2_xlarge.jpg";
const CAMERA_SRC = "https://www.apple.com/v/iphone-17-pro/e/images/overview/cameras/intro/hero_camera__f42igewygpqy_xlarge.jpg";

const ZOOM_MS  = 6200;   // slow pull-in
const FADE_MS  = 1100;   // crossfade
const HOLD_MS  = 3000;   // linger on camera
const GAP_MS   =  500;   // breath before loop

export default function CinematicHero() {
  const wideCtrl   = useAnimation();
  const cameraCtrl = useAnimation();
  const alive      = useRef(true);

  useEffect(() => {
    alive.current = true;

    async function run() {
      while (alive.current) {
        // ── reset ────────────────────────────────────────────────
        wideCtrl.set({ scale: 1, opacity: 1 });
        cameraCtrl.set({ scale: 1.08, opacity: 0 });

        // ── phase 1 : slow cinematic pull toward camera region ───
        await wideCtrl.start({
          scale: 1.6,
          transition: { duration: ZOOM_MS / 1000, ease: [0.08, 0, 0.28, 1] },
        });
        if (!alive.current) break;

        // ── phase 2 : crossfade wide ↔ camera ───────────────────
        await Promise.all([
          wideCtrl.start({
            opacity: 0,
            transition: { duration: FADE_MS / 1000, ease: "easeInOut" },
          }),
          cameraCtrl.start({
            opacity: 1,
            scale: 1,
            transition: { duration: FADE_MS / 1000, ease: "easeInOut" },
          }),
        ]);
        if (!alive.current) break;

        // ── phase 3 : hold on camera lens ───────────────────────
        // subtle slow drift inward while displayed
        cameraCtrl.start({
          scale: 1.06,
          transition: { duration: HOLD_MS / 1000, ease: "linear" },
        });
        await new Promise(r => setTimeout(r, HOLD_MS));
        if (!alive.current) break;

        // ── phase 4 : crossfade back ─────────────────────────────
        await Promise.all([
          wideCtrl.start({
            opacity: 1,
            transition: { duration: FADE_MS / 1000, ease: "easeInOut" },
          }),
          cameraCtrl.start({
            opacity: 0,
            transition: { duration: FADE_MS / 1000, ease: "easeInOut" },
          }),
        ]);

        await new Promise(r => setTimeout(r, GAP_MS));
      }
    }

    run();
    return () => { alive.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0a0a0a" }}>
      {/* Wide phone shot — zooms toward the camera module (upper-right of phone back) */}
      <motion.img
        animate={wideCtrl}
        src={WIDE_SRC}
        alt="iPhone 17 Pro Max"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          // transformOrigin aims at where the camera module sits in this image
          transformOrigin: "58% 26%",
        }}
      />

      {/* Camera close-up — fades in at peak of zoom */}
      <motion.img
        animate={cameraCtrl}
        src={CAMERA_SRC}
        alt="iPhone 17 Pro Max — Camera System"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
