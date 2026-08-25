"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RESSOURCES } from "@/lib/ressources";
import { deconnexion } from "@/app/admin/actions";

const LIENS = [
  { href: "/admin", label: "Tableau de bord", icone: "📊", exact: true },
  ...RESSOURCES.map((r) => ({
    href: `/admin/${r.cle}`,
    label: r.libelle,
    icone: r.icone,
    exact: false,
  })),
];

function classeLien(actif: boolean): string {
  return `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    actif ? "bg-nuit-800 text-white" : "text-nuit-200 hover:bg-nuit-800 hover:text-white"
  }`;
}

export default function NavigationAdmin({ nom }: { nom: string }) {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    setOuvert(false);
  }, [chemin]);

  const estActif = (lien: (typeof LIENS)[number]) =>
    lien.exact ? chemin === lien.href : chemin.startsWith(lien.href);

  const marque = (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-or-500 text-sm font-bold text-nuit-900">
        IT
      </span>
      <span className="text-sm font-bold text-white">Espace rédaction</span>
    </span>
  );

  return (
    <aside className="bg-nuit-900 lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-nuit-800">
      {/* Barre compacte : téléphones et tablettes */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-nuit-800 bg-nuit-900 px-4 py-3 lg:hidden">
        <Link href="/admin">{marque}</Link>
        <button
          type="button"
          onClick={() => setOuvert((v) => !v)}
          aria-expanded={ouvert}
          aria-label="Ouvrir le menu d'administration"
          className="rounded-md border border-nuit-700 p-2 text-nuit-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {ouvert ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {ouvert && (
        <nav className="border-b border-nuit-800 px-3 py-3 lg:hidden">
          {LIENS.map((lien) => (
            <Link key={lien.href} href={lien.href} className={classeLien(estActif(lien))}>
              <span aria-hidden="true">{lien.icone}</span> {lien.label}
            </Link>
          ))}
          <Link href="/" className={classeLien(false)}>
            <span aria-hidden="true">↗</span> Voir le site
          </Link>
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-nuit-800 px-3 pt-3">
            <span className="truncate text-sm font-semibold text-white">{nom}</span>
            <form action={deconnexion}>
              <button type="submit" className="text-xs font-semibold text-or-400 hover:text-or-300">
                Se déconnecter
              </button>
            </form>
          </div>
        </nav>
      )}

      {/* Barre latérale : grands écrans */}
      <div className="hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <div className="px-5 py-5">
          <Link href="/admin">{marque}</Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
          {LIENS.map((lien) => (
            <Link key={lien.href} href={lien.href} className={classeLien(estActif(lien))}>
              <span aria-hidden="true">{lien.icone}</span> {lien.label}
            </Link>
          ))}
          <Link href="/" className={classeLien(false)}>
            <span aria-hidden="true">↗</span> Voir le site
          </Link>
        </nav>
        <div className="border-t border-nuit-800 px-5 py-4">
          <p className="text-xs text-nuit-200">Connecté</p>
          <p className="truncate text-sm font-semibold text-white">{nom}</p>
          <form action={deconnexion}>
            <button type="submit" className="mt-2 text-xs font-semibold text-or-400 hover:text-or-300">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
