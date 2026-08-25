import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Etiquette } from "@/components/UI";
import { TYPES_OPPORTUNITE, dateLongue, tempsRelatif } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function trouver(slug: string) {
  return prisma.opportunite.findFirst({ where: { slug, publie: true } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const o = await trouver(slug);
  if (!o) return { title: "Opportunité introuvable" };
  return { title: o.titre, description: o.description.slice(0, 160) };
}

export default async function PageOpportunite({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const o = await trouver(slug);
  if (!o) notFound();

  const close = o.dateLimite ? new Date(o.dateLimite) < new Date() : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-sm text-nuit-600">
        <Link href="/opportunites" className="hover:text-or-600">
          ← Toutes les opportunités
        </Link>
      </nav>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Etiquette ton="or">{TYPES_OPPORTUNITE[o.type] ?? o.type}</Etiquette>
        {o.dateLimite && (
          <Etiquette ton={close ? "neutre" : "terre"}>
            {close
              ? `Clôturé le ${dateLongue(o.dateLimite)}`
              : `Date limite : ${dateLongue(o.dateLimite)} (${tempsRelatif(o.dateLimite)})`}
          </Etiquette>
        )}
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-nuit-900 sm:text-4xl">{o.titre}</h1>
      <p className="mt-3 text-base text-nuit-700">Proposé par {o.organisme}</p>

      {o.montant && (
        <p className="mt-6 rounded-lg border border-or-100 bg-or-50 px-4 py-3 text-sm font-semibold text-or-600">
          Financement : {o.montant}
        </p>
      )}

      <div className="prose-article mt-8 text-[16px] text-nuit-800">
        {o.description.split("\n").map((ligne, i) => {
          const t = ligne.trim();
          if (!t) return null;
          if (t.startsWith("## ")) return <h2 key={i}>{t.slice(3)}</h2>;
          if (t.startsWith("- ")) return <ul key={i}><li>{t.slice(2)}</li></ul>;
          return <p key={i}>{t}</p>;
        })}
      </div>

      {o.lien && !close && (
        <a
          href={o.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-md bg-or-500 px-6 py-3 text-sm font-semibold text-nuit-900 hover:bg-or-400"
        >
          Accéder au dossier de candidature
        </a>
      )}
    </div>
  );
}
