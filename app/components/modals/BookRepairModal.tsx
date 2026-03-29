"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEVICES = ["iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17", "iPhone 17 Air", "iPhone 16 series", "iPhone 15 series", "Samsung Galaxy S25", "Samsung Galaxy S24", "Google Pixel 9", "Google Pixel 8", "Other device"];
const ISSUES  = ["Screen Replacement", "Battery Replacement", "Water Damage Repair", "Camera Repair", "Charging Port Repair", "Speaker / Microphone", "Back Glass Repair", "Software / Factory Reset", "Other issue"];

interface Form {
  name: string; email: string; phone: string;
  device: string; issue: string; date: string; notes: string;
}

const EMPTY: Form = { name: "", email: "", phone: "", device: "", issue: "", date: "", notes: "" };

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div style={{ padding: "28px 28px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 6 }}>
          CELLZY Repairs
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", lineHeight: 1.1 }}>{title}</h2>
        <p style={{ fontSize: 14, color: "#6e6e73", marginTop: 6, lineHeight: 1.5 }}>{subtitle}</p>
      </div>
      <button
        onClick={onClose}
        style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "#f5f5f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

export default function BookRepairModal({ onClose }: { onClose: () => void }) {
  const [form, setForm]     = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [done, setDone]     = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<Form> = {};
    if (!form.name.trim())   e.name   = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim())  e.phone  = "Required";
    if (!form.device)        e.device = "Please select your device";
    if (!form.issue)         e.issue  = "Please select the issue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
  };

  const ref_num = `CEL-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ModalHeader
              title="Book a Repair"
              subtitle="Tell us about your device and we'll get you sorted."
              onClose={onClose}
            />

            <div style={{ padding: "24px 28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Row: name + phone */}
              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <input className="field-input" placeholder="Alex Johnson" value={form.name} onChange={ref("name")} />
                  {errors.name && <span style={{ fontSize: 12, color: "#ff3b30" }}>{errors.name}</span>}
                </div>
                <div className="field-group">
                  <label className="field-label">Phone</label>
                  <input className="field-input" placeholder="+1 (555) 000-1234" value={form.phone} onChange={ref("phone")} />
                  {errors.phone && <span style={{ fontSize: 12, color: "#ff3b30" }}>{errors.phone}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="field-group">
                <label className="field-label">Email</label>
                <input className="field-input" type="email" placeholder="alex@email.com" value={form.email} onChange={ref("email")} />
                {errors.email && <span style={{ fontSize: 12, color: "#ff3b30" }}>{errors.email}</span>}
              </div>

              {/* Row: device + issue */}
              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Device</label>
                  <select className="field-input" value={form.device} onChange={ref("device")}>
                    <option value="">Select device</option>
                    {DEVICES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.device && <span style={{ fontSize: 12, color: "#ff3b30" }}>{errors.device}</span>}
                </div>
                <div className="field-group">
                  <label className="field-label">Issue</label>
                  <select className="field-input" value={form.issue} onChange={ref("issue")}>
                    <option value="">Select issue</option>
                    {ISSUES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  {errors.issue && <span style={{ fontSize: 12, color: "#ff3b30" }}>{errors.issue}</span>}
                </div>
              </div>

              {/* Preferred date */}
              <div className="field-group">
                <label className="field-label">Preferred Drop-off Date (optional)</label>
                <input className="field-input" type="date" value={form.date} onChange={ref("date")} />
              </div>

              {/* Notes */}
              <div className="field-group">
                <label className="field-label">Additional Notes (optional)</label>
                <textarea
                  className="field-input"
                  placeholder="Anything else we should know..."
                  rows={3}
                  value={form.notes}
                  onChange={ref("notes")}
                  style={{ resize: "none", lineHeight: 1.5 }}
                />
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="btn btn-dark"
                style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <SpinnerIcon /> Booking your repair…
                  </span>
                ) : "Confirm Booking →"}
              </button>

              <p style={{ fontSize: 12, color: "#aeaeb2", textAlign: "center", lineHeight: 1.5 }}>
                No payment required today. We'll confirm your slot within 2 hours.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}>
            <div style={{ padding: "48px 32px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.16,1,0.3,1] }}
                style={{ width: 64, height: 64, borderRadius: "50%", background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </motion.div>

              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", marginBottom: 8 }}>You're all booked!</h2>
                <p style={{ fontSize: 15, color: "#6e6e73", lineHeight: 1.6, maxWidth: 340 }}>
                  Your repair has been scheduled. We'll call <strong style={{ color: "#1d1d1f" }}>{form.phone}</strong> within 2 hours to confirm.
                </p>
              </div>

              <div style={{ background: "#f5f5f7", borderRadius: 16, padding: "18px 28px", width: "100%" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 6 }}>Booking Reference</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.08em", color: "#1d1d1f" }}>{ref_num}</div>
              </div>

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
                {[
                  ["Device",  form.device],
                  ["Issue",   form.issue],
                  ["Name",    form.name],
                  ...(form.date ? [["Date", form.date]] : []),
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontSize: 14 }}>
                    <span style={{ color: "#aeaeb2", fontWeight: 500 }}>{k}</span>
                    <span style={{ color: "#1d1d1f", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <button onClick={onClose} className="btn btn-dark" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}
