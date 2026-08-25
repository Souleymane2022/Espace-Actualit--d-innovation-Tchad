"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

export type EtatFormulaire = { ok: boolean; message: string };

const schemaAbonne = z.object({
  email: z.string().email("Adresse e-mail invalide."),
});

export async function inscrireNewsletter(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const resultat = schemaAbonne.safeParse({ email: donnees.get("email") });
  if (!resultat.success) {
    return { ok: false, message: resultat.error.issues[0].message };
  }

  const email = resultat.data.email.trim().toLowerCase();
  const existant = await prisma.abonne.findUnique({ where: { email } });
  if (existant) {
    return { ok: true, message: "Vous êtes déjà inscrit. Merci !" };
  }

  await prisma.abonne.create({ data: { email } });
  return { ok: true, message: "Inscription enregistrée. À très vite !" };
}

const schemaSoumission = z.object({
  type: z.enum(["innovation", "chercheur", "actualite", "evenement"]),
  nomContact: z.string().min(2, "Merci d'indiquer votre nom."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().optional(),
  titre: z.string().min(4, "Le titre doit contenir au moins 4 caractères."),
  message: z.string().min(30, "Merci de décrire votre proposition en 30 caractères minimum."),
});

export async function envoyerSoumission(
  _etat: EtatFormulaire,
  donnees: FormData,
): Promise<EtatFormulaire> {
  const resultat = schemaSoumission.safeParse({
    type: donnees.get("type"),
    nomContact: donnees.get("nomContact"),
    email: donnees.get("email"),
    telephone: donnees.get("telephone") || undefined,
    titre: donnees.get("titre"),
    message: donnees.get("message"),
  });

  if (!resultat.success) {
    return { ok: false, message: resultat.error.issues[0].message };
  }

  await prisma.soumission.create({ data: resultat.data });
  return {
    ok: true,
    message:
      "Merci ! Votre proposition a bien été transmise à la rédaction, qui reviendra vers vous.",
  };
}
