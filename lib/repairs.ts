export const CONTACT_EMAIL = "info@cellzy.ca";

export const repairIssues = [
  { id: "cracked-screen", title: "Cracked screen", copy: "Cracks, touch issues or display damage", image: "/assets/issues/cracked-screen.jpg" },
  { id: "back-glass", title: "Broken back glass", copy: "Cracked or shattered rear panel", image: "/assets/issues/back-glass.jpg" },
  { id: "battery", title: "Battery problem", copy: "Fast drain or unexpected shutdowns", image: "/assets/issues/battery.jpg" },
  { id: "charging-port", title: "Not charging", copy: "Loose connection or no power", image: "/assets/issues/charging-port.jpg" },
  { id: "speaker-microphone", title: "Speaker or microphone", copy: "Low sound or trouble on calls", image: "/assets/issues/speaker-microphone.jpg" },
  { id: "camera", title: "Camera problem", copy: "Cracked lens, blur or camera failure", image: "/assets/issues/camera.jpg" },
  { id: "water-damage", title: "Water damage", copy: "Spills or liquid exposure", image: "/assets/issues/water-damage.jpg" },
  { id: "software-other", title: "Software or other", copy: "Freezing, boot issues or something else", image: "/assets/issues/software-other.jpg" },
] as const;

export type RepairIssue = (typeof repairIssues)[number];

export function prepareInquiry(subject: string, lines: string[] = []) {
  const body = ["Hi Cellzy,", "", ...lines, "", "Please let me know the price and availability.", "", "Thank you."].join("\n");
  return { subject, body, mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}

export function inquiryLink(subject: string, lines: string[] = []) {
  return prepareInquiry(subject, lines).mailto;
}

export type RepairRequest = {
  device: string;
  issue: string;
  screenGrade: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export function prepareRepairRequest(request: RepairRequest) {
  const subject = `Cellzy repair request — ${request.device} — ${request.issue}`;
  const body = [
    "Hi Cellzy,", "", "I'd like a repair quote and an appointment.", "",
    `Device: ${request.device}`, `Issue: ${request.issue}`,
    `Screen preference: ${request.screenGrade || "Not applicable"}`,
    `Preferred date: ${request.date}`, `Preferred time: ${request.time || "Flexible"}`,
    "", `Name: ${request.name}`, `Email: ${request.email}`,
    `Phone: ${request.phone || "Not provided"}`, `Additional details: ${request.notes || "None"}`,
    "", "Please confirm the price, parts and appointment time before reserving the repair.",
  ].join("\n");
  return { subject, body, mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
