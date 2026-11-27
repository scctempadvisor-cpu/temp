import type { MetadataRoute } from "next";
import { SITE, abs } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [abs(SITE.ogImage), abs("/scc/gambrel.jpg"), abs("/scc/steel-home.png"), abs("/scc/steel-garage.png")],
    },
  ];
}
