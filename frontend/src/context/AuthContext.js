"use client";

// Importation des hooks nécessaires depuis React
import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Création du contexte d'authentification
const AuthContext = createContext();

/**
 * Décode un token JWT pour extraire son payload
 * @param {string} token - Le token JWT à décoder
 * @returns {Object|null} Le payload décodé ou null en cas d'erreur
 */
function parseJwt(token) {
  try {
    // Décodage de la partie payload du token (deuxième partie séparée par des points)
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

/**
 * Fournisseur de contexte d'authentification
 * Gère l'état de connexion et les opérations liées à l'authentification
 */
export function AuthProvider({ children }) {
  // État pour suivre si l'utilisateur est connecté
  const [isLogged, setIsLogged] = useState(false);

  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion
   * @function
   */
  const logout = useCallback(() => {
    // Suppression du token du stockage local
    localStorage.removeItem("jwt");
    // Mise à jour de l'état de connexion
    setIsLogged(false);
    // Redirection vers la page de connexion (vérification côté client)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  /**
   * Connecte l'utilisateur avec un token JWT
   * @param {string} token - Le token JWT reçu après authentification
   */
  const login = useCallback((token) => {
    // Stockage du token dans le localStorage
    localStorage.setItem("jwt", token);
    // Mise à jour de l'état de connexion
    setIsLogged(true);

    // Planifie la déconnexion automatique selon l'expiration du token
    const decoded = parseJwt(token);
    if (decoded && decoded.exp) {
      // Calcul du temps avant expiration en millisecondes
      const expirationTime = decoded.exp * 1000 - Date.now();
      if (expirationTime > 0) {
        // Planification de la déconnexion automatique
        setTimeout(logout, expirationTime);
      } else {
        // Si le token est déjà expiré, déconnexion immédiate
        logout();
      }
    }
  }, [logout]);

  // Effet pour vérifier l'état d'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.exp) {
        const expirationTime = decoded.exp * 1000 - Date.now();
        if (expirationTime > 0) {
          // Si le token est valide, mise à jour de l'état de connexion
          setIsLogged(true);
          // Planification de la déconnexion automatique
          const timeout = setTimeout(logout, expirationTime);
          // Nettoyage du timeout si le composant est démonté
          return () => clearTimeout(timeout);
        } else {
          // Si le token est expiré, déconnexion
          logout();
        }
      } else {
        // Si le token est invalide, déconnexion
        logout();
      }
    }
  }, [logout]);

  // Fourniture du contexte d'authentification aux composants enfants
  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * @returns {Object} Les valeurs du contexte d'authentification
 * @throws {Error} Si utilisé en dehors d'un AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  return context;
}
