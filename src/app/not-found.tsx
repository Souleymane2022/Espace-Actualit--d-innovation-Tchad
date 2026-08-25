import Link from "next/link";

export default function Introuvable() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-or-500">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-nuit-900">
          Cette page est introuvable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-nuit-600">
          Le contenu que vous cherchez a peut-être été déplacé ou n&apos;existe plus.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-nuit-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-nuit-700"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/recherche"
            className="rounded-md border border-nuit-800 px-5 py-2.5 text-sm font-semibold text-nuit-800 hover:bg-nuit-800 hover:text-white"
          >
            Rechercher
          </Link>
        </div>
      </div>
    </div>
  );
}
