import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((p) => ({ url: absoluteUrl(`/work/${p.id}`), priority: 0.8 })),
  ];
}
