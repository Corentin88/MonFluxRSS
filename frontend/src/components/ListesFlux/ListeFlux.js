"use client";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/services/api";
/**
 * Composant ListeFlux - Récupère et groupe les flux par catégorie
 * @param {Function} onData - Callback appelé avec les données des flux groupés
 * @param {number} refreshTrigger - Déclencheur de rafraîchissement
 * @returns {JSX.Element} Ne retourne rien d'affiché directement (null) ou un message d'erreur
 */
export default function ListeFlux({ onData, refreshTrigger = 0 }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlux = async () => {
      try {
        let allSources = [];
        let currentPage = 1;
        let hasMorePages = true;

        // Boucle pour récupérer TOUTES les pages
        while (hasMorePages) {
          const response = await fetch(
            `${BASE_URL}/api/feed_sources?page=${currentPage}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...(localStorage.getItem("jwt") && {
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`
                })
              },
            }
          );

          if (!response.ok) throw new Error("Erreur HTTP " + response.status);

          const data = await response.json();

          // Extraire les sources de cette page
          let sources = [];
          if (data["hydra:member"]) {
            sources = data["hydra:member"];
          } else if (data.member) {
            sources = data.member;
          } else if (Array.isArray(data)) {
            sources = data;
          }
          
          // Ajouter les sources de cette page au tableau total
          allSources = [...allSources, ...sources];

          // Vérifier s'il y a une page suivante
          const hasNext = data["hydra:view"]?.["hydra:next"] || data.view?.next;
          
          if (hasNext) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        }

        // Regroupement des flux par type
        const groupedFlux = allSources.reduce((acc, item) => {
          // Gérer les flux sans type défini
          const itemType = item.type || "Sans catégorie";
          
          if (!acc[itemType]) acc[itemType] = [];
          acc[itemType].push(item.name);
          return acc;
        }, {});

        onData(groupedFlux);
      } catch (err) {
        console.error("Erreur lors du chargement des flux:", err);
        setError("Erreur lors du chargement des flux");
      }
    };

    fetchFlux();
  }, [onData, refreshTrigger]);

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return null;
}