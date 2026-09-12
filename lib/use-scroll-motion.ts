"use client";

import { useEffect, type RefObject } from "react";

/** Native scrolling, one frame per scroll event, and only currently visible imagery. */
export function useScrollMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scenes = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-scroll-scene]") ?? []);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    const configure = () => {
      stop();
      scenes.forEach((scene) => {
        scene.style.removeProperty("--media-scale");
        scene.style.removeProperty("--media-shift");
      });
      if (preference.matches || !("IntersectionObserver" in window)) return;

      const active = new Set<HTMLElement>();
      let frame = 0;
      const update = () => {
        frame = 0;
        if (document.hidden) return;
        const viewport = window.innerHeight;
        // Batch geometry reads before writes. No React renders or document-height changes.
        const changes = Array.from(active, (scene) => {
          const bounds = scene.getBoundingClientRect();
          const progress = Math.min(1, Math.max(0, (viewport - bounds.top) / (viewport + bounds.height)));
          return { scene, scale: 1.10 - progress * .06, shift: (progress - .5) * Math.min(12, bounds.height * .02) };
        });
        changes.forEach(({ scene, scale, shift }) => {
          scene.style.setProperty("--media-scale", scale.toFixed(4));
          scene.style.setProperty("--media-shift", `${shift.toFixed(2)}px`);
        });
      };
      const requestUpdate = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) active.add(target as HTMLElement);
          else active.delete(target as HTMLElement);
        });
        requestUpdate();
      }, { rootMargin: "120px 0px" });
      scenes.forEach((scene) => observer.observe(scene));
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      document.addEventListener("visibilitychange", requestUpdate);
      stop = () => {
        observer.disconnect();
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
        document.removeEventListener("visibilitychange", requestUpdate);
        cancelAnimationFrame(frame);
      };
    };

    configure();
    preference.addEventListener("change", configure);
    return () => {
      stop();
      preference.removeEventListener("change", configure);
      scenes.forEach((scene) => {
        scene.style.removeProperty("--media-scale");
        scene.style.removeProperty("--media-shift");
      });
    };
  }, [root]);
}
