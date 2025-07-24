"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AjoutFlux() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(null);

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
        body: JSON.stringify({ name, url }),
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
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ajouter un flux RSS</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">URL</label>
          <input
            type="url"
            className="w-full p-2 border rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
        <Link href="/deleteFlux" className="text-blue-600 underline hover:text-blue-800">
          Supprimer un flux
        </Link>
      </div>
    </div>
  );
}
