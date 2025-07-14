# MonFluxRSS - Backend Symfony

Ce projet Symfony permet de récupérer automatiquement des articles depuis des flux RSS, de les stocker en base de données et de les exposer via une API.

## 🚀 Fonctionnalités

-   Import automatique des flux RSS
-   Stockage des articles en base de données
-   Nettoyage automatique des articles anciens
-   Structure de données relationnelle entre les sources et les articles

## 🛠️ Technologies

-   **Symfony 7+** - Framework PHP
-   **Doctrine ORM** - Gestion de la base de données
-   **PHP 8.2+** - Langage de programmation
-   **MySQL** - Base de données relationnelle
-   **FeedIo** - Bibliothèque pour la lecture des flux RSS
-   **API Platform** - Génération automatique de l’API REST
-   **LexikJWTAuthenticationBundle** - Authentification JWT

## 📦 Installation

### Prérequis

-   PHP 8.2 ou supérieur
-   Composer
-   MySQL 8.0 ou supérieur
-   Symfony CLI (recommandé)

### Étapes d'installation

1. **Cloner le dépôt** :

    ```bash
    git clone https://github.com/Corentin88/MonFluxRSS.git
    cd MonFluxRSS/backend
    ```

2. **Installer les dépendances** :

    ```bash
    composer install
    ```

3. **Configurer l'environnement** :

    ```bash
    cp .env
    ```

    Éditez le fichier `.env.dev` pour configurer votre accès à la base de données :

    ```
    DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0"
    ```

4. **Migrer la base de données** :

    ```bash
    php bin/console make:migration
    php bin/console doctrine:migrations:migrate
    ```

5. **Charger des sources de flux de test (optionnel)** :

    ```bash
    php bin/console doctrine:fixtures:load
    ```

6. **Démarrer le serveur de développement** :
    ```bash
    php bin/console symfony serve
    ```

## 🚀 Utilisation

### Importer les flux RSS

Pour importer les articles depuis les flux RSS configurés :

```bash
php bin/console app:import-rss
```

## 📚 Structure des données

### Entités principales

-   **FeedSource** : Représente une source de flux RSS

    -   id (int)
    -   name (string) : Nom de la source
    -   url (string) : URL du flux RSS
    -   createdAt (DateTime) : Date de création

-   **Article** : Représente un article importé
    -   id (int)
    -   title (string) : Titre de l'article
    -   description (text) : Contenu de l'article
    -   link (string) : URL de l'article original
    -   publishedAt (DateTime) : Date de publication
    -   guid (string) : Identifiant unique de l'article
    -   feedSource (FeedSource) : Source du flux

## 🔧 Commandes disponibles

-   `app:import-rss` : Importe les articles depuis les flux RSS configurés

## 🌐 API Platform

Ce projet utilise [API Platform](https://api-platform.com/), un framework puissant pour construire des API REST et GraphQL modernes.

### Points d'accès API

L'API est disponible à l'adresse : `http://localhost:8000/api`

#### Collection Operations

-   **Sources de flux (FeedSource)**

    -   `GET /api/feed_sources` - Liste toutes les sources de flux
    -   `POST /api/feed_sources` - Crée une nouvelle source de flux

-   **Articles**
    -   `GET /api/articles` - Liste tous les articles
    -   `POST /api/articles` - Crée un nouvel article (utile pour les tests)

#### Item Operations

-   **Source de flux spécifique**

    -   `GET /api/feed_sources/{id}` - Affiche une source de flux spécifique
    -   `PUT /api/feed_sources/{id}` - Met à jour une source de flux
    -   `DELETE /api/feed_sources/{id}` - Supprime une source de flux

-   **Article spécifique**
    -   `GET /api/articles/{id}` - Affiche un article spécifique
    -   `PUT /api/articles/{id}` - Met à jour un article
    -   `DELETE /api/articles/{id}` - Supprime un article

### Filtres disponibles

Les endpoints de collection supportent plusieurs filtres :

-   `?page=1` - Pagination (30 éléments par page par défaut)
-   `?order[property]=asc|desc` - Tri par propriété
-   `?property=value` - Filtre par valeur exacte
-   `?property[]=gte:value` - Filtre avec opérateurs (gt, gte, lt, lte, between)

### Configuration avancée

La configuration d'API Platform se trouve dans :

-   `config/packages/api_platform.yaml` - Configuration principale
-   `config/routes/api_platform.yaml` - Routes de l'API

### Exemple de requête

# Créer une nouvelle source de flux

```bash
POST http://localhost:8000/api/feed_sources
Content-Type: application/ld+json

{
"name": "Le Monde",
"url": "https://www.lemonde.fr/rss/une.xml"
}
```

Le champ createdAt est automatiquement défini côté serveur, inutile de l'envoyer.
Pour associer des articles à une source, utilisez les IRIs internes à l’API, par exemple :
"articles": ["/api/articles/1", "/api/articles/2"]
N’utilisez jamais d’URL externe (ex : "https://example.com") dans ce champ.

### Sécurité

Par défaut, l'API est accessible en lecture seule. Pour les opérations d'écriture, vous devrez configurer l'authentification selon vos besoins.

### 🔐 Sécurité et authentification

L’API est sécurisée avec un système d’authentification JWT via LexikJWTAuthenticationBundle.

#### Contrôleur de login

Un contrôleur minimal SecurityController expose la route :

```php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): Response
    {
        throw new \Exception('Cette méthode ne devrait pas être appelée directement.');
    }
}
```

Ce contrôleur ne fait rien directement, c’est la configuration de json_login dans security.yaml qui gère l’authentification.

Utilisation

Envoyer une requête POST à /api/login avec le JSON :

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

Recevoir en réponse un token JWT à inclure dans l’en-tête Authorization de vos requêtes (Bearer Token) :

```makefile
Authorization: Bearer votre_token
```

Configuration importante
Les routes en lecture (GET /api/feed_sources, GET /api/articles) sont publiques (pas d’authentification requise).

Les routes d’écriture (POST, PUT, DELETE) nécessitent le rôle ROLE_ADMIN.

Toute autre route API nécessite une authentification JWT valide.

#### Fichiers importants de configuration

-   config/packages/api_platform.yaml

Configuration de base d’API Platform:

```yaml
api_platform:
    title: Hello API Platform
    version: 1.0.0
    formats:
        jsonld: ["application/ld+json"]
        json: ["application/json"]
    defaults:
        stateless: true
        cache_headers:
            vary: ["Content-Type", "Authorization", "Origin"]
    swagger:
        api_keys:
            JWT:
                name: Authorization
                type: header
```

Activation de la doc Swagger via swagger_ui (souvent activé par défaut)

Configuration de la sécurité (firewalls, providers, access_control)

Définition du firewall main avec json_login et JWT

-   config/packages/security.yaml

```yaml
firewalls:
    dev:
        pattern: ^/(_(profiler|wdt)|css|images|js)/
        security: false

    login:
        pattern: ^/api/login$
        stateless: true
        provider: app_user_provider
        json_login:
            check_path: /api/login
            username_path: email
            password_path: password
            success_handler: lexik_jwt_authentication.handler.authentication_success
            failure_handler: lexik_jwt_authentication.handler.authentication_failure

    api:
        pattern: ^/api
        stateless: true
        provider: app_user_provider
        jwt: ~

access_control:
    # Accès public seulement en lecture
    - { path: ^/api/feed_sources, methods: [GET], roles: PUBLIC_ACCESS }
    - { path: ^/api/articles, methods: [GET], roles: PUBLIC_ACCESS }
    - { path: ^/api/docs, roles: PUBLIC_ACCESS }

    # Accès restreint en écriture (POST, PUT, DELETE)
    - {
          path: ^/api/feed_sources,
          methods: [POST, PUT, PATCH, DELETE],
          roles: ROLE_ADMIN,
      }

    # Login reste public
    - { path: ^/api/login, roles: PUBLIC_ACCESS }

    # Par sécurité, tout le reste des routes API requiert une connexion
    - { path: ^/api, roles: ROLE_ADMIN }
```

-   src/Controller/SecurityController.php

Contrôleur d’authentification minimal pour la route /api/login

```yaml
controllers:
    resource:
        path: ../src/Controller/
        namespace: App\Controller
    type: attribute

login:
    path: /api/login
    controller: App\Controller\SecurityController::login
```
