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

Prérequis : Node.js 20 ou plus, et une base PostgreSQL (locale ou hébergée).

```bash
npm install
cp .env.example .env      # puis renseignez DATABASE_URL et les autres valeurs
npm run db:push           # applique le schéma à la base
npm run db:seed           # jeu de démonstration + compte administrateur
npm run dev               # http://localhost:3000
```

Pour créer rapidement une base locale sur un poste où PostgreSQL est installé :

```bash
sudo -u postgres psql -c "CREATE ROLE innov LOGIN PASSWORD 'innov';"
sudo -u postgres createdb -O innov innovtchad
# DATABASE_URL="postgresql://innov:innov@127.0.0.1:5432/innovtchad"
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
Tailwind CSS 4, Prisma et PostgreSQL.

## Mise en production

### Déploiement sur Vercel

1. **Créer la base** : dans le projet Vercel, onglet **Storage → Create Database → Neon
   (Postgres)**. La variable `DATABASE_URL` est ajoutée automatiquement au projet.
2. **Ajouter les autres variables** (Settings → Environment Variables) :
   - `SESSION_SECRET` : une valeur aléatoire (`openssl rand -hex 32`) — obligatoire ;
   - `NEXT_PUBLIC_SITE_URL` : l'URL publique, par ex. `https://innovtchad.vercel.app`.
3. **Redéployer** (Deployments → ⋯ → Redeploy). Le script `vercel-build` applique
   automatiquement le schéma à la base (`prisma db push`) avant de construire le site.
4. **Peupler la base une seule fois**, depuis votre machine, avec l'URL de la base Vercel
   (copiez la valeur de `DATABASE_URL` depuis l'onglet Storage) :

   ```bash
   DATABASE_URL="postgresql://…neon.tech/…" ADMIN_PASSWORD="un-vrai-mot-de-passe" npm run db:seed
   ```

   ⚠️ Le script de peuplement **vide la base** avant d'insérer le jeu de démonstration :
   ne le relancez jamais sur une base contenant de vrais contenus.

### Autres hébergeurs

Tout hébergeur Node.js convient (VPS, Render, Railway, Fly.io) : fournissez une base
PostgreSQL, définissez les variables ci-dessous, puis `npm run build && npm run start`.

### Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Connexion PostgreSQL |
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
