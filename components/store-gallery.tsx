"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

type StoreGalleryProps = {
  images: readonly (readonly [string, string])[];
};

function measureGallery(element: HTMLDivElement) {
  const slides = Array.from(element.querySelectorAll<HTMLElement>("figure"));
  const firstLeft = slides[0]?.getBoundingClientRect().left ?? 0;
  const maximum = Math.max(0, element.scrollWidth - element.clientWidth);
  const positions = slides.map((slide) => Math.min(maximum, Math.max(0, slide.getBoundingClientRect().left - firstLeft)));
  return { maximum, positions };
}

export function StoreGallery({ images }: StoreGalleryProps) {
  const gallery = useRef<HTMLDivElement>(null);
  const destination = useRef<number | null>(null);
  const id = useId();
  const [position, setPosition] = useState({ index: 0, previous: false, next: images.length > 1 });

  useEffect(() => {
    const element = gallery.current;
    if (!element) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const { maximum, positions } = measureGallery(element);
      const left = Math.max(0, element.scrollLeft);
      const atEnd = maximum > 1 && left >= maximum - 1;
      let index = 0;
      let distance = Infinity;
      positions.forEach((offset, slideIndex) => {
        const nextDistance = Math.abs(offset - left);
        if (nextDistance < distance) {
          distance = nextDistance;
          index = slideIndex;
        }
      });
      // More than one card fits on desktop. At the natural endpoint, the
      // final photograph is fully in view even though it cannot align left.
      if (atEnd) index = Math.max(0, positions.length - 1);
      if (destination.current !== null && Math.abs(left - destination.current) < 1) destination.current = null;
      const next = { index, previous: left > 1, next: left < maximum - 1 };
      setPosition((current) => current.index === next.index && current.previous === next.previous && current.next === next.next ? current : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { destination.current = null; schedule(); };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    element.querySelectorAll("figure").forEach((slide) => observer.observe(slide));
    element.addEventListener("scroll", schedule, { passive: true });
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("scroll", schedule);
    };
  }, [images]);

  const move = (direction: -1 | 1) => {
    const element = gallery.current;
    if (!element) return;
    const { maximum, positions } = measureGallery(element);
    const current = destination.current ?? element.scrollLeft;
    // Actual card offsets include the CSS gap and stay accurate at every
    // breakpoint; the final movement is clamped to the native scroll edge.
    const target = direction > 0
      ? positions.find((offset) => offset > current + 1) ?? maximum
      : positions.findLast((offset) => offset < current - 1) ?? 0;
    destination.current = target;
    element.scrollTo({ left: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  if (!images.length) return null;

  return (
    <>
      <div className="gallery-heading">
        <p>Take a look around.</p>
        <div className="gallery-controls">
          <span className="gallery-position" role="status" aria-live="polite" aria-atomic="true">
            <span aria-hidden="true">{position.index + 1} / {images.length}</span>
            <span className="sr-only">Store view {position.index + 1} of {images.length}</span>
          </span>
          <button type="button" aria-label="Previous store view" aria-controls={id} disabled={!position.previous} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" aria-label="Next store view" aria-controls={id} disabled={!position.next} onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
      <p id={`${id}-instructions`} className="sr-only">Use the left and right arrow keys to explore the store views.</p>
      <div
        id={id}
        className="store-filmstrip"
        ref={gallery}
        tabIndex={0}
        role="region"
        aria-label="Cellzy store concept gallery"
        aria-describedby={`${id}-instructions`}
        onPointerDown={() => { destination.current = null; }}
        onWheel={() => { destination.current = null; }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }}
      >
        {images.map(([src, alt]) => <figure key={src}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 80vw, 44vw" /><figcaption>{alt}</figcaption></figure>)}
      </div>
    </>
  );
}
