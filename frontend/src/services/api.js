"use client";

import { useAuth } from "@/context/AuthContext";

// Fonction utilitaire pour effectuer les requêtes API
async function fetchWithAuth(url, options = {}) {
  // Récupérer le token JWT du localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem("jwt") : null;
  
  // Préparer les en-têtes
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Ajouter le token d'authentification si disponible
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`http://localhost:8000${url}`, {
      ...options,
      headers,
      credentials: 'include', // Important pour les cookies de session
    });

    // Si la réponse est 401 (Non autorisé), déconnecter l'utilisateur
    if (response.status === 401) {
      // Vérifier si on est côté client avant d'utiliser localStorage
      if (typeof window !== 'undefined') {
        // Supprimer le token du localStorage
        localStorage.removeItem("jwt");
        
        // Appeler la fonction de déconnexion du contexte d'authentification
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          // Rediriger vers la page de connexion
          window.location.href = '/login';
        }
      }
      
      // Lancer une erreur avec un message clair
      const error = new Error("Votre session a expiré. Veuillez vous reconnecter.");
      error.status = 401;
      throw error;
    }

    // Si la réponse n'est pas OK, lancer une erreur avec le message d'erreur
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Une erreur est survenue');
      error.status = response.status;
      throw error;
    }

    // Si tout va bien, retourner les données JSON
    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    // Si ce n'est pas une erreur 401, on la propage
    if (error.status !== 401) {
      throw error;
    }
    // Pour les erreurs 401, on a déjà redirigé, on ne fait rien de plus
  }
}

// Méthodes HTTP de base
const api = {
  get: (url, options = {}) => fetchWithAuth(url, { ...options, method: 'GET' }),
  
  post: (url, data, options = {}) => 
    fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }),

  put: (url, data, options = {}) => 
    fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }),

  delete: (url, options = {}) => 
    fetchWithAuth(url, { ...options, method: 'DELETE' }),
};

export default api;
