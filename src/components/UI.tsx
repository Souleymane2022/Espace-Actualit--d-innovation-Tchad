import Link from "next/link";
import type { ReactNode } from "react";

export function Etiquette({
  children,
  ton = "neutre",
  couleur,
}: {
  children: ReactNode;
  ton?: "neutre" | "or" | "nuit" | "terre" | "vert";
  couleur?: string;
}) {
  const tons: Record<string, string> = {
    neutre: "bg-sable-100 text-nuit-700 border-sable-200",
    or: "bg-or-50 text-or-600 border-or-100",
    nuit: "bg-nuit-800 text-white border-nuit-800",
    terre: "bg-terre-100 text-terre-600 border-terre-100",
    vert: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tons[ton]}`}
      style={couleur ? { backgroundColor: `${couleur}14`, color: couleur, borderColor: `${couleur}33` } : undefined}
    >
      {children}
    </span>
  );
}

export function TitreSection({
  titre,
  sousTitre,
  lien,
  libelleLien = "Tout voir",
}: {
  titre: string;
  sousTitre?: string;
  lien?: string;
  libelleLien?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-sable-200 pb-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-nuit-900">{titre}</h2>
        {sousTitre && <p className="mt-1 text-sm text-nuit-600">{sousTitre}</p>}
      </div>
      {lien && (
        <Link
          href={lien}
          className="text-sm font-semibold text-nuit-700 hover:text-or-600"
        >
          {libelleLien} →
        </Link>
      )}
    </div>
  );
}

export function EnTetePage({
  surtitre,
  titre,
  description,
  children,
}: {
  surtitre?: string;
  titre: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-sable-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {surtitre && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-or-600">{surtitre}</p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-nuit-900 sm:text-4xl">{titre}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-nuit-600">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}

export function EtatVide({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-sable-200 bg-white px-6 py-14 text-center">
      <p className="text-sm text-nuit-600">{message}</p>
    </div>
  );
}

export function Filtres({
  base,
  actif,
  options,
  parametre = "categorie",
}: {
  base: string;
  actif?: string;
  options: { valeur: string; libelle: string }[];
  parametre?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={base}
        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
          !actif
            ? "border-nuit-800 bg-nuit-800 text-white"
            : "border-sable-200 bg-white text-nuit-700 hover:border-nuit-400"
        }`}
      >
        Tout
      </Link>
      {options.map((o) => (
        <Link
          key={o.valeur}
          href={`${base}?${parametre}=${encodeURIComponent(o.valeur)}`}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            actif === o.valeur
              ? "border-nuit-800 bg-nuit-800 text-white"
              : "border-sable-200 bg-white text-nuit-700 hover:border-nuit-400"
          }`}
        >
          {o.libelle}
        </Link>
      ))}
    </div>
  );
}

/** Visuel de repli lorsqu'aucune image n'est fournie. */
export function Vignette({
  src,
  alt,
  ratio = "aspect-[16/10]",
  texte,
}: {
  src?: string | null;
  alt: string;
  ratio?: string;
  texte?: string;
}) {
  if (src) {
    return (
      <div className={`${ratio} overflow-hidden bg-sable-100`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }
  return (
    <div
      className={`${ratio} flex items-center justify-center bg-gradient-to-br from-nuit-800 to-nuit-600 text-2xl font-bold text-or-400`}
    >
      {texte ?? alt.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function Pagination({
  page,
  total,
  parPage,
  base,
  parametres = {},
}: {
  page: number;
  total: number;
  parPage: number;
  base: string;
  parametres?: Record<string, string | undefined>;
}) {
  const pages = Math.ceil(total / parPage);
  if (pages <= 1) return null;

  const lien = (p: number) => {
    const qs = new URLSearchParams();
    for (const [cle, valeur] of Object.entries(parametres)) {
      if (valeur) qs.set(cle, valeur);
    }
    if (p > 1) qs.set("page", String(p));
    const suffixe = qs.toString();
    return suffixe ? `${base}?${suffixe}` : base;
  };

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={lien(page - 1)}
          className="rounded-md border border-sable-200 bg-white px-3.5 py-2 text-sm font-medium text-nuit-700 hover:border-nuit-400"
        >
          ← Précédent
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={lien(p)}
          aria-current={p === page ? "page" : undefined}
          className={`rounded-md border px-3.5 py-2 text-sm font-medium ${
            p === page
              ? "border-nuit-800 bg-nuit-800 text-white"
              : "border-sable-200 bg-white text-nuit-700 hover:border-nuit-400"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < pages && (
        <Link
          href={lien(page + 1)}
          className="rounded-md border border-sable-200 bg-white px-3.5 py-2 text-sm font-medium text-nuit-700 hover:border-nuit-400"
        >
          Suivant →
        </Link>
      )}
    </nav>
  );
}
