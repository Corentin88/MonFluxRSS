// Importation du composant ArticleFlux qui affiche la liste des articles
import ArticleFlux from "@/components/ArticlesFlux/articleflux";

// Composant de la page d'accueil
export default function Home() {
  return (
    // Conteneur principal avec une marge supérieure
    <div className="mt-20">
      {/* Intégration du composant qui affiche les articles des flux RSS */}
      <ArticleFlux />
    </div>
  );
}
