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

class ArticleFetcherService
{
    private FeedIo $feedIo;

    public function __construct(
        private FeedSourceRepository $feedRepo,
        private ArticleRepository $articleRepo,
        private EntityManagerInterface $em
    ) {
        $client = new FeedIoHttpClient(new HttplugClient());
        $this->feedIo = new FeedIo($client, new NullLogger());
    }

    public function fetchAndStoreArticles(): int
    {
        $feeds = $this->feedRepo->findAll();
        $newArticlesCount = 0;
        $sevenDaysAgo = new \DateTimeImmutable('-7 days');

        $this->em->createQueryBuilder()
            ->delete(Article::class, 'a')
            ->where('a.publishedAt < :limit')
            ->setParameter('limit', $sevenDaysAgo)
            ->getQuery()
            ->execute();

        foreach ($feeds as $feedSource) {
            try {
                $result = $this->feedIo->read($feedSource->getUrl());
            } catch (\Exception $e) {
                continue; // log ou ignore
            }

            foreach ($result->getFeed() as $item) {
                $publishedAt = $item->getLastModified() ? \DateTimeImmutable::createFromMutable($item->getLastModified()) : new \DateTimeImmutable();
                if ($publishedAt < $sevenDaysAgo) {
                    continue;
                }

                $guid = $item->getLink(); // ou autre si le guid est disponible
                if ($this->articleRepo->findOneBy(['guid' => $guid])) {
                    continue;
                }

                $article = new Article();
                $article->setTitle($item->getTitle() ?? 'Sans titre');
                $article->setDescription($item->getContent() ?? '');
                $article->setLink($item->getLink());
                $article->setGuid($guid);
                $article->setPublishedAt($publishedAt);
                $article->setFeedSource($feedSource);

                $this->em->persist($article);
                $newArticlesCount++;
            }
        }

        $this->em->flush();

        return $newArticlesCount;
    }
}
