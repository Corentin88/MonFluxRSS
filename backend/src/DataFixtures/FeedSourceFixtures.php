<?php

namespace App\DataFixtures;

use App\Entity\FeedSource;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

/**
 * Fixtures pour les sources de flux RSS
 * 
 * Cette classe permet de peupler la base de données avec des sources de flux RSS
 * couramment utilisées dans le domaine du développement web et de l'informatique.
 * 
 * Les flux sont chargés lors de l'exécution de la commande :
 * php bin/console doctrine:fixtures:load
 */
class FeedSourceFixtures extends Fixture
{
    /**
     * Charge les sources de flux RSS dans la base de données
     * 
     * Cette méthode crée et persiste des entités FeedSource pour chaque flux défini
     * dans le tableau $feeds. Chaque entrée du tableau contient un nom et une URL de flux.
     * 
     * @param ObjectManager $manager Gestionnaire d'entités Doctrine
     * @return void
     */
    public function load(ObjectManager $manager): void
    {
        // Tableau des flux RSS à charger
        // Format : ['Nom du flux', 'URL du flux']
        $feeds= [
            // Flux thématiques du Monde Informatique
            ['Le Monde informatique/emploi', 'https://www.lemondeinformatique.fr/flux-rss/thematique/emploi/rss.xml'],
            ['Le Monde informatique/internet', 'https://www.lemondeinformatique.fr/flux-rss/thematique/internet/rss.xml'],
            ['Le Monde informatique/os', 'https://www.lemondeinformatique.fr/flux-rss/thematique/os/rss.xml'],
            ['Le Monde informatique/sécurité', 'https://www.lemondeinformatique.fr/flux-rss/thematique/securite/rss.xml'],
            ['Le Monde informatique/stockage', 'https://www.lemondeinformatique.fr/flux-rss/thematique/stockage/rss.xml'],
            
            // Blogs et sites techniques
            ['fredcavazza', 'https://fredcavazza.net/feed/'],
            ['alsacreations', 'https://www.alsacreations.com/rss/actualites.xml'],
            ['linuxfr', 'https://linuxfr.org/news.atom'],
            ['zdnet', 'https://www.zdnet.fr/feeds/rss/actualites/'],
            ['developpez', 'https://www.developpez.com/index/rss'],
            ['journaldugeek', 'https://www.journaldugeek.com/feed/'],
            
            // Développement web et technologies
            ['nodejs', 'https://nodejs.org/en/feed/blog.xml'],
            ['logrocket', 'https://blog.logrocket.com/feed/'],
            ['stitcher', 'https://stitcher.io/rss'],
            ['symfony/blog', 'https://feeds.feedburner.com/symfony/blog'],
            ['hackernews', 'https://hnrss.org/newest?q=web+development'],
            ['sitepoint', 'https://www.sitepoint.com/sitepoint.rss'],
            ['dev.to', 'https://dev.to/feed'],
            ['css-tricks', 'https://css-tricks.com/feed/'],
            ['smashingmagazine', 'https://www.smashingmagazine.com/feed/'],
            ['stackoverflow', 'https://stackoverflow.blog/feed'],
        ];

        // Création et persistance de chaque source de flux
        foreach ($feeds as [$name, $url]) {
            $feed = new FeedSource();
            $feed->setName($name);
            $feed->setUrl($url);
            $manager->persist($feed);
        }
        
        // Exécution des requêtes SQL pour persister les entités
        $manager->flush();
    }
}
