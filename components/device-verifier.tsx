"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, LoaderCircle, RotateCw } from "lucide-react";
import type { Device, ThreeDModel } from "@/lib/devices";

export function DeviceVerifier({ device }: { device: Device }) {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<ThreeDModel | undefined>(device.threeD);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "missing">(device.threeD ? "ready" : "idle");
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [viewerSlow, setViewerSlow] = useState(false);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!open || !model || viewerLoaded) return;
    const timeout = window.setTimeout(() => setViewerSlow(true), 12000);
    return () => window.clearTimeout(timeout);
  }, [open, model, viewerLoaded]);

  async function toggle() {
    setOpen(!open);
    if (!open) { setViewerLoaded(false); setViewerSlow(false); }
    if (open || status !== "idle") return;
    if (device.brand === "Other") { setStatus("missing"); return; }
    setStatus("loading");
    controller.current = new AbortController();
    const timeout = window.setTimeout(() => controller.current?.abort(), 8000);
    try {
      const params = new URLSearchParams({ brand: device.brand, model: device.model });
      const response = await fetch(`/api/device-model?${params}`, { signal: controller.current.signal });
      if (!response.ok) throw new Error("Preview unavailable");
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || !("sketchfabId" in result) || typeof result.sketchfabId !== "string" || !/^[a-f0-9]{32}$/.test(result.sketchfabId)) throw new Error("Invalid preview");
      setModel(result as ThreeDModel);
      setStatus("ready");
    } catch { setStatus("missing"); }
    finally { window.clearTimeout(timeout); }
  }

  return (
    <section className="device-verifier" aria-label="Optional device preview">
      <button type="button" className="preview-toggle" aria-expanded={open} aria-controls="device-preview" onClick={toggle}><span><RotateCw /><span>Want a closer look?<small>Check for a 360° view of your model.</small></span></span><ChevronDown /></button>
      {open && <div id="device-preview" className="preview-content">
        {status === "loading" ? <p className="preview-message" role="status"><LoaderCircle className="loading-spinner" />Looking for a preview of {device.model}…</p> : model ? <>
          <div className="model-stage">
            {!viewerLoaded && <p className="viewer-loading" role="status">{viewerSlow ? "Taking a little longer. You can open the model below or continue your repair." : "Loading the interactive view…"}</p>}
            <iframe title={`360 degree reference of ${device.model}`} src={`https://sketchfab.com/models/${model.sketchfabId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_hint=0&ui_inspector=0&scrollwheel=0`} allow="fullscreen; xr-spatial-tracking" allowFullScreen onLoad={() => setViewerLoaded(true)} />
          </div>
          <div className="preview-footer"><p>Drag to rotate. Community visual reference; finishes may vary.</p><a href={model.source} target="_blank" rel="noreferrer">Open 3D reference <ExternalLink /></a></div>
          <p className="preview-credit">Model by {model.creator}. Your repair request uses the phone you selected above.</p>
        </> : <p className="preview-message" role="status">A matching 360° preview isn’t available for {device.model}. You can still choose any repair above; we’ll confirm your model before work begins.</p>}
      </div>}
    </section>
  );
}
