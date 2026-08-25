# Innov'Tchad

**Espace d'actualité et de valorisation de l'innovation et de la recherche scientifique au Tchad.**

Une plateforme web qui rassemble en un seul endroit : le fil d'actualité scientifique du pays,
un annuaire des chercheuses et chercheurs, une vitrine des innovations, l'agenda des événements
et la veille des appels à projets, bourses et financements — le tout administrable depuis un
espace de rédaction intégré.

---

## Ce que contient la plateforme

### Site public

| Section | Chemin | Contenu |
| --- | --- | --- |
| Accueil | `/` | Une, derniers articles, innovations et chercheurs mis en avant, agenda, opportunités, chiffres clés |
| Actualités | `/actualites` | Fil d'actualité filtrable par rubrique, avec pagination et pages d'article |
| Annuaire des chercheurs | `/chercheurs` | Recherche plein texte, filtre par domaine, fiches détaillées avec publications et contacts |
| Innovations | `/innovations` | Filtres par secteur et par niveau de maturité (idée → commercialisé), fiches projet |
| Événements | `/evenements` | Agenda séparant les rendez-vous à venir des éditions passées |
| Opportunités | `/opportunites` | Appels à projets, bourses, financements et prix, avec dates limites |
| Recherche globale | `/recherche` | Recherche transversale sur les quatre types de contenus |
| À propos | `/a-propos` | Présentation du projet et des missions |
| Contribuer | `/contribuer` | Formulaire public de proposition de contenu |

S'y ajoutent une page 404, un `sitemap.xml` et un `robots.txt` générés automatiquement,
ainsi que les métadonnées Open Graph par page.

### Espace de rédaction (`/admin`)

Authentification par session signée (cookie `httpOnly`), puis gestion complète de :
articles, chercheurs, publications, innovations, événements, opportunités, rubriques et
propositions reçues du public.

Les formulaires d'administration sont générés à partir d'une seule description déclarative
(`src/lib/ressources.ts`) : ajouter un champ à un contenu se fait en ajoutant une entrée dans
ce fichier et dans le schéma Prisma, sans écrire de nouvelle page.

L'espace propose également : génération automatique des slugs (avec gestion des doublons),
bascule publié / brouillon en un clic, prévisualisation du rendu public et suppression protégée.

---

## Démarrage

Prérequis : Node.js 20 ou plus.

```bash
npm install
cp .env.example .env      # puis ajustez les valeurs
npm run db:push           # crée la base SQLite
npm run db:seed           # jeu de démonstration + compte administrateur
npm run dev               # http://localhost:3000
```

Identifiants de l'espace de rédaction créés par le peuplement (modifiables dans `.env`) :

```
admin@innovtchad.td / admin1234
```

> ⚠️ Changez ce mot de passe avant toute mise en ligne, et renseignez un `SESSION_SECRET`
> aléatoire (`openssl rand -hex 32`).

### Scripts disponibles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Génération du client Prisma puis build de production |
| `npm run start` | Serveur de production |
| `npm run db:push` | Applique le schéma Prisma à la base |
| `npm run db:seed` | Remplit la base avec le jeu de démonstration |
| `npm run db:studio` | Explorateur graphique de la base |

---

## À propos du jeu de démonstration

⚠️ **Les contenus créés par `npm run db:seed` sont fictifs.** Les institutions citées
(universités de N'Djaména, Moundou, Sarh, Abéché, ITRAD, IRED…) existent bien, mais les
personnes, projets, articles, événements et appels à candidatures sont **inventés** pour
illustrer le fonctionnement de la plateforme.

Remplacez-les par des contenus réels et vérifiés avant toute mise en ligne. Les adresses
e-mail de démonstration utilisent volontairement le domaine `@demo.td`.

---

## Architecture

```
prisma/
  schema.prisma          Modèle de données (9 tables)
  seed.ts                Jeu de démonstration
public/couvertures/      Images de couverture SVG générées, par thématique
src/
  app/
    (site)/              Site public (en-tête + pied de page communs)
    admin/               Espace de rédaction
      actions.ts         Actions serveur (authentification et CRUD)
      [ressource]/       Liste, création et modification génériques
    actions.ts           Actions publiques (newsletter, contribution)
    layout.tsx           Enveloppe HTML racine
    sitemap.ts / robots.ts
  components/            En-tête, pied de page, cartes, primitives d'interface
  lib/
    db.ts                Client Prisma partagé
    auth.ts              Sessions signées HMAC + hachage bcrypt
    ressources.ts        Description déclarative des contenus administrables
    relations.ts         Chargement des listes de valeurs liées
    utils.ts             Slugs, dates en français, libellés
```

**Pile technique :** Next.js 15 (App Router, React 19, Server Actions), TypeScript,
Tailwind CSS 4, Prisma et SQLite.

## Mise en production

### Base de données

SQLite convient à un hébergement sur serveur unique avec disque persistant (VPS, Render,
Railway, Fly.io). Pour un hébergement sans état comme Vercel, basculez sur PostgreSQL :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

puis `npx prisma migrate dev --name init` et redéployez. Aucun autre changement de code
n'est nécessaire.

### Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Connexion à la base |
| `SESSION_SECRET` | Signature des cookies de session — **obligatoire en production** |
| `NEXT_PUBLIC_SITE_URL` | URL publique, utilisée par le sitemap et les métadonnées |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte créé par le script de peuplement |

---

## Pistes d'évolution

- Téléversement d'images depuis l'espace de rédaction (aujourd'hui : URL ou fichier dans `public/`)
- Envoi effectif de la lettre d'information aux adresses collectées
- Comptes à droits différenciés (rédacteur / relecteur / administrateur)
- Version anglaise et arabe des pages publiques
- Flux RSS du fil d'actualité
