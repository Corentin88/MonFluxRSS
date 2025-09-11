"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AjoutFlux() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [type, setType] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);

    try {
      const response = await fetch("http://localhost:8000/api/feed_sources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ name, url, type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData["hydra:description"] || "Erreur lors de l'ajout"
        );
      }

      setMessage("Flux ajouté avec succès !");
      setName("");
      setUrl("");
      setType("");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow bg-orange-50">
      <h1 className="text-2xl font-bold mb-4">Ajouter un flux RSS</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
