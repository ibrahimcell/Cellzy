"use client";

import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Copy, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { accessoryCategories, type AccessoryCategoryId } from "@/lib/accessories";
import { devices, matchesDevice } from "@/lib/devices";
import { CONTACT_EMAIL, prepareInquiry } from "@/lib/repairs";
import styles from "./shopping-inquiry.module.css";

type Props = { kind: "phone" | "accessory"; device?: string; categoryId?: AccessoryCategoryId; children: ReactNode; className?: string };

export function ShoppingInquiry({ children, className = "text-link", ...props }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><button type="button" className={className}>{children}</button></DialogTrigger>
      <DialogContent className={`booking-dialog ${styles.dialog}`}>
        <DialogTitle className="sr-only">{props.kind === "phone" ? "Ask about a phone" : "Reserve an accessory"}</DialogTitle>
        <DialogDescription className="sr-only">Tell Cellzy what you need, then review and send your prepared email. No online payment.</DialogDescription>
        {open && <InquiryFields {...props} />}
      </DialogContent>
    </Dialog>
  );
}

function InquiryFields({ kind, device = "", categoryId = "cases" }: Omit<Props, "children" | "className">) {
  const [model, setModel] = useState(device);
  const [category, setCategory] = useState<AccessoryCategoryId>(categoryId);
  const [item, setItem] = useState("Help me choose");
  const [storage, setStorage] = useState("");
  const [colour, setColour] = useState("");
  const [condition, setCondition] = useState("No preference");
  const [carrier, setCarrier] = useState("");
  const [budget, setBudget] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const modelList = useId();
  const options = useMemo(() => model.trim() ? devices.filter((entry) => matchesDevice(entry, model)).slice(0, 8) : [], [model]);
  const group = accessoryCategories.find((entry) => entry.id === category)!;
  const request = prepareInquiry(
    kind === "phone" ? `Phone inquiry — ${model.trim()}` : `Accessory request — ${group.title} — ${model.trim()}`,
    kind === "phone" ? [
      `Phone model: ${model.trim()}`, `Storage preference: ${storage.trim() || "Please advise"}`,
      `Colour preference: ${colour.trim() || "Flexible"}`, `Condition preference: ${condition}`,
      `Carrier / compatibility: ${carrier.trim() || "Please confirm"}`, `Budget (CAD): ${budget.trim() || "Not specified"}`,
      `Additional details: ${notes.trim() || "None"}`, "", "Please confirm available options, condition, what is included and pickup details.",
    ] : [
      `Phone / device model: ${model.trim()}`, `Category: ${group.title}`, `Item: ${item}`,
      `Colour / style: ${colour.trim() || "Flexible"}`, `Quantity: ${quantity}`,
      `Budget (CAD): ${budget.trim() || "Not specified"}`, `Additional details: ${notes.trim() || "None"}`,
      "", "Please confirm compatibility, available styles and pickup details before reserving.",
    ],
  );

  function focusHeading() {
    requestAnimationFrame(() => {
      heading.current?.closest('[role="dialog"]')?.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(`To: ${CONTACT_EMAIL}\nSubject: ${request.subject}\n\n${request.body}`);
      setCopyStatus(`Copied. Paste into an email to ${CONTACT_EMAIL}.`);
    } catch {
      setCopyStatus(`Copy the message below and send it to ${CONTACT_EMAIL}.`);
    }
  }

  if (prepared) return (
    <div className="booking-prepared">
      <span className="dialog-icon"><Mail aria-hidden="true" /></span>
      <h2 tabIndex={-1} ref={heading}>Your inquiry is ready.</h2>
      <p>Review and send it to <strong>{CONTACT_EMAIL}</strong>. We’ll reply with options and pricing. Nothing is reserved until we confirm.</p>
      <div className="prepared-actions"><a className="primary-button" href={request.mailto}>Open email app <ArrowRight aria-hidden="true" /></a><button type="button" className="secondary-button" onClick={copyRequest}><Copy aria-hidden="true" />Copy request</button></div>
      <p className="copy-status" role="status">{copyStatus || "No email app? Copy the message into your webmail."}</p>
      <label className="request-preview">Your message<textarea readOnly rows={12} value={`To: ${CONTACT_EMAIL}\nSubject: ${request.subject}\n\n${request.body}`} /></label>
      <button type="button" className="back-button" onClick={() => { setPrepared(false); focusHeading(); }}><ArrowLeft aria-hidden="true" />Edit inquiry</button>
    </div>
  );

  return (
    <form className={styles.form} onSubmit={(event) => { event.preventDefault(); if (!model.trim()) return; setPrepared(true); focusHeading(); }}>
      <h2 ref={heading} tabIndex={-1}>{kind === "phone" ? "Your next phone. Your preferences." : "The right fit. For your phone."}</h2>
      <p className={styles.intro}>{kind === "phone" ? "Tell us what you have in mind. We’ll check the options and email you a quote." : "Choose what you need. We’ll check the fit, colours and availability before confirming your reservation."}</p>
      <label className={styles.full}>{kind === "phone" ? "Phone model" : "Phone or device model"}<input aria-label={kind === "phone" ? "Phone model" : "Phone or device model"} aria-describedby={`${modelList}-help`} required maxLength={120} value={model} onChange={(event) => setModel(event.target.value)} list={modelList} autoComplete="off" placeholder="Try iPhone 13 Pro Max, or type your exact model" /><span id={`${modelList}-help`}>Type an unlisted model, or enter “Not sure” and describe it in the notes.</span></label>
      <datalist id={modelList}>{options.map((entry) => <option key={`${entry.brand}-${entry.model}`} value={entry.model}>{entry.brand}</option>)}</datalist>
      <div className={styles.fields}>
        {kind === "phone" ? <>
          <label>Storage <small>(optional)</small><input maxLength={40} value={storage} onChange={(event) => setStorage(event.target.value)} placeholder="e.g. 256 GB, or help me choose" /></label>
          <label>Condition preference<select value={condition} onChange={(event) => setCondition(event.target.value)}><option>No preference</option><option>New</option><option>Pre-owned</option></select></label>
          <label>Colour <small>(optional)</small><input maxLength={80} value={colour} onChange={(event) => setColour(event.target.value)} placeholder="A favourite colour, or any" /></label>
          <label>Carrier <small>(optional)</small><input maxLength={80} value={carrier} onChange={(event) => setCarrier(event.target.value)} placeholder="For a compatibility check" /></label>
        </> : <>
          <label>Category<select value={category} onChange={(event) => { setCategory(event.target.value as AccessoryCategoryId); setItem("Help me choose"); }}>{accessoryCategories.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select></label>
          <label>What are you looking for?<select value={item} onChange={(event) => setItem(event.target.value)}>{group.items.map((entry) => <option key={entry}>{entry}</option>)}</select></label>
          <label>Colour or style <small>(optional)</small><input maxLength={80} value={colour} onChange={(event) => setColour(event.target.value)} placeholder="e.g. Clear, black, slim or rugged" /></label>
          <label>Quantity<input type="number" min={1} max={20} step={1} required value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
        </>}
        <label className={styles.full}>Budget in CAD <small>(optional)</small><input maxLength={60} value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="Your preferred range" /></label>
        <label className={styles.full}>Anything else? <small>(optional)</small><textarea rows={3} maxLength={600} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="The features, fit or details that matter to you." /></label>
      </div>
      <div className={styles.actions}><button type="submit" className="primary-button" disabled={!model.trim()}>Prepare inquiry <ArrowRight aria-hidden="true" /></button><p>No payment. No automatic email.<br />You review and send the request.</p></div>
      <p className={styles.privacy}>Please don’t include passwords, device passcodes or payment details.</p>
    </form>
  );
}
