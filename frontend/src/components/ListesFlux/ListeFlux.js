"use client";
import { useEffect, useState } from "react";

export default function ListeFlux({ onData }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/feed_sources", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erreur HTTP " + response.status);

        const data = await response.json();
        const sources = data["hydra:member"] || data.member || [];

        const groupedFlux = sources.reduce((acc, item) => {
          if (!acc[item.type]) acc[item.type] = [];
          acc[item.type].push(item.name);
          return acc;
        }, {});

        onData(groupedFlux);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des flux");
      }
    };

    fetchFlux();
  }, [onData]);

  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return null;
}
