"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, ExternalLink, LoaderCircle, RotateCw, SearchCheck } from "lucide-react";
import { DuoModel } from "@/components/duo-model";
import type { Device, ThreeDModel } from "@/lib/devices";

type LookupModel = ThreeDModel & { matchedName?: string };

export function DeviceVerifier({ device }: { device?: Device }) {
  const duoProgressRef = useRef(0.5);
  const [model, setModel] = useState<LookupModel | undefined>(device?.threeD);
  const [status, setStatus] = useState<"ready" | "loading" | "missing">(device?.threeD ? "ready" : "loading");

  useEffect(() => {
    if (!device || device.threeD) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ brand: device.brand, model: device.model });
    fetch(`/api/device-model?${params}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("No model");
        return response.json() as Promise<LookupModel>;
      })
      .then((match) => {
        setModel(match);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("missing");
      });
    return () => controller.abort();
  }, [device]);

  if (!device) return null;
  const usesCellzyDuoModel = device.model === "iPhone Duo";
  const inquiry = `mailto:info@cellzy.com?subject=${encodeURIComponent(`Device inquiry — ${device.model}`)}&body=${encodeURIComponent(`Hi Cellzy, I'd like to reserve or ask about a ${device.model}.`)}`;

  return (
    <section className="device-verifier" aria-live="polite">
      <div className="verifier-copy">
        <p className="verifier-kicker"><span>{device.brand}</span> · {device.family}</p>
        <h3>{device.model}</h3>
        {usesCellzyDuoModel ? (
          <>
            <p>Open the hinge, then drag the phone to verify the frame, cameras and controls before choosing the repair.</p>
            <div className="verifier-status"><BadgeCheck /> Cellzy product model · interactive 3D</div>
          </>
        ) : status === "ready" && model ? (
          <>
            <p>Rotate the phone to verify the finish, camera layout, frame and controls before you choose the repair.</p>
            <div className="verifier-status"><BadgeCheck /> {model.label} · interactive 360°</div>
          </>
        ) : status === "loading" ? (
          <>
            <p>Finding the closest exact-name 3D model from the licensed catalog.</p>
            <div className="verifier-status is-loading"><LoaderCircle /> Matching 3D model</div>
          </>
        ) : (
          <>
            <p>No exact-name licensed model passed our match check. We will not show you the wrong phone.</p>
            <div className="verifier-status pending"><SearchCheck /> Exact model requested</div>
          </>
        )}
        {device.aliases?.length ? <p className="model-alias">Model number: {device.aliases.join(" · ")}</p> : null}
        <a className="verifier-inquiry" href={inquiry}>Reserve or ask about it <ArrowRight /></a>
      </div>

      <div className={model || usesCellzyDuoModel ? "model-stage is-live" : "model-stage is-searching"}>
        {usesCellzyDuoModel ? (
          <>
            <DuoModel progressRef={duoProgressRef} interactive />
            <div className="model-instruction"><RotateCw /> Drag to rotate · inspect every side</div>
          </>
        ) : model ? (
          <>
            <iframe
              key={model.sketchfabId}
              title={`Interactive 360 degree model of ${device.model}`}
              src={`https://sketchfab.com/models/${model.sketchfabId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_hint=0&ui_controls=1&ui_inspector=0&autospin=.15`}
              loading="lazy"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
            <div className="model-instruction"><RotateCw /> Drag to rotate · scroll to zoom</div>
            <a className="model-credit" href={model.source} target="_blank" rel="noreferrer">3D by {model.creator} · CC licensed <ExternalLink /></a>
          </>
        ) : (
          <div className="model-lookup" role="status">
            <span><i /><i /><i /></span>
            <strong>{status === "loading" ? "Matching the exact device" : "Exact model not found"}</strong>
            <small>{status === "loading" ? "Checking name, generation and variant" : "Cellzy has recorded this model request"}</small>
          </div>
        )}
      </div>
      <p className="verifier-disclaimer">Visual reference only. Colours and finishes can vary; trademarks belong to their respective owners.</p>
    </section>
  );
}
