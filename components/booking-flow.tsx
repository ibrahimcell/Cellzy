"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Check, Search, Wrench } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { devices, featuredModels } from "@/lib/devices";

const issues = ["Cracked screen", "Battery", "Charging port", "Back glass", "Camera", "Water damage", "Software", "Something else"];
const grades = [
  { name: "LCD", copy: "Reliable, budget-friendly replacement." },
  { name: "OLED", copy: "Deeper blacks, richer colour and sharper contrast." },
  { name: "Original", copy: "Closest match to the screen your phone came with." },
];
const times = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"];

export function BookingFlow({ initialDevice = "", initialIssue = "" }: { initialDevice?: string; initialIssue?: string }) {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [device, setDevice] = useState(initialDevice);
  const [issue, setIssue] = useState(initialIssue);
  const [grade, setGrade] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "email" | "error">("idle");

  const results = useMemo(() => {
    if (!query.trim()) return featuredModels.map((name) => devices.find((item) => item.model === name)).filter(Boolean).slice(0, 6);
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return devices.filter((item) => words.every((word) => `${item.brand} ${item.model}`.toLowerCase().includes(word))).slice(0, 8);
  }, [query]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device,
          issue,
          screenGrade: grade || "Not applicable",
          date: date ? format(date, "yyyy-MM-dd") : "",
          time,
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          notes: data.get("notes"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send booking");
      if (result.mailto) {
        window.location.href = result.mailto;
        setStatus("email");
      } else setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent" || status === "email") {
    return (
      <div className="booking-success">
        <span><Check /></span>
        <h3>{status === "sent" ? "Your request is in." : "Your email is ready."}</h3>
        <p>{status === "sent" ? "We’ll confirm the repair time by email shortly." : "Review the prepared message in your email app and press send to finish the request."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="booking-flow">
      <div className="booking-topline">
        <div className="dialog-icon"><Wrench aria-hidden="true" /></div>
        <span>Step {step + 1} of 4</span>
      </div>
      <div className="booking-progress"><i style={{ width: `${(step + 1) * 25}%` }} /></div>

      {step === 0 && (
        <div className="booking-step">
          <h2>What are we fixing?</h2>
          <p>Search by model name or model number. If it isn’t listed, type the exact model and choose the custom option.</p>
          <label className="model-search">
            <Search aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘iPhone 15 Pro’ or ‘SM-S928W’" autoFocus />
          </label>
          <div className="model-results">
            {results.map((item) => item && (
              <button type="button" className={device === item.model ? "selected" : ""} key={`${item.brand}-${item.model}`} onClick={() => setDevice(item.model)}>
                <span><small>{item.brand}</small>{item.model}</span>{device === item.model && <Check />}
              </button>
            ))}
            {query && <button type="button" className={device === query ? "selected" : ""} onClick={() => setDevice(query)}><span><small>Other / exact model</small>{query}</span>{device === query && <Check />}</button>}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="booking-step">
          <h2>What happened?</h2>
          <p>Choose the closest match. A technician will confirm the exact repair before work begins.</p>
          <div className="choice-grid">
            {issues.map((item) => <button type="button" className={issue === item ? "selected" : ""} key={item} onClick={() => setIssue(item)}>{item}{issue === item && <Check />}</button>)}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="booking-step">
          <h2>Choose your screen.</h2>
          <p>For screen repairs, pick the quality level you prefer. For other repairs, select “Not applicable.”</p>
          <div className="grade-list">
            {grades.map((item) => <button type="button" className={grade === item.name ? "selected" : ""} key={item.name} onClick={() => setGrade(item.name)}><span><strong>{item.name}</strong><small>{item.copy}</small></span>{grade === item.name && <Check />}</button>)}
            <button type="button" className={grade === "Not applicable" ? "selected" : ""} onClick={() => setGrade("Not applicable")}><span><strong>Not applicable</strong><small>This repair doesn’t need a display replacement.</small></span>{grade === "Not applicable" && <Check />}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="booking-step booking-final">
          <div>
            <h2>Reserve your visit.</h2>
            <p>Choose a preferred time. We’ll confirm availability by email.</p>
            <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} className="cellzy-calendar" />
            <div className="time-grid">{times.map((slot) => <button type="button" className={time === slot ? "selected" : ""} key={slot} onClick={() => setTime(slot)}>{slot}</button>)}</div>
          </div>
          <div className="contact-fields">
            <label>Name<input name="name" required /></label>
            <label>Email<input name="email" type="email" required /></label>
            <label>Phone<input name="phone" type="tel" /></label>
            <label>Anything we should know?<textarea name="notes" rows={3} /></label>
            <div className="booking-summary"><strong>{device}</strong><span>{issue} · {grade}</span><span>{date ? format(date, "MMM d, yyyy") : "Choose a date"}{time ? ` at ${time}` : ""}</span></div>
          </div>
        </div>
      )}

      <div className="booking-controls">
        {step > 0 ? <button type="button" className="back-button" onClick={() => setStep(step - 1)}><ArrowLeft /> Back</button> : <span />}
        {step < 3 ? <button type="button" className="primary-button" disabled={(step === 0 && !device) || (step === 1 && !issue) || (step === 2 && !grade)} onClick={() => setStep(step + 1)}>Continue <ArrowRight /></button> : <button type="submit" className="primary-button" disabled={!date || !time || status === "sending"}>{status === "sending" ? "Sending…" : "Request appointment"}<ArrowRight /></button>}
      </div>
      {status === "error" && <p className="booking-error">We couldn’t prepare the request. Email info@cellzy.com and we’ll help you.</p>}
    </form>
  );
}
