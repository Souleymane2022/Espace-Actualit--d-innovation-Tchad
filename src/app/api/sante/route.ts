import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Poste de contrôle public : indique si la configuration nécessaire au
 * fonctionnement du site est en place, sans jamais révéler de valeur.
 * Utile pour diagnostiquer un déploiement sans accès aux journaux.
 */
export async function GET() {
  const secret = process.env.SESSION_SECRET;
  const etatSecret = !secret
    ? "absente"
    : secret.length < 8
      ? `trop courte (${secret.length} caractères)`
      : "ok";

  let etatBase = "ok";
  let contenus: Record<string, number> | null = null;
  try {
    contenus = {
      articles: await prisma.article.count(),
      chercheurs: await prisma.chercheur.count(),
      comptes: await prisma.utilisateur.count(),
    };
  } catch {
    etatBase = "injoignable";
  }

  return Response.json({
    site: "Innov'Tchad",
    variable_SESSION_SECRET: etatSecret,
    variable_ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "définie" : "absente (défaut : admin@innovtchad.td)",
    base_de_donnees: etatBase,
    contenus,
  });
}
