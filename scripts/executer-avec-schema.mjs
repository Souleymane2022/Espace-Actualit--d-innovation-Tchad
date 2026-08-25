#!/usr/bin/env node
/**
 * Lance une commande (prisma db push, tsx prisma/seed.ts…) après avoir ajouté
 * `?schema=innovtchad` aux adresses de base de données.
 *
 * Innov'Tchad range ainsi toutes ses tables dans un schéma PostgreSQL qui lui
 * est propre : la base peut être partagée avec d'autres applications sans
 * qu'aucune commande de ce projet ne voie — ni ne menace — leurs tables.
 * (Le client de l'application applique la même règle : voir src/lib/db.ts.)
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const SCHEMA = "innovtchad";

// Charge .env si présent (les commandes lancées ici démarrent avant que
// Prisma ou Next n'aient chargé le fichier eux-mêmes).
if (existsSync(".env")) {
  for (const ligne of readFileSync(".env", "utf8").split("\n")) {
    const m = ligne.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?\s*(#.*)?$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim();
  }
}

function avecSchema(url) {
  if (!url || url.includes("schema=")) return url;
  return url + (url.includes("?") ? "&" : "?") + "schema=" + SCHEMA;
}

process.env.DATABASE_URL = avecSchema(process.env.DATABASE_URL);
process.env.DATABASE_URL_UNPOOLED = avecSchema(
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL,
);

const [commande, ...args] = process.argv.slice(2);
const resultat = spawnSync(commande, args, { stdio: "inherit", env: process.env });
process.exit(resultat.status ?? 1);
