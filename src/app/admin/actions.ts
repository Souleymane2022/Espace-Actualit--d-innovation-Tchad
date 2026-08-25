"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { fermerSession, ouvrirSession, exigerSession, verifierIdentifiants } from "@/lib/auth";
import { trouverRessource, type Champ } from "@/lib/ressources";
import { slugifier } from "@/lib/utils";

export type EtatAdmin = { ok: boolean; message: string };

/* ------------------------------------------------------------------ */
/* Authentification                                                    */
/* ------------------------------------------------------------------ */

export async function connexion(_etat: EtatAdmin, donnees: FormData): Promise<EtatAdmin> {
  const email = String(donnees.get("email") ?? "");
  const motDePasse = String(donnees.get("motDePasse") ?? "");

  if (!email || !motDePasse) {
    return { ok: false, message: "Renseignez votre e-mail et votre mot de passe." };
  }

  const utilisateur = await verifierIdentifiants(email, motDePasse);
  if (!utilisateur) {
    return { ok: false, message: "Identifiants incorrects." };
  }

  await ouvrirSession(utilisateur);
  redirect("/admin");
}


export async function deconnexion() {
  await fermerSession();
  redirect("/admin/connexion");
}

/* ------------------------------------------------------------------ */
/* CRUD générique piloté par la configuration des ressources           */
/* ------------------------------------------------------------------ */

function valeurDepuisFormulaire(champ: Champ, donnees: FormData): unknown {
  const brute = donnees.get(champ.nom);

  switch (champ.type) {
    case "booleen":
      return brute === "on" || brute === "true";
    case "nombre": {
      const texte = String(brute ?? "").trim();
      if (!texte) return champ.requis ? 0 : null;
      const nombre = Number(texte);
      return Number.isNaN(nombre) ? null : nombre;
    }
    case "date": {
      const texte = String(brute ?? "").trim();
      return texte ? new Date(texte) : null;
    }
    case "relation": {
      const texte = String(brute ?? "").trim();
      return texte || null;
    }
    default: {
      const texte = String(brute ?? "").trim();
      return texte || (champ.requis ? "" : null);
    }
  }
}

/**
 * Champs réellement nullables du modèle, d'après le schéma Prisma.
 * Un champ non nullable doté d'une valeur par défaut (ex. `publieLe`) doit être
 * omis lorsqu'il est vide, et non transmis à `null`.
 */
function champsNullables(modele: string): Set<string> {
  const description = Prisma.dmmf.datamodel.models.find(
    (m) => m.name.toLowerCase() === modele.toLowerCase(),
  );
  return new Set(
    description?.fields.filter((f) => !f.isRequired).map((f) => f.name) ?? [],
  );
}

export async function enregistrerRessource(
  _etat: EtatAdmin,
  donnees: FormData,
): Promise<EtatAdmin> {
  await exigerSession();

  const cle = String(donnees.get("__ressource") ?? "");
  const id = String(donnees.get("__id") ?? "");
  const ressource = trouverRessource(cle);
  if (!ressource) return { ok: false, message: "Ressource inconnue." };

  const nullables = champsNullables(ressource.modele);
  const data: Record<string, unknown> = {};

  for (const champ of ressource.champs) {
    const valeur = valeurDepuisFormulaire(champ, donnees);
    if (champ.requis && (valeur === "" || valeur === null || valeur === undefined)) {
      return { ok: false, message: `Le champ « ${champ.libelle} » est obligatoire.` };
    }
    // Un champ vide et non nullable est simplement omis : la valeur par défaut
    // du schéma s'applique à la création, et la valeur existante est conservée
    // lors d'une modification.
    if (valeur === null && !nullables.has(champ.nom)) continue;
    data[champ.nom] = valeur;
  }

  // Slug : génération automatique et unicité.
  if (ressource.slugDepuis && ressource.champs.some((c) => c.nom === "slug")) {
    let slug = String(data.slug ?? "").trim();
    if (!slug) slug = slugifier(String(data[ressource.slugDepuis] ?? "") || "sans-titre");
    slug = slugifier(slug);

    const modele = prisma[ressource.modele as keyof typeof prisma] as unknown as {
      findFirst: (a: unknown) => Promise<{ id: string } | null>;
    };
    let candidat = slug;
    let suffixe = 2;
    for (;;) {
      const existant = await modele.findFirst({ where: { slug: candidat } });
      if (!existant || existant.id === id) break;
      candidat = `${slug}-${suffixe++}`;
    }
    data.slug = candidat;
  } else {
    delete data.slug;
  }

  const modele = prisma[ressource.modele as keyof typeof prisma] as unknown as {
    create: (a: unknown) => Promise<{ id: string }>;
    update: (a: unknown) => Promise<{ id: string }>;
  };

  try {
    if (id) {
      await modele.update({ where: { id }, data });
    } else {
      await modele.create({ data });
    }
  } catch (erreur) {
    return {
      ok: false,
      message: `Enregistrement impossible : ${
        erreur instanceof Error ? erreur.message.split("\n").slice(-1)[0] : "erreur inconnue"
      }`,
    };
  }

  revalidatePath("/", "layout");
  redirect(`/admin/${ressource.cle}?ok=1`);
}

export async function supprimerRessource(donnees: FormData) {
  await exigerSession();

  const cle = String(donnees.get("__ressource") ?? "");
  const id = String(donnees.get("__id") ?? "");
  const ressource = trouverRessource(cle);
  if (!ressource || !id) return;

  const modele = prisma[ressource.modele as keyof typeof prisma] as unknown as {
    delete: (a: unknown) => Promise<unknown>;
  };
  await modele.delete({ where: { id } });

  revalidatePath("/", "layout");
  redirect(`/admin/${ressource.cle}?supprime=1`);
}

export async function basculerPublication(donnees: FormData) {
  await exigerSession();

  const cle = String(donnees.get("__ressource") ?? "");
  const id = String(donnees.get("__id") ?? "");
  const valeur = donnees.get("__valeur") === "1";
  const ressource = trouverRessource(cle);
  if (!ressource || !id) return;

  const modele = prisma[ressource.modele as keyof typeof prisma] as unknown as {
    update: (a: unknown) => Promise<unknown>;
  };
  await modele.update({ where: { id }, data: { publie: valeur } });

  revalidatePath("/", "layout");
  redirect(`/admin/${ressource.cle}`);
}
