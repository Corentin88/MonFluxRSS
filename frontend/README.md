# MonFluxRSS - Frontend Next.js

Ce projet Next.js constitue le frontend de MonFluxRSS, une application qui consomme une API Symfony sécurisée exposant des articles issus de flux RSS.

## 🚀 Fonctionnalités

- **Gestion des articles** :
  - Affichage des articles avec pagination
  - Mise en avant des vidéos YouTube intégrées
  - Affichage des métadonnées (date, source, etc.)

- **Gestion des flux RSS** :
  - Ajout de nouveaux flux RSS
  - Suppression des flux existants
  - Filtrage par catégorie (veille techno, jeux vidéo, cuisine, science et spatial)

- **Recherche** :
  - Recherche en temps réel dans les titres et descriptions
  - Débogage intégré pour une meilleure expérience utilisateur

- **Authentification** :
  - Connexion sécurisée avec JWT
  - Déconnexion automatique à l'expiration du token
  - Protection des routes sensibles

- **Interface utilisateur** :
  - Design responsive avec Tailwind CSS
  - Navigation intuitive
  - Retour visuel lors des interactions
  - Bouton de retour en haut de page

## 🛠️ Technologies

- **Next.js 14** avec App Router
- **React 18+** avec Hooks personnalisés
- **Tailwind CSS** pour le styling
- **Context API** pour la gestion d'état globale
- **Fetch API** pour les appels réseau
- **JWT** pour l'authentification
- **HTML5** et **CSS3** natifs

## 📦 Structure du projet

```
src/
├── app/                 # Pages et routes
│   ├── login/           # Page de connexion
│   ├── ajoutFlux/       # Page d'ajout de flux
│   └── sources/         # Gestion des sources
│
├── components/          # Composants réutilisables
│   ├── ArticlesFlux/    # Affichage des articles
│   ├── DataUsers/       # Gestion des utilisateurs
│   ├── ListesFlux/      # Liste des flux disponibles
│   ├── SearchBar/       # Barre de recherche
│   └── SelecteurFlux/   # Sélecteur de catégorie
│
├── context/             # Contexte React
│   └── AuthContext.js   # Gestion de l'authentification
│
└── services/            # Logique métier
    └── api.js           # Configuration des appels API
```

## 🔒 Sécurité

- Stockage sécurisé du token JWT dans le localStorage
- Protection des routes sensibles
- Gestion automatique de la déconnexion à l'expiration du token
- Validation côté client et serveur

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm, yarn ou pnpm
- Accès à l'API backend Symfony

### Installation

1. Cloner le dépôt
2. Installer les dépendances :
   ```bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   ```

3. Configurer les variables d'environnement :
   Créer un fichier `.env.local` à la racine du projet avec :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Démarrer le serveur de développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📝 Notes de développement

- Le projet utilise le système de routage de Next.js 14 (App Router)
- Les appels API sont centralisés dans le dossier `services`
- L'authentification est gérée via un contexte React
- Le design est entièrement personnalisé avec Tailwind CSS

## � Licence

Ce projet est sous licence MIT.
