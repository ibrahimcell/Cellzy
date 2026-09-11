"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { DuoModel } from "@/components/duo-model";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ProductStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const actionRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const duoProgressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      frameRef.current = null;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-bounds.top / travel);
      const duoOpacity = 1 - clamp((progress - 0.34) / 0.12);
      const proOpacity = clamp((progress - 0.39) / 0.13);
      const proCopy = clamp((progress - 0.48) / 0.11);
      duoProgressRef.current = clamp(progress / 0.31);

      section.style.setProperty("--story-background", proOpacity > 0.5 ? "#050505" : "#f5f5f7");
      section.style.setProperty("--duo-opacity", `${duoOpacity}`);
      section.style.setProperty("--duo-scale", `${1 - clamp(progress / 0.42) * 0.035}`);
      section.style.setProperty("--pro-opacity", `${proOpacity}`);
      section.style.setProperty("--pro-scale", `${1.035 - proOpacity * 0.035}`);
      section.style.setProperty("--pro-copy", `${proCopy}`);
      section.style.setProperty("--pro-copy-y", `${(1 - proCopy) * 20}px`);
      section.style.setProperty("--story-progress-height", `${progress * 120}px`);
      section.style.setProperty("--story-scroll-opacity", `${Math.max(0, 1 - progress * 7)}`);

      if (actionRef.current) {
        actionRef.current.tabIndex = proCopy > 0.88 ? 0 : -1;
        actionRef.current.setAttribute("aria-hidden", proCopy > 0.88 ? "false" : "true");
      }
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    frameRef.current = window.requestAnimationFrame(update);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="product-story product-film" id="top" aria-label="Cellzy new iPhone story">
      <div className="story-sticky">
        <section className="product-scene duo-scene" aria-label="iPhone Duo unfolds from closed to open">
          <div className="duo-stage"><DuoModel progressRef={duoProgressRef} /></div>
          <div className="film-copy duo-film-copy">
            <span>New at Cellzy</span>
            <h1>iPhone Duo</h1>
            <p>Scroll to unfold.</p>
          </div>
        </section>

        <section className="product-scene pro-scene" aria-label="iPhone 18 Pro Max in burgundy">
          <Image className="pro-product-image" src="/assets/products/iphone-18-pro-burgundy.jpg" alt="Burgundy iPhone 18 Pro Max camera detail" fill sizes="100vw" priority />
          <div className="film-copy pro-film-copy">
            <span>Now in burgundy</span>
            <h2>iPhone 18 Pro Max</h2>
            <p>Pro, from every angle.</p>
          </div>
          <a ref={actionRef} className="story-action" href="#repairs" tabIndex={-1} aria-hidden="true">
            Explore Cellzy care <ArrowRight />
          </a>
        </section>

        <div className="story-progress" aria-hidden="true"><i /><span>DUO</span><span>18 PRO MAX</span></div>
        <div className="story-scroll" aria-hidden="true"><ArrowDown /><span>Scroll</span></div>
      </div>
    </section>
  );
}
