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

  return (
    <header className="sticky top-0 z-50 border-b border-sable-200 bg-sable-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-nuit-800 text-sm font-bold text-or-400">
            IT
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-nuit-900">
              Innov&apos;Tchad
            </span>
            <span className="block text-[11px] text-nuit-600">
              Innovation &amp; recherche scientifique
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {LIENS.map((lien) => {
            const actif = chemin.startsWith(lien.href);
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  actif
                    ? "bg-nuit-800 text-white"
                    : "text-nuit-800 hover:bg-sable-200"
                }`}
              >
                {lien.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/recherche"
            aria-label="Rechercher"
            className="rounded-md border border-sable-200 bg-white p-2 text-nuit-700 transition-colors hover:border-nuit-400"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/contribuer"
            className="hidden rounded-md bg-or-500 px-3.5 py-2 text-sm font-semibold text-nuit-900 transition-colors hover:bg-or-400 sm:block"
          >
            Proposer un contenu
          </Link>
          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            aria-label="Ouvrir le menu"
            className="rounded-md border border-sable-200 bg-white p-2 text-nuit-700 lg:hidden"
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

      {ouvert && (
        <nav className="border-t border-sable-200 bg-white px-4 py-2 lg:hidden">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-nuit-800 hover:bg-sable-100"
            >
              {lien.label}
            </Link>
          ))}
          <Link
            href="/contribuer"
            className="mt-1 block rounded-md bg-or-500 px-3 py-2.5 text-center text-sm font-semibold text-nuit-900"
          >
            Proposer un contenu
          </Link>
        </nav>
      )}
    </header>
  );
}
