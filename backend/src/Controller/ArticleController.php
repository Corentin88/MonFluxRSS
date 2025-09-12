<?php

namespace App\Controller;

use App\Service\ArticleFetcherService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Contrôleur pour la gestion des articles
 * 
 * Ce contrôleur expose des endpoints API pour la gestion des articles,
 * notamment pour la mise à jour des articles depuis les flux RSS.
 */
class ArticleController extends AbstractController
{
    /**
     * Met à jour les articles en les récupérant depuis les flux RSS
     * 
     * Cette méthode est accessible via une requête POST sur /api/update-articles
     * Elle déclenche la récupération et le stockage des nouveaux articles
     * depuis les flux RSS configurés.
     * 
     * @param ArticleFetcherService $articleFetcher Service de récupération des articles
     * @return JsonResponse Réponse JSON contenant le nombre d'articles ajoutés
     */
    #[Route('/api/update-articles', name: 'app_update_articles', methods: ['POST'])]
    public function updateArticles(ArticleFetcherService $articleFetcher): JsonResponse
    {
        // Récupération et stockage des nouveaux articles
        $count = $articleFetcher->fetchAndStoreArticles();

        // Retourne une réponse JSON avec le nombre d'articles ajoutés
        return $this->json(['message' => "$count nouveaux articles ajoutés."]);
    }
}