import type { Metadata } from "next";
import Link from "next/link";
import { sessionCourante } from "@/lib/auth";
import { RESSOURCES } from "@/lib/ressources";
import { deconnexion } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Espace rédaction",
  robots: { index: false, follow: false },
};

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const session = await sessionCourante();

  if (!session) {
    return <div className="flex flex-1 items-center justify-center px-4 py-16">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <aside className="border-b border-nuit-800 bg-nuit-900 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-or-500 text-sm font-bold text-nuit-900">
            IT
          </span>
          <span className="text-sm font-bold text-white">Espace rédaction</span>
        </div>

        <nav className="flex flex-wrap gap-1 px-3 pb-4 lg:flex-col lg:flex-nowrap">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-sm font-medium text-nuit-200 hover:bg-nuit-800 hover:text-white"
          >
            📊 Tableau de bord
          </Link>
          {RESSOURCES.map((r) => (
            <Link
              key={r.cle}
              href={`/admin/${r.cle}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-nuit-200 hover:bg-nuit-800 hover:text-white"
            >
              {r.icone} {r.libelle}
            </Link>
          ))}
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-nuit-200 hover:bg-nuit-800 hover:text-white"
          >
            ↗ Voir le site
          </Link>
        </nav>

        <div className="border-t border-nuit-800 px-5 py-4">
          <p className="text-xs text-nuit-200">Connecté</p>
          <p className="truncate text-sm font-semibold text-white">{session.nom}</p>
          <form action={deconnexion}>
            <button
              type="submit"
              className="mt-2 text-xs font-semibold text-or-400 hover:text-or-300"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-sable-50">{children}</div>
    </div>
  );
}
