"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, BatteryCharging, Cable, Check, Headphones, Menu, RotateCw, Search, ShieldCheck, Smartphone, Sparkles, Wrench, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookingFlow } from "@/components/booking-flow";
import { DeviceVerifier } from "@/components/device-verifier";
import { ProductStory } from "@/components/product-story";
import { deviceBrands, devices, featuredModels, matchesDevice } from "@/lib/devices";

const categories = [
  { icon: Smartphone, title: "Cases", copy: "Clear, silicone, rugged, folio and fashion cases for current and classic models." },
  { icon: ShieldCheck, title: "Screen protection", copy: "Tempered glass, privacy glass, camera protection and unbreakable films." },
  { icon: Cable, title: "Power", copy: "Cables, wall chargers, car chargers, power banks, MagSafe and multi-port power." },
  { icon: Headphones, title: "Audio", copy: "Earbuds, headphones, speakers and hands-free accessories." },
  { icon: BatteryCharging, title: "Car & travel", copy: "Car mounts, holders, adapters and compact travel charging." },
  { icon: Sparkles, title: "More in store", copy: "PopSockets, tablet accessories, smart-watch add-ons and new arrivals." },
];

const repairIssues = [
  { id: "cracked-screen", title: "Cracked screen", copy: "Cracks, touch issues or display damage", image: "/assets/issues/cracked-screen.jpg" },
  { id: "back-glass", title: "Broken back glass", copy: "Cracked or shattered rear panel", image: "/assets/issues/back-glass.jpg" },
  { id: "battery", title: "Battery problem", copy: "Fast drain, swelling or unexpected shutdowns", image: "/assets/issues/battery.jpg" },
  { id: "charging-port", title: "Not charging", copy: "Loose cable, blocked port or no power", image: "/assets/issues/charging-port.jpg" },
  { id: "speaker-microphone", title: "Speaker or microphone", copy: "Low sound, distortion or call issues", image: "/assets/issues/speaker-microphone.jpg" },
  { id: "camera", title: "Camera problem", copy: "Cracked lens, blur or camera failure", image: "/assets/issues/camera.jpg" },
  { id: "water-damage", title: "Water damage", copy: "Moisture, spills or liquid exposure", image: "/assets/issues/water-damage.jpg" },
  { id: "software-other", title: "Software or other", copy: "Frozen screen, boot issues or something else", image: "/assets/issues/software-other.jpg" },
] as const;

type RepairIssue = (typeof repairIssues)[number];

function repairReservationLink(device: string, issue: RepairIssue) {
  const subject = `Repair reservation — ${device} — ${issue.title}`;
  const body = [
    "Hi Cellzy,",
    "",
    "I'd like to reserve a repair.",
    `Device: ${device}`,
    `Issue: ${issue.title}`,
    "Please share a price estimate and available appointment options.",
    "",
    "Additional details:",
    "",
    "Please contact me to confirm a time.",
  ].join("\n");
  return `mailto:info@cellzy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [previewModel, setPreviewModel] = useState("");
  const [issueSelection, setIssueSelection] = useState<{ deviceKey: string; issue: RepairIssue } | null>(null);
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .15 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const matches = useMemo(() => {
    const pool = selectedBrand === "All" ? devices : devices.filter((item) => item.brand === selectedBrand);
    if (!catalogQuery.trim()) {
      if (selectedBrand !== "All") return pool.slice(-9).reverse();
      return featuredModels.map((name) => devices.find((item) => item.model === name)).filter(Boolean);
    }
    return pool.filter((item) => matchesDevice(item, catalogQuery)).slice(0, 12);
  }, [catalogQuery, selectedBrand]);

  const previewDevice = useMemo(() => {
    const selected = matches.find((item) => item?.model === previewModel);
    return selected ?? matches[0];
  }, [matches, previewModel]);

  const previewDeviceKey = previewDevice ? `${previewDevice.brand}-${previewDevice.model}` : "";
  const selectedIssue = issueSelection?.deviceKey === previewDeviceKey ? issueSelection.issue : null;
  const selectedByChoice = Boolean(previewModel);
  const exactMatchSelected = Boolean(catalogQuery.trim() && matches.length === 1);
  const exactDeviceSelected = Boolean(previewDevice && (selectedByChoice || exactMatchSelected));

  return (
    <main>
      <header className="site-header cinematic-header">
        <a href="#top" aria-label="Cellzy home" className="logo-link"><Image src="/assets/cellzy-logo.png" alt="Cellzy" className="wordmark" width={340} height={120} priority /></a>
        <nav aria-label="Main navigation" className="desktop-nav">
          <a href="#repairs">Repairs</a><a href="#devices">Devices</a><a href="#accessories">Accessories</a><a href="#visit">Visit</a>
        </nav>
        <div className="header-actions">
          <BookingDialog triggerClass="nav-book" label="Book a repair" />
          <button type="button" className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu /></button>
        </div>
      </header>
      <div className={menuOpen ? "mobile-menu open" : "mobile-menu"} aria-hidden={!menuOpen}>
        <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></button>
        <nav><a onClick={() => setMenuOpen(false)} href="#repairs">Repairs</a><a onClick={() => setMenuOpen(false)} href="#devices">Devices</a><a onClick={() => setMenuOpen(false)} href="#accessories">Accessories</a><a onClick={() => setMenuOpen(false)} href="#visit">Visit</a></nav>
      </div>

      <ProductStory />

      <section className="repair-ribbon"><span>LCD</span><i /><span>OLED</span><i /><span>Original</span><i /><span>Most repairs in 30 minutes</span></section>

      <section className="repair-section" id="repairs">
        <div className="section-heading" data-reveal><p className="eyebrow">Repair without the runaround</p><h2>Pick the part.<br />Keep your day.</h2><p>From iPhone 5 through the latest Pro Max, Galaxy S, Flip and Fold models, Pixel, Motorola and more.</p></div>
        <div className="grade-showcase" data-reveal>
          <article><span>01</span><h3>LCD</h3><p>A dependable, budget-conscious screen replacement.</p></article>
          <article className="feature-grade"><span>02</span><h3>OLED</h3><p>Deep blacks, rich colour and sharp contrast for daily use.</p><b>Most popular</b></article>
          <article><span>03</span><h3>Original</h3><p>The closest match to the display your phone came with.</p></article>
        </div>
        <div className="repair-cta" data-reveal><div><Wrench /><span><strong>Cracked screen to finished phone</strong><small>Most standard repairs take about 30 minutes.</small></span></div><BookingDialog triggerClass="primary-button" label="Reserve a repair" icon /></div>
      </section>

      <section className="campaign-break" aria-label="Cellzy campaign">
        <div className="campaign-photo" data-reveal><Image src="/assets/brand/campaign-city.jpg" alt="Cellzy customer with her phone in the city" fill sizes="(max-width: 900px) 100vw, 56vw" /></div>
        <div className="campaign-copy" data-reveal><p className="eyebrow">Made for real life</p><h2>Every device.<br />Your kind of care.</h2><p>From the newest iPhone Duo and iPhone 18 Pro Max to the phone already in your pocket. Cellzy keeps the technology personal.</p><a href="#devices">Find your phone <ArrowRight /></a></div>
      </section>

      <section className="device-section" id="devices">
        <div className="section-heading compact" data-reveal><p className="eyebrow">Device directory</p><h2>Find your exact phone.</h2><p>Search {devices.length} phones by name or model number. Rotate supported models in 360°, choose the problem, then reserve your repair—no online checkout.</p></div>
        <div className="device-finder" data-reveal>
          <label><Search /><span className="sr-only">Search devices</span><input value={catalogQuery} onChange={(event) => { setCatalogQuery(event.target.value); setPreviewModel(""); }} placeholder="Search iPhone, Galaxy, Pixel, Motorola…" /></label>
          <div className="brand-filters" aria-label="Filter devices by brand">
            {["All", ...deviceBrands].map((brand) => <button type="button" key={brand} className={selectedBrand === brand ? "active" : ""} onClick={() => { setSelectedBrand(brand); setPreviewModel(""); }}>{brand}</button>)}
          </div>
          {previewDevice ? <DeviceVerifier key={`${previewDevice.brand}-${previewDevice.model}`} device={previewDevice} /> : null}
          {exactDeviceSelected && previewDevice ? (
            <RepairIssueSelector device={previewDevice.model} selectedIssue={selectedIssue} onSelect={(issue) => setIssueSelection({ deviceKey: previewDeviceKey, issue })} />
          ) : (
            <div className="device-results">
              {matches.length ? matches.map((item) => item && <article key={`${item.brand}-${item.model}`}><div className="device-card-top"><small>{item.brand} · {item.family}</small><span><RotateCw /> 360°</span></div><h3>{item.model}</h3>{item.aliases?.length ? <p>Also found as {item.aliases.join(" · ")}</p> : <p>Screen · battery · charging · more</p>}<div className="device-card-actions"><button type="button" onClick={() => { setCatalogQuery(item.model); setPreviewModel(item.model); }}>Choose this model <ArrowRight /></button></div></article>) : <article className="no-result"><h3>We can still help.</h3><p>Email the exact model number and we’ll check the repair or device options.</p><a href={`mailto:info@cellzy.com?subject=${encodeURIComponent(`Device inquiry — ${catalogQuery}`)}`}>Ask about this device <ArrowRight /></a></article>}
            </div>
          )}
        </div>
      </section>

      <section className="accessory-section" id="accessories">
        <div className="section-heading compact" data-reveal><p className="eyebrow">Accessories</p><h2>Built for every pocket.</h2><p>Essentials and standout pieces for phones sold across Canada and the US.</p></div>
        <div className="category-grid">
          {categories.map(({ icon: Icon, title, copy }, index) => <article key={title} data-reveal style={{ transitionDelay: `${index * 45}ms` }}><Icon /><h3>{title}</h3><p>{copy}</p><a href={`mailto:info@cellzy.com?subject=${encodeURIComponent(`${title} reservation`)}`}>Reserve an item <ArrowRight /></a></article>)}
        </div>
      </section>

      <section className="brand-world" id="visit">
        <div className="brand-world-heading" data-reveal>
          <p className="eyebrow">The Cellzy world</p>
          <h2>Designed online.<br />Built to feel real.</h2>
          <p>Warm wood, brushed metal, terrazzo and terracotta—the physical Cellzy spaces and the digital experience now speak the same language.</p>
        </div>
        <div className="store-cinema" data-reveal>
          <Image src="/assets/brand/store-overall.jpg" alt="Cellzy in-line store interior with circular displays and illuminated ceiling rings" fill sizes="100vw" />
          <span>In-line store · overall view</span>
        </div>
        <div className="store-filmstrip">
          {[
            ["/assets/brand/store-left.jpg", "In-line store left view"],
            ["/assets/brand/store-right.jpg", "In-line store right view"],
            ["/assets/brand/store-facade.jpg", "Cellzy storefront"],
            ["/assets/brand/kiosk-front.jpg", "Cellzy kiosk front view"],
            ["/assets/brand/kiosk-left.jpg", "Cellzy kiosk left view"],
            ["/assets/brand/kiosk-right.jpg", "Cellzy kiosk right view"],
          ].map(([src, alt]) => <figure key={src}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 88vw, 48vw" /><figcaption>{alt}</figcaption></figure>)}
        </div>
        <div className="people-collage">
          {[
            ["/assets/brand/campaign-float.jpg", "Phone floating above a hand"],
            ["/assets/brand/campaign-black.jpg", "Customer holding a phone"],
            ["/assets/brand/campaign-friends.jpg", "Friends taking photos together"],
            ["/assets/brand/campaign-camera.jpg", "Customer using a phone camera"],
            ["/assets/brand/campaign-call.jpg", "Customer taking a call"],
            ["/assets/brand/campaign-case.jpg", "Customer using a phone case"],
            ["/assets/brand/campaign-cafe.jpg", "Customer using a phone at a cafe"],
          ].map(([src, alt], index) => <figure key={src} className={`collage-item collage-item-${index + 1}`} data-reveal><Image src={src} alt={alt} fill sizes="(max-width: 700px) 50vw, 28vw" /></figure>)}
        </div>
        <div className="visit-callout" data-reveal>
          <div><p className="eyebrow">Talk to Cellzy</p><h2>Walk in.<br />Walk out connected.</h2></div>
          <div><p>Repairs, devices and accessories—with real help from people who know phones.</p><a href="mailto:info@cellzy.com">info@cellzy.com <ArrowRight /></a><span>Phone, address and opening hours coming soon</span></div>
        </div>
      </section>

      <footer><a href="#top"><Image src="/assets/cellzy-logo.png" alt="Cellzy" className="wordmark" width={340} height={120} /></a><p>Phones · accessories · repairs</p><a href="mailto:info@cellzy.com">info@cellzy.com</a><small>© 2026 Cellzy. Apple and iPhone are trademarks of Apple Inc.</small></footer>
    </main>
  );
}

function RepairIssueSelector({ device, selectedIssue, onSelect }: { device: string; selectedIssue: RepairIssue | null; onSelect: (issue: RepairIssue) => void }) {
  return (
    <section className="repair-issue-selector" aria-labelledby="repair-issue-heading">
      <div className="issue-heading">
        <div>
          <p className="eyebrow">Your {device}</p>
          <h3 id="repair-issue-heading">What needs attention?</h3>
        </div>
        <p>Choose the closest issue. You can add more details in the email.</p>
      </div>
      <div className="issue-grid">
        {repairIssues.map((issue) => {
          const selected = selectedIssue?.id === issue.id;
          return (
            <button key={issue.id} type="button" className={selected ? "issue-card is-selected" : "issue-card"} aria-pressed={selected} onClick={() => onSelect(issue)}>
              <Image src={issue.image} alt="" fill sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 25vw" />
              <span className="issue-shade" />
              <span className="issue-check" aria-hidden="true"><Check /></span>
              <span className="issue-copy"><strong>{issue.title}</strong><small>{issue.copy}</small></span>
            </button>
          );
        })}
      </div>
      <div className="issue-reserve-bar" aria-live="polite">
        <div>
          <small>Selected repair</small>
          <strong>{selectedIssue ? `${device} · ${selectedIssue.title}` : "Choose an issue above"}</strong>
        </div>
        {selectedIssue ? <a className="primary-button" href={repairReservationLink(device, selectedIssue)}>Reserve this repair <ArrowRight /></a> : <button className="primary-button" type="button" disabled>Reserve this repair <ArrowRight /></button>}
      </div>
    </section>
  );
}

function BookingDialog({ triggerClass, label, icon = false, webMcp = false }: { triggerClass: string; label: string; icon?: boolean; webMcp?: boolean }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState({ device: "", issue: "" });

  useEffect(() => {
    if (!webMcp) return;
    const context = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "prepare_cellzy_repair",
      title: "Prepare a Cellzy repair",
      description: "Open the Cellzy repair booking flow and optionally prefill the customer's device and repair issue. This prepares the request but does not submit it.",
      inputSchema: {
        type: "object",
        properties: { device: { type: "string" }, issue: { type: "string" } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const value = input && typeof input === "object" ? input as { device?: unknown; issue?: unknown } : {};
        const device = typeof value.device === "string" ? value.device.slice(0, 120) : "";
        const issue = typeof value.issue === "string" ? value.issue.slice(0, 120) : "";
        setPrefill({ device, issue });
        setOpen(true);
        return { status: "prepared", device: device || null, issue: issue || null };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [webMcp]);

  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger className={triggerClass}>{label}{icon && <ArrowRight aria-hidden="true" />}</DialogTrigger><DialogContent className="booking-dialog"><BookingFlow key={`${prefill.device}-${prefill.issue}`} initialDevice={prefill.device} initialIssue={prefill.issue} /></DialogContent></Dialog>;
}
