import { NextResponse } from "next/server";

type SketchfabResult = {
  uid?: string;
  name?: string;
  viewerUrl?: string;
  viewCount?: number;
  likeCount?: number;
  license?: { label?: string };
  user?: { displayName?: string; username?: string };
};

const allowedLicenses = new Set(["CC Attribution", "CC0 Public Domain"]);
const variantWords = new Set(["air", "edge", "fe", "flip", "fold", "lite", "max", "mini", "plus", "pro", "stylus", "ultra"]);

function words(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function isStrictModelMatch(target: string, candidate: string) {
  const targetWords = words(target);
  const candidateWords = words(candidate);
  if (!targetWords.every((word) => candidateWords.includes(word))) return false;

  for (const variant of variantWords) {
    if (candidateWords.includes(variant) && !targetWords.includes(variant)) return false;
  }

  const targetIds = targetWords.filter((word) => /^(?:\d{1,2}[a-z]?|[as]\d{1,3}|z\d|fold\d|flip\d)$/i.test(word));
  const candidateIds = candidateWords.filter((word) => /^(?:\d{1,2}[a-z]?|[as]\d{1,3}|z\d|fold\d|flip\d)$/i.test(word));
  return candidateIds.every((id) => targetIds.includes(id)) || candidateIds.length === 0;
}

function rank(target: string, result: SketchfabResult) {
  const targetName = words(target).join(" ");
  const candidateName = words(result.name ?? "").join(" ");
  const exact = candidateName === targetName ? 10000 : 0;
  const cleanPrefix = candidateName.startsWith(targetName) ? 3000 : 0;
  return exact + cleanPrefix + (result.likeCount ?? 0) * 8 + Math.log10((result.viewCount ?? 0) + 1) * 40;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand")?.trim().slice(0, 40) ?? "";
  const model = searchParams.get("model")?.trim().slice(0, 100) ?? "";
  if (!brand || !model) return NextResponse.json({ error: "Missing device" }, { status: 400 });

  const apiUrl = new URL("https://api.sketchfab.com/v3/search");
  apiUrl.searchParams.set("type", "models");
  apiUrl.searchParams.set("q", `${brand} ${model}`);
  apiUrl.searchParams.set("downloadable", "true");
  apiUrl.searchParams.set("sort_by", "-likeCount");

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error(`Sketchfab ${response.status}`);
    const payload = await response.json() as { results?: SketchfabResult[] };
    const candidates = (payload.results ?? [])
      .filter((result) => result.uid && result.name && allowedLicenses.has(result.license?.label ?? ""))
      .filter((result) => isStrictModelMatch(model, result.name ?? ""))
      .sort((a, b) => rank(model, b) - rank(model, a));
    const match = candidates[0];
    if (!match?.uid) return NextResponse.json({ error: "No exact model found" }, { status: 404 });

    return NextResponse.json({
      sketchfabId: match.uid,
      creator: match.user?.displayName || match.user?.username || "Sketchfab creator",
      source: match.viewerUrl || `https://sketchfab.com/models/${match.uid}`,
      label: "Community reference",
      matchedName: match.name,
    }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ error: "3D lookup unavailable" }, { status: 502 });
  }
}
