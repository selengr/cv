import type { MetadataRoute } from "next";

const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${base}/shop/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/shop/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/shop/track`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/shop/wishlist`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];
}
