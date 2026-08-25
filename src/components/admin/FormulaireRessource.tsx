"use client";

import Link from "next/link";
import { useActionState } from "react";
import { enregistrerRessource, supprimerRessource, type EtatAdmin } from "@/app/admin/actions";
import { trouverRessource, type Champ } from "@/lib/ressources";

const ETAT_INITIAL: EtatAdmin = { ok: false, message: "" };

const classeChamp =
  "mt-1.5 w-full rounded-md border border-sable-200 bg-white px-3.5 py-2.5 text-sm text-nuit-900 focus:border-nuit-400 focus:outline-none";

function valeurDate(valeur: unknown): string {
  if (!valeur) return "";
  const d = new Date(valeur as string);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function ChampFormulaire({
  champ,
  valeur,
  options,
}: {
  champ: Champ;
  valeur: unknown;
  options?: { valeur: string; libelle: string }[];
}) {
  const id = `champ-${champ.nom}`;

  if (champ.type === "booleen") {
    return (
      <label className="flex items-center gap-3 rounded-md border border-sable-200 bg-white px-3.5 py-3 text-sm font-medium text-nuit-800">
        <input
          id={id}
          name={champ.nom}
          type="checkbox"
          defaultChecked={valeur === undefined || valeur === null ? Boolean(champ.defaut) : Boolean(valeur)}
          className="h-4 w-4 accent-nuit-800"
        />
        {champ.libelle}
      </label>
    );
  }

  const defaut = valeur ?? champ.defaut ?? "";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-nuit-800">
        {champ.libelle}
        {champ.requis && <span className="text-terre-500"> *</span>}
      </label>

      {champ.type === "zone" && (
        <textarea
          id={id}
          name={champ.nom}
          required={champ.requis}
          rows={champ.nom === "contenu" || champ.nom === "description" ? 12 : 4}
          defaultValue={String(defaut)}
          className={classeChamp}
        />
      )}

      {champ.type === "select" && (
        <select id={id} name={champ.nom} defaultValue={String(defaut)} className={classeChamp}>
          {champ.options?.map((o) => (
            <option key={o.valeur} value={o.valeur}>
              {o.libelle}
            </option>
          ))}
        </select>
      )}

      {champ.type === "relation" && (
        <select
          id={id}
          name={champ.nom}
          required={champ.requis}
          defaultValue={String(defaut)}
          className={classeChamp}
        >
          <option value="">— Aucun —</option>
          {options?.map((o) => (
            <option key={o.valeur} value={o.valeur}>
              {o.libelle}
            </option>
          ))}
        </select>
      )}

      {champ.type === "date" && (
        <input
          id={id}
          name={champ.nom}
          type="date"
          required={champ.requis}
          defaultValue={valeurDate(valeur)}
          className={classeChamp}
        />
      )}

      {champ.type === "nombre" && (
        <input
          id={id}
          name={champ.nom}
          type="number"
          required={champ.requis}
          defaultValue={String(defaut)}
          className={classeChamp}
        />
      )}

      {champ.type === "couleur" && (
        <input
          id={id}
          name={champ.nom}
          type="color"
          defaultValue={String(defaut || "#0d9488")}
          className="mt-1.5 h-11 w-24 rounded-md border border-sable-200 bg-white p-1"
        />
      )}

      {champ.type === "texte" && (
        <input
          id={id}
          name={champ.nom}
          type="text"
          required={champ.requis}
          defaultValue={String(defaut)}
          className={classeChamp}
        />
      )}

      {champ.aide && <p className="mt-1.5 text-xs text-nuit-600">{champ.aide}</p>}
    </div>
  );
}

export default function FormulaireRessource({
  cle,
  enregistrement,
  optionsRelations = {},
}: {
  cle: string;
  enregistrement?: Record<string, unknown> | null;
  optionsRelations?: Record<string, { valeur: string; libelle: string }[]>;
}) {
  const [etat, action, enCours] = useActionState(enregistrerRessource, ETAT_INITIAL);
  const ressource = trouverRessource(cle);
  if (!ressource) return null;

  const id = enregistrement ? String(enregistrement.id) : "";
  const slugPublic = enregistrement?.slug ? String(enregistrement.slug) : "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <nav className="text-sm text-nuit-600">
        <Link href={`/admin/${ressource.cle}`} className="hover:text-or-600">
          ← {ressource.libelle}
        </Link>
      </nav>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-nuit-900">
          {id ? `Modifier : ${ressource.singulier}` : `Nouveau : ${ressource.singulier}`}
        </h1>
        {ressource.cheminPublic && slugPublic && (
          <a
            href={`${ressource.cheminPublic}/${slugPublic}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-nuit-700 hover:text-or-600"
          >
            Voir en ligne ↗
          </a>
        )}
      </div>

      <form action={action} className="mt-7 space-y-5">
        <input type="hidden" name="__ressource" value={ressource.cle} />
        <input type="hidden" name="__id" value={id} />

        <div className="grid gap-5 sm:grid-cols-2">
          {ressource.champs.map((champ) => (
            <div key={champ.nom} className={champ.pleineLargeur ? "sm:col-span-2" : ""}>
              <ChampFormulaire
                champ={champ}
                valeur={enregistrement?.[champ.nom]}
                options={optionsRelations[champ.nom]}
              />
            </div>
          ))}
        </div>

        {etat.message && !etat.ok && (
          <p className="rounded-md border border-terre-100 bg-terre-100 px-4 py-2.5 text-sm text-terre-600">
            {etat.message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-sable-200 pt-5">
          <button
            type="submit"
            disabled={enCours}
            className="rounded-md bg-nuit-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-nuit-700 disabled:opacity-60"
          >
            {enCours ? "Enregistrement…" : "Enregistrer"}
          </button>
          <Link
            href={`/admin/${ressource.cle}`}
            className="rounded-md border border-sable-200 bg-white px-5 py-2.5 text-sm font-semibold text-nuit-700 hover:border-nuit-400"
          >
            Annuler
          </Link>
        </div>
      </form>

      {id && (
        <form
          action={supprimerRessource}
          className="mt-10 rounded-xl border border-terre-100 bg-white p-5"
        >
          <input type="hidden" name="__ressource" value={ressource.cle} />
          <input type="hidden" name="__id" value={id} />
          <h2 className="text-sm font-bold text-terre-600">Supprimer définitivement</h2>
          <p className="mt-1.5 text-sm text-nuit-600">
            Cette action est irréversible. Pour retirer temporairement le contenu du site public,
            préférez le passer en brouillon.
          </p>
          <button
            type="submit"
            className="mt-4 rounded-md border border-terre-500 px-4 py-2 text-sm font-semibold text-terre-600 hover:bg-terre-500 hover:text-white"
          >
            Supprimer
          </button>
        </form>
      )}
    </div>
  );
}
