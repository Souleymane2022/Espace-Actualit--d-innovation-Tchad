import "server-only";

import { prisma } from "@/lib/db";
import type { Ressource } from "@/lib/ressources";

/** Charge la liste des valeurs sélectionnables pour chaque champ de type « relation ». */
export async function chargerOptionsRelations(
  ressource: Ressource,
): Promise<Record<string, { valeur: string; libelle: string }[]>> {
  const resultat: Record<string, { valeur: string; libelle: string }[]> = {};

  for (const champ of ressource.champs) {
    if (champ.type !== "relation" || !champ.relation) continue;

    const modele = prisma[champ.relation.modele as keyof typeof prisma] as unknown as {
      findMany: (a?: unknown) => Promise<Record<string, unknown>[]>;
    };
    const elements = await modele.findMany({ take: 500 });

    resultat[champ.nom] = elements
      .map((e) => ({ valeur: String(e.id), libelle: champ.relation!.etiquette(e) }))
      .sort((a, b) => a.libelle.localeCompare(b.libelle, "fr"));
  }

  return resultat;
}
