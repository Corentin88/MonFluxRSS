"use client";
// Importation des hooks nécessaires
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Composant principal pour la suppression d'un flux RSS
export default function DeleteFlux() {
  // États pour gérer la liste des flux, la sélection et les messages
  const [feeds, setFeeds] = useState([]);          // Liste des flux disponibles
  const [selectedId, setSelectedId] = useState(""); // ID du flux sélectionné
  const [message, setMessage] = useState(null);    // Message d'état (succès/erreur)
  const [loading, setLoading] = useState(true);    // État de chargement
  
  // Hook de navigation de Next.js
  const router = useRouter();

  // Récupération de la liste des flux au chargement du composant
  useEffect(() => {
    async function fetchFeeds() {
      try {
        setLoading(true);
        let allFeeds = [];
        let currentPage = 1;
        let hasMorePages = true;

        // Boucle pour récupérer TOUTES les pages
        while (hasMorePages) {
          const response = await fetch(
            `http://localhost:8000/api/feed_sources?page=${currentPage}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );
          
          if (!response.ok) throw new Error("Erreur lors du chargement des flux");
          
          const data = await response.json();
          
          // Extraire les flux de cette page
          const feedList = data["hydra:member"] || data.member || [];
          
          // Ajouter au tableau total
          allFeeds = [...allFeeds, ...feedList];

          // Vérifier s'il y a une page suivante
          const hasNext = data["hydra:view"]?.["hydra:next"] || data.view?.next;
          
          if (hasNext) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        }

        // Nettoyage des données : extraction des IDs depuis @id si nécessaire
        const feedsWithId = allFeeds.map((feed) => {
          if (feed.id) return feed;
          if (feed["@id"]) {
            const match = feed["@id"].match(/\/(\d+)$/);
            if (match) {
              return { ...feed, id: match[1] };
            }
          }
          return feed;
        });

        setFeeds(feedsWithId);

        // Sélection automatique du premier flux si disponible
        if (feedsWithId.length > 0) {
          setSelectedId(feedsWithId[0].id?.toString() || "");
        }
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeeds();
  }, []);

  // Gestion de la soumission du formulaire de suppression
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation de la sélection
    if (!selectedId) {
      setMessage("Veuillez sélectionner un flux.");
      return;
    }
    
    // Demande de confirmation avant suppression
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce flux ?"
    );
    if (!confirmed) return;
    
    try {
      // Envoi de la requête de suppression à l'API
      const response = await fetch(
        `http://localhost:8000/api/feed_sources/${selectedId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      // Vérification de la réponse
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData["description"] || "Erreur lors de la suppression"
        );
      }

      // Message de succès
      setMessage("Flux supprimé avec succès !");
      
      // IMPORTANT: Déclencher l'événement de rafraîchissement
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fluxAdded'));
      }
      
      // Redirection vers la page sources
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Rendu du composant
  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow bg-orange-50">
      <h1 className="text-2xl font-bold mb-4">Supprimer un flux RSS</h1>

      {/* Affichage des messages d'état */}
      {message && (
        <div className={`mb-4 text-center text-sm font-semibold ${
          message.includes('succès') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading ? (
        <p className="text-center text-gray-600">Chargement des flux...</p>
      ) : (
        /* Formulaire de sélection du flux à supprimer */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedSelect" className="block font-medium mb-1">
              Sélectionnez un flux à supprimer ({feeds.length} flux disponibles)
            </label>
            <select
              id="feedSelect"
              className="w-full p-2 border rounded bg-orange-100 hover:bg-orange-200"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
            >
              {/* Affichage conditionnel selon la disponibilité des flux */}
              {feeds.length === 0 ? (
                <option key="no-feed" value="">
                  Aucun flux disponible
                </option>
              ) : (
                // Liste des flux disponibles
                feeds.map((feed) => (
                  <option
                    key={feed.id?.toString() || feed.name}
                    value={feed.id}
                  >
                    {feed.name} ({feed.type || 'Sans catégorie'})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Bouton de suppression */}
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 hover:scale-105 transition-all duration-300"
            disabled={feeds.length === 0}
          >
            Supprimer
          </button>
        </form>
      )}
    </div>
  );
}