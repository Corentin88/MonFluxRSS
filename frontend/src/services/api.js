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
    });

    // Si la réponse est 401 (Non autorisé), déconnecter l'utilisateur
    if (response.status === 401) {
      // Vérifier si on est côté client avant d'utiliser localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("jwt");
        // Recharger la page pour forcer la mise à jour de l'état d'authentification
        window.location.href = '/login';
      }
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    // Si la réponse n'est pas OK, lancer une erreur avec le message d'erreur
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Une erreur est survenue');
    }

    // Si tout va bien, retourner les données JSON
    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
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
