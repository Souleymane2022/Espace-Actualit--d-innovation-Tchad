import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, chercheurs, innovations, evenements, opportunites] = await Promise.all([
    prisma.article.findMany({ where: { publie: true }, select: { slug: true, misAJourLe: true } }),
    prisma.chercheur.findMany({ where: { publie: true }, select: { slug: true, misAJourLe: true } }),
    prisma.innovation.findMany({ where: { publie: true }, select: { slug: true, misAJourLe: true } }),
    prisma.evenement.findMany({ where: { publie: true }, select: { slug: true, misAJourLe: true } }),
    prisma.opportunite.findMany({ where: { publie: true }, select: { slug: true, misAJourLe: true } }),
  ]);

  const statiques = [
    "",
    "/actualites",
    "/chercheurs",
    "/innovations",
    "/evenements",
    "/opportunites",
    "/a-propos",
    "/contribuer",
  ].map((chemin) => ({ url: `${BASE}${chemin}`, lastModified: new Date() }));

  const dynamiques = [
    ...articles.map((a) => ({ url: `${BASE}/actualites/${a.slug}`, lastModified: a.misAJourLe })),
    ...chercheurs.map((c) => ({ url: `${BASE}/chercheurs/${c.slug}`, lastModified: c.misAJourLe })),
    ...innovations.map((i) => ({ url: `${BASE}/innovations/${i.slug}`, lastModified: i.misAJourLe })),
    ...evenements.map((e) => ({ url: `${BASE}/evenements/${e.slug}`, lastModified: e.misAJourLe })),
    ...opportunites.map((o) => ({ url: `${BASE}/opportunites/${o.slug}`, lastModified: o.misAJourLe })),
  ];

  return [...statiques, ...dynamiques];
}
