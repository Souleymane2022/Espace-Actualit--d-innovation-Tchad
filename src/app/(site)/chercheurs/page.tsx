import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CarteChercheur } from "@/components/Cartes";
import { EnTetePage, EtatVide, Filtres, Pagination } from "@/components/UI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Annuaire des chercheurs",
  description:
    "Annuaire des chercheuses et chercheurs du Tchad : domaines de recherche, institutions, publications et contacts.",
};

const PAR_PAGE = 12;

export default async function PageChercheurs({
  searchParams,
}: {
  searchParams: Promise<{ domaine?: string; q?: string; page?: string }>;
}) {
  const { domaine, q, page: pageBrute } = await searchParams;
  const page = Math.max(1, Number(pageBrute) || 1);

  const where = {
    publie: true,
    ...(domaine ? { domaine } : {}),
    ...(q
      ? {
          OR: [
            { nom: { contains: q, mode: "insensitive" as const } },
            { prenom: { contains: q, mode: "insensitive" as const } },
            { institution: { contains: q, mode: "insensitive" as const } },
            { motsCles: { contains: q, mode: "insensitive" as const } },
            { domaine: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [domaines, chercheurs, total] = await Promise.all([
    prisma.chercheur.findMany({
      where: { publie: true },
      select: { domaine: true },
      distinct: ["domaine"],
      orderBy: { domaine: "asc" },
    }),
    prisma.chercheur.findMany({
      where,
      orderBy: [{ aLaUne: "desc" }, { nom: "asc" }],
      skip: (page - 1) * PAR_PAGE,
      take: PAR_PAGE,
      include: { _count: { select: { publications: true } } },
    }),
    prisma.chercheur.count({ where }),
  ]);

  return (
    <>
      <EnTetePage
        surtitre="Annuaire"
        titre="Chercheuses &amp; chercheurs du Tchad"
        description="Qui travaille sur quoi, et où ? Cet annuaire recense les scientifiques tchadiens, leurs domaines d'expertise et leurs travaux, pour faciliter les collaborations."
      >
        <form action="/chercheurs" className="mt-7 flex max-w-lg gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Nom, institution, mot-clé…"
            aria-label="Rechercher un chercheur"
            className="w-full rounded-md border border-sable-200 bg-sable-50 px-4 py-2.5 text-sm focus:border-nuit-400 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-nuit-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-nuit-700"
          >
            Rechercher
          </button>
        </form>
        <div className="mt-5">
          <Filtres
            base="/chercheurs"
            actif={domaine}
            parametre="domaine"
            options={domaines.map((d) => ({ valeur: d.domaine, libelle: d.domaine }))}
          />
        </div>
      </EnTetePage>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="mb-6 text-sm text-nuit-600">
          {total} profil{total > 1 ? "s" : ""} référencé{total > 1 ? "s" : ""}
        </p>
        {chercheurs.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {chercheurs.map((c) => (
              <CarteChercheur key={c.id} chercheur={c} />
            ))}
          </div>
        ) : (
          <EtatVide message="Aucun profil ne correspond à cette recherche." />
        )}
        <Pagination
          page={page}
          total={total}
          parPage={PAR_PAGE}
          base="/chercheurs"
          parametres={{ domaine, q }}
        />
      </div>
    </>
  );
}
