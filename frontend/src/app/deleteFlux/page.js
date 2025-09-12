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
  
  // Hook de navigation de Next.js
  const router = useRouter();

  // Récupération de la liste des flux au chargement du composant
  useEffect(() => {
    async function fetchFeeds() {
      try {
        // Récupération des flux depuis l'API
        const response = await fetch("http://localhost:8000/api/feed_sources", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des flux");
        
        const data = await response.json();
        const feedList = data["member"] || [];

        // Nettoyage des données : extraction des IDs depuis @id si nécessaire
        const feedsWithId = feedList.map((feed) => {
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

      // Message de succès et redirection
      setMessage("Flux supprimé avec succès !");
      setTimeout(() => {
        router.push("/");
      }, 2000);
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
        <div className="mb-4 text-center text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

      {/* Formulaire de sélection du flux à supprimer */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedSelect" className="block font-medium mb-1">
            Sélectionnez un flux à supprimer
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
                  key={feed.id?.toString() || "feed.name"}
                  value={feed.id}
                >
                  {feed.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Bouton de suppression */}
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 hover:scale-105 transition-all duration-300"
        >
          Supprimer
        </button>
      </form>
    </div>
  );
}
