"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LIENS = [
  { href: "/actualites", label: "Actualités" },
  { href: "/chercheurs", label: "Chercheurs" },
  { href: "/innovations", label: "Innovations" },
  { href: "/evenements", label: "Événements" },
  { href: "/opportunites", label: "Opportunités" },
  { href: "/a-propos", label: "À propos" },
];

export default function EnTete() {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    setOuvert(false);
  }, [chemin]);

  const dateDuJour = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date());

  return (
    <header className="border-b-2 border-nuit-900 bg-white">
      {/* Ligne de date, comme la manchette d'un quotidien */}
      <div className="hidden border-b border-sable-200 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-[12px] text-nuit-600">
          <span suppressHydrationWarning className="capitalize">{dateDuJour}</span>
          <span className="italic">L&apos;actualité de l&apos;innovation et de la recherche scientifique au Tchad</span>
        </div>
      </div>

      {/* Manchette */}
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center bg-nuit-900 text-sm font-bold text-or-400">
            IT
          </span>
          <span className="leading-tight">
            <span className="titre-journal block text-2xl text-nuit-900 sm:text-3xl">
              Innov&apos;Tchad
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/recherche"
            aria-label="Rechercher"
            className="p-2 text-nuit-700 transition-colors hover:text-or-600"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/contribuer"
            className="hidden bg-nuit-900 px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-nuit-700 sm:block"
          >
            Proposer un contenu
          </Link>
          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            aria-label="Ouvrir le menu"
            className="border border-sable-200 p-2 text-nuit-700 lg:hidden"
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
      </div>

      {/* Bandeau des rubriques */}
      <nav className="hidden border-t border-sable-200 lg:block">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4">
          {LIENS.map((lien) => {
            const actif = chemin.startsWith(lien.href);
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className={`whitespace-nowrap border-b-[3px] px-3 py-2.5 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                  actif
                    ? "border-or-500 text-nuit-900"
                    : "border-transparent text-nuit-700 hover:border-sable-200 hover:text-nuit-900"
                }`}
              >
                {lien.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {ouvert && (
        <nav className="border-t border-sable-200 bg-white px-4 py-2 lg:hidden">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="block px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-nuit-800 hover:bg-sable-100"
            >
              {lien.label}
            </Link>
          ))}
          <Link
            href="/contribuer"
            className="mt-1 block bg-nuit-900 px-3 py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-white"
          >
            Proposer un contenu
          </Link>
        </nav>
      )}
    </header>
  );
}
