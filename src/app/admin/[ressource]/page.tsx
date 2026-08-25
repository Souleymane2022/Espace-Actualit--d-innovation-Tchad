import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { exigerSession } from "@/lib/auth";
import { trouverRessource } from "@/lib/ressources";
import { basculerPublication } from "@/app/admin/actions";
import {
  STATUTS_INNOVATION,
  STATUTS_SOUMISSION,
  TYPES_EVENEMENT,
  TYPES_OPPORTUNITE,
  TYPES_SOUMISSION,
  dateCourte,
  tronquer,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const DICOS: Record<string, string> = {
  ...STATUTS_INNOVATION,
  ...STATUTS_SOUMISSION,
  ...TYPES_EVENEMENT,
  ...TYPES_OPPORTUNITE,
  ...TYPES_SOUMISSION,
};

function afficher(valeur: unknown): string {
  if (valeur === null || valeur === undefined || valeur === "") return "—";
  if (valeur instanceof Date) return dateCourte(valeur);
  if (typeof valeur === "boolean") return valeur ? "Oui" : "Non";
  const texte = String(valeur);
  return DICOS[texte] ?? tronquer(texte, 40);
}

export default async function ListeRessource({
  params,
  searchParams,
}: {
  params: Promise<{ ressource: string }>;
  searchParams: Promise<{ page?: string; ok?: string; supprime?: string }>;
}) {
  await exigerSession();
  const { ressource: cle } = await params;
  const { page: pageBrute, ok, supprime } = await searchParams;

  const ressource = trouverRessource(cle);
  if (!ressource) notFound();

  const page = Math.max(1, Number(pageBrute) || 1);
  const parPage = 20;

  const modele = prisma[ressource.modele as keyof typeof prisma] as unknown as {
    findMany: (a: unknown) => Promise<Record<string, unknown>[]>;
    count: () => Promise<number>;
  };

  const [elements, total] = await Promise.all([
    modele.findMany({
      orderBy: ressource.tri,
      skip: (page - 1) * parPage,
      take: parPage,
    }),
    modele.count(),
  ]);

  const pages = Math.ceil(total / parPage);
  const gerePublication = ressource.champs.some((c) => c.nom === "publie");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-nuit-900">
            {ressource.icone} {ressource.libelle}
          </h1>
          <p className="mt-1 text-sm text-nuit-600">{total} enregistrement(s)</p>
        </div>
        {!ressource.lectureSeule && (
          <Link
            href={`/admin/${ressource.cle}/nouveau`}
            className="rounded-md bg-nuit-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-nuit-700"
          >
            + Nouveau
          </Link>
        )}
      </div>

      {ok && (
        <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          Enregistrement effectué.
        </p>
      )}
      {supprime && (
        <p className="mt-5 rounded-md border border-sable-200 bg-white px-4 py-2.5 text-sm text-nuit-700">
          Élément supprimé.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-sable-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sable-200 bg-sable-50 text-xs uppercase tracking-wide text-nuit-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Titre</th>
              {ressource.colonnes.map((c) => (
                <th key={c.nom} className="hidden px-4 py-3 font-semibold sm:table-cell">
                  {c.libelle}
                </th>
              ))}
              {gerePublication && <th className="px-4 py-3 font-semibold">État</th>}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {elements.map((e) => (
              <tr key={String(e.id)} className="border-b border-sable-100 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/${ressource.cle}/${e.id}`}
                    className="font-medium text-nuit-900 hover:text-or-600"
                  >
                    {tronquer(String(e[ressource.champTitre] ?? "(sans titre)"), 60)}
                  </Link>
                </td>
                {ressource.colonnes.map((c) => (
                  <td key={c.nom} className="hidden px-4 py-3 text-nuit-600 sm:table-cell">
                    {afficher(e[c.nom])}
                  </td>
                ))}
                {gerePublication && (
                  <td className="px-4 py-3">
                    <form action={basculerPublication}>
                      <input type="hidden" name="__ressource" value={ressource.cle} />
                      <input type="hidden" name="__id" value={String(e.id)} />
                      <input type="hidden" name="__valeur" value={e.publie ? "0" : "1"} />
                      <button
                        type="submit"
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                          e.publie
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-sable-200 bg-sable-50 text-nuit-600"
                        }`}
                        title="Cliquer pour changer l'état"
                      >
                        {e.publie ? "Publié" : "Brouillon"}
                      </button>
                    </form>
                  </td>
                )}
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/${ressource.cle}/${e.id}`}
                    className="text-sm font-semibold text-nuit-700 hover:text-or-600"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
            {elements.length === 0 && (
              <tr>
                <td colSpan={ressource.colonnes.length + 3} className="px-4 py-12 text-center text-nuit-600">
                  Aucun enregistrement pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/${ressource.cle}?page=${p}`}
              className={`rounded-md border px-3.5 py-2 text-sm font-medium ${
                p === page
                  ? "border-nuit-800 bg-nuit-800 text-white"
                  : "border-sable-200 bg-white text-nuit-700"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
