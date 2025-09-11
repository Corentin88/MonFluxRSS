<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Doctrine\ORM\EntityManagerInterface;

use FeedIo\FeedIo;
use FeedIo\Adapter\Http\Client as FeedIoHttpClient;
use Symfony\Component\HttpClient\HttplugClient;
use Psr\Log\NullLogger;

use App\Entity\FeedSource;
use App\Entity\Article;

#[AsCommand(
    name: 'app:import-rss',
    description: 'Import RSS feeds and articles',
)]
class ImportRssCommand extends Command
{
    private EntityManagerInterface $em;
    private FeedIo $feedIo;
    
    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;

        $client = new FeedIoHttpClient(new HttplugClient());
        $logger = new NullLogger();

        $this->feedIo = new FeedIo($client, $logger);
    }

    protected function configure(): void
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Suppression des articles vieux de plus de 15 jours
        $limitDate = (new \DateTimeImmutable())->modify('-7 days');
        $this->em->createQueryBuilder()
            ->delete(Article::class, 'a')
            ->where('a.publishedAt < :limit')
            ->setParameter('limit', $limitDate)
            ->getQuery()->execute();

        $feedSources = $this->em->getRepository(FeedSource::class)->findAll();
        $totalImported = 0;

        foreach ($feedSources as $feedSource) {
            $io->writeln("Import du flux : " . $feedSource->getName());

            try {
                $result = $this->feedIo->read($feedSource->getUrl());
            } catch (\Exception $e) {
                $io->error("Erreur lors de la lecture du flux " . $feedSource->getUrl() . " : " . $e->getMessage());
                continue;
            }

            $feed = $result->getFeed();
            $imported = 0;

            foreach ($feed as $item) {
                $link = $item->getLink();
                $guid = $item->getLink();

                $existing = $this->em->getRepository(Article::class)->findOneBy(['guid' => $guid]);
                if ($existing) {
                    continue;
                }

                $article = new Article();
                $article->setTitle($item->getTitle() ?? 'Sans titre');
                $article->setDescription($item->getContent() ?? '');
                $article->setLink($link);
                $article->setGuid($guid);
                $date = $item->getLastModified();
                if (!$date || $date > new \DateTimeImmutable('+1 day')) {
                    $date = new \DateTimeImmutable();
                } elseif (!$date instanceof \DateTimeImmutable) {
                    $date = \DateTimeImmutable::createFromMutable($date);
                }
                $article->setPublishedAt($date);    
                $article->setFeedSource($feedSource);

                $this->em->persist($article);
                $imported++;
            }

            $totalImported += $imported;
            $io->success("$imported articles importés pour " . $feedSource->getName());
        }

        $this->em->flush();

        $io->success("Import terminé. $totalImported nouveaux articles importés.");

        return Command::SUCCESS;
    }
}
