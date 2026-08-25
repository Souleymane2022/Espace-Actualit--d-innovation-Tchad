import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CarteInnovation } from "@/components/Cartes";
import { EnTetePage, EtatVide, Filtres, Pagination } from "@/components/UI";
import { STATUTS_INNOVATION } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vitrine des innovations",
  description:
    "Les innovations, inventions et projets technologiques imaginés au Tchad : agriculture, santé, énergie, numérique.",
};

const PAR_PAGE = 12;

export default async function PageInnovations({
  searchParams,
}: {
  searchParams: Promise<{ secteur?: string; statut?: string; page?: string }>;
}) {
  const { secteur, statut, page: pageBrute } = await searchParams;
  const page = Math.max(1, Number(pageBrute) || 1);

  const where = {
    publie: true,
    ...(secteur ? { secteur } : {}),
    ...(statut ? { statut } : {}),
  };

  const [secteurs, innovations, total] = await Promise.all([
    prisma.innovation.findMany({
      where: { publie: true },
      select: { secteur: true },
      distinct: ["secteur"],
      orderBy: { secteur: "asc" },
    }),
    prisma.innovation.findMany({
      where,
      orderBy: [{ aLaUne: "desc" }, { annee: "desc" }],
      skip: (page - 1) * PAR_PAGE,
      take: PAR_PAGE,
    }),
    prisma.innovation.count({ where }),
  ]);

  return (
    <>
      <EnTetePage
        surtitre="Vitrine"
        titre="Innovations made in Tchad"
        description="Des prototypes d'atelier aux produits déjà commercialisés : les solutions conçues au Tchad pour répondre à des besoins tchadiens."
      >
        <div className="mt-7 space-y-4">
          <Filtres
            base="/innovations"
            actif={secteur}
            parametre="secteur"
            options={secteurs.map((s) => ({ valeur: s.secteur, libelle: s.secteur }))}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-nuit-600">
              Maturité :
            </span>
            <Filtres
              base="/innovations"
              actif={statut}
              parametre="statut"
              options={Object.entries(STATUTS_INNOVATION).map(([valeur, libelle]) => ({
                valeur,
                libelle,
              }))}
            />
          </div>
        </div>
      </EnTetePage>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="mb-6 text-sm text-nuit-600">
          {total} innovation{total > 1 ? "s" : ""} recensée{total > 1 ? "s" : ""}
        </p>
        {innovations.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {innovations.map((i) => (
              <CarteInnovation key={i.id} innovation={i} />
            ))}
          </div>
        ) : (
          <EtatVide message="Aucune innovation ne correspond à ces filtres." />
        )}
        <Pagination
          page={page}
          total={total}
          parPage={PAR_PAGE}
          base="/innovations"
          parametres={{ secteur, statut }}
        />
      </div>
    </>
  );
}
