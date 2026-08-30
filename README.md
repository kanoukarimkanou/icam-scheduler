# ICAM Scheduler — 100% gratuit & serverless

Architecture :
- **Base de données** : Supabase Postgres (plan Free)
- **Authentification** : Firebase Auth (plan Spark / gratuit)
- **Frontend** : React + Vite, hébergé sur Firebase Hosting (gratuit)
- **Moteur de planification** : Supabase Edge Function (TypeScript/Deno)
- **Anti-pause & sauvegardes** : GitHub Actions

> ⚠️ **"Gratuit" ne veut pas dire "illimité".** Le plan Free de Supabase (500 Mo de base,
> projet mis en pause après ~1 semaine d'inactivité — d'où le workflow anti-pause) et le
> plan Spark de Firebase (jusqu'à 50k utilisateurs actifs/mois en Auth, quota de bande
> passante Hosting) restent largement suffisants pour un usage type établissement scolaire
> (quelques centaines d'étudiants/chefs de projet), mais ont des plafonds. Si l'usage
> grossit beaucoup, il faudra passer sur un plan payant chez l'un ou l'autre fournisseur.

---

## Prérequis

- Un compte [Supabase](https://supabase.com) (gratuit, connexion via GitHub ou email).
- Un compte [Google/Firebase](https://console.firebase.google.com) (gratuit).
- [Node.js](https://nodejs.org) 18+ et npm installés localement.
- [Git](https://git-scm.com/) et un compte GitHub (pour l'anti-pause et les backups automatiques).
- `npm install -g firebase-tools supabase` pour les CLI de déploiement (voir étapes 3 et 4).

---

## Étape 1 — Créer et configurer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) → **New Project**.
   - Choisissez une région proche de vos utilisateurs (ex. `eu-west-1` pour la France).
   - Notez le **mot de passe de base de données** que vous définissez ici : vous en aurez
     besoin pour les backups (étape 6).
2. Une fois le projet créé, ouvrez le menu **SQL Editor** (icône `</>` dans la barre latérale).
3. Créez une nouvelle requête, collez tout le contenu du fichier `supabase/schema.sql` de
   ce projet, puis cliquez sur **Run**. Cela crée les 9 tables (`users`, `chefs_de_projet`,
   `etudiants`, `selections`, `disponibilite_binaire_chefprojet`,
   `disponibilite_binaire_etudiant`, `rendez_vous`, `evaluations`, `affectation`) avec RLS
   activée et une policy d'accès permissive (voir la section "Sécurité" plus bas).
4. Allez dans **Project Settings → API**. Notez :
   - **Project URL** → deviendra `VITE_SUPABASE_URL` et `SUPABASE_URL`.
   - **anon public key** → deviendra `VITE_SUPABASE_ANON_KEY` et `SUPABASE_ANON_KEY`.
   - **service_role key** → à garder **strictement secrète**, ne jamais la mettre dans le
     frontend ; elle ne sert que côté Edge Function (étape 3).
5. Allez dans **Project Settings → Database → Connection info**. Notez le **Host**
   (ex. `db.xxxxxxxx.supabase.co`) : il servira pour les backups (étape 6).
6. (Optionnel mais recommandé) Importez vos données de départ — la liste des chefs de
   projet et des étudiants — toujours via le SQL Editor :

   ```sql
   INSERT INTO chefs_de_projet (nom, specialite, email) VALUES
     ('Toufik Guettari', 'IoT', 'toufik.guettari@icam.fr'),
     ('Eric Loupiac', 'Mécanique', 'eric.loupiac@icam.fr');

   INSERT INTO etudiants (nom, prenom, adresse_email, parcours) VALUES
     ('Dupont', 'Jean', 'jean.dupont@eleve.icam.fr', 'I2026'),
     ('Martin', 'Alice', 'alice.martin@eleve.icam.fr', 'I2026');
   ```

   L'`adresse_email` d'un étudiant doit correspondre **exactement** à l'email avec lequel
   il se connectera (Firebase Auth), sinon `SelectionPage` ne retrouvera pas son profil.

---

## Étape 2 — Créer et configurer le projet Firebase

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com) →
   **Ajouter un projet**. Vous pouvez désactiver Google Analytics (pas nécessaire ici).
2. Dans le menu **Build → Authentication**, cliquez sur **Get started**, puis dans
   l'onglet **Sign-in method**, activez le fournisseur **Email/Mot de passe**.
3. Dans **Project Settings** (icône ⚙️ en haut à gauche) → onglet **General**, descendez
   jusqu'à "Your apps" et cliquez sur l'icône Web `</>` pour enregistrer une nouvelle
   application web. Donnez-lui un nom (ex. "icam-scheduler-web") ; vous n'avez pas besoin
   de configurer Firebase Hosting à cet instant, on le fera en CLI.
4. Firebase affiche un objet `firebaseConfig` : notez `apiKey`, `authDomain`, `projectId`,
   `storageBucket`, `messagingSenderId`, `appId` — ils vont dans `frontend/.env`.
5. Toujours dans **Project Settings → General**, notez le **Project ID** (pas le nom
   affiché, l'identifiant technique, ex. `icam-scheduler-a1b2c3`).
6. Ouvrez `.firebaserc` à la racine du projet et remplacez la valeur par ce Project ID :

   ```json
   {
     "projects": {
       "default": "icam-scheduler-a1b2c3"
     }
   }
   ```

---

## Étape 3 — Déployer l'Edge Function (moteur de planification)

Cette fonction tourne côté Supabase (Deno), vérifie que l'appelant est bien authentifié
via un token Firebase valide, puis calcule et enregistre les rendez-vous.

```bash
npm install -g supabase
supabase login
cd icam-scheduler
supabase link --project-ref <VOTRE_PROJECT_REF>          # trouvé dans l'URL du dashboard Supabase
supabase secrets set FIREBASE_PROJECT_ID=<VOTRE_FIREBASE_PROJECT_ID>
supabase functions deploy generer-rendez-vous
```

- `<VOTRE_PROJECT_REF>` : visible dans l'URL de votre projet Supabase
  (`https://supabase.com/dashboard/project/<PROJECT_REF>`) ou dans **Project Settings → General**.
- `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont automatiquement disponibles dans
  l'environnement des Edge Functions, vous n'avez pas besoin de les définir manuellement.
- Une fois déployée, la fonction est accessible sur :
  `https://<PROJECT_REF>.supabase.co/functions/v1/generer-rendez-vous`
  (déjà câblé dans `frontend/src/services/supabase.js` via `VITE_SUPABASE_URL`).

Pour tester rapidement sans frontend :

```bash
curl -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/generer-rendez-vous" \
  -H "Authorization: Bearer <UN_TOKEN_FIREBASE_VALIDE>" \
  -H "Content-Type: application/json" \
  -d '{"date_debut":"2026-09-01","date_fin":"2026-09-05"}'
```

---

## Étape 4 — Configurer et déployer le frontend

```bash
cd frontend
cp .env.example .env
```

Remplissez `.env` avec les valeurs récupérées aux étapes 1 et 2 :

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=...

VITE_ADMIN_EMAIL=admin.pse@icam.fr
```

Testez en local :

```bash
npm install
npm run dev
```

Ouvrez `http://localhost:5173`, créez un compte via "Créer un compte" avec l'email défini
dans `VITE_ADMIN_EMAIL` pour accéder aux pages d'administration
(Disponibilités / Affectations / Évaluations), ou avec un email d'étudiant déjà présent
dans la table `etudiants` pour accéder à "Mes vœux".

Une fois satisfait, construisez et déployez sur Firebase Hosting :

```bash
npm run build
cd ..                          # retour à la racine du projet (là où se trouve firebase.json)
firebase login
firebase deploy --only hosting
```

L'application sera disponible sur `https://<votre-projet>.web.app` (et
`https://<votre-projet>.firebaseapp.com`).

> Si vous préférez un nom de domaine personnalisé, ajoutez-le dans **Firebase Console →
> Hosting → Ajouter un domaine personnalisé** après ce premier déploiement.

---

## Étape 5 — Créer le compte administrateur et les premiers utilisateurs

1. Sur le site déployé, allez sur `/register` et créez un compte avec l'email défini
   dans `VITE_ADMIN_EMAIL`. Ce compte aura automatiquement accès aux pages
   Disponibilités / Affectations / Évaluations (voir `AuthContext.jsx`).
2. Chaque étudiant crée ensuite son propre compte via `/register`, avec l'email exact
   présent dans la table `etudiants` (sinon `SelectionPage` ne retrouvera pas son profil —
   un message d'erreur l'indique clairement dans l'app).
3. Les chefs de projet n'ont pas besoin de compte pour cette version : c'est
   l'administrateur qui saisit leurs disponibilités via la page **Disponibilités**. Si vous
   voulez qu'ils se connectent eux-mêmes, il faudrait étendre `AuthContext.jsx` pour
   distinguer un rôle "chef de projet" (actuellement seul `is_staff`/`VITE_ADMIN_EMAIL`
   existe).

---

## Étape 6 — Activer les workflows GitHub Actions (anti-pause & backups)

1. Poussez ce dépôt sur GitHub, de préférence en **privé** (le schéma et les workflows
   révèlent la structure de vos données).

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<votre-compte>/icam-scheduler.git
   git push -u origin main
   ```

2. Dans GitHub, allez dans **Settings → Secrets and variables → Actions → New repository
   secret** et ajoutez :
   - `SUPABASE_URL` → l'URL de votre projet (étape 1)
   - `SUPABASE_ANON_KEY` → la clé anonyme (étape 1)
   - `SUPABASE_DB_HOST` → l'hôte de connexion Postgres (étape 1, ex. `db.xxxx.supabase.co`)
   - `SUPABASE_DB_PASSWORD` → le mot de passe DB défini à la création du projet Supabase
3. `.github/workflows/keep-alive.yml` s'exécute tous les 5 jours et ping l'API REST
   Supabase pour empêcher la mise en pause automatique du projet Free (qui survient après
   ~7 jours sans activité).
4. `.github/workflows/backup.yml` s'exécute chaque dimanche à 2h UTC, fait un `pg_dump`
   complet de la base et le commit dans le dossier `backups/` du dépôt.
5. Vous pouvez déclencher ces workflows manuellement à tout moment depuis l'onglet
   **Actions** de GitHub (bouton "Run workflow") pour vérifier que tout fonctionne avant
   d'attendre le premier déclenchement automatique.

---

## Comptes et rôles

- Le rôle **administrateur** (accès à Disponibilités, Affectations, Évaluations) est
  déterminé par l'email défini dans `VITE_ADMIN_EMAIL` (par défaut `admin.pse@icam.fr`).
  Modifiez cette variable dans `frontend/.env` selon vos besoins, ou étendez
  `AuthContext.jsx` pour gérer une vraie liste d'administrateurs via la colonne
  `is_staff` de la table `users`.
- Les autres comptes sont considérés comme étudiants et accèdent à "Mes vœux" et
  "Mes rendez-vous".

## Sécurité — Row Level Security (RLS)

Le schéma active RLS sur toutes les tables mais avec une policy `"Public access"`
permissive (`USING (true) WITH CHECK (true)`), adaptée à un déploiement interne où la clé
`anon` reste dans le navigateur mais n'est jamais rendue publique en dehors de
l'application. Pour un usage plus strict (ex. empêcher un étudiant de modifier les
sélections d'un autre via les DevTools du navigateur), il est recommandé de :

1. Configurer Supabase pour accepter les JWT Firebase (Authentication → Third-Party Auth,
   fonctionnalité disponible sur les projets Supabase récents), ou
2. Remplacer les policies `"Public access"` par des règles ciblées, par exemple limiter
   les écritures sur `selections` à la ligne dont `etudiant_id` correspond à l'utilisateur
   courant (`auth.jwt() ->> 'email'`).

C'est un chantier à part entière et dépend de la sensibilité réelle de vos données ; pour
un usage pédagogique interne à un établissement, la policy permissive actuelle est un
compromis raisonnable en échange de simplicité.

---

## Structure du projet

```
icam-scheduler/
├── .firebaserc
├── firebase.json
├── .gitignore
├── README.md
├── .github/workflows/
│   ├── keep-alive.yml
│   └── backup.yml
├── supabase/
│   ├── schema.sql
│   └── functions/generer-rendez-vous/
│       ├── index.ts
│       └── scheduler.ts
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── services/
        │   ├── firebase.js
        │   ├── supabase.js
        │   └── useRealtimeRendezVous.js
        ├── context/
        │   └── AuthContext.jsx
        └── components/
            ├── Navbar.jsx
            ├── LoginForm.jsx
            ├── RegisterForm.jsx
            ├── ProtectedRoute.jsx
            ├── SelectionPage.jsx          (étudiant : vœux)
            ├── DisponibilitesPage.jsx     (admin : grille de créneaux)
            ├── RendezVousPage.jsx         (liste + génération du planning)
            ├── ProjectAssignment.jsx      (admin : affectation finale)
            └── EvaluationsTable.jsx       (admin : notes, radar chart, export Excel)
```

## Pages de l'application

| Route | Accès | Rôle |
|---|---|---|
| `/` | public | Connexion |
| `/register` | public | Création de compte |
| `/selectionpage` | connecté | Étudiant : sélectionne ses vœux de chef de projet |
| `/rendez-vous` | connecté | Liste des rendez-vous (admin : tous + génération ; étudiant : les siens) |
| `/disponibilites` | admin | Saisie des créneaux libres/occupés par chef de projet et par date |
| `/ProjectAssignment` | admin | Affectation finale étudiant ↔ chef de projet |
| `/evaluations` | admin | Notation par chef de projet, radar chart par étudiant, export Excel |

## Ce qui reste à personnaliser

- **Import initial** des étudiants/chefs de projet (voir étape 1.6 ci-dessus).
- **RLS plus strict** si nécessaire (voir section Sécurité ci-dessus).
- **Rôle "chef de projet"** dédié si vous souhaitez qu'ils saisissent eux-mêmes leurs
  disponibilités plutôt que de passer par l'administrateur (actuellement seul le rôle
  administrateur existe dans `AuthContext.jsx`).



