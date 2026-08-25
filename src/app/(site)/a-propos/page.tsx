import type { Metadata } from "next";
import Link from "next/link";
import { EnTetePage } from "@/components/UI";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Innov'Tchad : une plateforme ouverte pour valoriser la recherche scientifique et l'innovation tchadiennes.",
};

const MISSIONS = [
  {
    titre: "Rendre visible",
    texte:
      "Beaucoup de travaux de qualité restent confinés aux amphithéâtres, aux laboratoires ou aux ateliers. Innov'Tchad leur donne une vitrine publique, lisible par tous : journalistes, étudiants, bailleurs, entreprises.",
  },
  {
    titre: "Mettre en relation",
    texte:
      "Un annuaire des chercheuses et chercheurs, classé par domaine et par institution, pour trouver la bonne expertise et faire naître des collaborations entre universités, startups et administrations.",
  },
  {
    titre: "Informer en continu",
    texte:
      "Un fil d'actualité dédié aux sciences et aux technologies au Tchad, complété par un agenda des événements et une veille des appels à projets, bourses et financements.",
  },
  {
    titre: "Ouvrir la contribution",
    texte:
      "Chaque innovateur, laboratoire ou association peut proposer un contenu. La rédaction vérifie, met en forme et publie gratuitement.",
  },
];

const ETAPES = [
  { n: "01", t: "Vous proposez", d: "Via le formulaire « Proposer un contenu », en quelques minutes." },
  { n: "02", t: "Nous vérifions", d: "La rédaction contrôle les informations et vous recontacte si besoin." },
  { n: "03", t: "Nous publions", d: "Le contenu rejoint la plateforme et devient accessible à tous." },
];

export default function PageAPropos() {
  return (
    <>
      <EnTetePage
        surtitre="Le projet"
        titre="Valoriser ce que le Tchad invente et cherche"
        description="Innov'Tchad est un espace d'actualité et de valorisation entièrement consacré à l'innovation et à la recherche scientifique tchadiennes. L'objectif est simple : que le travail accompli ici soit connu, reconnu et utilisé."
      />

      <div className="mx-auto max-w-4xl px-4 py-14">
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-nuit-900">Nos quatre missions</h2>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {MISSIONS.map((m) => (
              <div key={m.titre} className="rounded-xl border border-sable-200 bg-white p-6">
                <h3 className="text-lg font-bold text-nuit-900">{m.titre}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-nuit-600">{m.texte}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-nuit-900">
            Comment publier sur la plateforme
          </h2>
          <ol className="mt-7 space-y-5">
            {ETAPES.map((e) => (
              <li key={e.n} className="flex gap-5 rounded-xl border border-sable-200 bg-white p-6">
                <span className="text-2xl font-bold text-or-500">{e.n}</span>
                <span>
                  <span className="block font-bold text-nuit-900">{e.t}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-nuit-600">{e.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-nuit-900">Ce que nous publions</h2>
          <ul className="mt-5 space-y-2.5 text-[16px] leading-relaxed text-nuit-700">
            <li>• Des <strong>actualités</strong> : découvertes, soutenances, partenariats, distinctions, lancements de projets.</li>
            <li>• Des <strong>profils de chercheurs</strong> : parcours, domaine, laboratoire, publications, contact.</li>
            <li>• Des <strong>innovations</strong> : de l&apos;idée au produit commercialisé, avec le porteur et l&apos;état d&apos;avancement.</li>
            <li>• Des <strong>événements</strong> : conférences, hackathons, ateliers, salons.</li>
            <li>• Des <strong>opportunités</strong> : appels à projets, bourses, financements, prix scientifiques.</li>
          </ul>
        </section>

        <section className="mt-16 rounded-2xl bg-nuit-900 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Une plateforme collective
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-nuit-200">
            Innov&apos;Tchad n&apos;a de valeur que par les contenus que la communauté scientifique et
            entrepreneuriale y dépose. Universités, instituts de recherche, incubateurs, startups et
            associations : cet espace est le vôtre.
          </p>
          <Link
            href="/contribuer"
            className="mt-7 inline-block rounded-md bg-or-500 px-6 py-3 text-sm font-semibold text-nuit-900 hover:bg-or-400"
          >
            Proposer un contenu
          </Link>
        </section>
      </div>
    </>
  );
}
