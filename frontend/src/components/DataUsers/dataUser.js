"use client";
// Importation des dépendances nécessaires
import { useAuth } from "@/context/AuthContext"; // Hook personnalisé pour la gestion de l'authentification
import { useState } from "react"; // Hook d'état de React
import { useRouter } from "next/navigation"; // Hook de routage de Next.js
import api from "@/services/api"; // Notre nouveau service d'API

/**
 * Composant LoginBox - Gère le formulaire de connexion utilisateur
 * @param {Function} onLogin - Callback exécuté après une connexion réussie
 * @returns {JSX.Element} Le formulaire de connexion
 */
export default function LoginBox({ onLogin }) {
  // États locaux du composant
  const [email, setEmail] = useState(""); // État pour l'email saisi
  const [password, setPassword] = useState(""); // État pour le mot de passe saisi
  const [loading, setLoading] = useState(false); // État pour gérer l'affichage du chargement
  const [error, setError] = useState(""); // État pour stocker les messages d'erreur

  // Récupération des fonctions et états du contexte d'authentification
  const { isLogged, login } = useAuth();

  // Initialisation du routeur pour la navigation
  const router = useRouter();

  /**
   * Gère la soumission du formulaire de connexion
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setLoading(true); // Active l'état de chargement
    setError(""); // Réinitialise les erreurs précédentes

    try {
      // Utilisation du service d'API pour la connexion
      const { token } = await api.post("/api/login", { email, password });

      // 1️⃣ Stockage du JWT via le contexte d'authentification
      login(token);

      // 2️⃣ Notification du composant parent (si une fonction onLogin est fournie)
      onLogin?.();

      // 3️⃣ Réinitialisation des champs du formulaire
      setEmail("");
      setPassword(""); 
      // Redirection vers la page d'accueil après connexion réussie
      router.push("/");
    } catch (err) {
      // Gestion des erreurs
      setError(err.message || "Identifiants invalides");
      setTimeout(() => setError(""), 5000);
    } finally {
      // Désactivation de l'état de chargement dans tous les cas
      setLoading(false);
    }
  };

  // Rendu du formulaire de connexion
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      {/* Champ email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded bg-orange-50 placeholder:text-gray-900"
      />

      {/* Champ mot de passe */}
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded placeholder:text-gray-900 bg-orange-50"
      />

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={loading} // Désactive le bouton pendant le chargement
        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold text-lg hover:scale-105 transition-all duration-300 p-2 rounded disabled:opacity-50"
      >
        {loading ? "Connexion…" : "Connexion"}
      </button>

      {/* Affichage des erreurs */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
