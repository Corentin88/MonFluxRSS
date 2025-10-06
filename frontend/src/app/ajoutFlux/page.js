// Directive pour indiquer que ce composant s'exécute côté client
"use client";
// Importation des hooks nécessaires de React
import { useState } from "react";
// Importation du hook de navigation de Next.js
import { useRouter } from "next/navigation";
// Importation du composant Link pour la navigation
import Link from "next/link";

// Composant principal pour l'ajout d'un flux RSS
export default function AjoutFlux() {
  // États pour gérer les données du formulaire
  const [name, setName] = useState("");        // Nom du flux
  const [url, setUrl] = useState("");          // URL du flux
  const [message, setMessage] = useState(null); // Message de statut (succès/erreur)
  const [type, setType] = useState("");        // Type de flux (catégorie)

  // Initialisation du routeur pour la navigation
  const router = useRouter();

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    setMessage(null); // Réinitialise les messages précédents

    try {
      // Envoi de la requête POST à l'API pour créer un nouveau flux
      const response = await fetch("http://localhost:8000/api/feed_sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Récupération du token JWT depuis le stockage local pour l'authentification
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        // Envoi des données du formulaire au format JSON
        body: JSON.stringify({ name, url, type }),
      });

      // Vérification si la réponse est OK (statut 2xx)
      if (!response.ok) {
        // En cas d'erreur, on extrait le message d'erreur de la réponse
        const errorData = await response.json();
        throw new Error(
          errorData["hydra:description"] || "Erreur lors de l'ajout"
        );
      }

      // Si la réponse est OK, on affiche un message de succès et on réinitialise les champs du formulaire
      setMessage("Flux ajouté avec succès !");
      setName("");
      setUrl("");
      setType("");
      // Redirection vers la page d'accueil après 2 secondes
      // IMPORTANT: Déclencher l'événement de rafraîchissement
      // Envoyer un événement personnalisé que la page Sources peut écouter
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fluxAdded'));
      }
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      // En cas d'erreur, on affiche le message d'erreur
      setMessage(error.message);
    }
  };

  // Retourne le JSX pour le formulaire d'ajout de flux
  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow bg-orange-50">
      <h1 className="text-2xl font-bold mb-4">Ajouter un flux RSS</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ pour le nom du flux RSS */}
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-orange-100 hover:bg-orange-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Champ pour l'URL du flux RSS */}
        <div>
          <label className="block font-medium">URL</label>
          <input
            type="url"
            className="w-full p-2 border rounded bg-orange-100 hover:bg-orange-200"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        {/* Sélecteur de catégorie pour le flux */}
        <div>
          <label className="block font-medium">Type</label>
          <select
            name="type"
            className="w-full p-2 border rounded bg-orange-100 hover:bg-orange-200"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">-- Sélectionnez un type --</option>
            <option value="veille techno">Veille techno</option>
            <option value="jeux video">Jeux vidéo</option>
            <option value="cuisine">Cuisine</option>
            <option value="science et spatial">Science et spatial</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-black font-bold text-lg hover:scale-105 transition-all duration-300 px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>
      {message && (
        <div className="mt-4 text-center text-sm font-semibold text-green-600">
          {message}
        </div>
      )}{" "}
      <div className="mt-6 text-center">
        <Link
          href="/deleteFlux"
          className="text-orange-600 underline hover:text-orange-800"
        >
          Supprimer un flux
        </Link>
      </div>
    </div>
  );
}
