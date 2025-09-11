"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteFlux() {
  const [feeds, setFeeds] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState(null);
  const router = useRouter();

  // Récupérer la liste des flux au chargement
  useEffect(() => {
    async function fetchFeeds() {
      try {
        const response = await fetch("http://localhost:8000/api/feed_sources", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        if (!response.ok) throw new Error("Erreur lors du chargement des flux");
        const data = await response.json();
        const feedList = data["member"] || [];

        // Extraction des IDs depuis @id
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

        if (feedsWithId.length > 0) {
          setSelectedId(feedsWithId[0].id?.toString() || "");
        }
      } catch (err) {
        setMessage(err.message);
      }
    }
    fetchFeeds();
  }, []);

  // Affichage dans la console pour debug
  // useEffect(() => {
  //   if (feeds.length > 0) {
  //     console.log("Premier feed:", feeds[0]);
  //     console.log(
  //       "Feeds IDs:",
  //       feeds.map((f) => f.id)
  //     );
  //   }
  // }, [feeds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedId) {
      setMessage("Veuillez sélectionner un flux.");
      return;
    }
    // Confirmation avant suppression
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce flux ?"
    );
    if (!confirmed) {
      // Si l'utilisateur annule, on ne fait rien
      return;
    }
    try {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData["description"] || "Erreur lors de la suppression"
        );
      }

      setMessage("Flux supprimé avec succès !");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow bg-orange-50">
      <h1 className="text-2xl font-bold mb-4">Supprimer un flux RSS</h1>

      {message && (
        <div className="mb-4 text-center text-sm font-semibold text-red-600">
          {message}
        </div>
      )}

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
            {feeds.length === 0 ? (
              <option key="no-feed" value="">
                Aucun flux disponible
              </option>
            ) : (
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
