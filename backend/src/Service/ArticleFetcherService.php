<?php

namespace App\Service;

use App\Repository\FeedSourceRepository;
use App\Repository\ArticleRepository;
use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use FeedIo\FeedIo;
use FeedIo\Adapter\Http\Client as FeedIoHttpClient;
use Symfony\Component\HttpClient\HttplugClient;
use Psr\Log\NullLogger;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * Service de récupération et de stockage des articles depuis des flux RSS
 * 
 * Ce service est responsable de la récupération des articles depuis différentes sources RSS,
 * du traitement des données et de leur stockage en base de données.
 */
class ArticleFetcherService
{
    /**
     * @var FeedIo Client pour la lecture des flux RSS
     */
    private FeedIo $feedIo;

    /**
     * @var HttpClientInterface Client HTTP pour les requêtes personnalisées
     */
    private HttpClientInterface $httpClient;

    /**
     * Constructeur du service
     * 
     * @param FeedSourceRepository $feedRepo Repository des sources de flux
     * @param ArticleRepository $articleRepo Repository des articles
     * @param EntityManagerInterface $em Gestionnaire d'entités Doctrine
     * @param HttpClientInterface $httpClient Client HTTP Symfony
     */
    public function __construct(
        private FeedSourceRepository $feedRepo,
        private ArticleRepository $articleRepo,
        private EntityManagerInterface $em,
        HttpClientInterface $httpClient
    ) {
        // Initialisation du client FeedIo avec Httplug
        $client = new FeedIoHttpClient(new HttplugClient());
        $this->feedIo = new FeedIo($client, new NullLogger());
        $this->httpClient = $httpClient;
    }

    /**
     * Récupère et stocke les articles depuis tous les flux configurés
     * 
     * Cette méthode :
     * 1. Supprime les articles de plus de 7 jours
     * 2. Parcourt tous les flux RSS configurés
     * 3. Utilise un parseur spécifique pour korben.info ou le parseur générique
     * 4. Stocke les nouveaux articles en base de données
     * 
     * @return int Nombre de nouveaux articles ajoutés
     */
    public function fetchAndStoreArticles(): int
    {
        // Récupération de tous les flux configurés
        $feeds = $this->feedRepo->findAll();
        $newArticlesCount = 0;
        
        // Définition de la date limite pour la conservation des articles
        $sevenDaysAgo = new \DateTimeImmutable('-7 days');

        // Suppression des articles de plus de 7 jours
        $this->em->createQueryBuilder()
            ->delete(Article::class, 'a')
            ->where('a.publishedAt < :limit')
            ->setParameter('limit', $sevenDaysAgo)
            ->getQuery()
            ->execute();

        // Parcours de tous les flux
        foreach ($feeds as $feedSource) {
            try {
                // Traitement spécial pour korben.info
                if (str_contains($feedSource->getUrl(), 'korben.info')) {
                    $newArticlesCount += $this->fetchKorbenFeed($feedSource, $sevenDaysAgo);
                } else {
                    // Traitement standard pour les autres flux
                    $result = $this->feedIo->read($feedSource->getUrl());
                    foreach ($result->getFeed() as $item) {
                        // Gestion de la date de publication
                        $publishedAt = $item->getLastModified()
                            ? \DateTimeImmutable::createFromMutable($item->getLastModified())
                            : new \DateTimeImmutable();

                        // Vérification de la date de publication
                        if ($publishedAt < $sevenDaysAgo) {
                            continue;
                        }

                        // Vérification des doublons
                        $guid = $item->getLink();
                        if ($this->articleRepo->findOneBy(['guid' => $guid])) {
                            continue;
                        }

                        // Création du nouvel article
                        $article = new Article();
                        $article->setTitle($item->getTitle() ?? 'Sans titre');

                        // Extraction du contenu
                        $content = $item->getContent();
                        if (is_object($content) && method_exists($content, 'getValue')) {
                            $description = $content->getValue();
                        } else {
                            $description = (string) $content;
                        }

                        // Configuration de l'article
                        $article->setDescription($description ?? '');
                        $article->setLink($item->getLink());
                        $article->setGuid($guid);
                        $article->setPublishedAt($publishedAt);
                        $article->setFeedSource($feedSource);

                        $this->em->persist($article);
                        $newArticlesCount++;
                    }
                }
            } catch (\Exception $e) {
                // En cas d'erreur, on passe au flux suivant
                continue;
            }
        }

        // Enregistrement des modifications en base de données
        $this->em->flush();

        return $newArticlesCount;
    }

    /**
     * Traitement spécifique pour le flux de korben.info
     * 
     * Cette méthode gère le format spécifique du flux RSS de korben.info
     * qui nécessite un traitement particulier.
     * 
     * @param object $feedSource La source de flux à traiter
     * @param \DateTimeImmutable $sevenDaysAgo Date limite pour la récupération
     * @return int Nombre de nouveaux articles ajoutés
     */
    private function fetchKorbenFeed($feedSource, \DateTimeImmutable $sevenDaysAgo): int
    {
        $count = 0;

        try {
            // Récupération du flux XML
            $response = $this->httpClient->request('GET', $feedSource->getUrl());
            $xmlString = $response->getContent();
        } catch (\Exception $e) {
            return 0;
        }

        // Traitement du XML avec DOMDocument
        $dom = new \DOMDocument();
        @$dom->loadXML($xmlString);
        $xpath = new \DOMXPath($dom);
        $xpath->registerNamespace('content', 'http://purl.org/rss/1.0/modules/content/');

        // Parcours des éléments du flux
        $items = $dom->getElementsByTagName('item');

        foreach ($items as $itemNode) {
            // Extraction du lien
            $linkNodes = $itemNode->getElementsByTagName('link');
            $link = $linkNodes->length > 0 ? $linkNodes->item(0)->nodeValue : null;
            
            // Vérification des doublons
            if (!$link || $this->articleRepo->findOneBy(['guid' => $link])) {
                continue;
            }

            // Extraction de la date de publication
            $pubDateNodes = $itemNode->getElementsByTagName('pubDate');
            $pubDateStr = $pubDateNodes->length > 0 ? $pubDateNodes->item(0)->nodeValue : null;
            $publishedAt = $pubDateStr ? new \DateTimeImmutable($pubDateStr) : new \DateTimeImmutable();

            // Vérification de la date
            if ($publishedAt < $sevenDaysAgo) {
                continue;
            }

            // Extraction du titre
            $titleNodes = $itemNode->getElementsByTagName('title');
            $title = $titleNodes->length > 0 ? $titleNodes->item(0)->nodeValue : 'Sans titre';

            // Extraction de la description
            $descriptionNodes = $itemNode->getElementsByTagName('description');
            $description = $descriptionNodes->length > 0 ? $descriptionNodes->item(0)->nodeValue : '';

            // Extraction du contenu encodé (si disponible)
            $contentEncodedNodes = $xpath->query('content:encoded', $itemNode);
            $contentEncoded = $contentEncodedNodes->length > 0 ? $contentEncodedNodes->item(0)->nodeValue : null;

            // Utilisation du contenu encodé ou de la description
            $finalDescription = $contentEncoded ?? $description ?? '';

            // Création et configuration de l'article
            $article = new Article();
            $article->setTitle($title);
            $article->setDescription($finalDescription);
            $article->setLink($link);
            $article->setGuid($link);
            $article->setPublishedAt($publishedAt);
            $article->setFeedSource($feedSource);

            $this->em->persist($article);
            $count++;
        }

        return $count;
    }
}
