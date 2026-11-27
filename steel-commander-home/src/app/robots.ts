import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/** Search + AI answer-engine crawlers that are explicitly welcomed. */
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "Applebot",
  "Applebot-Extended",
  "DuckDuckBot",
  "DuckAssistBot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "meta-externalagent",
  "MistralAI-User",
  "cohere-ai",
  "YouBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
