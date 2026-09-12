"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

export function ProductStory({ onBook }: { onBook: () => void }) {
  return (
    <section className="cellzy-hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-intro-label">Phones. Accessories. Repairs.</p>
        <h1 id="hero-title"><span>Your phone.</span>{" "}<span>In good hands.</span></h1>
        <p className="hero-intro">A fresh start for your phone. A little more you in every accessory. Expert care, all at Cellzy.</p>
        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={onBook}>Book a repair <ArrowRight aria-hidden="true" /></button>
          <a className="text-link" href="#devices">Find your phone</a>
        </div>
        <div className="hero-note"><span>30 min</span><p>Most standard repairs.<br />More time for your day.</p></div>
      </div>
      <div className="hero-media" data-scroll-scene>
        <div className="hero-image-stage"><Image src="/assets/hero-device.jpg" alt="A phone suspended above an open hand against a warm orange background" fill sizes="(max-width: 760px) 100vw, 50vw" preload data-scroll-image /></div>
        <a href="#accessories" className="hero-image-caption"><span>Made for your everyday.</span><ArrowRight aria-hidden="true" /></a>
      </div>
      <a className="hero-scroll" href="#repairs"><ArrowDown aria-hidden="true" /><span>A little care goes a long way</span></a>
    </section>
  );
}
