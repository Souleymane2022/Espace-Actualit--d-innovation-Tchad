"use client";

import Link from "next/link";
import { useActionState } from "react";
import { connexion, type EtatAdmin } from "@/app/admin/actions";

const ETAT_INITIAL: EtatAdmin = { ok: false, message: "" };

export default function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(connexion, ETAT_INITIAL);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-nuit-800 text-sm font-bold text-or-400">
          IT
        </span>
        <span>
          <span className="block font-bold text-nuit-900">Innov&apos;Tchad</span>
          <span className="block text-xs text-nuit-600">Espace rédaction</span>
        </span>
      </div>

      <form action={action} className="space-y-4 rounded-xl border border-sable-200 bg-white p-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-nuit-800">
            Adresse e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1.5 w-full rounded-md border border-sable-200 px-4 py-2.5 text-sm focus:border-nuit-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="motDePasse" className="block text-sm font-semibold text-nuit-800">
            Mot de passe
          </label>
          <input
            id="motDePasse"
            name="motDePasse"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-md border border-sable-200 px-4 py-2.5 text-sm focus:border-nuit-400 focus:outline-none"
          />
        </div>

        {etat.message && (
          <p className="rounded-md border border-terre-100 bg-terre-100 px-3 py-2 text-sm text-terre-600">
            {etat.message}
          </p>
        )}

        <button
          type="submit"
          disabled={enCours}
          className="w-full rounded-md bg-nuit-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-nuit-700 disabled:opacity-60"
        >
          {enCours ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-nuit-600">
        <Link href="/" className="hover:text-or-600">
          ← Retour au site
        </Link>
      </p>
    </div>
  );
}
