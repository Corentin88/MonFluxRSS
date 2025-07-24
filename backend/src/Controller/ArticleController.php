<?php

namespace App\Controller;

use App\Service\ArticleFetcherService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ArticleController extends AbstractController
{
#[Route('/api/update-articles', name: 'app_update_articles', methods: ['POST'])]
public function updateArticles(ArticleFetcherService $articleFetcher): JsonResponse
{
    $count = $articleFetcher->fetchAndStoreArticles();

    return $this->json(['message' => "$count nouveaux articles ajoutés."]);
}
}