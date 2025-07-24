"use client";
// Importation des dépendances nécessaires
import { useAuth } from "@/context/AuthContext";  // Hook personnalisé pour la gestion de l'authentification
import { useState } from "react";  // Hook d'état de React
import { useRouter } from "next/navigation";  // Hook de routage de Next.js
import api from "@/services/api";  // Notre nouveau service d'API

/**
 * Composant LoginBox - Gère le formulaire de connexion utilisateur
 * @param {Function} onLogin - Callback exécuté après une connexion réussie
 * @returns {JSX.Element} Le formulaire de connexion
 */
export default function LoginBox({ onLogin }) {
  // États locaux du composant
  const [email, setEmail] = useState("");  // État pour l'email saisi
  const [password, setPassword] = useState("");  // État pour le mot de passe saisi
  const [loading, setLoading] = useState(false);  // État pour gérer l'affichage du chargement
  const [error, setError] = useState("");  // État pour stocker les messages d'erreur
  
  // Récupération des fonctions et états du contexte d'authentification
  const { isLogged, login } = useAuth();
  
  // Initialisation du routeur pour la navigation
  const router = useRouter();

  /**
   * Gère la soumission du formulaire de connexion
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Empêche le rechargement de la page
    setLoading(true);  // Active l'état de chargement
    setError("");  // Réinitialise les erreurs précédentes

    try {
      // Utilisation du service d'API pour la connexion
      const { token } = await api.post("/api/login", { email, password });

      // 1️⃣ Stockage du JWT via le contexte d'authentification
      login(token);
      
      // Redirection vers la page d'accueil après connexion réussie
      router.push("/");
      
      // 2️⃣ Notification du composant parent (si une fonction onLogin est fournie)
      onLogin?.();

      // 3️⃣ Réinitialisation des champs du formulaire
      setEmail("");
      setPassword("");
    } catch (err) {
      // Gestion des erreurs
      setError(err.message || "Identifiants invalides");
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
        className="w-full border p-2 rounded"
      />
      
      {/* Champ mot de passe */}
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />
      
      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={loading}  // Désactive le bouton pendant le chargement
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Connexion…" : "Connexion"}
      </button>

      {/* Affichage des erreurs */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
