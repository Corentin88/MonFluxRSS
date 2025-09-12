"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SelectFlux from "../SelecteurFlux/SelectFlux";
import Search from "../SearchBar/search";

// Composant principal pour afficher la liste des articles
// Gère le chargement, la pagination, la recherche et l'affichage des articles
export default function ArticleFlux() {
  // États pour gérer les erreurs, les articles, le chargement, etc.
  const [error, setError] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [prevPage, setPrevPage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 30; // Nombre d'articles par page
  const [selectedType, setSelectedType] = useState("veille techno"); // Type de flux sélectionné
  const [search, setSearch] = useState(""); // Terme de recherche
  const [showScrollButton, setShowScrollButton] = useState(false); // Afficher le bouton de défilement

  const router = useRouter();

  // Fonction pour générer les numéros de page à afficher dans la pagination
  const getPageNumbers = () => {
    const pages = [];
    // Si moins de 7 pages, on les affiche toutes
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Sinon, on ajoute des points de suspension pour les pages éloignées
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // Fonction pour tronquer le texte trop long
  function truncateText(text, maxLength = 200) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  }

  // Fonction pour extraire l'ID d'une vidéo YouTube à partir d'une URL
  function extractYouTubeId(url) {
    try {
      const parsedUrl = new URL(url);
      // Cas 1 : lien classique "watch?v="
      if (parsedUrl.hostname.includes("youtube.com") && parsedUrl.searchParams.get("v")) {
        return parsedUrl.searchParams.get("v");
      }
      // Cas 2 : lien court "youtu.be/xxxx"
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      }
      // Cas 3 : shorts "youtube.com/shorts/xxxx"
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/")[2];
      }
      return null;
    } catch {
      return null;
    }
  }

  // Fonction pour récupérer les articles depuis l'API
  const fetchArticles = useCallback(
    async (page = 1, type = selectedType, searchQuery = search) => {
      const url = new URL("http://localhost:8000/api/articles");
      url.searchParams.set("page", page);
      if (type) url.searchParams.set("feedSource.type", type);
      if (searchQuery) url.searchParams.set("q", searchQuery);

    setLoading(true);
    setError("");
    let pageNumber = page;

    // Gestion de la pagination côté client
    if (typeof page === "string") {
      try {
        const url = new URL("http://localhost:8000" + page);
        pageNumber = parseInt(url.searchParams.get("page") || "1");
      } catch {
        pageNumber = 1;
      }
    }

    try {
      // Appel à l'API pour récupérer les articles
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Articles non trouvés");

      // Mise à jour de l'état avec les données reçues
      const data = await res.json();
      setArticles(data.member || []);
      setNextPage(data.view?.next || "");
      setPrevPage(data.view?.previous || "");
      setCurrentPage(pageNumber);
      setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, 
  [selectedType, search]
);


  // Effet pour charger les articles lorsque le type sélectionné change
  useEffect(() => {
    fetchArticles(1);
  }, [fetchArticles]);

  // Effet pour gérer l'affichage du bouton de défilement
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  // Fonction pour faire défiler vers le haut de la page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Gestion du clic sur un article
  const handleClick = (articleId) => {
    router.push(`/articles/${articleId}`);
  };

  // Gestion de la recherche
  const handleSearch = (q) => {
    setSearch(q);
    fetchArticles(1, selectedType, q);
  };

  // Rendu du composant
  return (
    <>
      {/* Sélecteur de flux */}
      <div className="mb-4">
        <SelectFlux value={selectedType} onChange={setSelectedType} />
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-4">
        <Search onSearch={handleSearch} />
      </div>
      
      {/* Conteneur principal */}
      <div className="flex flex-col items-center justify-center w-full px-4">
        <h1 className="text-xl font-bold mb-4">Articles</h1>

        {/* Affichage du chargement ou des erreurs */}
        {loading && <p>Chargement...</p>}
        {error && <p className="text-gray-800">{error}</p>}

        {/* Liste des articles */}
        <ul className="space-y-4 w-full break-words inline-block">
          {articles.map(({ id, title, publishedAt, description, feedSource, link }) => {
            const videoId = extractYouTubeId(link);
            const isYouTube = Boolean(videoId);

            return (
              <li
                key={id}
                onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
                className="cursor-pointer border p-4 rounded bg-orange-50 hover:bg-orange-200 hover:scale-104 transition-all duration-200 w-full shadow-lg"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    window.open(link, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(publishedAt).toLocaleDateString()}
                </p>

                {/* Affichage conditionnel pour les vidéos YouTube */}
                {isYouTube ? (
                  <div className="mt-4">
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic au parent
                    />
                  </div>
                ) : (
                  // Affichage du contenu de l'article
                  <p
                    className="description-content mt-1 text-gray-700 text-sm bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}

                {/* Affichage de la source de l'article */}
                <p className="mt-2 text-xs italic text-gray-600">
                  Source: {feedSource?.name || "Source inconnue"}
                </p>

                {/* Lien vers l'article original (sauf pour les vidéos YouTube) */}
                {!isYouTube && (
                  <p className="mt-2 text-xs italic text-gray-600">
                    Lien: {link}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-4 py-2">
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

      {/* Bouton de retour en haut de page */}
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
