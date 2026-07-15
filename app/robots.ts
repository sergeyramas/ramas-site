import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/themes", "/examples"] }],
    sitemap: "https://sergeyramas.vercel.app/sitemap.xml",
    host: "https://sergeyramas.vercel.app",
  };
}
