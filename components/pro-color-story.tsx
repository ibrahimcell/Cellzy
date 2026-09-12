"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { inquiryLink } from "@/lib/repairs";
import styles from "./pro-color-story.module.css";

const finishes = [
  { id: "burgundy", name: "Burgundy", swatch: "#70414b", backdrop: "#f3e1de" },
  { id: "glacier", name: "Glacier", swatch: "#adbdce", backdrop: "#e2ecf0" },
  { id: "silver", name: "Silver", swatch: "#e3e2de", backdrop: "#efece6" },
  { id: "black", name: "Black", swatch: "#303133", backdrop: "#e2ddd8" },
] as const;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

/** A local product chapter. Scroll never changes video playback or captures input. */
export function ProColorStory({ enabled = true }: { enabled?: boolean }) {
  const chapter = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const phoneLayers = useRef<(HTMLDivElement | null)[]>([]);
  const colorLayers = useRef<(HTMLDivElement | null)[]>([]);
  const swatches = useRef<(HTMLButtonElement | null)[]>([]);
  const selectFinish = useRef<((index: number) => void) | null>(null);
  const currentFinish = useRef(0);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const root = chapter.current;
    const stage = scene.current;
    if (!root || !stage) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const roomyViewport = window.matchMedia("(min-width: 761px) and (min-height: 680px), (max-width: 760px) and (min-height: 760px)");
    let frame = 0;
    let isNear = true;
    let motion = false;
    let headerOffset = 84;
    let scrollDistance = 1;
    let manual: { index: number; scrollY: number } | null = null;

    const paint = (position: number, animate: boolean) => {
      const nearest = Math.round(position);
      root.dataset.manual = animate ? "true" : "false";
      phoneLayers.current.forEach((layer, index) => {
        if (!layer) return;
        const distance = index - position;
        const absolute = Math.abs(distance);
        // The outgoing finish drifts upward; the incoming finish arcs up from below.
        // Only compositor properties change. The source PNG is never recoloured.
        const x = distance * 64;
        const y = absolute * 10 + distance * 5;
        const rotate = clamp(distance, -1.8, 1.8) * 12;
        const scale = 1 - Math.min(absolute, 2.5) * 0.2;
        const opacity = motion ? clamp(1.28 - absolute * 0.75) : Number(index === nearest);
        layer.style.transform = motion
          ? `translate3d(calc(-50% + ${x.toFixed(3)}%), calc(-50% + ${y.toFixed(3)}%), 0) rotate(${rotate.toFixed(3)}deg) scale(${scale.toFixed(4)})`
          : "translate3d(-50%, -50%, 0)";
        layer.style.opacity = opacity.toFixed(4);
        layer.style.zIndex = String(10 - Math.round(absolute * 2));
      });
      colorLayers.current.forEach((layer, index) => {
        if (!layer) return;
        // Every surface is opaque; overlapping only adjacent layers gives a calm colour dissolve.
        layer.style.opacity = (index === 0 ? 1 : clamp(position - index + 1)).toFixed(4);
      });
      if (currentFinish.current !== nearest) {
        currentFinish.current = nearest;
        setSelected(nearest);
      }
    };

    const render = () => {
      frame = 0;
      if (!isNear) return;
      const bounds = root.getBoundingClientRect();
      // A swatch is a new local progress anchor, not a temporary override. Returning
      // directly to native progress would make Black jump to Burgundy on the next scroll.
      if (manual && (bounds.bottom <= headerOffset || bounds.top >= window.innerHeight)) manual = null;
      if (manual) {
        const travelled = motion ? (window.scrollY - manual.scrollY) / scrollDistance * (finishes.length - 1) : 0;
        paint(clamp(manual.index + travelled, 0, finishes.length - 1), false);
        return;
      }
      const progress = motion ? clamp((headerOffset - bounds.top) / scrollDistance) : 0;
      // Small rests around each finish keep colour shots legible, while all travel is continuous.
      const timeline = progress * (finishes.length - 1);
      const segment = Math.floor(timeline);
      const fraction = smoothstep(clamp((timeline - segment - 0.08) / 0.84));
      paint(Math.min(finishes.length - 1, segment + fraction), false);
    };

    const schedule = () => {
      if (!frame && isNear) frame = window.requestAnimationFrame(render);
    };

    const measure = () => {
      motion = enabled && motionPreference.matches && roomyViewport.matches;
      root.dataset.motion = motion ? "on" : "off";
      headerOffset = Number.parseFloat(getComputedStyle(root).getPropertyValue("--pro-header-offset")) || 84;
      scrollDistance = Math.max(1, root.offsetHeight - stage.offsetHeight);
      schedule();
    };

    selectFinish.current = (index) => {
      manual = { index, scrollY: window.scrollY };
      paint(index, motion);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      isNear = entry.isIntersecting;
      root.dataset.near = isNear ? "true" : "false";
      if (isNear) schedule();
      else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: "100% 0px" });

    visibility.observe(root);
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    resize.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    motionPreference.addEventListener("change", measure);
    roomyViewport.addEventListener("change", measure);
    measure();

    return () => {
      window.cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      motionPreference.removeEventListener("change", measure);
      roomyViewport.removeEventListener("change", measure);
      selectFinish.current = null;
    };
  }, [enabled]);

  const choose = (index: number) => {
    currentFinish.current = index;
    setSelected(index);
    selectFinish.current?.(index);
  };

  const navigateFinishes = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % finishes.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + finishes.length - 1) % finishes.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = finishes.length - 1;
    else return;
    event.preventDefault();
    choose(next);
    swatches.current[next]?.focus({ preventScroll: true });
  };

  const finish = finishes[selected];

  return (
    <section className={styles.chapter} ref={chapter} id="iphone-pro" aria-labelledby="pro-colour-title" data-pro-color-story data-layout="sticky">
      <div className={styles.scene} ref={scene}>
        <div className={styles.backdrops} aria-hidden="true">
          {finishes.map((item, index) => (
            <div key={item.id} ref={(element) => { colorLayers.current[index] = element; }}
              className={styles.backdrop} style={{ backgroundColor: item.backdrop, opacity: index === 0 ? 1 : 0 }} />
          ))}
        </div>

        <div className={styles.copy}>
          <h2 id="pro-colour-title">iPhone 18<br />Pro Max.</h2>
          <p>A finish that feels like you.<br />{" "}Find yours at Cellzy.</p>
        </div>

        <div className={styles.artboard}>
          {finishes.map((item, index) => (
            <div key={item.id} className={styles.phone} ref={(element) => { phoneLayers.current[index] = element; }}
              aria-hidden={selected !== index} data-first={index === 0 ? "true" : undefined}>
              <Image src={`/assets/products/pro-max/${item.id}.png`} alt={`iPhone 18 Pro Max in ${item.name}, front and back`}
                width={940} height={1112} sizes="(max-width: 760px) 100vw, 55vw" loading="eager" />
            </div>
          ))}
        </div>

        <div className={styles.details}>
          <p className={styles.finishName}>{finish.name}</p>
          <div className={styles.swatches} role="radiogroup" aria-label="iPhone 18 Pro Max finish">
            {finishes.map((item, index) => (
              <button key={item.id} ref={(element) => { swatches.current[index] = element; }} className={styles.swatch}
                type="button" role="radio" aria-checked={selected === index} aria-label={item.name}
                tabIndex={selected === index ? 0 : -1} style={{ "--swatch": item.swatch } as CSSProperties}
                onClick={() => choose(index)} onKeyDown={(event) => navigateFinishes(event, index)}>
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
          <a className={`primary-button ${styles.inquiry}`} href={inquiryLink("iPhone 18 Pro Max availability", [
            `I'm interested in the iPhone 18 Pro Max in ${finish.name}.`, "Preferred storage:",
          ])}>Ask about availability</a>
          <p className={styles.stockNote}>Ask us about local stock, pricing and arrival dates.</p>
        </div>

        <a className={styles.next} href="#devices">Explore all phones <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
