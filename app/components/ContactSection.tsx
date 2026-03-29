"use client";

import FadeInUp from "./FadeInUp";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-5 sm:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        <FadeInUp className="mb-12">
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#0071e3] block mb-2">
            Get in Touch
          </span>
          <h2 className="text-[30px] sm:text-[36px] font-bold tracking-tight text-[#1d1d1f]">
            We&apos;re here to help.
          </h2>
          <p className="text-[15px] font-light text-[#6e6e73] mt-2">
            Visit us in store, call, or send a message.
          </p>
        </FadeInUp>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Map/location tile */}
          <FadeInUp delay={0.05} className="lg:col-span-2">
            <div
              className="rounded-[24px] overflow-hidden relative"
              style={{
                height: 260,
                background: "linear-gradient(145deg, #e8f0fe 0%, #d5e4fc 50%, #e0ecfd 100%)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {/* Fake map dots */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(0,0,0,0.08) 30px,rgba(0,0,0,0.08) 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(0,0,0,0.08) 30px,rgba(0,0,0,0.08) 31px)",
              }} />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-[#0071e3] flex items-center justify-center shadow-lg"
                  style={{ boxShadow: "0 0 0 8px rgba(0,113,227,0.15)" }}
                >
                  <span className="text-white text-xl">📍</span>
                </div>
                <div className="text-center bg-white/80 backdrop-blur px-5 py-2 rounded-2xl border border-white/60">
                  <div className="text-[14px] font-semibold text-[#1d1d1f]">CELLZY Store</div>
                  <div className="text-[12px] text-[#6e6e73]">123 Tech Boulevard, Suite 5</div>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Hours tile */}
          <FadeInUp delay={0.1}>
            <div
              className="rounded-[24px] p-6 h-[260px] flex flex-col justify-between"
              style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.07)" }}
            >
              <div>
                <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#aeaeb2] mb-4">Store Hours</div>
                {[
                  ["Mon – Fri", "9:00 – 7:00 PM"],
                  ["Saturday", "10:00 – 6:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-1.5 border-b border-black/[0.05] last:border-0">
                    <span className="text-[13px] text-[#6e6e73]">{day}</span>
                    <span className="text-[13px] font-medium text-[#1d1d1f]">{hours}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[12px] font-medium text-green-600">Open Now</span>
              </div>
            </div>
          </FadeInUp>

          {/* Phone */}
          <FadeInUp delay={0.12}>
            <a
              href="tel:+15550001234"
              className="rounded-[20px] p-5 flex items-center gap-4 group transition-all duration-200"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-xl shrink-0">📞</div>
              <div>
                <div className="text-[11px] font-medium text-[#aeaeb2] uppercase tracking-wider">Call us</div>
                <div className="text-[15px] font-semibold text-[#1d1d1f]">+1 (555) 000-1234</div>
              </div>
            </a>
          </FadeInUp>

          {/* Email */}
          <FadeInUp delay={0.14}>
            <a
              href="mailto:hello@cellzy.com"
              className="rounded-[20px] p-5 flex items-center gap-4 transition-all duration-200"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-xl shrink-0">✉️</div>
              <div>
                <div className="text-[11px] font-medium text-[#aeaeb2] uppercase tracking-wider">Email</div>
                <div className="text-[15px] font-semibold text-[#1d1d1f]">hello@cellzy.com</div>
              </div>
            </a>
          </FadeInUp>

          {/* WhatsApp */}
          <FadeInUp delay={0.16}>
            <a
              href="#"
              className="rounded-[20px] p-5 flex items-center gap-4 transition-all duration-200"
              style={{
                background: "#f0faf3",
                border: "1px solid rgba(52,199,89,0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(52,199,89,0.12)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")}
            >
              <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center text-xl shrink-0">💬</div>
              <div>
                <div className="text-[11px] font-medium text-[#aeaeb2] uppercase tracking-wider">WhatsApp</div>
                <div className="text-[15px] font-semibold text-[#1d1d1f]">Chat with us</div>
              </div>
            </a>
          </FadeInUp>

        </div>
      </div>
    </section>
  );
}
