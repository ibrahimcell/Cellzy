/** Original Apple video + offline silhouettes; never reads/processes live pixels. */
export const DUO_VIDEO_SRC = "/assets/products/duo/apple-highlights-display.mp4";
export const DUO_START_POSTER = "/assets/products/duo/duo-transparent-start.png";
export const DUO_END_POSTER = "/assets/products/duo/duo-transparent-end.png";
export const DUO_MATTE_SRC = "/assets/products/duo/duo-mattes.json";

type MatteFrame = {
  time: number;
  path: string;
  bounds: [number, number, number, number];
};

type MatteManifest = {
  version: 1;
  source: string;
  width: number;
  height: number;
  duration: number;
  frames: MatteFrame[];
};

export type DuoMatteRenderer = {
  /** Call with requestVideoFrameCallback metadata.mediaTime, not wall-clock time. */
  draw: (source: CanvasImageSource, mediaTime: number) => void;
  dispose: () => void;
};

let manifestPromise: Promise<MatteManifest> | undefined;

function loadManifest(): Promise<MatteManifest> {
  manifestPromise ??= fetch(DUO_MATTE_SRC).then(async (response) => {
    if (!response.ok) throw new Error("Duo silhouette assets could not be loaded.");
    const data = (await response.json()) as MatteManifest;
    if (
      data.version !== 1 || data.width !== 1260 || data.height !== 612 ||
      !Array.isArray(data.frames) || !data.frames.length ||
      data.frames.some((frame) => !Number.isFinite(frame.time) || typeof frame.path !== "string")
    ) throw new Error("Duo silhouette asset format is invalid.");
    return data;
  }).catch((error: unknown) => {
    manifestPromise = undefined;
    throw error;
  });
  return manifestPromise;
}

/**
 * Set canvas CSS dimensions/aspect-ratio in the component. Backing resolution is
 * the film's native 1260×612, independent of layout and DPR. The component owns
 * playback, intersection/visibility pausing, reduced motion, and rVFC cleanup.
 * If initialization fails, retain the transparent static poster; never expose
 * the original opaque <video> element. This does not start or schedule playback.
 */
export async function createDuoMatteRenderer(canvas: HTMLCanvasElement): Promise<DuoMatteRenderer> {
  const manifest = await loadManifest();
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("A transparent video canvas is unavailable.");
  canvas.width = manifest.width;
  canvas.height = manifest.height;
  const paths = manifest.frames.map((frame) => new Path2D(frame.path));
  let disposed = false;

  return {
    draw(source, mediaTime) {
      if (disposed) return;
      // Nearest exact PTS accommodates normal floating-point/decoder rounding.
      // currentTime is only a fallback when requestVideoFrameCallback is absent.
      const time = Number.isFinite(mediaTime) ? Math.max(0, mediaTime) : 0;
      let low = 0, high = manifest.frames.length - 1;
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (manifest.frames[middle].time < time) low = middle + 1;
        else high = middle;
      }
      let index = low;
      if (index > 0 && Math.abs(manifest.frames[index - 1].time - time) < Math.abs(manifest.frames[index].time - time)) index -= 1;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      try {
        context.clip(paths[index]);
        context.drawImage(source, 0, 0, manifest.width, manifest.height);
      } finally {
        context.restore();
      }
    },
    dispose() {
      disposed = true;
      paths.length = 0;
    },
  };
}
