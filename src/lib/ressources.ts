import {
  STATUTS_INNOVATION,
  STATUTS_SOUMISSION,
  TYPES_EVENEMENT,
  TYPES_OPPORTUNITE,
  TYPES_SOUMISSION,
} from "@/lib/utils";

export type TypeChamp =
  | "texte"
  | "zone"
  | "nombre"
  | "date"
  | "booleen"
  | "select"
  | "relation"
  | "couleur";

export type Champ = {
  nom: string;
  libelle: string;
  type: TypeChamp;
  requis?: boolean;
  aide?: string;
  options?: { valeur: string; libelle: string }[];
  /** Modèle Prisma cible pour un champ de type « relation ». */
  relation?: { modele: string; etiquette: (e: Record<string, unknown>) => string };
  defaut?: string | number | boolean;
  pleineLargeur?: boolean;
};

export type Ressource = {
  cle: string;
  modele: string;
  libelle: string;
  singulier: string;
  icone: string;
  /** Champ affiché comme titre dans les listes. */
  champTitre: string;
  /** Champ source pour générer automatiquement le slug. */
  slugDepuis?: string;
  /** Colonnes secondaires affichées dans la liste. */
  colonnes: { nom: string; libelle: string }[];
  tri: Record<string, "asc" | "desc">;
  champs: Champ[];
  /** Chemin public correspondant, pour le lien « voir en ligne ». */
  cheminPublic?: string;
  /** Une ressource en lecture seule n'a pas de formulaire de création. */
  lectureSeule?: boolean;
};

const enOptions = (dico: Record<string, string>) =>
  Object.entries(dico).map(([valeur, libelle]) => ({ valeur, libelle }));

export const RESSOURCES: Ressource[] = [
  {
    cle: "articles",
    modele: "article",
    libelle: "Articles",
    singulier: "Article",
    icone: "📰",
    champTitre: "titre",
    slugDepuis: "titre",
    cheminPublic: "/actualites",
    colonnes: [
      { nom: "auteur", libelle: "Auteur" },
      { nom: "publieLe", libelle: "Publié le" },
      { nom: "vues", libelle: "Vues" },
    ],
    tri: { publieLe: "desc" },
    champs: [
      { nom: "titre", libelle: "Titre", type: "texte", requis: true, pleineLargeur: true },
      {
        nom: "slug",
        libelle: "Slug (URL)",
        type: "texte",
        aide: "Laisser vide pour le générer automatiquement à partir du titre.",
      },
      {
        nom: "categorieId",
        libelle: "Rubrique",
        type: "relation",
        relation: { modele: "categorie", etiquette: (e) => String(e.nom) },
      },
      {
        nom: "chapo",
        libelle: "Chapô",
        type: "zone",
        requis: true,
        pleineLargeur: true,
        aide: "Résumé de deux ou trois phrases affiché sous le titre et dans les listes.",
      },
      {
        nom: "contenu",
        libelle: "Contenu",
        type: "zone",
        requis: true,
        pleineLargeur: true,
        aide: "Un paragraphe par ligne. « ## » pour un sous-titre, « - » pour une puce, « > » pour une citation.",
      },
      { nom: "image", libelle: "Image (URL)", type: "texte", pleineLargeur: true },
      { nom: "auteur", libelle: "Auteur", type: "texte", defaut: "La rédaction" },
      { nom: "source", libelle: "Source", type: "texte" },
      { nom: "lienSource", libelle: "Lien de la source", type: "texte", pleineLargeur: true },
      {
        nom: "tags",
        libelle: "Mots-clés",
        type: "texte",
        pleineLargeur: true,
        aide: "Séparés par des virgules.",
      },
      { nom: "publieLe", libelle: "Date de publication", type: "date" },
      { nom: "aLaUne", libelle: "Mettre à la une", type: "booleen" },
      { nom: "publie", libelle: "Publié", type: "booleen", defaut: true },
    ],
  },
  {
    cle: "chercheurs",
    modele: "chercheur",
    libelle: "Chercheurs",
    singulier: "Chercheur",
    icone: "🔬",
    champTitre: "nom",
    slugDepuis: "nom",
    cheminPublic: "/chercheurs",
    colonnes: [
      { nom: "prenom", libelle: "Prénom" },
      { nom: "institution", libelle: "Institution" },
      { nom: "domaine", libelle: "Domaine" },
    ],
    tri: { nom: "asc" },
    champs: [
      {
        nom: "civilite",
        libelle: "Civilité",
        type: "select",
        defaut: "Dr",
        options: ["Dr", "Pr", "M.", "Mme", "Ing."].map((v) => ({ valeur: v, libelle: v })),
      },
      { nom: "prenom", libelle: "Prénom", type: "texte", requis: true },
      { nom: "nom", libelle: "Nom", type: "texte", requis: true },
      { nom: "slug", libelle: "Slug (URL)", type: "texte", aide: "Généré automatiquement si vide." },
      { nom: "institution", libelle: "Institution", type: "texte", requis: true },
      { nom: "laboratoire", libelle: "Laboratoire / unité", type: "texte" },
      { nom: "ville", libelle: "Ville", type: "texte", defaut: "N'Djaména" },
      { nom: "domaine", libelle: "Domaine de recherche", type: "texte", requis: true },
      {
        nom: "motsCles",
        libelle: "Mots-clés",
        type: "texte",
        pleineLargeur: true,
        aide: "Séparés par des virgules.",
      },
      { nom: "biographie", libelle: "Biographie", type: "zone", requis: true, pleineLargeur: true },
      { nom: "photo", libelle: "Photo (URL)", type: "texte", pleineLargeur: true },
      { nom: "email", libelle: "E-mail", type: "texte" },
      { nom: "telephone", libelle: "Téléphone", type: "texte" },
      { nom: "siteWeb", libelle: "Site web", type: "texte" },
      { nom: "orcid", libelle: "Identifiant ORCID", type: "texte" },
      { nom: "googleScholar", libelle: "Google Scholar (URL)", type: "texte" },
      { nom: "linkedin", libelle: "LinkedIn (URL)", type: "texte" },
      { nom: "aLaUne", libelle: "Mettre en avant", type: "booleen" },
      { nom: "publie", libelle: "Publié", type: "booleen", defaut: true },
    ],
  },
  {
    cle: "innovations",
    modele: "innovation",
    libelle: "Innovations",
    singulier: "Innovation",
    icone: "💡",
    champTitre: "nom",
    slugDepuis: "nom",
    cheminPublic: "/innovations",
    colonnes: [
      { nom: "secteur", libelle: "Secteur" },
      { nom: "statut", libelle: "Maturité" },
      { nom: "annee", libelle: "Année" },
    ],
    tri: { annee: "desc" },
    champs: [
      { nom: "nom", libelle: "Nom de l'innovation", type: "texte", requis: true, pleineLargeur: true },
      { nom: "slug", libelle: "Slug (URL)", type: "texte", aide: "Généré automatiquement si vide." },
      { nom: "secteur", libelle: "Secteur", type: "texte", requis: true },
      {
        nom: "statut",
        libelle: "Maturité",
        type: "select",
        defaut: "prototype",
        options: enOptions(STATUTS_INNOVATION),
      },
      { nom: "annee", libelle: "Année", type: "nombre", requis: true },
      { nom: "resume", libelle: "Résumé", type: "zone", requis: true, pleineLargeur: true },
      {
        nom: "description",
        libelle: "Description détaillée",
        type: "zone",
        requis: true,
        pleineLargeur: true,
        aide: "Un paragraphe par ligne. « ## » pour un sous-titre, « - » pour une puce.",
      },
      { nom: "porteur", libelle: "Porteur du projet", type: "texte", requis: true },
      { nom: "organisation", libelle: "Structure", type: "texte" },
      { nom: "ville", libelle: "Ville", type: "texte", defaut: "N'Djaména" },
      {
        nom: "chercheurId",
        libelle: "Chercheur associé",
        type: "relation",
        relation: {
          modele: "chercheur",
          etiquette: (e) => `${e.prenom} ${e.nom}`,
        },
      },
      { nom: "image", libelle: "Image (URL)", type: "texte", pleineLargeur: true },
      { nom: "video", libelle: "Vidéo (URL)", type: "texte", pleineLargeur: true },
      { nom: "contact", libelle: "Contact", type: "texte" },
      { nom: "siteWeb", libelle: "Site web", type: "texte" },
      { nom: "aLaUne", libelle: "Mettre en avant", type: "booleen" },
      { nom: "publie", libelle: "Publié", type: "booleen", defaut: true },
    ],
  },
  {
    cle: "evenements",
    modele: "evenement",
    libelle: "Événements",
    singulier: "Événement",
    icone: "📅",
    champTitre: "titre",
    slugDepuis: "titre",
    cheminPublic: "/evenements",
    colonnes: [
      { nom: "type", libelle: "Type" },
      { nom: "ville", libelle: "Ville" },
      { nom: "dateDebut", libelle: "Début" },
    ],
    tri: { dateDebut: "desc" },
    champs: [
      { nom: "titre", libelle: "Titre", type: "texte", requis: true, pleineLargeur: true },
      { nom: "slug", libelle: "Slug (URL)", type: "texte", aide: "Généré automatiquement si vide." },
      {
        nom: "type",
        libelle: "Type",
        type: "select",
        defaut: "conference",
        options: enOptions(TYPES_EVENEMENT),
      },
      { nom: "dateDebut", libelle: "Date de début", type: "date", requis: true },
      { nom: "dateFin", libelle: "Date de fin", type: "date" },
      { nom: "lieu", libelle: "Lieu", type: "texte", requis: true },
      { nom: "ville", libelle: "Ville", type: "texte", defaut: "N'Djaména" },
      { nom: "organisateur", libelle: "Organisateur", type: "texte", requis: true },
      { nom: "description", libelle: "Description", type: "zone", requis: true, pleineLargeur: true },
      { nom: "lienInscription", libelle: "Lien d'inscription", type: "texte", pleineLargeur: true },
      { nom: "image", libelle: "Image (URL)", type: "texte", pleineLargeur: true },
      { nom: "publie", libelle: "Publié", type: "booleen", defaut: true },
    ],
  },
  {
    cle: "opportunites",
    modele: "opportunite",
    libelle: "Opportunités",
    singulier: "Opportunité",
    icone: "🎯",
    champTitre: "titre",
    slugDepuis: "titre",
    cheminPublic: "/opportunites",
    colonnes: [
      { nom: "type", libelle: "Type" },
      { nom: "organisme", libelle: "Organisme" },
      { nom: "dateLimite", libelle: "Date limite" },
    ],
    tri: { dateLimite: "desc" },
    champs: [
      { nom: "titre", libelle: "Titre", type: "texte", requis: true, pleineLargeur: true },
      { nom: "slug", libelle: "Slug (URL)", type: "texte", aide: "Généré automatiquement si vide." },
      {
        nom: "type",
        libelle: "Type",
        type: "select",
        defaut: "appel",
        options: enOptions(TYPES_OPPORTUNITE),
      },
      { nom: "organisme", libelle: "Organisme", type: "texte", requis: true },
      { nom: "dateLimite", libelle: "Date limite", type: "date" },
      { nom: "montant", libelle: "Montant / dotation", type: "texte" },
      { nom: "description", libelle: "Description", type: "zone", requis: true, pleineLargeur: true },
      { nom: "lien", libelle: "Lien de candidature", type: "texte", pleineLargeur: true },
      { nom: "publie", libelle: "Publié", type: "booleen", defaut: true },
    ],
  },
  {
    cle: "publications",
    modele: "publication",
    libelle: "Publications",
    singulier: "Publication",
    icone: "📚",
    champTitre: "titre",
    colonnes: [
      { nom: "revue", libelle: "Revue" },
      { nom: "annee", libelle: "Année" },
    ],
    tri: { annee: "desc" },
    champs: [
      { nom: "titre", libelle: "Titre", type: "texte", requis: true, pleineLargeur: true },
      {
        nom: "chercheurId",
        libelle: "Chercheur",
        type: "relation",
        requis: true,
        relation: { modele: "chercheur", etiquette: (e) => `${e.prenom} ${e.nom}` },
      },
      { nom: "annee", libelle: "Année", type: "nombre", requis: true },
      { nom: "revue", libelle: "Revue / éditeur", type: "texte" },
      { nom: "coAuteurs", libelle: "Co-auteurs", type: "texte", pleineLargeur: true },
      { nom: "doi", libelle: "DOI", type: "texte" },
      { nom: "lien", libelle: "Lien", type: "texte" },
    ],
  },
  {
    cle: "categories",
    modele: "categorie",
    libelle: "Rubriques",
    singulier: "Rubrique",
    icone: "🏷️",
    champTitre: "nom",
    slugDepuis: "nom",
    colonnes: [{ nom: "slug", libelle: "Slug" }],
    tri: { nom: "asc" },
    champs: [
      { nom: "nom", libelle: "Nom", type: "texte", requis: true },
      { nom: "slug", libelle: "Slug (URL)", type: "texte", aide: "Généré automatiquement si vide." },
      { nom: "description", libelle: "Description", type: "zone", pleineLargeur: true },
      { nom: "couleur", libelle: "Couleur", type: "couleur", defaut: "#0d9488" },
    ],
  },
  {
    cle: "soumissions",
    modele: "soumission",
    libelle: "Propositions reçues",
    singulier: "Proposition",
    icone: "📥",
    champTitre: "titre",
    lectureSeule: true,
    colonnes: [
      { nom: "type", libelle: "Type" },
      { nom: "nomContact", libelle: "Contact" },
      { nom: "statut", libelle: "Statut" },
      { nom: "creeLe", libelle: "Reçue le" },
    ],
    tri: { creeLe: "desc" },
    champs: [
      { nom: "titre", libelle: "Titre", type: "texte", requis: true, pleineLargeur: true },
      { nom: "type", libelle: "Type", type: "select", options: enOptions(TYPES_SOUMISSION) },
      {
        nom: "statut",
        libelle: "Statut de traitement",
        type: "select",
        options: enOptions(STATUTS_SOUMISSION),
      },
      { nom: "nomContact", libelle: "Nom du contact", type: "texte" },
      { nom: "email", libelle: "E-mail", type: "texte" },
      { nom: "telephone", libelle: "Téléphone", type: "texte" },
      { nom: "message", libelle: "Message", type: "zone", pleineLargeur: true },
    ],
  },
];

export function trouverRessource(cle: string): Ressource | undefined {
  return RESSOURCES.find((r) => r.cle === cle);
}
