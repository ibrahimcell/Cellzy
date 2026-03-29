"use client";

import { useModal } from "./ModalProvider";

export default function Footer() {
  const { open } = useModal();

  const COLS = [
    {
      heading: "Shop",
      links: [
        { label: "New Phones",         action: () => { document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); } },
        { label: "Premium Cases",      action: () => { document.getElementById("accessories")?.scrollIntoView({ behavior: "smooth" }); } },
        { label: "Chargers & Cables",  action: () => { document.getElementById("accessories")?.scrollIntoView({ behavior: "smooth" }); } },
        { label: "Screen Protectors",  action: () => { document.getElementById("accessories")?.scrollIntoView({ behavior: "smooth" }); } },
        { label: "Trade In",           action: () => open("repair") },
      ],
    },
    {
      heading: "Repairs",
      links: [
        { label: "Screen Repair",       action: () => open("repair") },
        { label: "Battery Replacement", action: () => open("repair") },
        { label: "Water Damage",        action: () => open("repair") },
        { label: "Camera Repair",       action: () => open("repair") },
        { label: "All Services",        action: () => { document.getElementById("repairs")?.scrollIntoView({ behavior: "smooth" }); } },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About CELLZY",   action: () => { document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }); } },
        { label: "Careers",        action: () => open("contact") },
        { label: "Press",          action: () => open("contact") },
        { label: "Sustainability", action: () => open("contact") },
      ],
    },
    {
      heading: "Support",
      links: [
        { label: "Track Order", action: () => open("trackOrder") },
        { label: "Warranty",    action: () => open("contact")    },
        { label: "Returns",     action: () => open("contact")    },
        { label: "FAQ",         action: () => open("contact")    },
        { label: "Contact",     action: () => open("contact")    },
      ],
    },
  ];

  return (
    <footer style={{ background: "#f5f5f7", borderTop: "1px solid rgba(0,0,0,0.07)" }}>

      {/* CTA banner */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(56px, 8vw, 100px) clamp(24px, 6vw, 96px) clamp(48px, 7vw, 80px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 36,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
              color: "#1d1d1f",
              marginBottom: 14,
            }}
          >
            Ready for a perfect device?
          </h3>
          <p style={{ fontSize: 17, fontWeight: 300, color: "#6e6e73", letterSpacing: "-0.01em", lineHeight: 1.5 }}>
            Shop new phones or book your repair today.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => open("repair")} className="btn btn-dark btn-lg">Book a Repair</button>
          <a
            href="#shop"
            className="btn btn-white btn-lg"
            style={{ border: "1px solid rgba(0,0,0,0.10)" }}
          >
            Explore Shop
          </a>
        </div>
      </div>

      {/* Contact line */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "18px clamp(24px, 6vw, 96px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <p style={{ fontSize: 13, color: "#6e6e73", lineHeight: 1.7 }}>
          More ways to reach us:{" "}
          <a href="tel:+15550001234" className="foot-subtle">+1 (555) 000-1234</a>
          {"  ·  "}
          <a href="mailto:hello@cellzy.com" className="foot-subtle">hello@cellzy.com</a>
          {"  ·  Mon–Sat 9am – 7pm"}
        </p>
      </div>

      {/* Links grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(44px, 6vw, 72px) clamp(24px, 6vw, 96px)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "36px 24px",
        }}
      >
        {COLS.map(col => (
          <div key={col.heading}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#aeaeb2",
                marginBottom: 20,
              }}
            >
              {col.heading}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {col.links.map(link => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="foot-link"
                  style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "22px clamp(24px, 6vw, 96px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <a
            href="#home"
            style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.05em", color: "#1d1d1f", textDecoration: "none" }}
          >
            CELLZY
          </a>
          <p style={{ fontSize: 12, color: "#aeaeb2" }}>Copyright © 2026 CELLZY Inc. All rights reserved.</p>
          <div style={{ display: "flex", gap: 22 }}>
            {["Privacy Policy", "Terms of Use", "Cookies"].map(l => (
              <button
                key={l}
                onClick={() => open("contact")}
                className="foot-link"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, padding: 0 }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive footer grid */}
      <style>{`
        @media (max-width: 768px) {
          footer > div:nth-child(4) > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          footer > div:nth-child(4) > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
