# MonFluxRSS - Frontend Next.js

Ce projet Next.js constitue le frontend de MonFluxRSS, une application qui consomme une API Symfony sécurisée exposant des articles issus de flux RSS.

## 🚀 Fonctionnalités

- **Affichage des articles** : Liste paginée des articles avec chargement automatique
- **Recherche** : Recherche en temps réel sur les titres et descriptions
- **Filtrage** : Par type de flux (ex: veille techno)
- **Authentification** : Connexion sécurisée avec JWT
- **Mise à jour** : Bouton pour forcer la mise à jour des articles
- **Interface** : Design responsive avec Tailwind CSS
- **Navigation** : Barre de navigation dynamique avec gestion du scroll

## 🛠️ Technologies

- **Next.js 14** avec App Router
- **React 18+** avec Hooks
- **Tailwind CSS** pour le styling
- **SWR** pour la gestion des données
- **Headless UI** pour les composants accessibles
- **Heroicons** pour les icônes
- **JWT** pour l'authentification

## 📦 Installation

### Prérequis

- Node.js 18+
- npm, yarn ou pnpm
- Accès à l'API backend (voir README du backend)

### Étapes d'installation

1. **Cloner le dépôt** :

```bash
git clone https://github.com/Corentin88/MonFluxRSS.git
cd MonFluxRSS/frontend/frontend
```

2. **Installer les dépendances** :

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configurer l'environnement** :

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. **Démarrer le serveur de développement** :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🚀 Utilisation

### Authentification

1. Accédez à la page de connexion `/login`
2. Entrez vos identifiants (email/mot de passe)
3. Vous serez redirigé vers la page d'accueil après authentification réussie

### Navigation

- **Page d'accueil** : Affiche la liste des articles avec pagination
- **Barre de recherche** : Recherche en temps réel dans les titres et descriptions
- **Filtres** : Filtrez les articles par type de flux
- **Mise à jour** : Bouton pour forcer une actualisation des articles

## 🏗️ Structure du projet

```
frontend/
├── src/
│   ├── app/                    # Dossier principal de l'application Next.js
│   │   ├── ajoutFlux/         # Page d'ajout de flux RSS
│   │   ├── deleteFlux/        # Page de suppression de flux
│   │   ├── login/             # Page de connexion
│   │   ├── sources/           # Page de gestion des sources
│   │   ├── globals.css        # Styles globaux
│   │   ├── layout.js          # Layout principal de l'application
│   │   └── page.js            # Page d'accueil
│   │
│   ├── components/            # Composants réutilisables
│   │   ├── ArticlesFlux/      # Composant d'affichage des articles
│   │   ├── DataUsers/         # Composant des données utilisateur
│   │   ├── ListesFlux/        # Liste des flux disponibles
│   │   ├── SearchBar/         # Barre de recherche
│   │   ├── SelecteurFlux/     # Sélecteur de flux
│   │   ├── footer.js          # Pied de page
│   │   └── header.js          # En-tête de l'application
│   │
│   ├── context/               # Contextes React
│   │   └── AuthContext.js     # Gestion de l'authentification
│   │
│   ├── hooks/                 # Hooks personnalisés
│   │
│   └── services/              # Services pour les appels API
│
├── public/                    # Fichiers statiques
├── .env*                     # Fichiers de configuration d'environnement
├── next.config.mjs           # Configuration Next.js
└── tailwind.config.js        # Configuration Tailwind CSS
```

### Description des dossiers clés :

- **src/app** : Contient les pages de l'application Next.js avec le nouveau routeur App Router
  - `page.js` : Page d'accueil qui affiche les articles
  - `login/` : Gestion de l'authentification
  - `ajoutFlux/` et `deleteFlux/` : Gestion des flux RSS
  - `sources/` : Liste et gestion des sources de flux

- **src/components** : Composants réutilisables de l'application
  - `ArticlesFlux/` : Affiche la liste des articles
  - `ListesFlux/` : Affiche et gère les flux abonnés
  - `SearchBar/` : Barre de recherche pour filtrer les articles
  - `header.js` et `footer.js` : En-tête et pied de page de l'application

- **src/context** : Gestion de l'état global
  - `AuthContext.js` : Gère l'état d'authentification de l'utilisateur

- **src/services** : Contient les appels API pour communiquer avec le backend

## � Gestion des données

### Récupération des articles

Les articles sont récupérés via l'API backend avec pagination et filtres :

```javascript
const { data, error } = useSWR(
  `/articles?page=${page}&title=${searchQuery}&type=${filterType}`,
  fetcher
);
```

### Authentification

Le token JWT est stocké dans le localStorage et inclus dans les en-têtes des requêtes :

```javascript
const response = await fetch(`${API_URL}/protected-route`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🌐 Déploiement

### Build pour la production

```bash
npm run build
```

### Démarrer le serveur de production

```bash
npm start
```

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `http://localhost:8000/api` |

## ✅ Tests

Pour lancer les tests :

```bash
npm test
```


## 📞 Contact


Lien du projet : [https://github.com/Corentin88/MonFluxRSS](https://github.com/Corentin88/MonFluxRSS)
