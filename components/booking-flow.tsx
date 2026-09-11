"use client";

import { useMemo, useRef, useState } from "react";
import { format, startOfDay } from "date-fns";
import { ArrowLeft, ArrowRight, Check, Copy, Mail, Search, Wrench } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { devices, featuredModels, matchesDevice } from "@/lib/devices";
import { prepareRepairRequest, repairIssues } from "@/lib/repairs";

const grades = [
  { name: "LCD", copy: "A budget-conscious replacement." },
  { name: "OLED", copy: "Rich colour and deep blacks." },
  { name: "Original", copy: "An original display option." },
  { name: "Help me choose", copy: "Recommend the right option and include a quote." },
];
type Step = "device" | "issue" | "screen" | "visit";

export function BookingFlow({ initialDevice = "", initialIssue = "" }: { initialDevice?: string; initialIssue?: string }) {
  const [device, setDevice] = useState(initialDevice);
  const [query, setQuery] = useState(initialDevice);
  const [issue, setIssue] = useState(initialIssue);
  const [grade, setGrade] = useState("");
  const [step, setStep] = useState<Step>(initialDevice ? initialIssue ? initialIssue === "Cracked screen" ? "screen" : "visit" : "issue" : "device");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" });
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const steps: Step[] = issue === "Cracked screen" ? ["device", "issue", "screen", "visit"] : ["device", "issue", "visit"];
  const index = steps.indexOf(step);
  const today = startOfDay(new Date());

  const results = useMemo(() => {
    if (!query.trim()) return featuredModels.flatMap((name) => devices.filter((item) => item.model === name));
    return devices.filter((item) => matchesDevice(item, query)).slice(0, 8);
  }, [query]);
  const request = prepareRepairRequest({
    device, issue, screenGrade: issue === "Cracked screen" ? grade : "Not applicable",
    date: date ? format(date, "yyyy-MM-dd") : "", time: time || "Flexible", ...contact,
  });
  const canContinue = step === "device" ? Boolean(device.trim()) : step === "issue" ? Boolean(issue) : step === "screen" ? Boolean(grade) : Boolean(date);
  const moveTo = (next: Step) => {
    setStep(next);
    requestAnimationFrame(() => {
      const dialog = heading.current?.closest('[role="dialog"]');
      dialog?.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  };
  const selectIssue = (value: string) => { setIssue(value); setGrade(""); };

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(`To: info@cellzy.com\nSubject: ${request.subject}\n\n${request.body}`);
      setCopyStatus("Copied. Paste into an email to info@cellzy.com.");
    } catch {
      setCopyStatus("Select and copy the message below, then email info@cellzy.com.");
    }
  }

  if (prepared) return (
    <div className="booking-prepared">
      <span className="dialog-icon"><Mail /></span>
      <h2 tabIndex={-1} ref={heading}>Your request is ready.</h2>
      <p>Open your email app, review the message and send it to <strong>info@cellzy.com</strong>. Your appointment is requested only after you send; Cellzy will reply to confirm.</p>
      <div className="prepared-actions"><a className="primary-button" href={request.mailto}>Open email app <ArrowRight /></a><button type="button" className="secondary-button" onClick={copyRequest}><Copy />Copy request</button></div>
      <p role="status" className="copy-status">{copyStatus || "No email app? Copy the request into your webmail."}</p>
      <label className="request-preview">Your message<textarea readOnly rows={12} value={`To: info@cellzy.com\nSubject: ${request.subject}\n\n${request.body}`} /></label>
      <button type="button" className="back-button" onClick={() => { setPrepared(false); moveTo("visit"); }}><ArrowLeft />Edit request</button>
    </div>
  );

  return (
    <form className="booking-flow" onSubmit={(event) => { event.preventDefault(); if (step !== "visit" || !device.trim() || !issue || !contact.name.trim() || !contact.email.trim() || !canContinue || !date || date < today) return; setPrepared(true); requestAnimationFrame(() => heading.current?.focus()); }}>
      <div className="booking-topline"><span className="dialog-icon"><Wrench /></span><span>Step {index + 1} of {steps.length}</span></div>
      <div className="booking-progress" aria-hidden="true"><i style={{ width: `${(index + 1) / steps.length * 100}%` }} /></div>
      {device && step !== "device" && <p className="booking-context">{device}{issue && step !== "issue" ? ` · ${issue}` : ""}</p>}

      {step === "device" && <div className="booking-step">
        <h2 ref={heading} tabIndex={-1}>What are we fixing?</h2>
        <p>Search a phone name or model number. You can also enter an unlisted model.</p>
        <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">Search booking devices</span><input value={query} onChange={(event) => { setQuery(event.target.value); setDevice(""); setIssue(""); setGrade(""); }} placeholder="Try iPhone 13 Pro Max" maxLength={120} autoComplete="off" /></label>
        <div className="model-results">{results.map((item) => <button type="button" aria-pressed={device === item.model} key={`${item.brand}-${item.model}`} onClick={() => { setDevice(item.model); setIssue(""); setGrade(""); }}><span><small>{item.brand}</small>{item.model}</span>{device === item.model && <Check />}</button>)}
          {query.trim() && !results.some((item) => item.model.toLowerCase() === query.trim().toLowerCase()) && <button type="button" aria-pressed={device === query.trim()} onClick={() => { setDevice(query.trim()); setIssue(""); setGrade(""); }}><span><small>Use this exact model</small>{query.trim()}</span>{device === query.trim() && <Check />}</button>}
        </div>
        {device && <p className="selected-summary">Selected: <strong>{device}</strong></p>}
      </div>}

      {step === "issue" && <div className="booking-step">
        <h2 ref={heading} tabIndex={-1}>What happened?</h2><p>Choose the closest match. Add any other issues in the notes.</p>
        <div className="choice-grid">{repairIssues.map((item) => <button type="button" aria-pressed={issue === item.title} key={item.id} onClick={() => selectIssue(item.title)}>{item.title}{issue === item.title && <Check />}</button>)}</div>
      </div>}

      {step === "screen" && <div className="booking-step">
        <h2 ref={heading} tabIndex={-1}>Your screen preference.</h2><p>Availability and pricing depend on your model. We’ll confirm both before the repair.</p>
        <div className="grade-list">{grades.map((item) => <button type="button" aria-pressed={grade === item.name} key={item.name} onClick={() => setGrade(item.name)}><span><strong>{item.name}</strong><small>{item.copy}</small></span>{grade === item.name && <Check />}</button>)}</div>
      </div>}

      {step === "visit" && <div className="booking-step">
        <h2 ref={heading} tabIndex={-1}>When works for you?</h2><p>Choose a preferred visit. We’ll reply by email with pricing and a confirmed appointment time.</p>
        <div className="booking-final">
          <div><span className="field-label">Preferred date</span><Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: today }} startMonth={today} className="cellzy-calendar" />
            <label className="preferred-time">Preferred time <span>(optional)</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label><p className="field-note">Leave blank if you’re flexible. This is a request, not live store availability.</p>
          </div>
          <div className="contact-fields">
            <label>Name<input name="name" autoComplete="name" required pattern=".*\S.*" maxLength={100} value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} /></label>
            <label>Email<input name="email" autoComplete="email" type="email" required maxLength={160} value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label>
            <label>Phone <span>(optional)</span><input name="phone" autoComplete="tel" type="tel" maxLength={40} value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} /></label>
            <label>Anything else? <span>(optional)</span><textarea name="notes" rows={3} maxLength={1000} value={contact.notes} onChange={(event) => setContact({ ...contact, notes: event.target.value })} /></label>
            <div className="booking-summary"><strong>{device}</strong><span>{issue}{issue === "Cracked screen" ? ` · ${grade}` : ""}</span><span>{date ? format(date, "MMM d, yyyy") : "Choose a date"}{time ? ` at ${time}` : " · Flexible time"}</span></div>
          </div>
        </div>
      </div>}

      <div className="booking-controls">{index > 0 ? <button type="button" className="back-button" onClick={() => moveTo(steps[index - 1])}><ArrowLeft />Back</button> : <span />}
        {step === "visit" ? <button key="prepare" type="submit" className="primary-button" disabled={!canContinue}>Prepare email <ArrowRight /></button> : <button key="continue" type="button" className="primary-button" disabled={!canContinue} onClick={(event) => { event.preventDefault(); moveTo(steps[index + 1]); }}>Continue <ArrowRight /></button>}
      </div>
      {step === "visit" && <p className="booking-privacy">Your details stay in this browser until you send the prepared email. No payment is collected.</p>}
    </form>
  );
}
