/**
 * Peuplement de la base avec un jeu de démonstration.
 *
 * ⚠️ Les profils de chercheurs, les innovations, les articles et les événements
 * ci-dessous sont des EXEMPLES FICTIFS destinés à illustrer la plateforme.
 * Les institutions citées existent, mais les personnes, projets et dates sont
 * inventés : remplacez-les par des contenus réels avant toute mise en ligne.
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { slugifier } from "../src/lib/utils";

const prisma = new PrismaClient();

const JOUR = 86_400_000;
const dans = (jours: number) => new Date(Date.now() + jours * JOUR);
const ilYA = (jours: number) => new Date(Date.now() - jours * JOUR);

const CATEGORIES = [
  { nom: "Agriculture & élevage", couleur: "#15803d", description: "Agronomie, semences, élevage, sécurité alimentaire." },
  { nom: "Santé", couleur: "#b32a22", description: "Santé publique, maladies tropicales, pharmacopée." },
  { nom: "Énergie", couleur: "#cc8a05", description: "Solaire, biomasse, accès à l'électricité." },
  { nom: "Numérique & IA", couleur: "#4338ca", description: "Logiciels, données, intelligence artificielle, télécoms." },
  { nom: "Environnement & climat", couleur: "#0e7490", description: "Lac Tchad, désertification, biodiversité, eau." },
  { nom: "Vie universitaire", couleur: "#7c3aed", description: "Soutenances, partenariats, politiques de recherche." },
];

const CHERCHEURS = [
  {
    civilite: "Dr",
    prenom: "Achta",
    nom: "Mahamat Ali",
    institution: "Université de N'Djaména",
    laboratoire: "Laboratoire de biotechnologie végétale",
    ville: "N'Djaména",
    domaine: "Agronomie",
    motsCles: "semences, sorgho, sécheresse, sélection variétale",
    email: "exemple.achta@demo.td",
    orcid: "0000-0002-1825-0097",
    aLaUne: true,
    biographie:
      "Agronome, elle travaille sur la sélection de variétés de sorgho tolérantes au déficit hydrique dans la bande sahélienne.\nSes essais, conduits avec des coopératives du Kanem et du Batha, visent à réduire d'un tiers les pertes de rendement en année sèche.\nElle encadre plusieurs mémoires de master et anime un réseau d'agriculteurs-expérimentateurs.",
    publications: [
      { titre: "Tolérance au stress hydrique de six variétés locales de sorgho au Sahel tchadien", revue: "Cahiers Agricultures", annee: 2024, coAuteurs: "avec l'équipe du laboratoire de biotechnologie végétale" },
      { titre: "Pratiques semencières paysannes et conservation de la diversité variétale au Kanem", revue: "Revue d'écologie sahélienne", annee: 2022 },
    ],
  },
  {
    civilite: "Pr",
    prenom: "Djimadoum",
    nom: "Ngaradoum",
    institution: "Université de Moundou",
    laboratoire: "Unité de recherche en énergies renouvelables",
    ville: "Moundou",
    domaine: "Énergie",
    motsCles: "solaire photovoltaïque, mini-réseaux, stockage",
    email: "exemple.djimadoum@demo.td",
    aLaUne: true,
    biographie:
      "Spécialiste des systèmes photovoltaïques hors réseau, il conçoit des mini-réseaux solaires adaptés aux bourgs ruraux du sud du pays.\nSes travaux portent sur le dimensionnement du stockage et sur les modèles économiques permettant aux usagers de payer l'électricité à l'usage.",
    publications: [
      { titre: "Dimensionnement optimal de mini-réseaux solaires pour localités rurales sahéliennes", revue: "Renewable Energy for Development", annee: 2023 },
      { titre: "Modèles de tarification prépayée de l'électricité solaire en zone rurale", revue: "Énergies & Territoires", annee: 2021 },
    ],
  },
  {
    civilite: "Dr",
    prenom: "Fatimé",
    nom: "Abdelkerim",
    institution: "Faculté des sciences de la santé humaine, N'Djaména",
    laboratoire: "Laboratoire de parasitologie",
    ville: "N'Djaména",
    domaine: "Santé publique",
    motsCles: "paludisme, épidémiologie, prévention, santé maternelle",
    email: "exemple.fatime@demo.td",
    biographie:
      "Épidémiologiste, elle étudie la saisonnalité du paludisme dans les quartiers périphériques de N'Djaména et l'efficacité des campagnes de moustiquaires imprégnées.\nElle plaide pour une surveillance communautaire s'appuyant sur les agents de santé de quartier.",
    publications: [
      { titre: "Saisonnalité de la transmission palustre en zone périurbaine de N'Djaména", revue: "Bulletin de santé tropicale", annee: 2024 },
      { titre: "Acceptabilité des moustiquaires imprégnées dans trois arrondissements", revue: "Santé publique Afrique", annee: 2023 },
      { titre: "Déterminants du recours tardif aux soins chez la femme enceinte", revue: "Revue africaine de santé maternelle", annee: 2021 },
    ],
  },
  {
    civilite: "Dr",
    prenom: "Ousmane",
    nom: "Brahim",
    institution: "Institut national supérieur des sciences et techniques d'Abéché",
    laboratoire: "Laboratoire d'informatique appliquée",
    ville: "Abéché",
    domaine: "Numérique & IA",
    motsCles: "apprentissage automatique, langues locales, traitement du signal",
    email: "exemple.ousmane@demo.td",
    biographie:
      "Informaticien, il travaille sur la reconnaissance vocale pour l'arabe tchadien et le ngambaye, avec l'objectif de rendre les services publics numériques accessibles aux populations non francophones.\nIl coordonne la collecte d'un corpus audio ouvert avec des étudiants bénévoles.",
    publications: [
      { titre: "Constitution d'un corpus audio ouvert pour l'arabe tchadien", revue: "Actes du colloque TAL pour les langues peu dotées", annee: 2024 },
      { titre: "Reconnaissance de la parole en contexte multilingue sahélien", revue: "Revue africaine d'informatique", annee: 2022 },
    ],
  },
  {
    civilite: "Dr",
    prenom: "Mariam",
    nom: "Hassane",
    institution: "Université de Sarh",
    laboratoire: "Laboratoire d'hydrologie",
    ville: "Sarh",
    domaine: "Environnement & climat",
    motsCles: "lac Tchad, hydrologie, télédétection, adaptation",
    email: "exemple.mariam@demo.td",
    aLaUne: true,
    biographie:
      "Hydrologue, elle suit par télédétection l'évolution des surfaces en eau du bassin du lac Tchad et documente les stratégies d'adaptation des communautés riveraines.\nElle collabore avec des équipes de la sous-région sur l'harmonisation des données hydrologiques.",
    publications: [
      { titre: "Vingt ans d'évolution des surfaces en eau du bassin du lac Tchad par imagerie satellitaire", revue: "Hydrologie continentale", annee: 2025 },
      { titre: "Stratégies d'adaptation des pêcheurs face à la variabilité du niveau du lac", revue: "Environnement & Sociétés", annee: 2023 },
    ],
  },
  {
    civilite: "Dr",
    prenom: "Nadjita",
    nom: "Rimtebaye",
    institution: "Institut tchadien de recherche agronomique pour le développement",
    laboratoire: "Programme post-récolte",
    ville: "N'Djaména",
    domaine: "Technologie alimentaire",
    motsCles: "post-récolte, séchage, conservation, transformation",
    email: "exemple.nadjita@demo.td",
    biographie:
      "Technologue alimentaire, elle met au point des procédés simples de séchage et de conservation des fruits et légumes destinés aux groupements féminins de transformation.\nSes travaux visent à réduire les pertes après récolte, estimées à près d'un tiers de la production maraîchère.",
    publications: [
      { titre: "Séchage solaire indirect de la mangue : qualité nutritionnelle et acceptabilité", revue: "Technologies alimentaires tropicales", annee: 2024 },
      { titre: "Réduction des pertes post-récolte dans les filières maraîchères périurbaines", revue: "Agro-industrie Sahel", annee: 2022 },
    ],
  },
  {
    civilite: "Pr",
    prenom: "Béchir",
    nom: "Adoum",
    institution: "Université Adam Barka d'Abéché",
    laboratoire: "Département de sociologie",
    ville: "Abéché",
    domaine: "Sciences sociales",
    motsCles: "mobilités, pastoralisme, gouvernance foncière",
    email: "exemple.bechir@demo.td",
    biographie:
      "Sociologue des mobilités pastorales, il analyse les mécanismes locaux de prévention des conflits entre éleveurs et agriculteurs dans l'est du pays.\nIl plaide pour une reconnaissance juridique des couloirs de transhumance négociés localement.",
    publications: [
      { titre: "Couloirs de transhumance et médiation coutumière au Ouaddaï", revue: "Cahiers d'études africaines", annee: 2023 },
      { titre: "Gouvernance foncière et mobilité pastorale au Sahel central", revue: "Revue de sociologie africaine", annee: 2020 },
    ],
  },
  {
    civilite: "Dr",
    prenom: "Zara",
    nom: "Oumar",
    institution: "Institut de recherche en élevage pour le développement",
    laboratoire: "Unité santé animale",
    ville: "N'Djaména",
    domaine: "Santé animale",
    motsCles: "épidémiosurveillance, une seule santé, vaccination, bétail",
    email: "exemple.zara@demo.td",
    biographie:
      "Vétérinaire, elle travaille sur l'épidémiosurveillance des maladies transmissibles entre le bétail et l'homme, dans une approche « une seule santé ».\nElle a contribué à la mise en place d'un réseau d'alerte s'appuyant sur les auxiliaires d'élevage.",
    publications: [
      { titre: "Réseau d'alerte communautaire pour la surveillance des zoonoses en zone pastorale", revue: "Revue d'élevage et de médecine vétérinaire tropicale", annee: 2024 },
      { titre: "Couverture vaccinale du cheptel bovin et contraintes logistiques", revue: "Santé animale Sahel", annee: 2022 },
    ],
  },
];

const INNOVATIONS = [
  {
    nom: "Séchoir solaire indirect pour fruits et légumes",
    secteur: "Agroalimentaire",
    statut: "pilote",
    annee: 2024,
    ville: "N'Djaména",
    porteur: "Groupement de transformatrices Al-Amal",
    organisation: "Coopérative de transformation agroalimentaire",
    image: "/couvertures/agriculture.svg",
    aLaUne: true,
    chercheur: "Nadjita",
    resume:
      "Un séchoir en briques et tôles locales qui déshydrate mangues, tomates et oignons sans contact direct avec le soleil, préservant vitamines et couleur.",
    description:
      "Le séchoir repose sur un principe simple : l'air est chauffé dans un capteur solaire, puis circule par convection naturelle dans une chambre de séchage où les produits sont disposés sur des claies.\nCette séparation entre le capteur et la chambre évite le brunissement des fruits et divise par deux le temps de séchage par rapport au séchage à même le sol.\n## Ce que cela change\n- Les pertes post-récolte de mangues passent de 35 % à moins de 10 % sur la saison testée.\n- Le produit séché se conserve six mois et se vend hors saison à un prix trois fois supérieur.\n- L'ensemble est fabriqué avec des matériaux disponibles localement, pour un coût maîtrisé.\n## Prochaines étapes\nUne dizaine d'unités sont en test dans des groupements féminins. L'objectif est de publier les plans de construction en libre accès et de former des artisans-métalliers à leur fabrication.",
  },
  {
    nom: "Mini-réseau solaire à paiement à l'usage",
    secteur: "Énergie",
    statut: "pilote",
    annee: 2025,
    ville: "Moundou",
    porteur: "Unité de recherche en énergies renouvelables, Université de Moundou",
    organisation: "Université de Moundou",
    image: "/couvertures/energie.svg",
    aLaUne: true,
    chercheur: "Djimadoum",
    resume:
      "Un mini-réseau photovoltaïque de quartier, doté d'un compteur prépayé par carte, qui alimente foyers, échoppes et un centre de santé.",
    description:
      "L'installation combine un champ photovoltaïque, un parc de batteries dimensionné pour trois jours d'autonomie et un réseau basse tension desservant une centaine d'abonnés.\nChaque foyer dispose d'un compteur prépayé rechargeable par petites sommes, ce qui correspond aux rythmes de revenus des ménages.\n## Résultats du pilote\n- Douze heures d'électricité par jour en saison sèche, contre aucune auparavant.\n- Un centre de santé désormais capable de conserver des vaccins et d'assurer les accouchements de nuit.\n- Un taux de recouvrement supérieur à 90 % grâce au prépaiement.\nLe modèle est documenté pour être répliqué dans d'autres chefs-lieux de sous-préfecture.",
  },
  {
    nom: "Assistant vocal en arabe tchadien pour services publics",
    secteur: "Numérique",
    statut: "prototype",
    annee: 2025,
    ville: "Abéché",
    porteur: "Laboratoire d'informatique appliquée, INSTA Abéché",
    organisation: "Institut national supérieur des sciences et techniques d'Abéché",
    image: "/couvertures/numerique.svg",
    chercheur: "Ousmane",
    resume:
      "Un service téléphonique qui répond en arabe tchadien aux questions les plus courantes sur l'état civil, la scolarisation et la santé.",
    description:
      "Le prototype s'appuie sur un corpus audio collecté auprès de locuteurs de plusieurs régions, annoté par des étudiants.\nL'utilisateur appelle un numéro court, pose sa question oralement, et reçoit une réponse vocale préenregistrée correspondant à la démarche demandée.\n## Pourquoi c'est utile\nUne part importante de la population ne lit pas le français administratif. Le canal vocal, en langue véhiculaire, lève cette barrière sans exiger de smartphone ni de connexion internet.\n## État d'avancement\nLe corpus compte plusieurs dizaines d'heures d'enregistrements. Le modèle de reconnaissance atteint un taux d'erreur acceptable sur les formulations courantes ; les tests en conditions réelles doivent commencer avec une mairie partenaire.",
  },
  {
    nom: "Filtre à eau céramique à base d'argile locale",
    secteur: "Eau & assainissement",
    statut: "commercialise",
    annee: 2023,
    ville: "Bongor",
    porteur: "Atelier céramique du Mayo-Kebbi",
    organisation: "Petite entreprise artisanale",
    image: "/couvertures/eau.svg",
    resume:
      "Un filtre domestique en argile poreuse imprégnée d'argent colloïdal, qui rend potable l'eau de puits ou de mare pour une famille entière.",
    description:
      "Le filtre est moulé à partir d'argile locale mélangée à de la sciure de bois, dont la combustion à la cuisson crée la porosité.\nUn traitement à l'argent colloïdal complète l'action mécanique par un effet bactéricide.\n## Performance\n- Débit d'environ deux litres par heure, suffisant pour les besoins de boisson d'un ménage.\n- Réduction très nette de la charge bactérienne mesurée sur les eaux de surface testées.\n- Durée de vie de deux ans, avec un simple brossage périodique.\nL'atelier produit aujourd'hui plusieurs centaines d'unités par an et forme d'autres potiers à la technique.",
  },
  {
    nom: "Application de suivi de la transhumance",
    secteur: "Élevage",
    statut: "prototype",
    annee: 2024,
    ville: "Abéché",
    porteur: "Département de sociologie, Université Adam Barka",
    organisation: "Université Adam Barka d'Abéché",
    image: "/couvertures/industrie.svg",
    chercheur: "Béchir",
    resume:
      "Une application mobile hors ligne qui cartographie les couloirs de transhumance négociés et alerte sur les zones de tension.",
    description:
      "Les couloirs de passage du bétail sont relevés sur le terrain avec les comités locaux, puis intégrés dans une carte consultable sans connexion.\nÉleveurs et agriculteurs peuvent signaler un empiètement ou un incident, ce qui déclenche l'intervention des médiateurs coutumiers.\n## Ce que le prototype apporte\n- Une trace écrite et partagée d'accords jusqu'ici uniquement oraux.\n- Une information en amont sur l'état des couloirs pour les éleveurs en déplacement.\n- Des données agrégées utiles aux autorités pour anticiper les zones de friction.",
  },
  {
    nom: "Kit d'épidémiosurveillance pour auxiliaires d'élevage",
    secteur: "Santé animale",
    statut: "pilote",
    annee: 2024,
    ville: "N'Djaména",
    porteur: "Unité santé animale, IRED",
    organisation: "Institut de recherche en élevage pour le développement",
    image: "/couvertures/sante.svg",
    chercheur: "Zara",
    resume:
      "Un kit de terrain et une fiche de signalement par SMS permettant aux auxiliaires d'élevage de remonter en temps réel les suspicions de maladies.",
    description:
      "Le kit rassemble le matériel de prélèvement, un guide illustré de reconnaissance des signes cliniques et un formulaire de signalement par SMS codé.\nLes signalements alimentent un tableau de bord consulté par les services vétérinaires.\n## Intérêt\nDans les zones pastorales, le délai entre l'apparition des premiers cas et l'alerte officielle se comptait en semaines. Le dispositif vise à le réduire à quelques jours, ce qui change tout pour la maîtrise d'un foyer.",
  },
  {
    nom: "Briques en terre comprimée stabilisée",
    secteur: "Construction",
    statut: "commercialise",
    annee: 2022,
    ville: "N'Djaména",
    porteur: "Coopérative d'artisans bâtisseurs",
    organisation: "Coopérative de construction",
    image: "/couvertures/industrie.svg",
    resume:
      "Des briques pressées à partir de terre locale et d'un faible pourcentage de ciment, deux fois moins chères que le parpaing et bien plus fraîches.",
    description:
      "La presse manuelle produit des blocs réguliers qui se montent à joints minces, sans cuisson.\nL'inertie thermique de la terre abaisse la température intérieure de plusieurs degrés en saison chaude, réduisant le recours à la ventilation.\n## Adoption\nPlusieurs écoles et centres de santé ont été construits avec ces blocs. La coopérative forme des maçons et loue ses presses à des chantiers de quartier.",
  },
  {
    nom: "Plateforme de données ouvertes sur le bassin du lac Tchad",
    secteur: "Environnement",
    statut: "idee",
    annee: 2025,
    ville: "Sarh",
    porteur: "Laboratoire d'hydrologie, Université de Sarh",
    organisation: "Université de Sarh",
    image: "/couvertures/environnement.svg",
    chercheur: "Mariam",
    resume:
      "Un projet de portail rassemblant, en accès libre, les séries hydrologiques et les images satellitaires du bassin, harmonisées entre pays riverains.",
    description:
      "Les données existent, mais sont dispersées entre institutions et formats. Le projet consiste à les collecter, les harmoniser et les publier avec une documentation claire.\n## Ce qui est visé\n- Un accès libre pour les étudiants et chercheurs de la sous-région.\n- Des indicateurs simples suivis dans le temps : surface en eau, pluviométrie, niveau des nappes.\n- Une interopérabilité avec les portails régionaux existants.\nLe projet cherche un financement de démarrage et des partenaires institutionnels.",
  },
];

const ARTICLES = [
  {
    titre: "Un séchoir solaire conçu au Tchad divise par trois les pertes de mangues",
    categorie: "Agriculture & élevage",
    image: "/couvertures/agriculture.svg",
    aLaUne: true,
    jours: 2,
    tags: "post-récolte, solaire, agroalimentaire, femmes",
    chapo:
      "Testé par des groupements de transformatrices, un séchoir en matériaux locaux permet de conserver la production maraîchère six mois et de la vendre hors saison.",
    contenu:
      "Chaque saison, une part considérable de la récolte de mangues se perd faute de moyens de conservation. Le séchage à même le sol, encore courant, abîme le produit et n'offre aucune garantie sanitaire.\nLe dispositif mis au point sépare le capteur solaire de la chambre de séchage : l'air chauffé circule par convection naturelle autour des claies, sans exposition directe des fruits.\n## Des résultats mesurés sur une saison\nSur les unités suivies, les pertes sont passées de 35 % à moins de 10 %. Le produit séché se conserve environ six mois et se négocie hors saison à un prix nettement supérieur à celui du fruit frais.\n## Une technologie transférable\nLe séchoir est construit en briques et tôles disponibles sur les marchés locaux. L'équipe prépare la publication des plans en accès libre et la formation d'artisans-métalliers.\n> « Ce n'est pas une technologie compliquée. Ce qui compte, c'est qu'elle soit réparable ici, avec ce qu'on trouve ici. »",
  },
  {
    titre: "Électricité solaire : un mini-réseau de quartier éclaire un centre de santé à Moundou",
    categorie: "Énergie",
    image: "/couvertures/energie.svg",
    jours: 6,
    tags: "solaire, mini-réseau, santé, électrification rurale",
    chapo:
      "Cent foyers, plusieurs échoppes et un centre de santé sont désormais alimentés douze heures par jour grâce à une installation photovoltaïque à compteur prépayé.",
    contenu:
      "L'installation associe un champ photovoltaïque, un parc de batteries et un réseau basse tension. Chaque abonné dispose d'un compteur prépayé qu'il recharge par petites sommes.\n## Le prépaiement, clé de la viabilité\nLe modèle colle aux rythmes de revenus des ménages : on achète de l'électricité comme on achète du crédit téléphonique. Le taux de recouvrement dépasse 90 %, là où les systèmes à facturation mensuelle échouaient.\n## Un effet immédiat sur la santé\nLe centre de santé conserve désormais des vaccins et assure les accouchements de nuit sans lampe torche. C'est l'usage qui a le plus frappé les habitants.\nL'équipe documente le dimensionnement et les coûts afin que d'autres localités puissent répliquer l'expérience.",
  },
  {
    titre: "Reconnaissance vocale : un corpus ouvert en arabe tchadien voit le jour",
    categorie: "Numérique & IA",
    image: "/couvertures/numerique.svg",
    jours: 11,
    tags: "intelligence artificielle, langues, services publics, données ouvertes",
    chapo:
      "Des étudiants d'Abéché ont collecté et annoté des dizaines d'heures d'enregistrements pour entraîner un modèle capable de comprendre l'arabe tchadien.",
    contenu:
      "Les technologies vocales ignorent largement les langues peu dotées. L'arabe tchadien, pourtant véhiculaire, ne figure dans presque aucun jeu de données public.\n## Une collecte menée par des étudiants\nLe corpus a été constitué auprès de locuteurs de plusieurs régions, avec une attention portée à la diversité des accents et des tranches d'âge. Chaque enregistrement est transcrit et vérifié.\n## Un usage concret visé\nL'objectif n'est pas académique : il s'agit de permettre à une personne qui ne lit pas le français administratif d'obtenir, par simple appel téléphonique, la marche à suivre pour un acte de naissance ou une inscription scolaire.\n## Ouverture des données\nL'équipe prévoit de publier le corpus sous licence libre, condition pour que d'autres laboratoires et startups s'en saisissent.",
  },
  {
    titre: "Lac Tchad : vingt ans d'évolution des surfaces en eau cartographiés par satellite",
    categorie: "Environnement & climat",
    image: "/couvertures/environnement.svg",
    jours: 15,
    tags: "lac Tchad, télédétection, climat, hydrologie",
    chapo:
      "Une étude menée à l'Université de Sarh reconstitue, image après image, la variabilité des surfaces en eau du bassin et ses conséquences pour les riverains.",
    contenu:
      "L'analyse s'appuie sur deux décennies d'images satellitaires, retraitées pour distinguer eau libre, végétation aquatique et sols humides.\n## Une variabilité plus que un déclin linéaire\nLe travail montre une alternance marquée entre années sèches et années humides, plutôt qu'une disparition régulière. Cette variabilité, difficile à anticiper, est en soi un facteur de vulnérabilité pour les pêcheurs et les éleveurs.\n## Des données à partager\nLes séries produites restent aujourd'hui dispersées entre institutions. L'équipe plaide pour un portail commun aux pays riverains, condition d'une gestion partagée de la ressource.",
  },
  {
    titre: "Santé animale : des auxiliaires d'élevage signalent les foyers par SMS",
    categorie: "Santé",
    image: "/couvertures/sante.svg",
    jours: 21,
    tags: "une seule santé, zoonoses, élevage, surveillance",
    chapo:
      "Un kit de terrain et un formulaire SMS permettent de réduire de plusieurs semaines à quelques jours le délai d'alerte sur les maladies du bétail.",
    contenu:
      "Dans les zones pastorales, la distance et l'absence de couverture vétérinaire allongent considérablement le délai entre les premiers cas et l'alerte officielle.\n## Le dispositif\nChaque auxiliaire reçoit un guide illustré de reconnaissance des signes cliniques, le matériel de prélèvement et un code SMS simple pour transmettre un signalement.\n## Une logique « une seule santé »\nPlusieurs des maladies suivies sont transmissibles à l'homme. Surveiller le troupeau, c'est aussi protéger les familles qui vivent à son contact.\nLe pilote se poursuit avec l'objectif d'étendre le réseau aux régions frontalières, où circulent les troupeaux transhumants.",
  },
  {
    titre: "Sorgho : des variétés locales à l'épreuve de la sécheresse",
    categorie: "Agriculture & élevage",
    image: "/couvertures/agriculture.svg",
    jours: 28,
    tags: "sorgho, sélection variétale, sécheresse, Kanem",
    chapo:
      "Six variétés paysannes ont été comparées en conditions de déficit hydrique, avec des écarts de rendement qui vont du simple au double.",
    contenu:
      "Les essais, conduits avec des agriculteurs-expérimentateurs du Kanem et du Batha, portent sur des variétés déjà présentes dans les greniers, et non sur du matériel importé.\n## Pourquoi partir du local\nLes variétés paysannes sont adaptées aux sols et aux pratiques ; les sélectionner évite de bousculer les systèmes de culture existants et facilite l'adoption.\n## Résultats\nDeux variétés se détachent nettement en année sèche. Elles font désormais l'objet d'une multiplication semencière par les coopératives partenaires.\n## Suite des travaux\nL'équipe s'intéresse maintenant à la qualité nutritionnelle et aux usages culinaires, déterminants pour l'acceptation par les ménages.",
  },
  {
    titre: "Transhumance : cartographier les couloirs pour prévenir les conflits",
    categorie: "Vie universitaire",
    image: "/couvertures/industrie.svg",
    jours: 34,
    tags: "pastoralisme, médiation, foncier, cartographie",
    chapo:
      "Une équipe de sociologues relève avec les comités locaux les couloirs de passage négociés, jusqu'ici transmis uniquement à l'oral.",
    contenu:
      "Les accords qui organisent le passage des troupeaux entre les champs reposent sur la mémoire des anciens et sur des médiations coutumières. Leur fragilité apparaît dès qu'un litige survient.\n## Mettre par écrit sans figer\nLe travail consiste à relever les tracés avec les parties prenantes, puis à les restituer sous forme de cartes discutées en assemblée. L'écrit sert d'appui à la médiation, non de substitut.\n## Un outil consultable hors ligne\nLes tracés sont intégrés dans une application mobile fonctionnant sans connexion, avec possibilité de signaler un empiètement.\nLes premiers retours des comités de médiation sont encourageants, mais les chercheurs insistent : l'outil ne vaut que par la qualité du dialogue local qu'il accompagne.",
  },
  {
    titre: "Filtres en argile : de l'atelier de poterie à l'eau potable",
    categorie: "Santé",
    image: "/couvertures/eau.svg",
    jours: 41,
    tags: "eau potable, céramique, artisanat, santé",
    chapo:
      "Fabriqués à partir d'argile du Mayo-Kebbi, ces filtres domestiques réduisent fortement la charge bactérienne de l'eau de puits.",
    contenu:
      "Le principe est ancien : une argile rendue poreuse par la combustion de sciure lors de la cuisson, complétée par un traitement à l'argent colloïdal.\n## Une production locale\nL'atelier produit plusieurs centaines d'unités par an et forme d'autres potiers. Le filtre coûte l'équivalent de quelques journées de travail et dure environ deux ans.\n## Ce qu'il faut surveiller\nLa régularité de la cuisson conditionne la porosité, donc la performance. Un contrôle qualité simple, lot par lot, a été mis en place avec l'appui d'un laboratoire universitaire.",
  },
];

const EVENEMENTS = [
  {
    titre: "Journées nationales de la recherche scientifique",
    type: "conference",
    lieu: "Palais des arts et de la culture",
    ville: "N'Djaména",
    debut: 24,
    fin: 26,
    organisateur: "Ministère en charge de la recherche scientifique",
    image: "/couvertures/recherche.svg",
    description:
      "Trois journées de communications, d'ateliers et de tables rondes réunissant les laboratoires universitaires et les instituts de recherche du pays.\nLes travaux d'étudiants en master et en doctorat font l'objet d'une session de posters dédiée.\nL'inscription est gratuite pour les étudiants sur présentation d'une carte.",
  },
  {
    titre: "Hackathon « Données ouvertes pour le Sahel »",
    type: "hackathon",
    lieu: "Campus universitaire",
    ville: "N'Djaména",
    debut: 12,
    fin: 13,
    organisateur: "Réseau des développeurs tchadiens",
    image: "/couvertures/numerique.svg",
    description:
      "Quarante-huit heures pour concevoir un service utile à partir de jeux de données publiques : climat, santé, transport, agriculture.\nLes équipes sont composées de trois à cinq personnes, avec au moins un profil non technique.\nUn accompagnement post-hackathon est proposé aux trois meilleurs projets.",
  },
  {
    titre: "Atelier de formation à la rédaction scientifique",
    type: "atelier",
    lieu: "Université de Moundou",
    ville: "Moundou",
    debut: 40,
    fin: 42,
    organisateur: "Université de Moundou",
    image: "/couvertures/recherche.svg",
    description:
      "Un atelier pratique destiné aux doctorants : structurer un article, choisir une revue, répondre aux relecteurs, éviter les revues prédatrices.\nChaque participant vient avec un manuscrit en cours, travaillé tout au long de la session.",
  },
  {
    titre: "Salon de l'innovation et de l'entrepreneuriat",
    type: "salon",
    lieu: "Centre d'exposition",
    ville: "N'Djaména",
    debut: 68,
    fin: 70,
    organisateur: "Incubateurs et chambre de commerce",
    image: "/couvertures/industrie.svg",
    description:
      "Stands de porteurs de projets, démonstrations de prototypes et rencontres avec des financeurs.\nUn espace est réservé aux innovations issues des laboratoires universitaires cherchant un partenaire industriel.",
  },
  {
    titre: "Colloque sur la gestion intégrée du bassin du lac Tchad",
    type: "conference",
    lieu: "Université de Sarh",
    ville: "Sarh",
    debut: -25,
    fin: -23,
    organisateur: "Université de Sarh et partenaires régionaux",
    image: "/couvertures/environnement.svg",
    description:
      "Chercheurs et gestionnaires des pays riverains ont confronté leurs données sur l'évolution du bassin et discuté d'un cadre commun de partage.\nLes actes du colloque sont en cours de publication.",
  },
];

const OPPORTUNITES = [
  {
    titre: "Appel à projets de recherche appliquée — édition en cours",
    type: "appel",
    organisme: "Fonds national d'appui à la recherche",
    jours: 45,
    montant: "Jusqu'à 15 000 000 FCFA par projet",
    lien: "",
    description:
      "Cet appel finance des projets de recherche appliquée répondant à un besoin identifié : agriculture, santé, énergie, eau, numérique.\n## Qui peut candidater\n- Équipes rattachées à un établissement d'enseignement supérieur ou à un institut de recherche du pays.\n- Consortiums associant un laboratoire et une structure utilisatrice (coopérative, entreprise, service public).\n## Dossier attendu\n- Une note de problème de trois pages maximum.\n- Un budget détaillé et un calendrier sur dix-huit mois.\n- Une lettre d'engagement du partenaire utilisateur.",
  },
  {
    titre: "Bourses de master et de doctorat en sciences de l'ingénieur",
    type: "bourse",
    organisme: "Programme régional de mobilité universitaire",
    jours: 20,
    montant: "Allocation mensuelle + frais de scolarité",
    lien: "",
    description:
      "Bourses destinées aux étudiants souhaitant poursuivre un master ou un doctorat dans un établissement de la sous-région.\n## Critères\n- Moins de 32 ans pour le master, moins de 38 ans pour le doctorat.\n- Mention bien au diplôme précédent.\n- Projet de recherche en lien avec les priorités nationales de développement.\nLes candidatures féminines sont particulièrement encouragées.",
  },
  {
    titre: "Prix de la jeune innovatrice et du jeune innovateur",
    type: "prix",
    organisme: "Réseau des incubateurs",
    jours: 12,
    montant: "Dotation de 3 000 000 FCFA et six mois d'accompagnement",
    lien: "",
    description:
      "Le prix distingue un prototype fonctionnel conçu au Tchad par une personne de moins de 35 ans.\n## Ce qui est évalué\n- L'utilité concrète et la preuve d'usage sur le terrain.\n- Le caractère reproductible et le coût de fabrication.\n- La capacité de l'équipe à passer à l'échelle.\nLe dossier comprend une vidéo de démonstration de trois minutes.",
  },
  {
    titre: "Financement d'équipements de laboratoire",
    type: "financement",
    organisme: "Programme d'appui à l'enseignement supérieur",
    jours: 75,
    montant: "Enveloppe de 50 000 000 FCFA à répartir",
    lien: "",
    description:
      "Ce guichet cofinance l'acquisition d'équipements scientifiques mutualisés entre plusieurs laboratoires.\n## Condition principale\nL'équipement doit être accessible à au moins trois équipes de recherche distinctes, avec une charte d'utilisation partagée et un responsable de plateau technique désigné.",
  },
  {
    titre: "Appel à communications — revue régionale de recherche appliquée",
    type: "appel",
    organisme: "Comité éditorial de la revue",
    jours: -8,
    montant: "",
    lien: "",
    description:
      "Numéro thématique consacré aux innovations frugales en contexte sahélien.\nLes soumissions closes seront évaluées en double aveugle ; les auteurs recevront une réponse sous deux mois.",
  },
];

async function main() {
  // Garde-fou : ce script est lancé à chaque déploiement (vercel-build).
  // Si la base contient déjà un compte, elle est considérée comme vivante
  // et on ne touche à rien — sauf si FORCE_SEED=1 est passé explicitement.
  const dejaPeuplee = (await prisma.utilisateur.count()) > 0;
  if (dejaPeuplee && process.env.FORCE_SEED !== "1") {
    console.log("Base déjà peuplée : aucun changement (utilisez FORCE_SEED=1 pour repartir de zéro).");
    return;
  }

  console.log("Nettoyage de la base…");
  await prisma.publication.deleteMany();
  await prisma.innovation.deleteMany();
  await prisma.article.deleteMany();
  await prisma.chercheur.deleteMany();
  await prisma.categorie.deleteMany();
  await prisma.evenement.deleteMany();
  await prisma.opportunite.deleteMany();
  await prisma.soumission.deleteMany();
  await prisma.abonne.deleteMany();

  console.log("Compte administrateur…");
  const email = (process.env.ADMIN_EMAIL ?? "admin@innovtchad.td").toLowerCase();
  const motDePasse = process.env.ADMIN_PASSWORD ?? "admin1234";
  await prisma.utilisateur.upsert({
    where: { email },
    update: { motDePasseHash: await hash(motDePasse, 10) },
    create: {
      email,
      nom: "Rédaction Innov'Tchad",
      motDePasseHash: await hash(motDePasse, 10),
      role: "admin",
    },
  });

  console.log("Rubriques…");
  const categories = new Map<string, string>();
  for (const c of CATEGORIES) {
    const cree = await prisma.categorie.create({
      data: { ...c, slug: slugifier(c.nom) },
    });
    categories.set(c.nom, cree.id);
  }

  console.log("Chercheurs et publications…");
  const chercheurs = new Map<string, string>();
  for (const c of CHERCHEURS) {
    const { publications, ...donnees } = c;
    const cree = await prisma.chercheur.create({
      data: { ...donnees, slug: slugifier(`${c.prenom} ${c.nom}`) },
    });
    chercheurs.set(c.prenom, cree.id);
    for (const p of publications) {
      await prisma.publication.create({ data: { ...p, chercheurId: cree.id } });
    }
  }

  console.log("Innovations…");
  for (const i of INNOVATIONS) {
    const { chercheur, ...donnees } = i;
    await prisma.innovation.create({
      data: {
        ...donnees,
        slug: slugifier(i.nom),
        chercheurId: chercheur ? chercheurs.get(chercheur) ?? null : null,
      },
    });
  }

  console.log("Articles…");
  for (const a of ARTICLES) {
    const { categorie, jours, ...donnees } = a;
    await prisma.article.create({
      data: {
        ...donnees,
        slug: slugifier(a.titre),
        publieLe: ilYA(jours),
        auteur: "La rédaction",
        categorieId: categories.get(categorie) ?? null,
        vues: Math.floor(50 + jours * 7),
      },
    });
  }

  console.log("Événements…");
  for (const e of EVENEMENTS) {
    const { debut, fin, ...donnees } = e;
    await prisma.evenement.create({
      data: {
        ...donnees,
        slug: slugifier(e.titre),
        dateDebut: dans(debut),
        dateFin: dans(fin),
      },
    });
  }

  console.log("Opportunités…");
  for (const o of OPPORTUNITES) {
    const { jours, ...donnees } = o;
    await prisma.opportunite.create({
      data: {
        ...donnees,
        slug: slugifier(o.titre),
        dateLimite: dans(jours),
        montant: o.montant || null,
        lien: o.lien || null,
      },
    });
  }

  console.log("Propositions de démonstration…");
  await prisma.soumission.createMany({
    data: [
      {
        type: "innovation",
        nomContact: "Exemple — Coopérative maraîchère",
        email: "contact@exemple.td",
        titre: "Presse à huile de sésame manuelle",
        message:
          "Nous avons mis au point une presse manuelle qui permet d'extraire l'huile de sésame sans moteur. Nous aimerions la faire connaître aux autres groupements.",
        statut: "nouveau",
      },
      {
        type: "chercheur",
        nomContact: "Exemple — Laboratoire universitaire",
        email: "labo@exemple.td",
        titre: "Ajout du profil d'un enseignant-chercheur en chimie",
        message:
          "Nous souhaitons référencer un enseignant-chercheur travaillant sur la valorisation des plantes médicinales locales. Nous pouvons fournir sa biographie et sa liste de publications.",
        statut: "en_cours",
      },
    ],
  });

  console.log("✅ Base peuplée avec le jeu de démonstration.");
  console.log(`   Connexion administration : ${email} / ${motDePasse}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
