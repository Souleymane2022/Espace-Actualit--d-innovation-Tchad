"use client";

/**
 * Filet de sécurité global : affiche un message lisible plutôt que la page
 * d'erreur brute de Next.js quand une exception serveur survient.
 */
export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sable-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-5xl">🛠️</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-nuit-900">
          Le site rencontre un problème technique
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-nuit-600">
          Il s&apos;agit le plus souvent d&apos;une base de données injoignable ou d&apos;une
          variable d&apos;environnement manquante côté hébergeur. Réessayez dans un instant ;
          si le problème persiste, vérifiez la configuration puis redéployez.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-nuit-600">Code de référence : {error.digest}</p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-md bg-nuit-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-nuit-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
