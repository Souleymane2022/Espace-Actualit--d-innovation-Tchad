import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CarteArticle } from "@/components/Cartes";
import { EnTetePage, EtatVide, Filtres, Pagination } from "@/components/UI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Le fil d'actualité de l'innovation et de la recherche scientifique au Tchad : découvertes, projets, portraits et annonces.",
};

const PAR_PAGE = 9;

export default async function PageActualites({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; page?: string }>;
}) {
  const { categorie, page: pageBrute } = await searchParams;
  const page = Math.max(1, Number(pageBrute) || 1);

  const where = {
    publie: true,
    ...(categorie ? { categorie: { slug: categorie } } : {}),
  };

  const [categories, articles, total] = await Promise.all([
    prisma.categorie.findMany({ orderBy: { nom: "asc" } }),
    prisma.article.findMany({
      where,
      orderBy: { publieLe: "desc" },
      skip: (page - 1) * PAR_PAGE,
      take: PAR_PAGE,
      include: { categorie: true },
    }),
    prisma.article.count({ where }),
  ]);

  return (
    <>
      <EnTetePage
        surtitre="Le fil d'actualité"
        titre="Actualités"
        description="Découvertes, projets, portraits et annonces : tout ce qui fait bouger la science et l'innovation au Tchad."
      >
        <div className="mt-7">
          <Filtres
            base="/actualites"
            actif={categorie}
            options={categories.map((c) => ({ valeur: c.slug, libelle: c.nom }))}
          />
        </div>
      </EnTetePage>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="mb-6 text-sm text-nuit-600">
          {total} article{total > 1 ? "s" : ""}
          {categorie ? ` dans cette rubrique` : ""}
        </p>
        {articles.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <CarteArticle key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <EtatVide message="Aucun article ne correspond à cette rubrique pour le moment." />
        )}
        <Pagination
          page={page}
          total={total}
          parPage={PAR_PAGE}
          base="/actualites"
          parametres={{ categorie }}
        />
      </div>
    </>
  );
}
