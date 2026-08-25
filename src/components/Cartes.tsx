import Link from "next/link";
import { Etiquette, Vignette } from "@/components/UI";
import {
  STATUTS_INNOVATION,
  TYPES_EVENEMENT,
  TYPES_OPPORTUNITE,
  dateLongue,
  initiales,
  periode,
  tempsRelatif,
  tronquer,
} from "@/lib/utils";

type ArticleCarte = {
  slug: string;
  titre: string;
  chapo: string;
  image: string | null;
  publieLe: Date;
  auteur: string;
  categorie: { nom: string; couleur: string; slug: string } | null;
};

export function CarteArticle({ article, grande = false }: { article: ArticleCarte; grande?: boolean }) {
  return (
    <article
      className={`group overflow-hidden rounded-xl border border-sable-200 bg-white transition-shadow hover:shadow-lg ${
        grande ? "sm:grid sm:grid-cols-2" : ""
      }`}
    >
      <Link href={`/actualites/${article.slug}`} className="block">
        <Vignette
          src={article.image}
          alt={article.titre}
          ratio={grande ? "aspect-[16/10] sm:h-full sm:aspect-auto sm:min-h-[280px]" : "aspect-[16/10]"}
          texte="IT"
        />
      </Link>
      <div className={`p-5 ${grande ? "sm:flex sm:flex-col sm:justify-center sm:p-8" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          {article.categorie && (
            <Etiquette couleur={article.categorie.couleur}>{article.categorie.nom}</Etiquette>
          )}
          <span className="text-xs text-nuit-600">{dateLongue(article.publieLe)}</span>
        </div>
        <h3
          className={`mt-3 font-bold tracking-tight text-nuit-900 ${
            grande ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          <Link href={`/actualites/${article.slug}`} className="lien-souligne">
            {article.titre}
          </Link>
        </h3>
        <p className={`mt-2 text-sm leading-relaxed text-nuit-600 ${grande ? "sm:text-base" : ""}`}>
          {tronquer(article.chapo, grande ? 220 : 130)}
        </p>
        <p className="mt-4 text-xs font-medium text-nuit-600">Par {article.auteur}</p>
      </div>
    </article>
  );
}

type ChercheurCarte = {
  slug: string;
  civilite: string;
  prenom: string;
  nom: string;
  institution: string;
  ville: string;
  domaine: string;
  photo: string | null;
  biographie: string;
  _count?: { publications: number };
};

export function CarteChercheur({ chercheur }: { chercheur: ChercheurCarte }) {
  return (
    <article className="group flex gap-4 rounded-xl border border-sable-200 bg-white p-5 transition-shadow hover:shadow-lg">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
        <Vignette
          src={chercheur.photo}
          alt={`${chercheur.prenom} ${chercheur.nom}`}
          ratio="aspect-square"
          texte={initiales(chercheur.prenom, chercheur.nom)}
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-nuit-900">
          <Link href={`/chercheurs/${chercheur.slug}`} className="lien-souligne">
            {chercheur.civilite} {chercheur.prenom} {chercheur.nom}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-nuit-600">
          {chercheur.institution} · {chercheur.ville}
        </p>
        <div className="mt-2.5">
          <Etiquette ton="or">{chercheur.domaine}</Etiquette>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-nuit-600">
          {tronquer(chercheur.biographie, 120)}
        </p>
        {chercheur._count && (
          <p className="mt-2 text-xs font-medium text-nuit-600">
            {chercheur._count.publications} publication
            {chercheur._count.publications > 1 ? "s" : ""} référencée
            {chercheur._count.publications > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </article>
  );
}

type InnovationCarte = {
  slug: string;
  nom: string;
  resume: string;
  secteur: string;
  statut: string;
  ville: string;
  annee: number;
  porteur: string;
  image: string | null;
};

export function CarteInnovation({ innovation }: { innovation: InnovationCarte }) {
  const tons = { idee: "neutre", prototype: "or", pilote: "nuit", commercialise: "vert" } as const;
  return (
    <article className="group overflow-hidden rounded-xl border border-sable-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/innovations/${innovation.slug}`}>
        <Vignette src={innovation.image} alt={innovation.nom} texte="⚙" />
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Etiquette ton={tons[innovation.statut as keyof typeof tons] ?? "neutre"}>
            {STATUTS_INNOVATION[innovation.statut] ?? innovation.statut}
          </Etiquette>
          <span className="text-xs text-nuit-600">
            {innovation.secteur} · {innovation.annee}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold tracking-tight text-nuit-900">
          <Link href={`/innovations/${innovation.slug}`} className="lien-souligne">
            {innovation.nom}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-nuit-600">
          {tronquer(innovation.resume, 130)}
        </p>
        <p className="mt-4 text-xs font-medium text-nuit-600">
          {innovation.porteur} · {innovation.ville}
        </p>
      </div>
    </article>
  );
}

type EvenementCarte = {
  slug: string;
  titre: string;
  description: string;
  type: string;
  lieu: string;
  ville: string;
  dateDebut: Date;
  dateFin: Date | null;
  organisateur: string;
  lienInscription: string | null;
};

export function CarteEvenement({ evenement }: { evenement: EvenementCarte }) {
  const debut = new Date(evenement.dateDebut);
  return (
    <article className="flex gap-5 rounded-xl border border-sable-200 bg-white p-5 transition-shadow hover:shadow-lg">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-nuit-800 text-white">
        <span className="text-xl font-bold leading-none">{debut.getDate()}</span>
        <span className="mt-1 text-[10px] uppercase tracking-wide text-or-400">
          {new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(debut)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Etiquette ton="or">{TYPES_EVENEMENT[evenement.type] ?? evenement.type}</Etiquette>
          <span className="text-xs text-nuit-600">{tempsRelatif(evenement.dateDebut)}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold tracking-tight text-nuit-900">
          <Link href={`/evenements/${evenement.slug}`} className="lien-souligne">
            {evenement.titre}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-nuit-600">
          {periode(evenement.dateDebut, evenement.dateFin)} · {evenement.lieu}, {evenement.ville}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-nuit-600">
          {tronquer(evenement.description, 130)}
        </p>
        <p className="mt-3 text-xs font-medium text-nuit-600">
          Organisé par {evenement.organisateur}
        </p>
      </div>
    </article>
  );
}

type OpportuniteCarte = {
  slug: string;
  titre: string;
  description: string;
  type: string;
  organisme: string;
  dateLimite: Date | null;
  montant: string | null;
  lien: string | null;
};

export function CarteOpportunite({ opportunite }: { opportunite: OpportuniteCarte }) {
  const expiree = opportunite.dateLimite ? new Date(opportunite.dateLimite) < new Date() : false;
  return (
    <article className="rounded-xl border border-sable-200 bg-white p-5 transition-shadow hover:shadow-lg">
      <div className="flex flex-wrap items-center gap-2">
        <Etiquette ton={expiree ? "neutre" : "or"}>
          {TYPES_OPPORTUNITE[opportunite.type] ?? opportunite.type}
        </Etiquette>
        {opportunite.dateLimite && (
          <Etiquette ton={expiree ? "neutre" : "terre"}>
            {expiree ? "Clôturé" : `Avant le ${dateLongue(opportunite.dateLimite)}`}
          </Etiquette>
        )}
      </div>
      <h3 className="mt-3 text-lg font-bold tracking-tight text-nuit-900">
        <Link href={`/opportunites/${opportunite.slug}`} className="lien-souligne">
          {opportunite.titre}
        </Link>
      </h3>
      <p className="mt-1.5 text-sm text-nuit-600">{opportunite.organisme}</p>
      <p className="mt-2.5 text-sm leading-relaxed text-nuit-600">
        {tronquer(opportunite.description, 150)}
      </p>
      {opportunite.montant && (
        <p className="mt-3 text-sm font-semibold text-nuit-800">{opportunite.montant}</p>
      )}
    </article>
  );
}
