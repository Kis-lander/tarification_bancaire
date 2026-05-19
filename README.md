# Tarification bancaire

Portail institutionnel de centralisation, validation et publication des tarifs bancaires.

Cette application permet aux banques de soumettre leurs frais de services à la BCC, qui les contrôle et les homologue, puis au public de consulter des tarifs fiables, comparables et historisés.

## Objectif

Le projet répond à un besoin de transparence tarifaire dans le secteur bancaire. Il met en place un circuit clair :

1. Les banques déclarent leurs tarifs et leurs agences.
2. La BCC examine les soumissions et approuve ou rejette les demandes.
3. Les tarifs approuvés deviennent visibles dans le portail public.
4. Les utilisateurs peuvent comparer les banques, consulter l'historique des prix et localiser les agences.

## Fonctionnalités principales

### Portail public

- Consultation du répertoire des banques actives.
- Comparaison des tarifs approuvés par banque et par service.
- Classement des banques selon le coût total des services sélectionnés.
- Historique des tarifs validés pour suivre leur évolution.
- Visualisation des agences bancaires sur une carte.
- Tableau d'analyse de l'évolution des frais bancaires.

### Espace banque

- Authentification des comptes rattachés à une banque.
- Gestion du profil de la banque.
- Création, modification et suppression des agences.
- Soumission de tarifs pour les services bancaires actifs.
- Suivi des tarifs approuvés et des demandes en attente.
- Mise à jour d'une demande de tarif tant qu'elle reste en attente.

### Espace BCC

- Authentification séparée des utilisateurs BCC.
- Création et gestion des banques.
- Gestion du catalogue des services bancaires.
- Gestion des comptes utilisateurs banque.
- Validation ou rejet des demandes d'inscription banque.
- Validation ou rejet des tarifs soumis par les banques.
- Notifications internes pour les demandes en attente.
- Envoi d'e-mails de décision aux banques.

## Workflow métier

```text
Banque -> soumet un tarif -> statut PENDING
BCC -> examine la demande -> APPROVED ou REJECTED
Public -> consulte uniquement les tarifs APPROVED
```

Les comparaisons, historiques et analyses s'appuient uniquement sur les tarifs validés par la BCC.

## Stack technique

- **Framework backend** : AdonisJS
- **Langage** : TypeScript
- **Moteur de vues** : Edge
- **Base de données** : PostgreSQL
- **ORM** : Lucid
- **Authentification** : Adonis Auth, avec gardes séparés pour les comptes banque et BCC
- **Frontend** : Vite, Tailwind CSS, Alpine.js
- **Cartographie** : Leaflet
- **Tests** : Japa

## Prérequis

- Node.js `>= 24`
- npm
- PostgreSQL

## Installation

```bash
npm install
```

Créer ensuite un fichier `.env` à partir de `.env.example`, puis renseigner les variables propres à l'environnement local.

Exemple minimal :

```env
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development
LOG_LEVEL=info
APP_KEY=your_app_key
APP_URL=http://localhost:3333

SESSION_DRIVER=cookie
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=tarification_db

MAIL_MAILER=smtp
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@example.com
MAIL_FROM_NAME="Banque Centrale du Congo"

BCC_SEED_EMAIL=bcc@tarification.cd
BCC_SEED_PASSWORD=BccSecure123!
```

> Ne pas utiliser de vrais secrets dans les fichiers versionnés. Les clés, mots de passe et identifiants SMTP doivent rester propres à chaque environnement.

## Base de données

Exécuter les migrations :

```bash
node ace migration:run
```

Créer le compte BCC initial :

```bash
node ace db:seed
```

Par défaut, le seeder utilise :

- E-mail : `bcc@tarification.cd`
- Mot de passe : `BccSecure123!`

Ces valeurs peuvent être surchargées avec `BCC_SEED_EMAIL` et `BCC_SEED_PASSWORD`.

## Lancement en développement

```bash
npm run dev
```

L'application est disponible par défaut sur :

```text
http://localhost:3333
```

## Scripts utiles

```bash
npm run dev        # Lance le serveur de développement avec HMR
npm run build      # Prépare l'application pour la production
npm run start      # Lance l'application compilée
npm run test       # Exécute les tests
npm run lint       # Analyse le code avec ESLint
npm run typecheck  # Vérifie les types TypeScript
```

## Routes fonctionnelles

### Pages publiques

- `/` - Accueil
- `/banks` - Répertoire des banques
- `/compare` - Comparaison des tarifs
- `/map` - Carte des agences
- `/history` - Historique des tarifs
- `/analytics` - Analyse de l'évolution des tarifs

### Authentification banque

- `/signup` - Demande de création de compte banque
- `/signup/verify` - Vérification OTP
- `/login` - Connexion banque

### Espace banque

- `/bank/account` - Profil et agences de la banque
- `/bank/tariffs` - Gestion et soumission des tarifs

### Espace BCC

- `/bcc` - Accès BCC
- `/bcc/login` - Connexion BCC
- `/bcc/signup` - Création de compte BCC
- `/bcc/banks` - Gestion des banques
- `/bcc/services` - Gestion des services bancaires
- `/bcc/bank-users` - Gestion des comptes banque et demandes d'inscription
- `/bcc/tariff-reviews` - Validation des tarifs soumis

## Modèle de données principal

- `banks` : banques publiées sur le portail.
- `users` : comptes banque rattachés à une banque.
- `bcc_users` : comptes administratifs BCC.
- `agencies` : agences géolocalisées des banques.
- `service_categories` : catégories de services bancaires.
- `services` : services tarifables.
- `tariffs` : tarifs soumis, approuvés ou rejetés.
- `pending_bank_registrations` : demandes d'inscription banque en attente.
- `bank_signup_verifications` : vérification OTP des inscriptions.
- `mailbox_messages` : messages internes ou notifications applicatives.

## Règles importantes

- Un tarif soumis par une banque est créé avec le statut `PENDING`.
- Un tarif `PENDING` n'est pas visible dans les comparaisons publiques.
- Seuls les tarifs `APPROVED` sont utilisés par les pages publiques.
- Un tarif rejeté peut conserver un motif de rejet.
- Une banque ne peut modifier que ses propres tarifs en attente.
- Les actions sensibles de validation sont réservées aux comptes BCC.

## Qualité et vérification

Avant une livraison, exécuter :

```bash
npm run typecheck
npm run lint
npm run test
```

## Licence

Projet privé.
