import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://cellzy.ca", lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
