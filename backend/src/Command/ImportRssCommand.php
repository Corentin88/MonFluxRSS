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

/**
 * Commande d'importation des flux RSS
 * 
 * Cette commande permet d'importer automatiquement les articles depuis différents flux RSS
 * définis dans la base de données. Elle nettoie également les articles anciens.
 */
#[AsCommand(
    name: 'app:import-rss',
    description: 'Import RSS feeds and articles',
)]
class ImportRssCommand extends Command
{
    private EntityManagerInterface $em;
    private FeedIo $feedIo;
    
    /**
     * Constructeur de la commande
     * 
     * @param EntityManagerInterface $em Gestionnaire d'entités pour la persistance des données
     */
    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;

        // Initialisation du client HTTP pour la lecture des flux
        $client = new FeedIoHttpClient(new HttplugClient());
        $logger = new NullLogger();

        // Création de l'instance FeedIo pour le traitement des flux RSS
        $this->feedIo = new FeedIo($client, $logger);
    }

    /**
     * Configuration de la commande
     */
    protected function configure(): void
    {
        // La configuration de la commande est vide car toutes les options sont gérées en dur
    }

    /**
     * Exécute la commande d'importation des flux RSS
     * 
     * 1. Nettoie les articles trop anciens
     * 2. Récupère tous les flux RSS configurés
     * 3. Pour chaque flux, télécharge et traite les nouveaux articles
     * 4. Enregistre les nouveaux articles en base de données
     * 
     * @param InputInterface $input Interface d'entrée de la console
     * @param OutputInterface $output Interface de sortie de la console
     * @return int Code de retour de la commande
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Initialisation de l'interface utilisateur stylisée
        $io = new SymfonyStyle($input, $output);

        // Nettoyage : suppression des articles de plus de 7 jours
        $limitDate = (new \DateTimeImmutable())->modify('-7 days');
        $this->em->createQueryBuilder()
            ->delete(Article::class, 'a')
            ->where('a.publishedAt < :limit')
            ->setParameter('limit', $limitDate)
            ->getQuery()->execute();

        // Récupération de tous les flux RSS configurés
        $feedSources = $this->em->getRepository(FeedSource::class)->findAll();
        $totalImported = 0;

        // Traitement de chaque flux RSS
        foreach ($feedSources as $feedSource) {
            $io->writeln("Import du flux : " . $feedSource->getName());

            try {
                // Lecture du flux RSS distant
                $result = $this->feedIo->read($feedSource->getUrl());
            } catch (\Exception $e) {
                $io->error("Erreur lors de la lecture du flux " . $feedSource->getUrl() . " : " . $e->getMessage());
                continue; // Passe au flux suivant en cas d'erreur
            }

            $feed = $result->getFeed();
            $imported = 0; // Compteur d'articles importés pour ce flux

            // Traitement de chaque article du flux
            foreach ($feed as $item) {
                $link = $item->getLink();
                $guid = $item->getLink(); // Utilisation du lien comme identifiant unique

                // Vérification de l'existence de l'article pour éviter les doublons
                $existing = $this->em->getRepository(Article::class)->findOneBy(['guid' => $guid]);
                if ($existing) {
                    continue; // Passe à l'article suivant si déjà existant
                }

                // Création d'un nouvel article
                $article = new Article();
                $article->setTitle($item->getTitle() ?? 'Sans titre');
                $article->setDescription($item->getContent() ?? '');
                $article->setLink($link);
                $article->setGuid($guid);
                
                // Gestion de la date de publication
                $date = $item->getLastModified();
                if (!$date || $date > new \DateTimeImmutable('+1 day')) {
                    // Si pas de date ou date invalide (dans le futur), on utilise la date actuelle
                    $date = new \DateTimeImmutable();
                } elseif (!$date instanceof \DateTimeImmutable) {
                    // Conversion de DateTime en DateTimeImmutable si nécessaire
                    $date = \DateTimeImmutable::createFromMutable($date);
                }
                $article->setPublishedAt($date);
                
                // Association de l'article à son flux source
                $article->setFeedSource($feedSource);

                // Préparation de l'article pour la persistance
                $this->em->persist($article);
                $imported++;
            }

            // Mise à jour du compteur total d'articles importés
            $totalImported += $imported;
            $io->success("$imported articles importés pour " . $feedSource->getName());
        }

        // Enregistrement de tous les articles en base de données
        $this->em->flush();

        // Affichage du récapitulatif
        $io->success("Import terminé. $totalImported nouveaux articles importés.");

        return Command::SUCCESS;
    }
}
