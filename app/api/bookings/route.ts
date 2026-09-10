import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const booking = await request.json();
  const required = ["device", "issue", "date", "time", "name", "email"];
  if (required.some((key) => !booking[key])) return NextResponse.json({ error: "Missing booking details" }, { status: 400 });

  const subject = `Cellzy repair request — ${booking.device}`;
  const lines = [
    `Customer: ${booking.name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone || "Not provided"}`,
    `Device: ${booking.device}`,
    `Repair: ${booking.issue}`,
    `Screen grade: ${booking.screenGrade}`,
    `Preferred time: ${booking.date} at ${booking.time}`,
    `Notes: ${booking.notes || "None"}`,
  ];

  if (!process.env.RESEND_API_KEY) {
    const mailto = `mailto:info@cellzy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    return NextResponse.json({ mailto });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BOOKINGS_FROM_EMAIL || "Cellzy Bookings <bookings@cellzy.com>",
      to: ["info@cellzy.com"],
      reply_to: booking.email,
      subject,
      text: lines.join("\n"),
    }),
  });
  if (!response.ok) return NextResponse.json({ error: "Email service unavailable" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
