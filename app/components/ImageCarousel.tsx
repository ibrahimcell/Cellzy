"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselImage {
  src: string;
  alt: string;
}

export default function ImageCarousel({
  images,
  interval = 3200,
  objectFit = "cover",
  objectPosition = "center",
  background = "transparent",
}: {
  images: CarouselImage[];
  interval?: number;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  background?: string;
}) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, interval);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timer.current) clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, interval]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={images[index].src}
          alt={images[index].alt}
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit,
            objectPosition,
          }}
        />
      </AnimatePresence>

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 7,
          zIndex: 10,
        }}
      >
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              startTimer();
            }}
            style={{
              width: i === index ? 22 : 7,
              height: 7,
              borderRadius: 999,
              background: i === index ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.38)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "width 0.35s cubic-bezier(0.16,1,0.3,1), background 0.25s ease",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
