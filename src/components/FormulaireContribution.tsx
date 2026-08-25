"use client";

import { useActionState } from "react";
import { envoyerSoumission, type EtatFormulaire } from "@/app/actions";
import { TYPES_SOUMISSION } from "@/lib/utils";

const ETAT_INITIAL: EtatFormulaire = { ok: false, message: "" };

const champ =
  "mt-1.5 w-full rounded-md border border-sable-200 bg-white px-4 py-2.5 text-sm text-nuit-900 focus:border-nuit-400 focus:outline-none";
const label = "block text-sm font-semibold text-nuit-800";

export default function FormulaireContribution() {
  const [etat, action, enCours] = useActionState(envoyerSoumission, ETAT_INITIAL);

  if (etat.ok) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-800">Proposition envoyée 🎉</p>
        <p className="mt-2 text-sm leading-relaxed text-emerald-700">{etat.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5 rounded-xl border border-sable-200 bg-white p-6 sm:p-8">
      <div>
        <label htmlFor="type" className={label}>
          Que souhaitez-vous proposer ? *
        </label>
        <select id="type" name="type" required className={champ} defaultValue="innovation">
          {Object.entries(TYPES_SOUMISSION).map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>
              {libelle}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="titre" className={label}>
          Titre / nom du sujet *
        </label>
        <input id="titre" name="titre" required className={champ} placeholder="Ex. : Séchoir solaire pour mangues" />
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Description *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          className={champ}
          placeholder="Présentez le projet, la personne ou l'événement : à quoi cela sert, où, avec qui, à quel stade d'avancement…"
        />
        <p className="mt-1.5 text-xs text-nuit-600">30 caractères minimum.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nomContact" className={label}>
            Votre nom *
          </label>
          <input id="nomContact" name="nomContact" required className={champ} />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Votre e-mail *
          </label>
          <input id="email" name="email" type="email" required className={champ} />
        </div>
      </div>

      <div>
        <label htmlFor="telephone" className={label}>
          Téléphone (facultatif)
        </label>
        <input id="telephone" name="telephone" className={champ} placeholder="+235 …" />
      </div>

      {etat.message && !etat.ok && (
        <p className="rounded-md border border-terre-100 bg-terre-100 px-4 py-2.5 text-sm text-terre-600">
          {etat.message}
        </p>
      )}

      <button
        type="submit"
        disabled={enCours}
        className="w-full rounded-md bg-nuit-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-nuit-700 disabled:opacity-60"
      >
        {enCours ? "Envoi en cours…" : "Envoyer ma proposition"}
      </button>
      <p className="text-xs leading-relaxed text-nuit-600">
        Vos coordonnées servent uniquement à vous recontacter au sujet de cette proposition. Elles ne
        sont ni publiées ni transmises à des tiers.
      </p>
    </form>
  );
}
