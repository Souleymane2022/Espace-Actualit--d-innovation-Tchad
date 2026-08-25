import Link from "next/link";
import { prisma } from "@/lib/db";
import { exigerSession } from "@/lib/auth";
import { STATUTS_SOUMISSION, TYPES_SOUMISSION, dateCourte } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TableauDeBord() {
  const session = await exigerSession();

  const [
    articles,
    brouillons,
    chercheurs,
    innovations,
    evenements,
    opportunites,
    abonnes,
    soumissions,
    dernieresSoumissions,
    derniersArticles,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { publie: false } }),
    prisma.chercheur.count(),
    prisma.innovation.count(),
    prisma.evenement.count(),
    prisma.opportunite.count(),
    prisma.abonne.count(),
    prisma.soumission.count({ where: { statut: "nouveau" } }),
    prisma.soumission.findMany({ orderBy: { creeLe: "desc" }, take: 5 }),
    prisma.article.findMany({ orderBy: { misAJourLe: "desc" }, take: 5 }),
  ]);

  const chiffres = [
    { libelle: "Articles", valeur: articles, lien: "/admin/articles", note: `${brouillons} brouillon(s)` },
    { libelle: "Chercheurs", valeur: chercheurs, lien: "/admin/chercheurs" },
    { libelle: "Innovations", valeur: innovations, lien: "/admin/innovations" },
    { libelle: "Événements", valeur: evenements, lien: "/admin/evenements" },
    { libelle: "Opportunités", valeur: opportunites, lien: "/admin/opportunites" },
    { libelle: "Abonnés newsletter", valeur: abonnes },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-nuit-900">
        Bonjour {session.nom.split(" ")[0]} 👋
      </h1>
      <p className="mt-1.5 text-sm text-nuit-600">
        Voici l&apos;état de la plateforme aujourd&apos;hui.
      </p>

      {soumissions > 0 && (
        <Link
          href="/admin/soumissions"
          className="mt-6 block rounded-xl border border-or-100 bg-or-50 px-5 py-4 text-sm font-semibold text-or-600 hover:border-or-300"
        >
          📥 {soumissions} nouvelle{soumissions > 1 ? "s" : ""} proposition
          {soumissions > 1 ? "s" : ""} à examiner →
        </Link>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chiffres.map((c) => {
          const contenu = (
            <>
              <p className="text-3xl font-bold text-nuit-900">{c.valeur}</p>
              <p className="mt-1 text-sm text-nuit-600">{c.libelle}</p>
              {c.note && <p className="mt-1 text-xs text-nuit-600">{c.note}</p>}
            </>
          );
          return c.lien ? (
            <Link
              key={c.libelle}
              href={c.lien}
              className="rounded-xl border border-sable-200 bg-white p-5 transition-colors hover:border-nuit-400"
            >
              {contenu}
            </Link>
          ) : (
            <div key={c.libelle} className="rounded-xl border border-sable-200 bg-white p-5">
              {contenu}
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-lg font-bold text-nuit-900">Derniers articles modifiés</h2>
          <ul className="space-y-2">
            {derniersArticles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/articles/${a.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-sable-200 bg-white px-4 py-3 text-sm hover:border-nuit-400"
                >
                  <span className="truncate font-medium text-nuit-800">{a.titre}</span>
                  <span className="shrink-0 text-xs text-nuit-600">
                    {a.publie ? "Publié" : "Brouillon"}
                  </span>
                </Link>
              </li>
            ))}
            {derniersArticles.length === 0 && (
              <li className="rounded-lg border border-dashed border-sable-200 px-4 py-6 text-center text-sm text-nuit-600">
                Aucun article pour le moment.
              </li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-bold text-nuit-900">Dernières propositions reçues</h2>
          <ul className="space-y-2">
            {dernieresSoumissions.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/soumissions/${s.id}`}
                  className="block rounded-lg border border-sable-200 bg-white px-4 py-3 text-sm hover:border-nuit-400"
                >
                  <span className="block truncate font-medium text-nuit-800">{s.titre}</span>
                  <span className="mt-0.5 block text-xs text-nuit-600">
                    {TYPES_SOUMISSION[s.type] ?? s.type} · {STATUTS_SOUMISSION[s.statut] ?? s.statut}{" "}
                    · {dateCourte(s.creeLe)}
                  </span>
                </Link>
              </li>
            ))}
            {dernieresSoumissions.length === 0 && (
              <li className="rounded-lg border border-dashed border-sable-200 px-4 py-6 text-center text-sm text-nuit-600">
                Aucune proposition reçue.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
