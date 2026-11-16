import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/our-thinking/",
    "/about/",
    "/home-leadership-kit/",
    "/help-shape-polaris/",
    "/privacy-policy/",
    "/cookie-policy/",
    "/terms-of-use/",
  ].map(route => ({ url: `https://kyrolearning.com${route}` }));
}
