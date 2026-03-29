"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAKE_ORDERS: Record<string, { status: string; device: string; steps: { label: string; done: boolean; time: string }[] }> = {
  "CEL-10234": {
    status: "In Repair",
    device: "iPhone 17 Pro Max",
    steps: [
      { label: "Order Received",    done: true,  time: "Today 9:02 AM"  },
      { label: "Diagnostics",       done: true,  time: "Today 10:15 AM" },
      { label: "Repair In Progress",done: true,  time: "Today 11:30 AM" },
      { label: "Quality Check",     done: false, time: "Est. 2:00 PM"   },
      { label: "Ready for Pickup",  done: false, time: "Est. 3:30 PM"   },
    ],
  },
  "CEL-55821": {
    status: "Ready for Pickup",
    device: "Samsung Galaxy S25",
    steps: [
      { label: "Order Received",    done: true, time: "Yesterday 2:10 PM" },
      { label: "Diagnostics",       done: true, time: "Yesterday 3:00 PM" },
      { label: "Repair In Progress",done: true, time: "Yesterday 4:20 PM" },
      { label: "Quality Check",     done: true, time: "Yesterday 6:00 PM" },
      { label: "Ready for Pickup",  done: true, time: "Today 9:00 AM"     },
    ],
  },
};

export default function TrackOrderModal({ onClose }: { onClose: () => void }) {
  const [orderNum, setOrderNum] = useState("");
  const [email, setEmail]       = useState("");
  const [result, setResult]     = useState<(typeof FAKE_ORDERS)[string] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading]   = useState(false);

  const lookup = async () => {
    if (!orderNum.trim()) return;
    setLoading(true);
    setNotFound(false);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    const found = FAKE_ORDERS[orderNum.trim().toUpperCase()];
    if (found) { setResult(found); }
    else {
      // Generate a fake "in transit" result for any order number entered
      setResult({
        status: "Order Placed",
        device: "Your Device",
        steps: [
          { label: "Order Placed",      done: true,  time: "Recently"     },
          { label: "Awaiting Drop-off", done: false, time: "Pending"      },
          { label: "Diagnostics",       done: false, time: "Pending"      },
          { label: "Repair In Progress",done: false, time: "Pending"      },
          { label: "Ready for Pickup",  done: false, time: "Pending"      },
        ],
      });
    }
  };

  return (
    <div>
      <div style={{ padding: "28px 28px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 6 }}>CELLZY</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", lineHeight: 1.1 }}>Track Your Order</h2>
          <p style={{ fontSize: 14, color: "#6e6e73", marginTop: 6, lineHeight: 1.5 }}>Enter your booking reference to see live status.</p>
        </div>
        <button onClick={onClose} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "#f5f5f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div style={{ padding: "24px 28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="lookup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">Booking Reference</label>
                <input
                  className="field-input"
                  placeholder="e.g. CEL-10234"
                  value={orderNum}
                  onChange={e => { setOrderNum(e.target.value); setNotFound(false); }}
                  onKeyDown={e => e.key === "Enter" && lookup()}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Email (optional)</label>
                <input className="field-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              {notFound && (
                <p style={{ fontSize: 13, color: "#ff3b30", background: "rgba(255,59,48,0.06)", padding: "12px 16px", borderRadius: 10 }}>
                  We couldn't find that reference. Check for typos or contact support.
                </p>
              )}
              <button
                onClick={lookup}
                disabled={loading || !orderNum.trim()}
                className="btn btn-dark"
                style={{ width: "100%", justifyContent: "center", opacity: loading || !orderNum.trim() ? 0.55 : 1 }}
              >
                {loading ? "Looking up…" : "Track Order →"}
              </button>
              <p style={{ fontSize: 12, color: "#aeaeb2", textAlign: "center", lineHeight: 1.5 }}>
                Try <strong style={{ color: "#6e6e73" }}>CEL-10234</strong> or <strong style={{ color: "#6e6e73" }}>CEL-55821</strong> as demo references.
              </p>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Status badge */}
              <div style={{ background: "#f5f5f7", borderRadius: 16, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aeaeb2", marginBottom: 4 }}>Status</div>
                  <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f" }}>{result.status}</div>
                  <div style={{ fontSize: 13, color: "#6e6e73", marginTop: 3 }}>{result.device}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {result.steps.map((step, i) => (
                  <div key={step.label} style={{ display: "flex", gap: 16, paddingBottom: i < result.steps.length - 1 ? 20 : 0 }}>
                    {/* Timeline dot + line */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: step.done ? "#1d1d1f" : "#e5e5ea",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background 0.2s",
                      }}>
                        {step.done && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      {i < result.steps.length - 1 && (
                        <div style={{ width: 1.5, flex: 1, marginTop: 4, background: step.done ? "rgba(0,0,0,0.15)" : "#e5e5ea", minHeight: 16 }} />
                      )}
                    </div>
                    {/* Label */}
                    <div style={{ paddingTop: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: step.done ? 600 : 400, color: step.done ? "#1d1d1f" : "#aeaeb2" }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: "#aeaeb2", marginTop: 2 }}>{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setResult(null)} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                  Track Another
                </button>
                <button onClick={onClose} className="btn btn-dark btn-sm" style={{ flex: 1, justifyContent: "center" }}>
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
