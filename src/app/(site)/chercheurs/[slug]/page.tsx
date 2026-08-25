import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CarteInnovation } from "@/components/Cartes";
import { Etiquette, Vignette } from "@/components/UI";
import { initiales, listeTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function trouver(slug: string) {
  return prisma.chercheur.findFirst({
    where: { slug, publie: true },
    include: {
      publications: { orderBy: { annee: "desc" } },
      innovations: { where: { publie: true }, orderBy: { annee: "desc" } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await trouver(slug);
  if (!c) return { title: "Profil introuvable" };
  const nomComplet = `${c.civilite} ${c.prenom} ${c.nom}`;
  return {
    title: nomComplet,
    description: `${nomComplet} — ${c.domaine}, ${c.institution} (${c.ville}, Tchad).`,
  };
}

export default async function PageChercheur({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await trouver(slug);
  if (!c) notFound();

  const liens = [
    { libelle: "Site web", valeur: c.siteWeb },
    { libelle: "ORCID", valeur: c.orcid ? `https://orcid.org/${c.orcid}` : null },
    { libelle: "Google Scholar", valeur: c.googleScholar },
    { libelle: "LinkedIn", valeur: c.linkedin },
  ].filter((l) => l.valeur);

  return (
    <>
      <section className="border-b border-sable-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <nav className="text-sm text-nuit-600">
            <Link href="/chercheurs" className="hover:text-or-600">
              ← Annuaire des chercheurs
            </Link>
          </nav>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
              <Vignette
                src={c.photo}
                alt={`${c.prenom} ${c.nom}`}
                ratio="aspect-square"
                texte={initiales(c.prenom, c.nom)}
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-nuit-900">
                {c.civilite} {c.prenom} {c.nom}
              </h1>
              <p className="mt-2 text-base text-nuit-700">
                {c.institution}
                {c.laboratoire && <> · {c.laboratoire}</>}
              </p>
              <p className="text-sm text-nuit-600">{c.ville}, Tchad</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Etiquette ton="nuit">{c.domaine}</Etiquette>
                {listeTags(c.motsCles).map((m) => (
                  <Etiquette key={m}>{m}</Etiquette>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-4xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-nuit-900">Parcours</h2>
          <div className="prose-article mt-4 text-[16px] text-nuit-800">
            {c.biographie.split("\n").map((p, i) =>
              p.trim() ? <p key={i}>{p.trim()}</p> : null,
            )}
          </div>

          {c.publications.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-nuit-900">
                Publications ({c.publications.length})
              </h2>
              <ul className="mt-4 space-y-4">
                {c.publications.map((p) => (
                  <li key={p.id} className="rounded-lg border border-sable-200 bg-white p-4">
                    <p className="font-semibold text-nuit-900">{p.titre}</p>
                    <p className="mt-1 text-sm text-nuit-600">
                      {[p.coAuteurs, p.revue, String(p.annee)].filter(Boolean).join(" · ")}
                    </p>
                    {(p.lien || p.doi) && (
                      <a
                        href={p.lien ?? `https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-semibold text-nuit-700 underline"
                      >
                        {p.doi ? `DOI : ${p.doi}` : "Consulter la publication"}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.innovations.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-nuit-900">Innovations associées</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {c.innovations.map((i) => (
                  <CarteInnovation key={i.id} innovation={i} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-sable-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-nuit-600">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {c.email && (
                <li>
                  <a href={`mailto:${c.email}`} className="break-all font-medium text-nuit-800 underline">
                    {c.email}
                  </a>
                </li>
              )}
              {c.telephone && <li className="text-nuit-700">{c.telephone}</li>}
              {liens.map((l) => (
                <li key={l.libelle}>
                  <a
                    href={l.valeur as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-nuit-800 underline"
                  >
                    {l.libelle}
                  </a>
                </li>
              ))}
              {!c.email && !c.telephone && liens.length === 0 && (
                <li className="text-nuit-600">Coordonnées non communiquées.</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
