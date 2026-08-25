import Link from "next/link";
import { prisma } from "@/lib/db";
import { CarteArticle, CarteChercheur, CarteEvenement, CarteInnovation, CarteOpportunite } from "@/components/Cartes";
import { EtatVide, TitreSection } from "@/components/UI";

export const dynamic = "force-dynamic";

async function chargerDonnees() {
  const maintenant = new Date();
  const [
    aLaUne,
    articles,
    chercheurs,
    innovations,
    evenements,
    opportunites,
    nbArticles,
    nbChercheurs,
    nbInnovations,
    nbPublications,
  ] = await Promise.all([
    prisma.article.findFirst({
      where: { publie: true, aLaUne: true },
      orderBy: { publieLe: "desc" },
      include: { categorie: true },
    }),
    prisma.article.findMany({
      where: { publie: true },
      orderBy: { publieLe: "desc" },
      take: 7,
      include: { categorie: true },
    }),
    prisma.chercheur.findMany({
      where: { publie: true },
      orderBy: [{ aLaUne: "desc" }, { creeLe: "desc" }],
      take: 3,
      include: { _count: { select: { publications: true } } },
    }),
    prisma.innovation.findMany({
      where: { publie: true },
      orderBy: [{ aLaUne: "desc" }, { annee: "desc" }],
      take: 3,
    }),
    prisma.evenement.findMany({
      where: { publie: true, dateDebut: { gte: maintenant } },
      orderBy: { dateDebut: "asc" },
      take: 3,
    }),
    prisma.opportunite.findMany({
      where: { publie: true },
      orderBy: [{ dateLimite: "asc" }],
      take: 2,
    }),
    prisma.article.count({ where: { publie: true } }),
    prisma.chercheur.count({ where: { publie: true } }),
    prisma.innovation.count({ where: { publie: true } }),
    prisma.publication.count(),
  ]);

  return {
    aLaUne,
    articles: articles.filter((a) => a.id !== aLaUne?.id),
    chercheurs,
    innovations,
    evenements,
    opportunites,
    chiffres: { nbArticles, nbChercheurs, nbInnovations, nbPublications },
  };
}

export default async function Accueil() {
  const d = await chargerDonnees();
  const une = d.aLaUne ?? d.articles[0] ?? null;
  const secondaires = d.articles.filter((a) => a.id !== une?.id);

  return (
    <>
      <section className="border-b border-sable-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-or-600">
            Plateforme nationale de valorisation
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-nuit-900 sm:text-5xl">
            L&apos;innovation et la recherche tchadiennes,{" "}
            <span className="text-or-600">enfin visibles</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-nuit-600">
            Innov&apos;Tchad rassemble en un seul endroit l&apos;actualité scientifique du pays, les
            profils des chercheuses et chercheurs, les innovations nées sur le terrain, ainsi que
            les événements et financements à ne pas manquer.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/innovations"
              className="rounded-md bg-nuit-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nuit-700"
            >
              Découvrir les innovations
            </Link>
            <Link
              href="/chercheurs"
              className="rounded-md border border-nuit-800 px-5 py-2.5 text-sm font-semibold text-nuit-800 transition-colors hover:bg-nuit-800 hover:text-white"
            >
              Parcourir l&apos;annuaire des chercheurs
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-sable-200 pt-8 sm:grid-cols-4">
            {[
              { valeur: d.chiffres.nbInnovations, libelle: "Innovations recensées" },
              { valeur: d.chiffres.nbChercheurs, libelle: "Chercheurs référencés" },
              { valeur: d.chiffres.nbPublications, libelle: "Publications indexées" },
              { valeur: d.chiffres.nbArticles, libelle: "Articles publiés" },
            ].map((c) => (
              <div key={c.libelle}>
                <dt className="text-3xl font-bold text-nuit-900">{c.valeur}</dt>
                <dd className="mt-1 text-sm text-nuit-600">{c.libelle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14">
        <TitreSection
          titre="À la une"
          sousTitre="L'essentiel de l'actualité scientifique et technologique tchadienne"
          lien="/actualites"
        />
        {une ? (
          <div className="space-y-6">
            <CarteArticle article={une} grande />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondaires.slice(0, 6).map((a) => (
                <CarteArticle key={a.id} article={a} />
              ))}
            </div>
          </div>
        ) : (
          <EtatVide message="Aucun article publié pour le moment." />
        )}
      </div>

      <section className="border-y border-sable-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <TitreSection
            titre="Innovations à découvrir"
            sousTitre="Des solutions imaginées et fabriquées au Tchad"
            lien="/innovations"
          />
          {d.innovations.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {d.innovations.map((i) => (
                <CarteInnovation key={i.id} innovation={i} />
              ))}
            </div>
          ) : (
            <EtatVide message="La vitrine des innovations se remplit bientôt." />
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14">
        <TitreSection
          titre="Ils font la recherche au Tchad"
          sousTitre="Portraits de chercheuses et de chercheurs à connaître"
          lien="/chercheurs"
        />
        {d.chercheurs.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {d.chercheurs.map((c) => (
              <CarteChercheur key={c.id} chercheur={c} />
            ))}
          </div>
        ) : (
          <EtatVide message="L'annuaire des chercheurs est en cours de constitution." />
        )}
      </div>

      <section className="border-y border-sable-200 bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
          <div>
            <TitreSection titre="Prochains événements" lien="/evenements" />
            {d.evenements.length ? (
              <div className="space-y-5">
                {d.evenements.map((e) => (
                  <CarteEvenement key={e.id} evenement={e} />
                ))}
              </div>
            ) : (
              <EtatVide message="Aucun événement annoncé pour l'instant." />
            )}
          </div>
          <div>
            <TitreSection titre="Appels &amp; financements" lien="/opportunites" />
            {d.opportunites.length ? (
              <div className="space-y-5">
                {d.opportunites.map((o) => (
                  <CarteOpportunite key={o.id} opportunite={o} />
                ))}
              </div>
            ) : (
              <EtatVide message="Aucune opportunité ouverte pour l'instant." />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl bg-nuit-900 px-6 py-12 text-center sm:px-14">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Vous menez un projet, une recherche, une invention ?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-nuit-200">
            Innov&apos;Tchad est une plateforme ouverte. Proposez votre innovation, votre profil de
            chercheur ou un événement : la rédaction étudie chaque contribution et la publie
            gratuitement.
          </p>
          <Link
            href="/contribuer"
            className="mt-7 inline-block rounded-md bg-or-500 px-6 py-3 text-sm font-semibold text-nuit-900 transition-colors hover:bg-or-400"
          >
            Proposer un contenu
          </Link>
        </div>
      </section>
    </>
  );
}
