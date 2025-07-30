"use client";

import { useState, useEffect } from "react";

export default function Search({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500); // 500ms après la dernière frappe

    return () => clearTimeout(timer); // Clear si l'utilisateur tape vite
  }, [query]);

  return (
    <div className="flex justify-center">
    <input
      type="text"
      placeholder="Rechercher..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="border p-2 rounded mb-4 bg-orange-50 hover:bg-orange-200 "
    />
    </div>
  );
}