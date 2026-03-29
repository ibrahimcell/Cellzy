"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = ["General Enquiry", "Order Support", "Repair Question", "Warranty Claim", "Returns & Refunds", "Press & Media", "Careers", "Other"];

interface Form { name: string; email: string; subject: string; message: string; }
const EMPTY: Form = { name: "", email: "", subject: "", message: "" };

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm]       = useState<Form>(EMPTY);
  const [errors, setErrors]   = useState<Partial<Form>>({});
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = (f: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [f]: e.target.value }));
    if (errors[f]) setErrors(er => ({ ...er, [f]: "" }));
  };

  const validate = () => {
    const e: Partial<Form> = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.subject)        e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div style={{ padding: "28px 28px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 6 }}>CELLZY Support</p>
                <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", lineHeight: 1.1 }}>Get in Touch</h2>
                <p style={{ fontSize: 14, color: "#6e6e73", marginTop: 6, lineHeight: 1.5 }}>We reply within 24 hours, Mon–Sat.</p>
              </div>
              <CloseBtn onClose={onClose} />
            </div>

            <div style={{ padding: "24px 28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Name</label>
                  <input className="field-input" placeholder="Your name" value={form.name} onChange={ref("name")} />
                  {errors.name && <Err>{errors.name}</Err>}
                </div>
                <div className="field-group">
                  <label className="field-label">Email</label>
                  <input className="field-input" type="email" placeholder="you@email.com" value={form.email} onChange={ref("email")} />
                  {errors.email && <Err>{errors.email}</Err>}
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Subject</label>
                <select className="field-input" value={form.subject} onChange={ref("subject")}>
                  <option value="">Select a topic</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <Err>{errors.subject}</Err>}
              </div>

              <div className="field-group">
                <label className="field-label">Message</label>
                <textarea
                  className="field-input"
                  placeholder="Tell us how we can help…"
                  rows={5}
                  value={form.message}
                  onChange={ref("message")}
                  style={{ resize: "none", lineHeight: 1.6 }}
                />
                {errors.message && <Err>{errors.message}</Err>}
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="btn btn-dark"
                style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Sending…" : "Send Message →"}
              </button>

              <p style={{ fontSize: 12, color: "#aeaeb2", textAlign: "center" }}>
                Or call us: <a href="tel:+15550001234" style={{ color: "#1d1d1f", fontWeight: 500, textDecoration: "none" }}>+1 (555) 000-1234</a>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}>
            <div style={{ padding: "52px 32px 44px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
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
                <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", marginBottom: 8 }}>Message sent!</h2>
                <p style={{ fontSize: 15, color: "#6e6e73", lineHeight: 1.6, maxWidth: 320 }}>
                  Thanks, <strong style={{ color: "#1d1d1f" }}>{form.name}</strong>. We'll reply to <strong style={{ color: "#1d1d1f" }}>{form.email}</strong> within 24 hours.
                </p>
              </div>
              <button onClick={onClose} className="btn btn-dark" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Done</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "#f5f5f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  );
}

function Err({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 12, color: "#ff3b30" }}>{children}</span>;
}
