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
    <article className={`group ${grande ? "grid gap-6 sm:grid-cols-5 sm:items-center" : ""}`}>
      <Link href={`/actualites/${article.slug}`} className={`block ${grande ? "sm:order-2 sm:col-span-3" : ""}`}>
        <Vignette src={article.image} alt={article.titre} texte="IT" />
      </Link>
      <div className={grande ? "sm:order-1 sm:col-span-2" : "pt-3"}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {article.categorie && (
            <span className="rubrique" style={{ color: article.categorie.couleur }}>
              {article.categorie.nom}
            </span>
          )}
          <span className="text-xs text-nuit-600">{dateLongue(article.publieLe)}</span>
        </div>
        <h3
          className={`titre-journal mt-2 leading-snug text-nuit-900 ${
            grande ? "text-2xl leading-tight sm:text-3xl lg:text-4xl" : "text-xl"
          }`}
        >
          <Link
            href={`/actualites/${article.slug}`}
            className="transition-colors group-hover:text-nuit-600"
          >
            {article.titre}
          </Link>
        </h3>
        <p className={`mt-2.5 leading-relaxed text-nuit-600 ${grande ? "text-base" : "text-sm"}`}>
          {tronquer(article.chapo, grande ? 200 : 120)}
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-nuit-600">
          Par {article.auteur}
        </p>
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
    <article className="group flex gap-4 border-b border-sable-200 pb-6">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
        <Vignette
          src={chercheur.photo}
          alt={`${chercheur.prenom} ${chercheur.nom}`}
          ratio="aspect-square"
          texte={initiales(chercheur.prenom, chercheur.nom)}
        />
      </div>
      <div className="min-w-0">
        <p className="rubrique text-or-600">{chercheur.domaine}</p>
        <h3 className="titre-journal mt-1 text-xl leading-snug text-nuit-900">
          <Link
            href={`/chercheurs/${chercheur.slug}`}
            className="transition-colors group-hover:text-nuit-600"
          >
            {chercheur.civilite} {chercheur.prenom} {chercheur.nom}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-nuit-600">
          {chercheur.institution} · {chercheur.ville}
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-nuit-600">
          {tronquer(chercheur.biographie, 120)}
        </p>
        {chercheur._count && chercheur._count.publications > 0 && (
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-nuit-600">
            {chercheur._count.publications} publication
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
    <article className="group">
      <Link href={`/innovations/${innovation.slug}`} className="block">
        <Vignette src={innovation.image} alt={innovation.nom} texte="⚙" />
      </Link>
      <div className="pt-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="rubrique text-or-600">{innovation.secteur}</span>
          <Etiquette ton={tons[innovation.statut as keyof typeof tons] ?? "neutre"}>
            {STATUTS_INNOVATION[innovation.statut] ?? innovation.statut}
          </Etiquette>
        </div>
        <h3 className="titre-journal mt-2 text-xl leading-snug text-nuit-900">
          <Link
            href={`/innovations/${innovation.slug}`}
            className="transition-colors group-hover:text-nuit-600"
          >
            {innovation.nom}
          </Link>
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-nuit-600">
          {tronquer(innovation.resume, 120)}
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-nuit-600">
          {innovation.porteur} · {innovation.ville} · {innovation.annee}
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
    <article className="group flex gap-5 border-b border-sable-200 pb-6">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center border-2 border-nuit-900 text-nuit-900">
        <span className="titre-journal text-2xl leading-none">{debut.getDate()}</span>
        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-or-600">
          {new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(debut)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rubrique text-or-600">{TYPES_EVENEMENT[evenement.type] ?? evenement.type}</span>
          <span className="text-xs text-nuit-600">{tempsRelatif(evenement.dateDebut)}</span>
        </div>
        <h3 className="titre-journal mt-1.5 text-xl leading-snug text-nuit-900">
          <Link
            href={`/evenements/${evenement.slug}`}
            className="transition-colors group-hover:text-nuit-600"
          >
            {evenement.titre}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-nuit-600">
          {periode(evenement.dateDebut, evenement.dateFin)} · {evenement.lieu}, {evenement.ville}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-nuit-600">
          {tronquer(evenement.description, 120)}
        </p>
        <p className="mt-2.5 text-xs font-medium uppercase tracking-wide text-nuit-600">
          {evenement.organisateur}
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
    <article className="group border-b border-sable-200 pb-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="rubrique text-or-600">
          {TYPES_OPPORTUNITE[opportunite.type] ?? opportunite.type}
        </span>
        {opportunite.dateLimite && (
          <Etiquette ton={expiree ? "neutre" : "terre"}>
            {expiree ? "Clôturé" : `Avant le ${dateLongue(opportunite.dateLimite)}`}
          </Etiquette>
        )}
      </div>
      <h3 className="titre-journal mt-2 text-xl leading-snug text-nuit-900">
        <Link
          href={`/opportunites/${opportunite.slug}`}
          className="transition-colors group-hover:text-nuit-600"
        >
          {opportunite.titre}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-nuit-600">{opportunite.organisme}</p>
      <p className="mt-2 text-sm leading-relaxed text-nuit-600">
        {tronquer(opportunite.description, 140)}
      </p>
      {opportunite.montant && (
        <p className="mt-2.5 text-sm font-semibold text-nuit-800">{opportunite.montant}</p>
      )}
    </article>
  );
}
