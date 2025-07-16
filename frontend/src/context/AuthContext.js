// Directive indiquant que ce module doit s'exécuter côté client
"use client";

// Importation des hooks et fonctions nécessaires depuis React
import { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * Création d'un contexte d'authentification
 * Ce contexte permettra de partager l'état d'authentification à travers toute l'application
 * sans avoir à passer les props manuellement à chaque niveau de l'arbre des composants
 */
const AuthContext = createContext();

/**
 * Fournisseur du contexte d'authentification
 * Ce composant englobe l'application et fournit les données d'authentification
 * à tous les composants enfants qui utilisent le hook useAuth()
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les composants enfants qui auront accès au contexte
 * @returns {JSX.Element} Le fournisseur de contexte avec les enfants enveloppés
 */
export function AuthProvider({ children }) {
  // État local pour suivre si l'utilisateur est connecté
  // Initialisé à false par défaut
  const [isLogged, setIsLogged] = useState(false);

  /**
   * Effet qui s'exécute au montage du composant
   * Vérifie si un token JWT est présent dans le localStorage
   * et met à jour l'état d'authentification en conséquence
   */
  useEffect(() => {
    // Vérifie la présence du token JWT dans le localStorage
    // !! convertit la valeur en booléen (true si le token existe, false sinon)
    setIsLogged(!!localStorage.getItem("jwt"));
  }, []); // Le tableau de dépendances vide signifie que cet effet ne s'exécute qu'au montage

  /**
   * Fonction pour connecter l'utilisateur
   * Stocke le token JWT dans le localStorage et met à jour l'état
   * 
   * @param {string} token - Le token JWT reçu après une authentification réussie
   */
  const login = useCallback((token) => {
    // Stocke le token dans le localStorage pour maintenir la session
    localStorage.setItem("jwt", token);
    // Met à jour l'état pour indiquer que l'utilisateur est connecté
    setIsLogged(true);
  }, []); // Pas de dépendances car la fonction ne dépend d'aucune valeur extérieure

  /**
   * Fonction pour déconnecter l'utilisateur
   * Supprime le token JWT du localStorage et met à jour l'état
   */
  const logout = useCallback(() => {
    // Supprime le token du localStorage
    localStorage.removeItem("jwt");
    // Met à jour l'état pour indiquer que l'utilisateur est déconnecté
    setIsLogged(false);
  }, []); // Pas de dépendances car la fonction ne dépend d'aucune valeur extérieure

  /**
   * Rendu du fournisseur de contexte
   * Fournit l'état d'authentification et les fonctions de connexion/déconnexion
   * à tous les composants enfants via le contexte
   */
  return (
    <AuthContext.Provider 
      value={{ 
        isLogged,   // État de connexion (booléen)
        login,      // Fonction pour se connecter
        logout      // Fonction pour se déconnecter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * Permet d'accéder facilement aux valeurs du contexte d'authentification
 * depuis n'importe quel composant enfant
 * 
 * @returns {Object} Un objet contenant { isLogged, login, logout }
 * @throws {Error} Si utilisé en dehors d'un AuthProvider
 */
export function useAuth() {
  // Récupère le contexte d'authentification
  const context = useContext(AuthContext);
  
  // Vérifie que le hook est bien utilisé à l'intérieur d'un AuthProvider
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  
  return context;
}