import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Etiquette, Vignette } from "@/components/UI";
import { STATUTS_INNOVATION, initiales } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function trouver(slug: string) {
  return prisma.innovation.findFirst({
    where: { slug, publie: true },
    include: { chercheur: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = await trouver(slug);
  if (!i) return { title: "Innovation introuvable" };
  return {
    title: i.nom,
    description: i.resume,
    openGraph: { title: i.nom, description: i.resume, images: i.image ? [i.image] : undefined },
  };
}

export default async function PageInnovation({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = await trouver(slug);
  if (!i) notFound();

  const fiche = [
    { cle: "Secteur", valeur: i.secteur },
    { cle: "Maturité", valeur: STATUTS_INNOVATION[i.statut] ?? i.statut },
    { cle: "Année", valeur: String(i.annee) },
    { cle: "Localisation", valeur: `${i.ville}, Tchad` },
    { cle: "Porteur", valeur: i.porteur },
    { cle: "Structure", valeur: i.organisation },
  ].filter((l) => l.valeur);

  return (
    <>
      <section className="border-b border-sable-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <nav className="text-sm text-nuit-600">
            <Link href="/innovations" className="hover:text-or-600">
              ← Toutes les innovations
            </Link>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Etiquette ton="nuit">{STATUTS_INNOVATION[i.statut] ?? i.statut}</Etiquette>
            <Etiquette ton="or">{i.secteur}</Etiquette>
            <span className="text-sm text-nuit-600">{i.annee}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-nuit-900 sm:text-4xl">
            {i.nom}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-nuit-700">{i.resume}</p>
        </div>
      </section>

      {i.image && (
        <div className="mx-auto max-w-5xl px-4 pt-10">
          <div className="overflow-hidden rounded-xl">
            <Vignette src={i.image} alt={i.nom} ratio="aspect-[16/9]" />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-nuit-900">Le projet en détail</h2>
          <div className="prose-article mt-4 text-[16px] text-nuit-800">
            {i.description.split("\n").map((ligne, idx) => {
              const t = ligne.trim();
              if (!t) return null;
              if (t.startsWith("## ")) return <h2 key={idx}>{t.slice(3)}</h2>;
              if (t.startsWith("- ")) return <ul key={idx}><li>{t.slice(2)}</li></ul>;
              return <p key={idx}>{t}</p>;
            })}
          </div>

          {i.video && (
            <a
              href={i.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md border border-nuit-800 px-5 py-2.5 text-sm font-semibold text-nuit-800 hover:bg-nuit-800 hover:text-white"
            >
              ▶ Voir la vidéo de présentation
            </a>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-sable-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-nuit-600">
              Fiche d&apos;identité
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              {fiche.map((l) => (
                <div key={l.cle}>
                  <dt className="text-nuit-600">{l.cle}</dt>
                  <dd className="font-medium text-nuit-900">{l.valeur}</dd>
                </div>
              ))}
            </dl>
            {(i.contact || i.siteWeb) && (
              <div className="mt-5 space-y-2 border-t border-sable-200 pt-4 text-sm">
                {i.contact && (
                  <a href={`mailto:${i.contact}`} className="block break-all font-medium text-nuit-800 underline">
                    {i.contact}
                  </a>
                )}
                {i.siteWeb && (
                  <a
                    href={i.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-medium text-nuit-800 underline"
                  >
                    Site du projet
                  </a>
                )}
              </div>
            )}
          </div>

          {i.chercheur && (
            <div className="rounded-xl border border-sable-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-nuit-600">
                Chercheur associé
              </h2>
              <Link href={`/chercheurs/${i.chercheur.slug}`} className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <Vignette
                    src={i.chercheur.photo}
                    alt={i.chercheur.nom}
                    ratio="aspect-square"
                    texte={initiales(i.chercheur.prenom, i.chercheur.nom)}
                  />
                </div>
                <span>
                  <span className="block font-semibold text-nuit-900">
                    {i.chercheur.civilite} {i.chercheur.prenom} {i.chercheur.nom}
                  </span>
                  <span className="block text-sm text-nuit-600">{i.chercheur.institution}</span>
                </span>
              </Link>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
