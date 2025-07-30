"use client";
// Importation des dépendances nécessaires
import { useState, useEffect } from "react"; // Hook d'état de React
import { useRouter } from "next/navigation"; // Hook de routage de Next.js
import SelectFlux from "../SelecteurFlux/SelectFlux";
import Search from "../SearchBar/search";
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
  const itemsPerPage = 30;
  const [selectedType, setSelectedType] = useState("veille techno");
  const [search, setSearch] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

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
  const fetchArticles = async (
    page = 1,
    type = selectedType,
    searchQuery = search
  ) => {
    const url = new URL("http://localhost:8000/api/articles");
    url.searchParams.set("page", page);
    if (type) url.searchParams.set("feedSource.type", type);
    if (searchQuery) {
      url.searchParams.set("q", searchQuery );
    }

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
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Articles non trouvés");

      const data = await res.json();
      console.log("Réponse complète de l'API :", data);
      // Mise à jour de l'état avec les nouvelles données
      setArticles(data.member|| []);
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
    fetchArticles(1, selectedType, search);
  }, [selectedType]);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) { 
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleClick = (articleId) => {
    router.push(`/articles/${articleId}`);
  };
  const handleSearch = (q) => {
    setSearch(q);
    fetchArticles(1, selectedType, q);
  };
  // Rendu du formulaire de connexion
  return (
    <>
      {/* Intégration de SelectFlux */}
      <div className="mb-4">
        <SelectFlux value={selectedType} onChange={setSelectedType} />
      </div>
      {/* Intégration de Search */}
      <div className="mb-4">
        <Search onSearch={handleSearch} />
      </div>
      <div className="flex flex-col items-center justify-center w-full px-4 ">
        <h1 className="text-xl font-bold mb-4 ">Articles</h1>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-gray-800">{error}</p>}

        <ul className="space-y-4 w-full break-words inline-block">
          {articles.map(
            ({ id, title, publishedAt, description, feedSource, link }) => (
              <li
                key={id}
                className="cursor-pointer border p-4 rounded bg-orange-50 hover:bg-orange-200 hover:scale-104 transition-all duration-200 w-full shadow-lg"
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <h2 className="text-lg font-semibold ">{title}</h2>

                  <p className="text-sm text-gray-600">
                    {new Date(publishedAt).toLocaleDateString()}
                  </p>
                  <p
                    className="description-content mt-1 text-gray-700 text-sm bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                  <p className="mt-2 text-xs italic text-gray-600">
                    Source: {feedSource?.name || "Source inconnue"}
                  </p>
                  <p className="mt-2 text-xs italic text-gray-600 ">
                    Lien: {link}
                  </p>
                </a>
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
                  fetchArticles(page, selectedType, search);
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
      {/* Bouton de retour en haut */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-30 bg-orange-500 text-white p-5 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 z-50"
          aria-label="Retour en haut de la page"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}
    </>
  );
}
