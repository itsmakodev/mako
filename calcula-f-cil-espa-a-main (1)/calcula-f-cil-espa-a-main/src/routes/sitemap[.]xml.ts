import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { CALCULATORS } from "../lib/calculators/registry";
import { POSTS } from "../lib/blog";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/calculadoras", priority: "0.9", changefreq: "weekly" },
          { path: "/ayudas", priority: "0.9", changefreq: "weekly" },
          { path: "/blog", priority: "0.8", changefreq: "weekly" },
          { path: "/quienes-somos", priority: "0.4", changefreq: "yearly" },
          { path: "/aviso-legal", priority: "0.2", changefreq: "yearly" },
          { path: "/politica-privacidad", priority: "0.2", changefreq: "yearly" },
          { path: "/politica-cookies", priority: "0.2", changefreq: "yearly" },
          ...CALCULATORS.map((c) => ({ path: `/calculadoras/${c.slug}`, priority: "0.9", changefreq: "monthly" })),
          ...POSTS.map((p) => ({ path: `/blog/${p.slug}`, priority: "0.7", changefreq: "monthly", lastmod: p.date })),
        ];
        const urls = entries.map((e) => [
          `  <url>`,
          `    <loc>${BASE_URL}${e.path}</loc>`,
          "lastmod" in e && e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
          `    <changefreq>${e.changefreq}</changefreq>`,
          `    <priority>${e.priority}</priority>`,
          `  </url>`,
        ].filter(Boolean).join("\n"));
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});