import { NextResponse } from "next/server";
import { z } from "zod";
import { prepareRepairRequest } from "@/lib/repairs";

const bookingSchema = z.object({
  device: z.string().trim().min(1).max(120),
  issue: z.string().trim().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const parsed = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
      && parsed.valueOf() >= Date.now() - 86400000;
  }, "Choose a current or future date"),
  time: z.string().regex(/^(Flexible|([01]\d|2[0-3]):[0-5]\d)$/).default("Flexible"),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  screenGrade: z.string().trim().max(80).optional().default("Not applicable"),
  notes: z.string().trim().max(1000).optional().default(""),
});

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 8000) return NextResponse.json({ error: "Request is too long" }, { status: 413 });
    const result = bookingSchema.safeParse(JSON.parse(raw));
    if (!result.success) return NextResponse.json({ error: "Check your device, contact details and preferred date" }, { status: 400 });
    // Compose only. Nothing is sent or reserved by this endpoint.
    return NextResponse.json(prepareRepairRequest(result.data));
  } catch {
    return NextResponse.json({ error: "Invalid booking details" }, { status: 400 });
  }
}
