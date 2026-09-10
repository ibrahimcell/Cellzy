"use client";

import { ArrowRight, BadgeCheck, Box, ExternalLink, RotateCw } from "lucide-react";
import type { Device } from "@/lib/devices";

export function DeviceVerifier({ device }: { device?: Device }) {
  if (!device) return null;

  const inquiry = `mailto:info@cellzy.com?subject=${encodeURIComponent(`Device inquiry — ${device.model}`)}&body=${encodeURIComponent(`Hi Cellzy, I'd like to reserve or ask about a ${device.model}.`)}`;

  return (
    <section className="device-verifier" aria-live="polite">
      <div className="verifier-copy">
        <p className="verifier-kicker"><span>{device.brand}</span> · {device.family}</p>
        <h3>{device.model}</h3>
        {device.threeD ? (
          <>
            <p>Inspect the finish, camera layout, frame and controls from every angle before you book.</p>
            <div className="verifier-status"><BadgeCheck /> {device.threeD.label} · interactive 360°</div>
          </>
        ) : (
          <>
            <p>We have this device in the Cellzy directory. Its exact licensed 360° model is still being prepared.</p>
            <div className="verifier-status pending"><Box /> 360° reference coming next</div>
          </>
        )}
        {device.aliases?.length ? <p className="model-alias">Model number: {device.aliases.join(" · ")}</p> : null}
        <a className="verifier-inquiry" href={inquiry}>Reserve or ask about it <ArrowRight /></a>
      </div>

      <div className={device.threeD ? "model-stage is-live" : "model-stage"}>
        {device.threeD ? (
          <>
            <iframe
              key={device.threeD.sketchfabId}
              title={`Interactive 360 degree model of ${device.model}`}
              src={`https://sketchfab.com/models/${device.threeD.sketchfabId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_hint=0&ui_controls=1&ui_inspector=0`}
              loading="lazy"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
            <div className="model-instruction"><RotateCw /> Drag to rotate · scroll to zoom</div>
            <a className="model-credit" href={device.threeD.source} target="_blank" rel="noreferrer">3D by {device.threeD.creator} · CC BY <ExternalLink /></a>
          </>
        ) : (
          <div className="model-pending" aria-label={`A generic placeholder for ${device.model}; not an exact model`}>
            <div className="wireframe-phone"><i /><b /><span /></div>
            <small>Exact-model preview pending</small>
          </div>
        )}
      </div>
      <p className="verifier-disclaimer">Visual reference only. Colours and finishes can vary; trademarks belong to their respective owners.</p>
    </section>
  );
}
