import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f2f2eb",
    theme_color: "#1d1d1b",
    lang: "en-US",
    categories: ["business", "shopping"],
    icons: [{ src: "/scc/shield.png", sizes: "270x270", type: "image/png", purpose: "any" }],
  };
}
