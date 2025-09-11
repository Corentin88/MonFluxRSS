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

class ArticleFetcherService
{
    private FeedIo $feedIo;
    private HttpClientInterface $httpClient;

    public function __construct(
        private FeedSourceRepository $feedRepo,
        private ArticleRepository $articleRepo,
        private EntityManagerInterface $em,
        HttpClientInterface $httpClient
    ) {
        $client = new FeedIoHttpClient(new HttplugClient());
        $this->feedIo = new FeedIo($client, new NullLogger());
        $this->httpClient = $httpClient;
    }

    public function fetchAndStoreArticles(): int
    {
        $feeds = $this->feedRepo->findAll();
        $newArticlesCount = 0;
        $sevenDaysAgo = new \DateTimeImmutable('-7 days');

        // Suppression des anciens articles
        $this->em->createQueryBuilder()
            ->delete(Article::class, 'a')
            ->where('a.publishedAt < :limit')
            ->setParameter('limit', $sevenDaysAgo)
            ->getQuery()
            ->execute();

        foreach ($feeds as $feedSource) {
            try {
                if (str_contains($feedSource->getUrl(), 'korben.info')) {
                    $newArticlesCount += $this->fetchKorbenFeed($feedSource, $sevenDaysAgo);
                } else {
                    $result = $this->feedIo->read($feedSource->getUrl());
foreach ($result->getFeed() as $item) {
    $publishedAt = $item->getLastModified()
        ? \DateTimeImmutable::createFromMutable($item->getLastModified())
        : new \DateTimeImmutable();

    if ($publishedAt < $sevenDaysAgo) {
        continue;
    }

    $guid = $item->getLink();
    if ($this->articleRepo->findOneBy(['guid' => $guid])) {
        continue;
    }

    $article = new Article();
    $article->setTitle($item->getTitle() ?? 'Sans titre');

    $content = $item->getContent();
    if (is_object($content) && method_exists($content, 'getValue')) {
        $description = $content->getValue();
    } else {
        $description = (string) $content;
    }

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
                continue;
            }
        }

        $this->em->flush();

        return $newArticlesCount;
    }

    private function fetchKorbenFeed($feedSource, \DateTimeImmutable $sevenDaysAgo): int
    {
        $count = 0;

        try {
            $response = $this->httpClient->request('GET', $feedSource->getUrl());
            $xmlString = $response->getContent();
        } catch (\Exception $e) {
            return 0;
        }

        $dom = new \DOMDocument();
        @$dom->loadXML($xmlString);
        $xpath = new \DOMXPath($dom);
        $xpath->registerNamespace('content', 'http://purl.org/rss/1.0/modules/content/');

        $items = $dom->getElementsByTagName('item');

        foreach ($items as $itemNode) {
            $linkNodes = $itemNode->getElementsByTagName('link');
            $link = $linkNodes->length > 0 ? $linkNodes->item(0)->nodeValue : null;
            if (!$link || $this->articleRepo->findOneBy(['guid' => $link])) {
                continue;
            }

            $pubDateNodes = $itemNode->getElementsByTagName('pubDate');
            $pubDateStr = $pubDateNodes->length > 0 ? $pubDateNodes->item(0)->nodeValue : null;
            $publishedAt = $pubDateStr ? new \DateTimeImmutable($pubDateStr) : new \DateTimeImmutable();

            if ($publishedAt < $sevenDaysAgo) {
                continue;
            }

            $titleNodes = $itemNode->getElementsByTagName('title');
            $title = $titleNodes->length > 0 ? $titleNodes->item(0)->nodeValue : 'Sans titre';

            $descriptionNodes = $itemNode->getElementsByTagName('description');
            $description = $descriptionNodes->length > 0 ? $descriptionNodes->item(0)->nodeValue : '';

            $contentEncodedNodes = $xpath->query('content:encoded', $itemNode);
            $contentEncoded = $contentEncodedNodes->length > 0 ? $contentEncodedNodes->item(0)->nodeValue : null;

            $finalDescription = $contentEncoded ?? $description ?? '';

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
