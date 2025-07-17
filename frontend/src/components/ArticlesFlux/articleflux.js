"use client";
// Importation des dépendances nécessaires
import { useState, useEffect } from "react"; // Hook d'état de React
import { useRouter } from "next/navigation"; // Hook de routage de Next.js

/**
 * Composant LoginBox - Gère le formulaire de connexion utilisateur
 * @param {Function} onLogin - Callback exécuté après une connexion réussie
 * @returns {JSX.Element} Le formulaire de connexion
 */
export default function ArticleFlux() {
  // États locaux du composant
  const [error, setError] = useState(""); // État pour stocker les messages d'erreur
  const [articles, setArticles] = useState([]); // État pour stocker les articles
  const [loading, setLoading] = useState(false); // État pour gérer l'affichage du chargement
  const [nextPage, setNextPage] = useState(""); // État pour stocker le lien de la page suivante
  const [prevPage, setPrevPage] = useState(""); // État pour stocker le lien de la page précédente
  const [currentPage, setCurrentPage] = useState(1); // État pour stocker le numéro de la page actuelle
  const [totalPages, setTotalPages] = useState(0); // État pour stocker le nombre total de pages
  const itemsPerPage = 10;
  // Initialisation du routeur pour la navigation
  const router = useRouter();
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) pages.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };
  /**
   * Gère la soumission du formulaire de connexion
   * @param {Event} e - L'événement de soumission du formulaire
   */
  function truncateText(text, maxLength = 200) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  }
  const fetchArticles = async (page = 1) => {
    setLoading(true);
    setError("");
    let pageNumber = page;

    // Si page est une URL (string), on extrait le numéro de page
    if (typeof page === "string") {
      try {
        const url = new URL("http://localhost:8000" + page);
        pageNumber = parseInt(url.searchParams.get("page") || "1");
      } catch {
        pageNumber = 1;
      }
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/articles?page=${pageNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Articles non trouvés");

      const data = await res.json();

      // Mise à jour de l'état avec les nouvelles données
      setArticles(data.member || []);
      setNextPage(data.view?.next || "");
      setPrevPage(data.view?.previous || "");
      setCurrentPage(pageNumber);
      setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArticles(1);
  }, []);
  const handleClick = (articleId) => {
    router.push(`/articles/${articleId}`);
  };
  // Rendu du formulaire de connexion
  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <h1 className="text-xl font-bold mb-4 ">Articles</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-gray-800">{error}</p>}

      <ul className="space-y-4 w-full break-all inline-block">
        {articles.map(
          ({ id, title, publishedAt, description, feedSource, link }) => (
            <li
              key={id}
              className="cursor-pointer border p-4 rounded bg-gray-50 hover:bg-gray-200 hover:scale-104 transition-all duration-200 w-full shadow-lg"
            >
              <a href={link} target="_blank" rel="noopener noreferrer">
              <h2 className="text-lg font-semibold">{title}</h2>
              
              <p className="text-sm text-gray-600">
                {new Date(publishedAt).toLocaleDateString()}
              </p>
              <p className="description-content mt-1 text-gray-700 text-sm bg-gray-50" dangerouslySetInnerHTML={{ __html: description }} />
              <p className="mt-2 text-xs italic text-gray-600">
                Source: {feedSource}
              </p>
              <p className="mt-2 text-xs italic text-gray-600 ">
                Lien: {link}
              </p></a>
            </li>
          )
        )}
      </ul>
      <div className="flex justify-center items-center mt-4">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-4 py-2 ">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => {
                fetchArticles(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`m-2 px-4 py-2 rounded 
              ${
                page === currentPage
                  ? "bg-orange-500 text-white"
                  : "bg-gray-500 text-white hover:bg-orange-400"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
}
