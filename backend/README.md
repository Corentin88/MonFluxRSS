# MonFluxRSS - Backend Symfony

Ce projet Symfony permet de récupérer automatiquement des articles depuis des flux RSS, de les stocker en base de données et de les exposer via une API.

## 🚀 Fonctionnalités

- Import automatique des flux RSS
- Stockage des articles en base de données
- Nettoyage automatique des articles anciens
- Structure de données relationnelle entre les sources et les articles

## 🛠️ Technologies

- **Symfony 7+** - Framework PHP
- **Doctrine ORM** - Gestion de la base de données
- **PHP 8.2+** - Langage de programmation
- **MySQL** - Base de données relationnelle
- **FeedIo** - Bibliothèque pour la lecture des flux RSS

## 📦 Installation

### Prérequis

- PHP 8.2 ou supérieur
- Composer
- MySQL 8.0 ou supérieur
- Symfony CLI (recommandé)

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

- **FeedSource** : Représente une source de flux RSS
  - id (int)
  - name (string) : Nom de la source
  - url (string) : URL du flux RSS
  - createdAt (DateTime) : Date de création

- **Article** : Représente un article importé
  - id (int)
  - title (string) : Titre de l'article
  - description (text) : Contenu de l'article
  - link (string) : URL de l'article original
  - publishedAt (DateTime) : Date de publication
  - guid (string) : Identifiant unique de l'article
  - feedSource (FeedSource) : Source du flux

## 🔧 Commandes disponibles

- `app:import-rss` : Importe les articles depuis les flux RSS configurés

## 🌐 API Platform

Ce projet utilise [API Platform](https://api-platform.com/), un framework puissant pour construire des API REST et GraphQL modernes.

### Points d'accès API

L'API est disponible à l'adresse : `http://localhost:8000/api`

#### Collection Operations

- **Sources de flux (FeedSource)**
  - `GET /api/feed_sources` - Liste toutes les sources de flux
  - `POST /api/feed_sources` - Crée une nouvelle source de flux

- **Articles**
  - `GET /api/articles` - Liste tous les articles
  - `POST /api/articles` - Crée un nouvel article (utile pour les tests)

#### Item Operations

- **Source de flux spécifique**
  - `GET /api/feed_sources/{id}` - Affiche une source de flux spécifique
  - `PUT /api/feed_sources/{id}` - Met à jour une source de flux
  - `DELETE /api/feed_sources/{id}` - Supprime une source de flux

- **Article spécifique**
  - `GET /api/articles/{id}` - Affiche un article spécifique
  - `PUT /api/articles/{id}` - Met à jour un article
  - `DELETE /api/articles/{id}` - Supprime un article

### Filtres disponibles

Les endpoints de collection supportent plusieurs filtres :

- `?page=1` - Pagination (30 éléments par page par défaut)
- `?order[property]=asc|desc` - Tri par propriété
- `?property=value` - Filtre par valeur exacte
- `?property[]=gte:value` - Filtre avec opérateurs (gt, gte, lt, lte, between)


### Configuration avancée

La configuration d'API Platform se trouve dans :
- `config/packages/api_platform.yaml` - Configuration principale
- `config/routes/api_platform.yaml` - Routes de l'API

### Exemple de requête

# Créer une nouvelle source de flux
POST http://localhost:8000/api/feed_sources
Content-Type: application/json

{
  "name": "Le Monde",
  "url": "https://www.lemonde.fr/rss/une.xml"
}
Le champ createdAt est automatiquement défini côté serveur, inutile de l'envoyer.
Pour associer des articles à une source, utilisez les IRIs internes à l’API, par exemple :
"articles": ["/api/articles/1", "/api/articles/2"]
N’utilisez jamais d’URL externe (ex : "https://example.com") dans ce champ.

### Sécurité

Par défaut, l'API est accessible en lecture seule. Pour les opérations d'écriture, vous devrez configurer l'authentification selon vos besoins.
