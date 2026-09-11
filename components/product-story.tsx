"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

export function ProductStory({ onBook }: { onBook: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      // Native scroll; only the image shifts, never the visibility of content.
      const offset = preference.matches ? 0 : Math.min(32, Math.max(0, -bounds.top * .06));
      section.style.setProperty("--hero-shift", `${offset}px`);
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    preference.addEventListener("change", requestUpdate);
    update();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      preference.removeEventListener("change", requestUpdate);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="cellzy-hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-intro-label">Phones. Accessories. Repairs.</p>
        <h1 id="hero-title">Your phone.<br />In good hands.</h1>
        <p className="hero-intro">A fresh start for your phone. A little more you in every accessory. Expert care, all at Cellzy.</p>
        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={onBook}>Book a repair <ArrowRight aria-hidden="true" /></button>
          <a className="text-link" href="#devices">Find your phone</a>
        </div>
        <div className="hero-note"><span>30 min</span><p>Most standard repairs.<br />More time for your day.</p></div>
      </div>
      <div className="hero-media">
        <Image src="/assets/hero-device.jpg" alt="A phone suspended above an open hand against a warm orange background" fill sizes="(max-width: 760px) 100vw, 50vw" preload />
        <a href="#accessories" className="hero-image-caption"><span>Made for your everyday.</span><ArrowRight aria-hidden="true" /></a>
      </div>
      <a className="hero-scroll" href="#repairs"><ArrowDown aria-hidden="true" /><span>A little care goes a long way</span></a>
    </section>
  );
}
