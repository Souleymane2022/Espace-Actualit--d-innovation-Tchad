import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { CarteArticle, CarteChercheur, CarteInnovation } from "@/components/Cartes";
import { EnTetePage, EtatVide } from "@/components/UI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rechercher",
  description: "Rechercher un article, un chercheur, une innovation ou un événement.",
};

export default async function PageRecherche({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const terme = q?.trim() ?? "";

  const [articles, chercheurs, innovations, evenements] = terme
    ? await Promise.all([
        prisma.article.findMany({
          where: {
            publie: true,
            OR: [
              { titre: { contains: terme } },
              { chapo: { contains: terme } },
              { contenu: { contains: terme } },
              { tags: { contains: terme } },
            ],
          },
          include: { categorie: true },
          orderBy: { publieLe: "desc" },
          take: 6,
        }),
        prisma.chercheur.findMany({
          where: {
            publie: true,
            OR: [
              { nom: { contains: terme } },
              { prenom: { contains: terme } },
              { domaine: { contains: terme } },
              { institution: { contains: terme } },
              { motsCles: { contains: terme } },
              { biographie: { contains: terme } },
            ],
          },
          include: { _count: { select: { publications: true } } },
          take: 6,
        }),
        prisma.innovation.findMany({
          where: {
            publie: true,
            OR: [
              { nom: { contains: terme } },
              { resume: { contains: terme } },
              { description: { contains: terme } },
              { secteur: { contains: terme } },
              { porteur: { contains: terme } },
            ],
          },
          orderBy: { annee: "desc" },
          take: 6,
        }),
        prisma.evenement.findMany({
          where: {
            publie: true,
            OR: [{ titre: { contains: terme } }, { description: { contains: terme } }],
          },
          orderBy: { dateDebut: "desc" },
          take: 5,
        }),
      ])
    : [[], [], [], []];

  const total = articles.length + chercheurs.length + innovations.length + evenements.length;

  return (
    <>
      <EnTetePage surtitre="Recherche" titre="Rechercher sur Innov&apos;Tchad">
        <form action="/recherche" className="mt-6 flex max-w-xl gap-2">
          <input
            type="search"
            name="q"
            defaultValue={terme}
            autoFocus
            placeholder="Ex. : énergie solaire, agronomie, N'Djaména…"
            aria-label="Votre recherche"
            className="w-full rounded-md border border-sable-200 bg-sable-50 px-4 py-3 text-sm focus:border-nuit-400 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-nuit-800 px-6 py-3 text-sm font-semibold text-white hover:bg-nuit-700"
          >
            Rechercher
          </button>
        </form>
      </EnTetePage>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
        {!terme && (
          <EtatVide message="Saisissez un mot-clé pour explorer les articles, les chercheurs, les innovations et les événements." />
        )}

        {terme && total === 0 && (
          <EtatVide message={`Aucun résultat pour « ${terme} ». Essayez un autre mot-clé.`} />
        )}

        {articles.length > 0 && (
          <section>
            <h2 className="mb-5 border-b border-sable-200 pb-3 text-lg font-bold text-nuit-900">
              Actualités ({articles.length})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <CarteArticle key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {chercheurs.length > 0 && (
          <section>
            <h2 className="mb-5 border-b border-sable-200 pb-3 text-lg font-bold text-nuit-900">
              Chercheurs ({chercheurs.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {chercheurs.map((c) => (
                <CarteChercheur key={c.id} chercheur={c} />
              ))}
            </div>
          </section>
        )}

        {innovations.length > 0 && (
          <section>
            <h2 className="mb-5 border-b border-sable-200 pb-3 text-lg font-bold text-nuit-900">
              Innovations ({innovations.length})
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {innovations.map((i) => (
                <CarteInnovation key={i.id} innovation={i} />
              ))}
            </div>
          </section>
        )}

        {evenements.length > 0 && (
          <section>
            <h2 className="mb-5 border-b border-sable-200 pb-3 text-lg font-bold text-nuit-900">
              Événements ({evenements.length})
            </h2>
            <ul className="space-y-2">
              {evenements.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/evenements/${e.slug}`}
                    className="block rounded-lg border border-sable-200 bg-white px-4 py-3 text-sm font-medium text-nuit-800 hover:border-nuit-400"
                  >
                    {e.titre}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
