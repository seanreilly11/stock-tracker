import { MetadataRoute } from "next";
import { readFileSync } from "fs";
import { join } from "path";

interface TickerEntry {
  t: string;
  n: string;
  k: string;
  x: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  const rawTickers = readFileSync(
    join(process.cwd(), "public", "tickers.json"),
    "utf8",
  );
  const tickers: TickerEntry[] = JSON.parse(rawTickers);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: new Date(),
    },
    {
      url: `${base}/contact`,
      priority: 0.2,
      changeFrequency: "monthly",
      lastModified: new Date(),
    },
  ];

  const stockRoutes: MetadataRoute.Sitemap = tickers.map((entry) => ({
    url: `${base}/stocks/${entry.t}`,
    priority: 0.7,
    changeFrequency: "daily" as const,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...stockRoutes];
}
