"use client";

import { useActionState } from "react";
import { inscrireNewsletter, type EtatFormulaire } from "@/app/actions";

const ETAT_INITIAL: EtatFormulaire = { ok: false, message: "" };

export default function FormulaireNewsletter() {
  const [etat, action, enCours] = useActionState(inscrireNewsletter, ETAT_INITIAL);

  return (
    <form action={action} className="mt-6 max-w-sm">
      <label htmlFor="email-newsletter" className="text-sm font-medium text-white">
        Recevoir la veille mensuelle
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="email-newsletter"
          name="email"
          type="email"
          required
          placeholder="vous@exemple.td"
          className="w-full rounded-md border border-nuit-700 bg-nuit-800 px-3 py-2 text-sm text-white placeholder:text-nuit-400 focus:border-or-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={enCours}
          className="shrink-0 rounded-md bg-or-500 px-4 py-2 text-sm font-semibold text-nuit-900 transition-colors hover:bg-or-400 disabled:opacity-60"
        >
          {enCours ? "…" : "OK"}
        </button>
      </div>
      {etat.message && (
        <p className={`mt-2 text-xs ${etat.ok ? "text-or-300" : "text-terre-100"}`}>
          {etat.message}
        </p>
      )}
    </form>
  );
}
