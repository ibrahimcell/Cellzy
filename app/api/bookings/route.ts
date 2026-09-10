import { NextResponse } from "next/server";

type BookingPayload = {
  device: string;
  issue: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone?: string;
  screenGrade?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const payload: unknown = await request.json();
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid booking details" }, { status: 400 });
  }

  const candidate = payload as Record<string, unknown>;
  const required: Array<keyof BookingPayload> = ["device", "issue", "date", "time", "name", "email"];
  if (required.some((key) => typeof candidate[key] !== "string" || !candidate[key].trim())) {
    return NextResponse.json({ error: "Missing booking details" }, { status: 400 });
  }

  const booking = candidate as BookingPayload;

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
