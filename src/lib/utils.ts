/** Transforme un titre en identifiant d'URL lisible ("Énergie solaire" -> "energie-solaire"). */
export function slugifier(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['\u2019]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const formatLong = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const formatCourt = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function dateLongue(date: Date | string): string {
  return formatLong.format(new Date(date));
}

export function dateCourte(date: Date | string): string {
  return formatCourt.format(new Date(date));
}

/** Formate une période d'événement en une seule ligne. */
export function periode(debut: Date | string, fin?: Date | string | null): string {
  if (!fin) return dateLongue(debut);
  const d = new Date(debut);
  const f = new Date(fin);
  if (d.toDateString() === f.toDateString()) return dateLongue(d);
  return `du ${dateLongue(d)} au ${dateLongue(f)}`;
}

/** "il y a 3 jours", "dans 2 mois"... */
export function tempsRelatif(date: Date | string): string {
  const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });
  const diff = new Date(date).getTime() - Date.now();
  const jours = Math.round(diff / 86_400_000);
  if (Math.abs(jours) < 1) return "aujourd'hui";
  if (Math.abs(jours) < 31) return rtf.format(jours, "day");
  const mois = Math.round(jours / 30);
  if (Math.abs(mois) < 12) return rtf.format(mois, "month");
  return rtf.format(Math.round(mois / 12), "year");
}

/** Découpe une chaîne de mots-clés séparés par des virgules. */
export function listeTags(valeur?: string | null): string[] {
  if (!valeur) return [];
  return valeur
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Estimation du temps de lecture d'un texte. */
export function tempsLecture(contenu: string): string {
  const mots = contenu.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(mots / 200))} min de lecture`;
}

export function tronquer(texte: string, taille = 160): string {
  if (texte.length <= taille) return texte;
  return texte.slice(0, taille).trimEnd() + "…";
}

export function initiales(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

export const STATUTS_INNOVATION: Record<string, string> = {
  idee: "Idée",
  prototype: "Prototype",
  pilote: "Phase pilote",
  commercialise: "Commercialisé",
};

export const TYPES_EVENEMENT: Record<string, string> = {
  conference: "Conférence",
  hackathon: "Hackathon",
  atelier: "Atelier",
  salon: "Salon",
  formation: "Formation",
};

export const TYPES_OPPORTUNITE: Record<string, string> = {
  appel: "Appel à projets",
  bourse: "Bourse",
  financement: "Financement",
  prix: "Prix scientifique",
  formation: "Formation",
};

export const TYPES_SOUMISSION: Record<string, string> = {
  innovation: "Une innovation",
  chercheur: "Un chercheur / une chercheuse",
  actualite: "Une actualité",
  evenement: "Un événement",
};

export const STATUTS_SOUMISSION: Record<string, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours d'examen",
  publie: "Publié",
  rejete: "Écarté",
};
