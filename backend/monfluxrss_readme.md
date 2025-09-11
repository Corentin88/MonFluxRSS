# MonFluxRSS - Backend Symfony

Ce projet Symfony permet de récupérer automatiquement des articles depuis des flux RSS, de les stocker en base de données, et de les exposer via une API REST sécurisée avec authentification JWT.

## 🚀 Fonctionnalités

- Import automatique des flux RSS (via commande CLI)
- Lecture des flux via FeedIo
- Stockage en base de données relationnelle avec Doctrine
- API RESTful avec API Platform
- Authentification JWT (LexikJWTAuthenticationBundle)
- Lecture seule publique, écriture réservée aux admins
- Recherche personnalisée sur plusieurs champs

ℹ️ À propos de FeedIo

Le bundle FeedIo est utilisé pour parser les flux RSS/Atom, en récupérant les métadonnées (titre, description, date de publication, lien, etc.).
Dans ce projet, FeedIo est utilisé dans la commande app:import-rss pour lire les flux depuis chaque FeedSource, puis créer ou mettre à jour les Article associés.
Lien : https://github.com/alexdebril/feed-io

## 🏗️ Structure du projet

```
backend/
├── bin/                    # Exécutables du projet
│   └── console             # Console Symfony
├── config/ 
│   ├── jwt               # Configuration JWT
│   ├── packages/          # Configuration des bundles
│   ├── routes/            # Définition des routes
│   └── services.yaml      # Configuration des services
├── migrations/            # Fichiers de migration de la base de données
├── public/                # Point d'entrée public
│   └── index.php
├── src/                   # Code source de l'application
│   ├── ApiResource/       # Ressources API Platform
│   ├── Command/           # Commandes console
│   │   ├── CreateAdminCommand.php  # Commande de création d'un admin
│   │   └── ImportRssCommand.php  # Commande d'import RSS
│   ├── Controller/        # Contrôleurs
│   │   ├── ArticleController.php # Gestion des articles
│   │   └── SecurityController.php # Gestion de l'authentification
│   ├── DataFixtures/      # Données de test
│   ├── Entity/            # Entités Doctrine
│   │   ├── Article.php    # Article (titre, description, lien, etc.)
│   │   ├── FeedSource.php # Source de flux RSS
│   │   └── User.php       # Utilisateurs et rôles
│   ├── Repository/        # Repository Doctrine
│   └── Service/ 
│      ├── Filter/           # Filtres
│      │    └── OrSearchFilter.php # Filtre de recherche multi-champs
│      └─ArticleFetcherService.php # Service de récupération d'articles
├── templates/             # Templates Twig (si nécessaire)
└── tests/                 # Tests unitaires et fonctionnels
```

### Description des dossiers clés :

- **src/Entity** : Contient les entités Doctrine qui représentent la structure de la base de données
  - `Article.php` : Stocke les informations des articles (titre, description, lien, date, etc.)
  - `FeedSource.php` : Définit les sources de flux RSS (nom, URL, type)
  - `User.php` : Gère les utilisateurs et l'authentification

- **src/Service** : Contient la logique métier
  - `ArticleFetcherService.php` : Service pour récupérer et stocker les articles depuis les flux RSS

- **src/Command** : Commandes console personnalisées
  - `ImportRssCommand.php` : Commande pour importer les articles depuis les flux configurés

- **config/packages** : Configuration des bundles Symfony
  - `api_platform.yaml` : Configuration d'API Platform
  - `doctrine.yaml` : Configuration de Doctrine
  - `lexik_jwt_authentication.yaml` : Configuration de l'authentification JWT

- **migrations/** : Contient les fichiers de migration pour les mises à jour de la base de données

## 🛠️ Technologies

- **Symfony 7**
- **Doctrine ORM**
- **MySQL**
- **FeedIo** (lecture des flux RSS)
- **API Platform**
- **LexikJWTAuthenticationBundle** (authentification)

## 📦 Installation

### Prérequis

- PHP 8.2+
- Composer
- MySQL 8.0+
- Symfony CLI

### Étapes

1. **Cloner le projet :**

```bash
git clone https://github.com/Corentin88/MonFluxRSS.git
cd MonFluxRSS/backend
```

2. **Installer les dépendances :**

```bash
composer install
```

3. **Configurer l'environnement :**

```bash
cp .env .env.local
```

Modifier `.env.local` :

```env
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0"
```

4. **Créer la base :**

```bash
php bin/console doctrine:database:create
```

5. **Exécuter les migrations :**

```bash
php bin/console make:migration
```

```bash
php bin/console doctrine:migrations:migrate
```

6. **Charger des flux de test (optionnel) :**

```bash
php bin/console doctrine:fixtures:load
```

7. **Générer la clé JWT :**

```bash
composer require lexik/jwt-authentication-bundle
php bin/console lexik:jwt:generate-keypair
```

8. **Démarrer le serveur :**

```bash
symfony serve
```

## 🚀 Utilisation

### Importer les articles RSS :

**Via la commande CLI :**
```bash
php bin/console app:import-rss
```

**Via une requête HTTP sécurisée (JWT) :**
```bash
POST /api/update-articles  ### Cette route permet de déclencher l’import d’articles directement depuis une requête HTTP sécurisée (JWT)
Authorization: Bearer {votre_token}   
Content-Type: application/json
```

### Authentification JWT

Envoyer une requête :

```bash
POST /api/login
Content-Type: application/json
```

```json
{
  "email": "votre_email@example.com",
  "password": "votre_mot_de_passe"
}
```

Token reçu :

```
Authorization: Bearer votre_token
```

## 📃 Structure des données

### FeedSource

- id (int)
- name (string)
- url (string)
- type (string)
- createdAt (datetime)
- articles (relation vers Article[])

### Article

- id (int)
- title (string)
- description (text)
- link (string)
- guid (string)
- publishedAt (datetime)
- feedSource (relation vers FeedSource)

### User

- id (int)
- email (string)
- password (hash)
- roles (json)

## 🔧 Commandes disponibles

- `app:import-rss` : importe les flux depuis les sources **Utilisé principalement pour un import manuel ou au démarrage.**
- `app:create-admin` : crée un utilisateur admin

## 🌐 API Platform

L'API est documentée via Swagger :

> [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

### Routes principales

#### FeedSources

- `GET /api/feed_sources`
- `POST /api/feed_sources`
- `GET /api/feed_sources/{id}`
- `PUT /api/feed_sources/{id}`
- `DELETE /api/feed_sources/{id}`

#### Articles

- `GET /api/articles`
- `POST /api/articles`
- `GET /api/articles/{id}`
- `PUT /api/articles/{id}`
- `DELETE /api/articles/{id}`

### Filtres disponibles

- `?page=1`
- `?order[publishedAt]=desc`
- `?title=value` (exact)
- `?description=value` (exact)
- `?feedSource.type=veille techno`

> ✅ Recherche multi-champs disponible via un filtre personnalisé `OrSearchFilter` (sur `title` et `description`)

## 🔐 Sécurité

### Accès Public :

- `GET /api/articles`
- `GET /api/feed_sources`

### Accès Protégé (JWT + ROLE\_ADMIN) :

- `POST`, `PUT`, `DELETE` sur tous les endpoints API

## 📁 Fichiers de configuration importants

### `config/packages/security.yaml`

- Authentification JSON Login + JWT
- Routes publiques en lecture
- Accès écriture réservé aux admins

### `config/packages/api_platform.yaml`

- Formats supportés : JSON-LD, JSON
- Swagger activé
- JWT comme clé API

## 🔗 Exemple de POST :

```http
POST /api/feed_sources
Content-Type: application/ld+json

{
  "name": "Le Monde",
  "url": "https://www.lemonde.fr/rss/une.xml",
  "type": "veille techno"
}
```

> Le champ `createdAt` est géré automatiquement. Les articles sont associés automatiquement à chaque import via `app:import-rss`.

## ✅ Remarques

- La suppression automatique des articles anciens (7 jours) est prévue mais non encore automatisée (CRON à ajouter).
- Le projet est prêt à être intégré avec un frontend React/Next.js

---

Tu peux maintenant consulter `README.md` du dossier frontend pour la suite ou revenir ici une fois le déploiement envisagé.
