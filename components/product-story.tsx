"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ProductStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const actionRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      frameRef.current = null;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-bounds.top / travel);
      const proOpacity = clamp(0.2 + progress * 1.2);
      const proCopy = clamp(progress * 1.25);
      const storyScroll = clamp(1 - progress * 2.2);

      section.style.setProperty("--story-background", "#050505");
      section.style.setProperty("--pro-opacity", `${proOpacity}`);
      section.style.setProperty("--pro-scale", `${1.035 - proOpacity * 0.035}`);
      section.style.setProperty("--pro-copy", `${proCopy}`);
      section.style.setProperty("--pro-copy-y", `${(1 - proCopy) * 20}px`);
      section.style.setProperty("--story-progress-height", `${progress * 120}px`);
      section.style.setProperty("--story-scroll-opacity", `${storyScroll}`);

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
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="product-story product-film" id="top" aria-label="Cellzy new iPhone story">
      <div className="story-sticky">
        <section className="product-scene pro-scene" aria-label="iPhone 18 Pro Max in burgundy">
          <Image
            className="pro-product-image"
            src="/assets/products/iphone-18-pro-burgundy.jpg"
            alt="Burgundy iPhone 18 Pro Max camera detail"
            fill
            sizes="100vw"
            priority
          />
          <div className="film-copy pro-film-copy">
            <span>Now in burgundy</span>
            <h2>iPhone 18 Pro Max</h2>
            <p>Pro, from every angle.</p>
          </div>
          <a ref={actionRef} className="story-action" href="#repairs" tabIndex={-1} aria-hidden="true">
            Explore Cellzy care <ArrowRight />
          </a>
        </section>

        <div className="story-progress" aria-hidden="true"><span>18 PRO MAX</span></div>
        <div className="story-scroll" aria-hidden="true"><ArrowDown /><span>Scroll</span></div>
      </div>
    </section>
  );
}
