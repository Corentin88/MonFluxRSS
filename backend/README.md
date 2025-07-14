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






