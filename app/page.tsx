"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, Clock3, Mail, Menu, Search, ShieldCheck, Smartphone, Sparkles, Wrench, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { BookingFlow } from "@/components/booking-flow";
import { ProductStory } from "@/components/product-story";
import { StoreGallery } from "@/components/store-gallery";
import { AccessoryCatalog } from "@/components/accessory-catalog";
import { CustomerHelp } from "@/components/customer-help";
import { ShoppingInquiry } from "@/components/shopping-inquiry";
import { deviceBrands, devices, featuredModels, matchesDevice, type Device } from "@/lib/devices";
import { CONTACT_EMAIL, inquiryLink, repairIssues, type RepairIssue } from "@/lib/repairs";
import { useScrollMotion } from "@/lib/use-scroll-motion";

const storeImages = [
  ["/assets/brand/store-left.jpg", "Inside Cellzy · left view"],
  ["/assets/brand/store-right.jpg", "Inside Cellzy · right view"],
  ["/assets/brand/store-facade.jpg", "The Cellzy storefront"],
  ["/assets/brand/kiosk-front.jpg", "The Cellzy kiosk"],
  ["/assets/brand/kiosk-left.jpg", "Kiosk · left view"],
  ["/assets/brand/kiosk-right.jpg", "Kiosk · right view"],
] as const;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<RepairIssue | null>(null);
  const [booking, setBooking] = useState<{ device: string; issue: string } | null>(null);
  const [resultLimit, setResultLimit] = useState(6);
  const main = useRef<HTMLElement>(null);
  useScrollMotion(main);

  const matches = useMemo(() => {
    const pool = selectedBrand === "All" ? devices : devices.filter((item) => item.brand === selectedBrand);
    if (catalogQuery.trim()) return pool.filter((item) => matchesDevice(item, catalogQuery));
    if (selectedBrand !== "All") return [...pool].reverse();
    return featuredModels.flatMap((name) => devices.filter((item) => item.model === name));
  }, [catalogQuery, selectedBrand]);

  const resetSelection = () => { setSelectedDevice(null); setSelectedIssue(null); setResultLimit(6); };
  const chooseDevice = (device: Device) => { setSelectedDevice(device); setSelectedIssue(null); };
  const openBooking = () => setBooking({ device: selectedDevice?.model || "", issue: selectedIssue?.title || "" });

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <a href="#top" aria-label="Cellzy home" className="logo-link"><Image src="/assets/cellzy-wordmark.svg" alt="Cellzy" className="wordmark" width={280} height={82} preload /></a>
        <nav aria-label="Main navigation" className="desktop-nav"><a href="#repairs">Repairs</a><a href="#devices">Devices</a><a href="#accessories">Accessories</a><a href="#visit">Our world</a></nav>
        <div className="header-actions">
          <button type="button" className="nav-book" onClick={openBooking}>Book a repair</button>
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger className="menu-button" aria-label="Open menu"><Menu aria-hidden="true" /></DialogTrigger>
            <DialogContent className="mobile-menu" showCloseButton={false}>
              <DialogTitle className="sr-only">Cellzy navigation</DialogTitle>
              <DialogDescription className="sr-only">Explore repairs, phones and accessories.</DialogDescription>
              <DialogClose className="menu-close" aria-label="Close menu"><X /></DialogClose>
              <nav aria-label="Mobile navigation">{[["#repairs", "Repairs"], ["#devices", "Devices"], ["#accessories", "Accessories"], ["#questions", "Questions"], ["#visit", "Our world"]].map(([href, title]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{title}</a>)}</nav>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main id="main-content" ref={main}>
        <ProductStory onBook={openBooking} />
        <div className="service-strip"><span><Clock3 />Most repairs in 30 minutes</span><span><Wrench />Care for iPhone & Android</span><span><ShieldCheck />Quote before we repair</span></div>

        <section className="repair-section section-space" id="repairs" aria-labelledby="repairs-title">
          <div className="section-heading"><div><p className="section-label">A repair that fits you</p><h2 id="repairs-title">Keep the phone.<br />Love it again.</h2></div><p>A cracked screen shouldn’t stop your day. Choose your phone, tell us what happened, and we’ll help with the rest.</p></div>
          <div className="grade-showcase">
            <article><span className="grade-marker"><Smartphone /></span><h3>LCD</h3><p>A budget-conscious option to get your screen working again.</p><span className="grade-caption">Everyday value</span></article>
            <article className="feature-grade"><span className="grade-marker"><Sparkles /></span><h3>OLED</h3><p>Rich colour, deep blacks and crisp contrast for compatible phones.</p><span className="grade-caption">A vivid display</span></article>
            <article><span className="grade-marker"><ShieldCheck /></span><h3>Original</h3><p>Ask about an original display option for your exact model.</p><span className="grade-caption">Original quality</span></article>
          </div>
          <div className="repair-cta"><p>Parts, price and repair time confirmed before we begin.<br /><span>Screen options vary by model. Walk-ins are welcome.</span></p><a className="primary-button" href="#devices">Find my repair <ArrowRight /></a></div>
        </section>

        <section className="device-section section-space" id="devices" aria-labelledby="devices-title">
          <div className="section-heading"><div><p className="section-label">Let’s start with your device</p><h2 id="devices-title">Find your phone.</h2></div><p>Search by name or model number. Choose your phone to see everything we can help with.</p></div>
          <div className="device-finder">
            <div className="search-field"><Search aria-hidden="true" /><label className="sr-only" htmlFor="device-search">Search devices</label><input id="device-search" maxLength={120} value={catalogQuery} onChange={(event) => { setCatalogQuery(event.target.value); resetSelection(); }} placeholder="Try iPhone 13 Pro Max or SM-S928W" autoComplete="off" />{catalogQuery && <button type="button" aria-label="Clear device search" onClick={() => { setCatalogQuery(""); resetSelection(); }}><X /></button>}</div>
            <div className="brand-filters" aria-label="Filter devices by brand">{["All", ...deviceBrands].map((brand) => <button type="button" key={brand} aria-pressed={selectedBrand === brand} onClick={() => { setSelectedBrand(brand); resetSelection(); }}>{brand}</button>)}</div>
            {selectedDevice ? (
              <div className="device-selection">
                <div className="selected-device-bar"><div><span className="selection-check"><Check /></span><div><p>{selectedDevice.brand === "Other" ? "Your device" : selectedDevice.brand}</p><h3>{selectedDevice.model}</h3></div></div><button type="button" className="text-link" onClick={resetSelection}>Change device</button></div>
                <RepairIssueSelector device={selectedDevice.model} selectedIssue={selectedIssue} onSelect={setSelectedIssue} onReserve={openBooking} />
                <div className="device-purchase"><p>Looking to buy this phone?</p><ShoppingInquiry kind="phone" device={selectedDevice.model}>Ask about price & availability <ArrowRight /></ShoppingInquiry><ShoppingInquiry kind="accessory" device={selectedDevice.model}>Find accessories for this model <ArrowRight /></ShoppingInquiry></div>
              </div>
            ) : (
              <>
                <p className="results-count" role="status">{catalogQuery.trim() ? `${matches.length} matching ${matches.length === 1 ? "device" : "devices"}` : selectedBrand === "All" ? "Popular phones. Older models welcome, too." : `${matches.length} ${selectedBrand} models`}</p>
                <div className="device-results">{matches.slice(0, resultLimit).map((item) => <button type="button" className="device-result" key={`${item.brand}-${item.model}`} onClick={() => chooseDevice(item)}><span><small>{item.brand}</small><strong>{item.model}</strong>{item.aliases?.length ? <span className="device-alias">{item.aliases.join(" / ")}</span> : <span className="device-alias">Repairs, accessories & device inquiries</span>}</span><ArrowRight aria-hidden="true" /></button>)}</div>
                {matches.length > resultLimit && <button type="button" className="load-more" onClick={() => setResultLimit(resultLimit + 12)}>Show more models <span>({matches.length - resultLimit})</span></button>}
                <div className="custom-device"><div><strong>{matches.length ? "Don’t see your model?" : "We can still help with this phone."}</strong><p>We’ll check the options and email you a quote.</p></div>{catalogQuery.trim() ? <button type="button" className="text-link" onClick={() => chooseDevice({ brand: "Other", family: "Custom model", model: catalogQuery.trim().slice(0, 120), kind: "phone" })}>Use “{catalogQuery.trim()}” <ArrowRight /></button> : <button type="button" className="text-link" onClick={() => document.getElementById("device-search")?.focus()}>Search your exact model <ArrowRight /></button>}</div>
              </>
            )}
          </div>
        </section>

        <AccessoryCatalog device={selectedDevice?.model} />
        <CustomerHelp />

        <section className="brand-world section-space" id="visit" aria-labelledby="visit-title">
          <div className="section-heading"><div><p className="section-label">Welcome to Cellzy</p><h2 id="visit-title">Real people.<br />A fresh perspective.</h2></div><p>Come for a case. Stay for a little advice. A welcoming space for your phone and everything that goes with it.</p></div>
          <div className="store-cinema" data-scroll-scene><Image src="/assets/brand/store-overall.jpg" alt="Cellzy store design with circular displays and illuminated ceiling rings" fill sizes="(max-width: 760px) 100vw, 88vw" data-scroll-image /><span>The Cellzy store concept</span></div>
          <StoreGallery images={storeImages} />
          <div className="life-heading"><p className="section-label">Life, connected.</p><p>Every age. Every style. Your Cellzy.</p></div>
          <div className="people-collage">{[
            ["/assets/brand/campaign-float.jpg", "A phone above an open hand"],
            ["/assets/brand/campaign-black.jpg", "A customer holding a phone"],
            ["/assets/brand/campaign-friends.jpg", "Friends taking a photo together"],
            ["/assets/brand/campaign-camera.jpg", "A customer using a phone camera"],
            ["/assets/brand/campaign-call.jpg", "A customer taking a call"],
            ["/assets/brand/campaign-case.jpg", "A phone case in everyday use"],
            ["/assets/brand/campaign-cafe.jpg", "Keeping connected at a cafe"],
          ].map(([src, alt]) => <figure key={src}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 45vw, 24vw" /></figure>)}</div>
        </section>
        <section className="visit-callout"><div><p className="section-label">We’re here to help</p><h2>Let’s talk<br />about your phone.</h2></div><div><p>A repair, an upgrade, or the perfect accessory.<br />Tell us what you’re looking for.</p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <ArrowRight /></a><button type="button" className="light-button" onClick={openBooking}>Book a repair <ArrowRight /></button></div></section>
      </main>
      <footer><a href="#top" aria-label="Cellzy home" className="logo-link"><Image src="/assets/cellzy-wordmark.svg" alt="Cellzy" className="wordmark" width={280} height={82} /></a><p>Phones. Accessories. Repairs.</p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><small>© {new Date().getFullYear()} Cellzy. Product names and trademarks belong to their respective owners.</small></footer>
      <Dialog open={Boolean(booking)} onOpenChange={(open) => { if (!open) setBooking(null); }}><DialogContent className="booking-dialog"><DialogTitle className="sr-only">Request a Cellzy repair appointment</DialogTitle><DialogDescription className="sr-only">Choose your device, repair and preferred visit. Prepare an email for Cellzy to confirm pricing and availability.</DialogDescription>{booking && <BookingFlow initialDevice={booking.device} initialIssue={booking.issue} />}</DialogContent></Dialog>
    </>
  );
}

function RepairIssueSelector({ device, selectedIssue, onSelect, onReserve }: { device: string; selectedIssue: RepairIssue | null; onSelect: (issue: RepairIssue) => void; onReserve: () => void }) {
  return (
    <section className="repair-issue-selector" aria-labelledby="repair-issue-heading">
      <div className="issue-heading"><h3 id="repair-issue-heading">What needs attention?</h3><p>Choose the issue. We’ll confirm the right repair for your {device}.</p></div>
      <div className="issue-grid">{repairIssues.map((issue) => <button key={issue.id} type="button" className={`issue-card${selectedIssue?.id === issue.id ? " is-selected" : ""}`} aria-pressed={selectedIssue?.id === issue.id} onClick={() => onSelect(issue)}><div className="issue-image"><Image src={issue.image} alt="" fill sizes="(max-width: 760px) 45vw, 22vw" /><span className="issue-check" aria-hidden="true"><Check /></span></div><span className="issue-copy"><strong>{issue.title}</strong><small>{issue.copy}</small></span></button>)}</div>
      <div className="issue-reserve-bar"><div role="status"><small>Your repair</small><strong key={selectedIssue?.id || "empty"}>{selectedIssue ? `${device} · ${selectedIssue.title}` : "Select an issue to continue"}</strong></div><div className="issue-actions">{selectedIssue && <a className="primary-button quote-button" href={inquiryLink(`Repair quote — ${device} — ${selectedIssue.title}`, [`Device: ${device}`, `Issue: ${selectedIssue.title}`, "Additional details:"])}><Mail aria-hidden="true" />Email for a quote</a>}<button className="primary-button" type="button" disabled={!selectedIssue} onClick={onReserve}>Reserve this repair <ArrowRight /></button></div></div>
    </section>
  );
}
