import { PrismaClient } from "@prisma/client";

/**
 * Toutes les tables d'Innov'Tchad vivent dans le schéma PostgreSQL
 * « innovtchad » : la base peut ainsi être partagée avec d'autres
 * applications sans risque de collision. Les commandes en ligne
 * (db push, seed) appliquent la même règle via
 * scripts/executer-avec-schema.mjs.
 */
function urlAvecSchema(url: string | undefined): string | undefined {
  if (!url || url.includes("schema=")) return url;
  return url + (url.includes("?") ? "&" : "?") + "schema=innovtchad";
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: urlAvecSchema(process.env.DATABASE_URL),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
