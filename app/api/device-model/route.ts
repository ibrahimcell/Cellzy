import { NextResponse } from "next/server";
import { devices } from "@/lib/devices";

type SketchfabResult = {
  uid?: string; name?: string; viewCount?: number; likeCount?: number;
  license?: { label?: string };
  user?: { displayName?: string; username?: string };
};
const allowedLicenses = new Set(["CC Attribution", "CC0 Public Domain"]);
const brandWords = new Set(["apple", "google", "galaxy", "lg", "motorola", "oneplus", "samsung", "xiaomi"]);
const presentationWords = new Set(["3d", "model", "phone", "smartphone", "mobile", "low", "high", "poly", "polycount", "detail", "detailed", "realistic", "pbr", "rigged", "textured", "free", "scan", "titanium", "natural", "black", "white", "silver", "gold", "blue", "green", "red", "purple", "pink", "orange", "burgundy", "graphite", "desert", "midnight", "starlight", "space", "gray", "grey"]);

function words(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/\+/g, " plus ")
    .replace(/\b3d\b/g, " ").replace(/([a-z])(\d)/g, "$1 $2").replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
}
function isStrictModelMatch(target: string, candidate: string) {
  // Reject accessories and concepts, even when their titles contain a phone's exact name.
  if (/\b(case|cover|protector|concept|mockup|stand|charger|bundle|collection)\b/i.test(candidate)) return false;
  const targetWords = words(target).filter((word) => !brandWords.has(word));
  const candidateWords = words(candidate).filter((word) => !brandWords.has(word));
  return targetWords.every((word) => candidateWords.includes(word))
    && candidateWords.every((word) => targetWords.includes(word) || presentationWords.has(word));
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand")?.trim() ?? "";
  const model = searchParams.get("model")?.trim() ?? "";
  if (!brand || !model || brand.length > 40 || model.length > 120) return NextResponse.json({ error: "Missing or invalid device" }, { status: 400 });
  if (!devices.some((device) => device.brand === brand && device.model === model)) return NextResponse.json({ error: "No preview for this device" }, { status: 404 });

  try {
    const signal = AbortSignal.timeout(6000);
    const queries = [...new Set([model, model.replace(/\s+/g, "")])];
    const pages = await Promise.all(queries.map(async (query) => {
      const url = new URL("https://api.sketchfab.com/v3/search");
      url.searchParams.set("type", "models");
      url.searchParams.set("q", query);
      url.searchParams.set("downloadable", "true");
      url.searchParams.set("count", "24");
      const response = await fetch(url, { next: { revalidate: 86400 }, signal });
      if (!response.ok) return [];
      const payload = await response.json() as { results?: SketchfabResult[] };
      return payload.results ?? [];
    }));
    const candidates = pages.flat()
      .filter((result) => result.uid && /^[a-f0-9]{32}$/.test(result.uid) && result.name && allowedLicenses.has(result.license?.label ?? ""))
      .filter((result) => isStrictModelMatch(model, result.name ?? ""))
      .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
    const match = candidates[0];
    if (!match?.uid) return NextResponse.json({ error: "No matching model available" }, { status: 404 });
    return NextResponse.json({
      sketchfabId: match.uid,
      creator: match.user?.displayName || match.user?.username || "Sketchfab creator",
      source: `https://sketchfab.com/models/${match.uid}`,
      label: "Community reference",
      matchedName: match.name,
    }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ error: "Preview temporarily unavailable" }, { status: 503 });
  }
}
