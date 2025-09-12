"use client";
// Importation des hooks nécessaires depuis React
import { useEffect, useState } from "react";

/**
 * Composant ListeFlux - Récupère et groupe les flux par catégorie
 * @param {Function} onData - Callback appelé avec les données des flux groupés
 * @returns {JSX.Element} Ne retourne rien d'affiché directement (null) ou un message d'erreur
 */
export default function ListeFlux({ onData }) {
  // État pour gérer les erreurs potentielles
  const [error, setError] = useState(null);

  // Effet qui s'exécute au montage du composant et quand onData change
  useEffect(() => {
    // Fonction asynchrone pour récupérer les flux depuis l'API
    const fetchFlux = async () => {
      try {
        // Requête GET vers l'API pour récupérer les sources de flux
        const response = await fetch("http://localhost:8000/api/feed_sources", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Vérification de la réponse HTTP
        if (!response.ok) throw new Error("Erreur HTTP " + response.status);

        // Extraction des données JSON de la réponse
        const data = await response.json();
        // Récupération des sources depuis la réponse (support de différents formats d'API)
        const sources = data["hydra:member"] || data.member || [];

        // Regroupement des flux par type (catégorie)
        const groupedFlux = sources.reduce((acc, item) => {
          // Crée un tableau vide pour le type s'il n'existe pas encore
          if (!acc[item.type]) acc[item.type] = [];
          // Ajoute le nom du flux au tableau de son type
          acc[item.type].push(item.name);
          return acc;
        }, {}); // Initialisation avec un objet vide

        // Appel du callback parent avec les données groupées
        onData(groupedFlux);
      } catch (err) {
        // Gestion des erreurs
        console.error(err);
        setError("Erreur lors du chargement des flux");
      }
    };

    // Appel de la fonction de récupération des flux
    fetchFlux();
  }, [onData]); // Dépendance : le callback onData

  // Affichage conditionnel des erreurs
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  // Le composant ne rend rien de visible par défaut
  return null;
}
