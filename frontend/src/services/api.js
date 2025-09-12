"use client";

// Importation du hook d'authentification pour gérer les tokens JWT
import { useAuth } from "@/context/AuthContext";

/**
 * Fonction utilitaire pour effectuer des requêtes HTTP authentifiées
 * Gère automatiquement l'ajout du token JWT et la gestion des erreurs
 * @param {string} url - L'URL de l'API (sans le domaine de base)
 * @param {Object} options - Options de la requête fetch
 * @returns {Promise<Object>} Les données JSON de la réponse
 * @throws {Error} En cas d'erreur HTTP ou de problème de connexion
 */
async function fetchWithAuth(url, options = {}) {
  // Récupération du token JWT depuis le localStorage (uniquement côté client)
  const token = typeof window !== 'undefined' ? localStorage.getItem("jwt") : null;
  
  // Configuration des en-têtes par défaut
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Permet de surcharger les en-têtes
  };

  // Ajout du token d'authentification s'il existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Exécution de la requête avec l'URL complète et les options
    const response = await fetch(`http://localhost:8000${url}`, {
      ...options,
      headers,
      credentials: 'include', // Important pour les cookies de session (CSRF, etc.)
    });

    // Gestion des réponses non autorisées (401)
    if (response.status === 401) {
      // Nettoyage côté client uniquement
      if (typeof window !== 'undefined') {
        localStorage.removeItem("jwt");
        
        // Redirection vers la page de connexion si pas déjà dessus
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Lancement d'une erreur avec un message clair
      const error = new Error("Votre session a expiré. Veuillez vous reconnecter.");
      error.status = 401;
      throw error;
    }

    // Gestion des autres erreurs HTTP
    if (!response.ok) {
      // Tentative de récupération du message d'erreur du serveur
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Une erreur est survenue');
      error.status = response.status;
      throw error;
    }

    // Retour des données JSON en cas de succès
    return response.json();
  } catch (error) {
    console.error('Erreur lors de l\'appel API:', error);
    // On ne propage que les erreurs qui ne sont pas des 401 (déjà gérées)
    if (error.status !== 401) {
      throw error;
    }
  }
}

/**
 * Objet API exposant les méthodes HTTP de base
 * Chaque méthode appelle fetchWithAuth avec la méthode HTTP appropriée
 */
const api = {
  /**
   * Effectue une requête GET
   * @param {string} url - L'URL de la ressource
   * @param {Object} options - Options supplémentaires pour la requête
   */
  get: (url, options = {}) => fetchWithAuth(url, { ...options, method: 'GET' }),
  
  /**
   * Effectue une requête POST
   * @param {string} url - L'URL de la ressource
   * @param {Object} data - Les données à envoyer (seront converties en JSON)
   * @param {Object} options - Options supplémentaires pour la requête
   */
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

  /**
   * Effectue une requête PUT
   * @param {string} url - L'URL de la ressource
   * @param {Object} data - Les données à mettre à jour (seront converties en JSON)
   * @param {Object} options - Options supplémentaires pour la requête
   */
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

  /**
   * Effectue une requête DELETE
   * @param {string} url - L'URL de la ressource à supprimer
   * @param {Object} options - Options supplémentaires pour la requête
   */
  delete: (url, options = {}) => 
    fetchWithAuth(url, { ...options, method: 'DELETE' }),
};

export default api;
