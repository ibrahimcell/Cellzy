"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { createDuoMatteRenderer, DUO_VIDEO_SRC, DUO_START_POSTER, DUO_END_POSTER } from "@/lib/duo-matte";
import { ProColorStory } from "./pro-color-story";
import styles from "./product-story.module.css";

const staticQuery = "(prefers-reduced-motion: reduce), (max-height: 660px)";
const getStaticMode = () => window.matchMedia(staticQuery).matches;
const getServerMode = () => false;
function subscribeMode(callback: () => void) {
  const query = window.matchMedia(staticQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** Original film + offline silhouettes. Scroll seeks are serialized, never queued. */
export function ProductStory({ onBook }: { onBook: () => void }) {
  const story = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [introComplete, setIntroComplete] = useState(false);
  const staticMode = useSyncExternalStore(subscribeMode, getStaticMode, getServerMode);

  useEffect(() => {
    const section = story.current;
    const pin = scene.current;
    const video = film.current;
    const surface = canvas.current;
    if (!section || !pin || !video || !surface || staticMode) return;

    const header = document.querySelector<HTMLElement>(".site-header");
    let renderer: Awaited<ReturnType<typeof createDuoMatteRenderer>> | null = null;
    let frame = 0;
    let videoFrame = 0;
    let seekDeadline = 0;
    let target = 0;
    let ready = false;
    let failed = false;
    let disposed = false;
    let complete = false;
    const frameDuration = 1 / 30;
    const supportsVideoFrames = typeof video.requestVideoFrameCallback === "function";
    video.pause();

    function draw(time: number) {
      if (disposed || failed || !renderer || video!.readyState < 2) return;
      renderer.draw(video!, time);
      if (!complete && time >= video!.duration - frameDuration * 1.5) {
        complete = true;
        setIntroComplete(true);
      }
    }

    function decodedFrame(_now: number, metadata: VideoFrameCallbackMetadata) {
      if (disposed || failed) return;
      draw(metadata.mediaTime);
      videoFrame = video!.requestVideoFrameCallback(decodedFrame);
    }

    function fail() {
      if (disposed) return;
      failed = true;
      window.clearTimeout(loadDeadline);
      window.clearTimeout(seekDeadline);
      window.cancelAnimationFrame(frame);
      if (supportsVideoFrames) video!.cancelVideoFrameCallback(videoFrame);
      setStatus("unavailable");
      setIntroComplete(true);
    }

    function seekLatest() {
      if (!ready || failed || disposed || video!.seeking) return;
      if (Math.abs(video!.currentTime - target) < frameDuration / 2) return;
      try {
        video!.currentTime = target;
        window.clearTimeout(seekDeadline);
        seekDeadline = window.setTimeout(fail, 5000);
      } catch { fail(); }
    }

    function update() {
      frame = 0;
      if (disposed || failed) return;
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const distance = Math.max(1, section!.offsetHeight - pin!.offsetHeight);
      const progress = Math.min(1, Math.max(0, (headerHeight - section!.getBoundingClientRect().top) / distance));
      section!.style.setProperty("--duo-progress", String(progress));
      if (!ready) return;
      // Land inside the last frame, not exactly on its rounded timestamp. Safari
      // and Chromium can otherwise decode the preceding frame and miss the handoff.
      target = progress * Math.max(0, video!.duration - frameDuration / 2);
      seekLatest();
    }

    function schedule() {
      if (!frame && !disposed && !failed) frame = window.requestAnimationFrame(update);
    }

    function seeked() {
      window.clearTimeout(seekDeadline);
      // On older browsers use the original clip's 30fps frame timestamp.
      // Modern browsers draw with the actual decoded PTS via rVFC instead.
      if (!supportsVideoFrames) draw(Math.floor(video!.currentTime * 30 + 0.001) / 30);
      schedule();
    }

    function loaded() {
      if (ready || failed || disposed || !renderer || video!.readyState < 2 || !Number.isFinite(video!.duration)) return;
      ready = true;
      window.clearTimeout(loadDeadline);
      draw(Math.floor(video!.currentTime * 30 + 0.001) / 30);
      setStatus("ready");
      if (supportsVideoFrames) videoFrame = video!.requestVideoFrameCallback(decodedFrame);
      schedule();
    }

    const loadDeadline = window.setTimeout(fail, 10000);
    video.addEventListener("loadeddata", loaded);
    video.addEventListener("seeked", seeked);
    video.addEventListener("error", fail);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(section);
    resize.observe(pin);
    if (header) resize.observe(header);
    void createDuoMatteRenderer(surface).then((result) => {
      if (disposed || failed) { result.dispose(); return; }
      renderer = result;
      loaded();
    }).catch(fail);
    schedule();

    return () => {
      disposed = true;
      window.clearTimeout(loadDeadline);
      window.clearTimeout(seekDeadline);
      window.cancelAnimationFrame(frame);
      if (supportsVideoFrames) video.cancelVideoFrameCallback(videoFrame);
      video.pause();
      video.removeEventListener("loadeddata", loaded);
      video.removeEventListener("seeked", seeked);
      video.removeEventListener("error", fail);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      resize.disconnect();
      renderer?.dispose();
    };
  }, [staticMode]);

  const showCanvas = status === "ready" && !staticMode;
  const mode = staticMode || status === "unavailable" ? "still" : "scroll";

  return (
    <>
      <section ref={story} className={styles.story} id="top" aria-labelledby="hero-title" data-mode={mode} data-film-state={status}>
        <noscript><style>{"#top{height:auto}#top>div{position:relative}"}</style></noscript>
        <div ref={scene} className={styles.scene}>
          <div className={styles.copy}>
            <h1 id="hero-title">Your phone.<br />In good hands.</h1>
            <div className={styles.intro}>
              <p>Phones you love. Accessories that fit you.<br className={styles.desktopBreak} /> Expert repairs, right here at Cellzy.</p>
              <div className={styles.actions}>
                <button type="button" className="primary-button" onClick={onBook}>Book a repair <ArrowRight aria-hidden="true" /></button>
                <a className="text-link" href="#devices">Find your phone</a>
              </div>
            </div>
          </div>
          <div className={styles.media} role="img" aria-label="iPhone Duo unfolding as you scroll. Original Apple product footage, with its background removed.">
            <div className={styles.frame}>
              <Image className={styles.still} src={mode === "still" ? DUO_END_POSTER : DUO_START_POSTER} alt="" fill sizes="(max-width: 760px) 175vw, 1260px" preload unoptimized style={{ visibility: showCanvas ? "hidden" : "visible" }} />
              <canvas ref={canvas} className={styles.canvas} width={1260} height={612} aria-hidden="true" style={{ visibility: showCanvas ? "visible" : "hidden" }} />
              <video ref={film} className={styles.sourceVideo} src={DUO_VIDEO_SRC} preload="auto" muted playsInline disablePictureInPicture tabIndex={-1} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.caption}>
            <div className={styles.productName}><span className={styles.brandMark} role="img" aria-label="Cellzy" /><span className={styles.deviceName}>iPhone Duo</span></div>
            <span className={styles.scrollCue} aria-hidden="true"><span className={styles.progress}><span /></span>Scroll to unfold</span>
            <a href="#iphone-pro" className={styles.skip} onClick={() => setIntroComplete(true)}>Meet the Pro Max <ArrowDown aria-hidden="true" /></a>
          </div>
        </div>
      </section>
      <ProColorStory enabled={introComplete || staticMode || status === "unavailable"} />
    </>
  );
}
