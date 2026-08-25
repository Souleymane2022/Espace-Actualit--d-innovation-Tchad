import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CarteOpportunite } from "@/components/Cartes";
import { EnTetePage, EtatVide, Filtres } from "@/components/UI";
import { TYPES_OPPORTUNITE } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Appels à projets, bourses et financements",
  description:
    "Appels à projets, bourses d'études, financements et prix scientifiques ouverts aux chercheurs et innovateurs tchadiens.",
};

export default async function PageOpportunites({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const where = { publie: true, ...(type ? { type } : {}) };
  const maintenant = new Date();

  const [ouvertes, closes] = await Promise.all([
    prisma.opportunite.findMany({
      where: { ...where, OR: [{ dateLimite: null }, { dateLimite: { gte: maintenant } }] },
      orderBy: { dateLimite: "asc" },
    }),
    prisma.opportunite.findMany({
      where: { ...where, dateLimite: { lt: maintenant } },
      orderBy: { dateLimite: "desc" },
      take: 6,
    }),
  ]);

  return (
    <>
      <EnTetePage
        surtitre="Opportunités"
        titre="Appels à projets, bourses &amp; financements"
        description="Toutes les occasions de financer une recherche, un prototype ou une formation — rassemblées et mises à jour régulièrement."
      >
        <div className="mt-7">
          <Filtres
            base="/opportunites"
            actif={type}
            parametre="type"
            options={Object.entries(TYPES_OPPORTUNITE).map(([valeur, libelle]) => ({
              valeur,
              libelle,
            }))}
          />
        </div>
      </EnTetePage>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-6 border-b border-sable-200 pb-3 text-xl font-bold text-nuit-900">
          Candidatures ouvertes
        </h2>
        {ouvertes.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {ouvertes.map((o) => (
              <CarteOpportunite key={o.id} opportunite={o} />
            ))}
          </div>
        ) : (
          <EtatVide message="Aucune candidature ouverte pour le moment. Revenez bientôt." />
        )}

        {closes.length > 0 && (
          <>
            <h2 className="mb-6 mt-14 border-b border-sable-200 pb-3 text-xl font-bold text-nuit-900">
              Récemment clôturées
            </h2>
            <div className="grid gap-6 opacity-75 md:grid-cols-2">
              {closes.map((o) => (
                <CarteOpportunite key={o.id} opportunite={o} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
