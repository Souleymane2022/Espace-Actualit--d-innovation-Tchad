import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const NOM_COOKIE = "innovtchad_session";
const DUREE_SESSION = 60 * 60 * 24 * 7; // 7 jours

type Session = { id: string; email: string; nom: string; role: string; exp: number };

function secret(): string {
  const valeur = process.env.SESSION_SECRET;
  if (!valeur || valeur.length < 8) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET doit être défini en production.");
    }
    return "secret-de-developpement";
  }
  return valeur;
}

function signer(charge: string): string {
  return createHmac("sha256", secret()).update(charge).digest("base64url");
}

function encoder(session: Session): string {
  const charge = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${charge}.${signer(charge)}`;
}

function decoder(jeton: string): Session | null {
  const [charge, signature] = jeton.split(".");
  if (!charge || !signature) return null;

  const attendue = Buffer.from(signer(charge));
  const fournie = Buffer.from(signature);
  if (attendue.length !== fournie.length || !timingSafeEqual(attendue, fournie)) return null;

  try {
    const session = JSON.parse(Buffer.from(charge, "base64url").toString()) as Session;
    if (session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function ouvrirSession(utilisateur: {
  id: string;
  email: string;
  nom: string;
  role: string;
}) {
  const session: Session = {
    ...utilisateur,
    exp: Math.floor(Date.now() / 1000) + DUREE_SESSION,
  };
  const magasin = await cookies();
  magasin.set(NOM_COOKIE, encoder(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DUREE_SESSION,
  });
}

export async function fermerSession() {
  const magasin = await cookies();
  magasin.delete(NOM_COOKIE);
}

export async function sessionCourante(): Promise<Session | null> {
  const magasin = await cookies();
  const jeton = magasin.get(NOM_COOKIE)?.value;
  return jeton ? decoder(jeton) : null;
}

/** À appeler en tête de chaque page ou action de l'espace d'administration. */
export async function exigerSession(): Promise<Session> {
  const session = await sessionCourante();
  if (!session) redirect("/admin/connexion");
  return session;
}

export async function verifierIdentifiants(email: string, motDePasse: string) {
  const { compare } = await import("bcryptjs");
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!utilisateur) return null;
  const valide = await compare(motDePasse, utilisateur.motDePasseHash);
  if (!valide) return null;
  return {
    id: utilisateur.id,
    email: utilisateur.email,
    nom: utilisateur.nom,
    role: utilisateur.role,
  };
}
