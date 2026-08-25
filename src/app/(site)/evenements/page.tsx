import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CarteEvenement } from "@/components/Cartes";
import { EnTetePage, EtatVide, Filtres } from "@/components/UI";
import { TYPES_EVENEMENT } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Conférences, hackathons, ateliers et salons scientifiques au Tchad : l'agenda de l'innovation.",
};

export default async function PageEvenements({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const maintenant = new Date();
  const where = { publie: true, ...(type ? { type } : {}) };

  const [aVenir, passes] = await Promise.all([
    prisma.evenement.findMany({
      where: { ...where, dateDebut: { gte: maintenant } },
      orderBy: { dateDebut: "asc" },
    }),
    prisma.evenement.findMany({
      where: { ...where, dateDebut: { lt: maintenant } },
      orderBy: { dateDebut: "desc" },
      take: 8,
    }),
  ]);

  return (
    <>
      <EnTetePage
        surtitre="Agenda"
        titre="Événements scientifiques &amp; technologiques"
        description="Conférences, hackathons, ateliers et salons : les rendez-vous à ne pas manquer au Tchad et dans la sous-région."
      >
        <div className="mt-7">
          <Filtres
            base="/evenements"
            actif={type}
            parametre="type"
            options={Object.entries(TYPES_EVENEMENT).map(([valeur, libelle]) => ({
              valeur,
              libelle,
            }))}
          />
        </div>
      </EnTetePage>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-6 border-b border-sable-200 pb-3 text-xl font-bold text-nuit-900">
          À venir
        </h2>
        {aVenir.length ? (
          <div className="space-y-5">
            {aVenir.map((e) => (
              <CarteEvenement key={e.id} evenement={e} />
            ))}
          </div>
        ) : (
          <EtatVide message="Aucun événement à venir n'est annoncé pour l'instant." />
        )}

        {passes.length > 0 && (
          <>
            <h2 className="mb-6 mt-14 border-b border-sable-200 pb-3 text-xl font-bold text-nuit-900">
              Éditions passées
            </h2>
            <div className="space-y-5 opacity-75">
              {passes.map((e) => (
                <CarteEvenement key={e.id} evenement={e} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
