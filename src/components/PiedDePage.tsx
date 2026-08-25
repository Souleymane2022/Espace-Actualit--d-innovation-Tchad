import Link from "next/link";
import FormulaireNewsletter from "@/components/FormulaireNewsletter";

export default function PiedDePage() {
  return (
    <footer className="mt-20 border-t-4 border-or-500 bg-nuit-900 text-nuit-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-or-500 text-sm font-bold text-nuit-900">
              IT
            </span>
            <span className="text-lg font-bold text-white">Innov&apos;Tchad</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-nuit-200">
            L&apos;espace d&apos;actualité qui met en lumière les innovations, les projets
            technologiques et les travaux des chercheuses et chercheurs du Tchad — pour les
            valoriser et les faire découvrir au plus grand nombre.
          </p>
          <FormulaireNewsletter />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-or-400">Explorer</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/actualites" className="hover:text-or-300">Actualités</Link></li>
            <li><Link href="/chercheurs" className="hover:text-or-300">Annuaire des chercheurs</Link></li>
            <li><Link href="/innovations" className="hover:text-or-300">Vitrine des innovations</Link></li>
            <li><Link href="/evenements" className="hover:text-or-300">Événements</Link></li>
            <li><Link href="/opportunites" className="hover:text-or-300">Appels &amp; bourses</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-or-400">Participer</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/contribuer" className="hover:text-or-300">Proposer un contenu</Link></li>
            <li><Link href="/a-propos" className="hover:text-or-300">À propos du projet</Link></li>
            <li><Link href="/recherche" className="hover:text-or-300">Rechercher</Link></li>
            <li><Link href="/admin" className="hover:text-or-300">Espace rédaction</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-nuit-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-nuit-200 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Innov&apos;Tchad — plateforme ouverte de valorisation de la recherche tchadienne.</p>
          <p>Fait à N&apos;Djaména 🇹🇩</p>
        </div>
      </div>
    </footer>
  );
}
