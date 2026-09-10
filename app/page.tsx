"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, BatteryCharging, Cable, Clock3, Headphones, Menu, RotateCw, Search, ShieldCheck, Smartphone, Sparkles, Wrench, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookingFlow } from "@/components/booking-flow";
import { DeviceVerifier } from "@/components/device-verifier";
import { deviceBrands, devices, featuredModels, matchesDevice } from "@/lib/devices";

const categories = [
  { icon: Smartphone, title: "Cases", copy: "Clear, silicone, rugged, folio and fashion cases for current and classic models." },
  { icon: ShieldCheck, title: "Screen protection", copy: "Tempered glass, privacy glass, camera protection and unbreakable films." },
  { icon: Cable, title: "Power", copy: "Cables, wall chargers, car chargers, power banks, MagSafe and multi-port power." },
  { icon: Headphones, title: "Audio", copy: "Earbuds, headphones, speakers and hands-free accessories." },
  { icon: BatteryCharging, title: "Car & travel", copy: "Car mounts, holders, adapters and compact travel charging." },
  { icon: Sparkles, title: "More in store", copy: "PopSockets, tablet accessories, smart-watch add-ons and new arrivals." },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [previewModel, setPreviewModel] = useState("");
  useEffect(() => {
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

  return (
    <main>
      <header className="site-header">
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

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow reveal reveal-one">Phones · accessories · repairs</p>
          <h1 className="reveal reveal-two">Your phone,<span>back to perfect.</span></h1>
          <p className="hero-intro reveal reveal-three">Most repairs finished in about 30 minutes. Every model, every day, with screen options that fit how you use your phone.</p>
          <div className="hero-actions reveal reveal-four"><BookingDialog triggerClass="primary-button" label="Start your repair" icon webMcp /><a className="text-button" href="#devices">Browse devices</a></div>
          <div className="hero-proof reveal reveal-five"><span><Clock3 /> 30-minute repairs</span><span><ShieldCheck /> Three screen grades</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-image-wrap"><Image src="/assets/hero-device.jpg" alt="" className="hero-image" fill sizes="(max-width: 900px) 100vw, 50vw" priority /><div className="hero-glass-card"><span className="pulse-dot" /><div><strong>Repair bench open</strong><small>Walk in or reserve a time</small></div></div></div>
          <span className="hero-index">01 / Care</span>
        </div>
        <a className="scroll-cue" href="#repairs"><span>Explore</span><ArrowDown /></a>
      </section>

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

      <section className="store-story" aria-label="Cellzy store concept">
        <div className="store-photo" data-reveal><Image src="/assets/store-interior.jpg" alt="Cellzy store interior concept with phone case displays and repair counter" fill sizes="(max-width: 900px) 100vw, 65vw" /></div>
        <div className="store-copy" data-reveal><p className="eyebrow">Designed around your device</p><h2>See it. Feel it. Find the right fit.</h2><p>Our stores bring hundreds of cases, accessories and repair options together in one bright, easy-to-shop space.</p><a href="#visit">Explore the store <ArrowRight /></a></div>
      </section>

      <section className="device-section" id="devices">
        <div className="section-heading compact" data-reveal><p className="eyebrow">Device directory</p><h2>Find your exact phone.</h2><p>Search {devices.length} phones by name or model number. Inspect supported models in 360°, then reserve a device or repair—no online checkout.</p></div>
        <div className="device-finder" data-reveal>
          <label><Search /><span className="sr-only">Search devices</span><input value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder="Search iPhone, Galaxy, Pixel, Motorola…" /></label>
          <div className="brand-filters" aria-label="Filter devices by brand">
            {["All", ...deviceBrands].map((brand) => <button type="button" key={brand} className={selectedBrand === brand ? "active" : ""} onClick={() => { setSelectedBrand(brand); setPreviewModel(""); }}>{brand}</button>)}
          </div>
          {previewDevice ? <DeviceVerifier device={previewDevice} /> : null}
          <div className="device-results">
            {matches.length ? matches.map((item) => item && <article className={previewDevice?.model === item.model ? "selected-device" : ""} key={`${item.brand}-${item.model}`}><div className="device-card-top"><small>{item.brand} · {item.family}</small>{item.threeD ? <span><RotateCw /> 360°</span> : null}</div><h3>{item.model}</h3>{item.aliases?.length ? <p>Also found as {item.aliases.join(" · ")}</p> : <p>Screen · battery · charging · more</p>}<div className="device-card-actions"><button type="button" onClick={() => setPreviewModel(item.model)}>{item.threeD ? "View in 360°" : "Inspect device"}</button><a href={`mailto:info@cellzy.com?subject=${encodeURIComponent(`Device reservation — ${item.model}`)}&body=${encodeURIComponent(`Hi Cellzy, I'd like to reserve or ask about a ${item.model}.`)}`}>Reserve <ArrowRight /></a></div></article>) : <article className="no-result"><h3>We can still help.</h3><p>Email the exact model number and we’ll check the repair or device options.</p><a href={`mailto:info@cellzy.com?subject=${encodeURIComponent(`Device inquiry — ${catalogQuery}`)}`}>Ask about this device <ArrowRight /></a></article>}
          </div>
        </div>
      </section>

      <section className="accessory-section" id="accessories">
        <div className="section-heading compact" data-reveal><p className="eyebrow">Accessories</p><h2>Built for every pocket.</h2><p>Essentials and standout pieces for phones sold across Canada and the US.</p></div>
        <div className="category-grid">
          {categories.map(({ icon: Icon, title, copy }, index) => <article key={title} data-reveal style={{ transitionDelay: `${index * 45}ms` }}><Icon /><h3>{title}</h3><p>{copy}</p><a href={`mailto:info@cellzy.com?subject=${encodeURIComponent(`${title} reservation`)}`}>Reserve an item <ArrowRight /></a></article>)}
        </div>
      </section>

      <section className="visit-section" id="visit">
        <div className="visit-copy" data-reveal><p className="eyebrow">Talk to Cellzy</p><h2>Walk in.<br />Walk out connected.</h2><p>Repairs, devices and accessories—all with real help from people who know phones.</p><div className="contact-list"><a href="mailto:info@cellzy.com">info@cellzy.com</a><span>Phone and opening hours coming soon</span></div></div>
        <div className="visit-image" data-reveal><Image src="/assets/store-facade.jpg" alt="Cellzy storefront concept" fill sizes="(max-width: 900px) 100vw, 62vw" /></div>
      </section>

      <footer><a href="#top"><Image src="/assets/cellzy-logo.png" alt="Cellzy" className="wordmark" width={340} height={120} /></a><p>Phones · accessories · repairs</p><a href="mailto:info@cellzy.com">info@cellzy.com</a><small>© 2026 Cellzy. All rights reserved.</small></footer>
    </main>
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
