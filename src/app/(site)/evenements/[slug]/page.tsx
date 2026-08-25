import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Etiquette, Vignette } from "@/components/UI";
import { TYPES_EVENEMENT, periode, tempsRelatif } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function trouver(slug: string) {
  return prisma.evenement.findFirst({ where: { slug, publie: true } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = await trouver(slug);
  if (!e) return { title: "Événement introuvable" };
  return { title: e.titre, description: e.description.slice(0, 160) };
}

export default async function PageEvenement({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await trouver(slug);
  if (!e) notFound();

  const passe = new Date(e.dateFin ?? e.dateDebut) < new Date();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-sm text-nuit-600">
        <Link href="/evenements" className="hover:text-or-600">
          ← Tous les événements
        </Link>
      </nav>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Etiquette ton="or">{TYPES_EVENEMENT[e.type] ?? e.type}</Etiquette>
        <Etiquette ton={passe ? "neutre" : "vert"}>
          {passe ? "Édition passée" : tempsRelatif(e.dateDebut)}
        </Etiquette>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-nuit-900 sm:text-4xl">{e.titre}</h1>

      {e.image && (
        <div className="mt-7 overflow-hidden rounded-xl">
          <Vignette src={e.image} alt={e.titre} ratio="aspect-[16/9]" />
        </div>
      )}

      <dl className="mt-8 grid gap-4 rounded-xl border border-sable-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-nuit-600">Dates</dt>
          <dd className="font-medium text-nuit-900">{periode(e.dateDebut, e.dateFin)}</dd>
        </div>
        <div>
          <dt className="text-sm text-nuit-600">Lieu</dt>
          <dd className="font-medium text-nuit-900">
            {e.lieu}, {e.ville}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm text-nuit-600">Organisateur</dt>
          <dd className="font-medium text-nuit-900">{e.organisateur}</dd>
        </div>
      </dl>

      <div className="prose-article mt-8 text-[16px] text-nuit-800">
        {e.description.split("\n").map((p, i) => (p.trim() ? <p key={i}>{p.trim()}</p> : null))}
      </div>

      {e.lienInscription && !passe && (
        <a
          href={e.lienInscription}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-md bg-or-500 px-6 py-3 text-sm font-semibold text-nuit-900 hover:bg-or-400"
        >
          S&apos;inscrire à l&apos;événement
        </a>
      )}
    </div>
  );
}
