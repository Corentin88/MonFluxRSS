"use client";

// Importation des hooks nécessaires depuis React
import { useState, useEffect } from "react";

/**
 * Composant Search - Barre de recherche avec délai de débogage
 * @param {Function} onSearch - Fonction de rappel appelée avec la requête de recherche
 * @returns {JSX.Element} Un champ de saisie pour la recherche
 */
export default function Search({ onSearch }) {
  // État local pour stocker la valeur de la recherche
  const [query, setQuery] = useState("");

  // Effet qui s'exécute à chaque changement de la requête
  useEffect(() => {
    // Débogage : attendre 500ms après la dernière frappe avant d'appeler onSearch
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500); // Délai de 500 millisecondes

    // Nettoyage : annule le timer si le composant est démonté ou si la requête change rapidement
    return () => clearTimeout(timer);
  }, [query]); // Dépendance : la requête de recherche

  // Rendu du champ de recherche
  return (
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Rechercher..."
        value={query}
        // Met à jour l'état de la requête à chaque frappe
        onChange={(e) => setQuery(e.target.value)}
        // Classes Tailwind pour le style
        className="border p-2 rounded mb-4 bg-orange-50 hover:bg-orange-200"
      />
    </div>
  );
}