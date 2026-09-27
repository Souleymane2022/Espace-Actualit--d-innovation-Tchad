import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CarteArticle } from "@/components/Cartes";
import { Etiquette, Vignette } from "@/components/UI";
import { dateLongue, listeTags, tempsLecture } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function trouver(slug: string) {
  return prisma.article.findFirst({
    where: { slug, publie: true },
    include: { categorie: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await trouver(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.titre,
    description: article.chapo,
    openGraph: {
      title: article.titre,
      description: article.chapo,
      type: "article",
      publishedTime: article.publieLe.toISOString(),
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function PageArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await trouver(slug);
  if (!article) notFound();

  // Compteur de lecture, sans bloquer le rendu.
  prisma.article
    .update({ where: { id: article.id }, data: { vues: { increment: 1 } } })
    .catch(() => undefined);

  const similaires = await prisma.article.findMany({
    where: {
      publie: true,
      id: { not: article.id },
      ...(article.categorieId ? { categorieId: article.categorieId } : {}),
    },
    orderBy: { publieLe: "desc" },
    take: 3,
    include: { categorie: true },
  });

  const tags = listeTags(article.tags);

  return (
    <>
      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <nav className="text-sm text-nuit-600">
            <Link href="/actualites" className="hover:text-or-600">
              ← Toutes les actualités
            </Link>
          </nav>

          {article.categorie && (
            <p className="rubrique mt-6" style={{ color: article.categorie.couleur }}>
              {article.categorie.nom}
            </p>
          )}

          <h1 className="titre-journal mt-3 text-3xl leading-tight text-nuit-900 sm:text-[42px] sm:leading-[1.15]">
            {article.titre}
          </h1>
          <p className="mt-5 font-serif text-xl leading-relaxed text-nuit-700">{article.chapo}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-sable-200 py-3 text-[13px] text-nuit-600">
            <span className="font-semibold uppercase tracking-wide text-nuit-800">
              Par {article.auteur}
            </span>
            <span aria-hidden="true">|</span>
            <span>{dateLongue(article.publieLe)}</span>
            <span aria-hidden="true">|</span>
            <span>{tempsLecture(article.contenu)}</span>
            {article.source && (
              <>
                <span aria-hidden="true">|</span>
                <span>Source : {article.source}</span>
              </>
            )}
          </div>
        </div>

        {article.image && (
          <figure className="mx-auto max-w-4xl px-4">
            <Vignette src={article.image} alt={article.titre} ratio="aspect-[16/9]" />
            <figcaption className="mt-2 border-b border-sable-200 pb-2 text-xs italic text-nuit-600">
              {article.titre} — Innov&apos;Tchad
            </figcaption>
          </figure>
        )}

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="prose-article text-[17px] text-nuit-800">
            {(() => {
              let premierParagraphe = true;
              return article.contenu.split("\n").map((ligne, i) => {
                const t = ligne.trim();
                if (!t) return null;
                if (t.startsWith("## ")) return <h2 key={i}>{t.slice(3)}</h2>;
                if (t.startsWith("### ")) return <h3 key={i}>{t.slice(4)}</h3>;
                if (t.startsWith("> ")) return <blockquote key={i}>{t.slice(2)}</blockquote>;
                if (t.startsWith("- ")) return <ul key={i}><li>{t.slice(2)}</li></ul>;
                const classe = premierParagraphe ? "lettrine" : undefined;
                premierParagraphe = false;
                return <p key={i} className={classe}>{t}</p>;
              });
            })()}
          </div>

          {article.lienSource && (
            <p className="mt-8 rounded-lg border border-sable-200 bg-sable-50 px-4 py-3 text-sm">
              Pour aller plus loin :{" "}
              <a
                href={article.lienSource}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-nuit-800 underline"
              >
                consulter la source
              </a>
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-sable-200 pt-6">
              {tags.map((tag) => (
                <Link key={tag} href={`/recherche?q=${encodeURIComponent(tag)}`}>
                  <Etiquette>#{tag}</Etiquette>
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>

      {similaires.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="titre-journal mb-7 border-t-[3px] border-nuit-900 pt-3 text-2xl text-nuit-900">
            À lire également
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((a) => (
              <CarteArticle key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
