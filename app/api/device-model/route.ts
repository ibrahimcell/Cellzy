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

type SketchfabSearch = {
  results?: SketchfabResult[];
  next?: string | null;
};

const allowedLicenses = new Set(["CC Attribution", "CC0 Public Domain"]);
const variantWords = new Set(["air", "edge", "fe", "flip", "fold", "lite", "max", "mini", "plus", "pro", "stylus", "ultra"]);

function words(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\b(?:3d|5g)\b/g, " ")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/[^a-z0-9+]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function isStrictModelMatch(target: string, candidate: string) {
  const brandWords = new Set(["apple", "google", "galaxy", "lg", "motorola", "oneplus", "samsung", "xiaomi"]);
  const targetWords = words(target).filter((word) => !brandWords.has(word));
  const candidateWords = words(candidate).filter((word) => !brandWords.has(word));
  if (!targetWords.every((word) => candidateWords.includes(word))) return false;

  for (const variant of variantWords) {
    if (candidateWords.includes(variant) && !targetWords.includes(variant)) return false;
  }

  const targetIds = targetWords.filter((word) => /^\d{1,3}$/.test(word));
  const candidateIds = candidateWords.filter((word) => /^\d{1,3}$/.test(word));
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

  try {
    const compact = words(model).join("");
    const withoutBrand = compact.replace(words(brand).join(""), "");
    const queries = [...new Set([model, compact, withoutBrand].filter((query) => query.length > 1))];
    const searchUrls = queries.flatMap((query) => {
      const textSearch = new URL("https://api.sketchfab.com/v3/search");
      textSearch.searchParams.set("type", "models");
      textSearch.searchParams.set("q", query);
      textSearch.searchParams.set("downloadable", "true");
      const tagSearch = new URL(textSearch);
      tagSearch.searchParams.delete("q");
      tagSearch.searchParams.append("tags", query.replace(/\s+/g, ""));
      return [textSearch.toString(), tagSearch.toString()];
    });

    async function search(url: string) {
      const found: SketchfabResult[] = [];
      let page: string | null = url;
      for (let index = 0; index < 3 && page; index += 1) {
        const response = await fetch(page, { next: { revalidate: 86400 } });
        if (!response.ok) break;
        const payload = await response.json() as SketchfabSearch;
        found.push(...(payload.results ?? []));
        if ((payload.results ?? []).some((result) => result.name && allowedLicenses.has(result.license?.label ?? "") && isStrictModelMatch(model, result.name))) break;
        page = payload.next ?? null;
      }
      return found;
    }

    const resultPages = await Promise.all(searchUrls.map(search));
    const unique = new Map<string, SketchfabResult>();
    resultPages.flat().forEach((result) => result.uid && unique.set(result.uid, result));
    const candidates = [...unique.values()]
      .filter((result) => result.uid && result.name && allowedLicenses.has(result.license?.label ?? ""))
      .filter((result) => isStrictModelMatch(model, result.name ?? ""))
      .sort((a, b) => rank(model, b) - rank(model, a));
    const match = candidates[0];
    if (!match?.uid) return NextResponse.json({ error: "No exact model found" }, { status: 404 });

    return NextResponse.json({
      sketchfabId: match.uid,
      creator: match.user?.displayName || match.user?.username || "Sketchfab creator",
      source: `https://sketchfab.com/models/${match.uid}`,
      label: "Community reference",
      matchedName: match.name,
    }, { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json({ error: "3D lookup unavailable" }, { status: 502 });
  }
}
