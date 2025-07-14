<?php

namespace App\DataFixtures;

use App\Entity\FeedSource;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class FeedSourceFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $feeds= [
            ['Le Monde informatique/emploi' , 'https://www.lemondeinformatique.fr/flux-rss/thematique/emploi/rss.xml'],
            ['Le Monde informatique/internet' , 'https://www.lemondeinformatique.fr/flux-rss/thematique/internet/rss.xml'],
            ['Le Monde informatique/os' , 'https://www.lemondeinformatique.fr/flux-rss/thematique/os/rss.xml'],
            ['Le Monde informatique/sécurité' , 'https://www.lemondeinformatique.fr/flux-rss/thematique/securite/rss.xml'],
            ['Le Monde informatique/stockage' , 'https://www.lemondeinformatique.fr/flux-rss/thematique/stockage/rss.xml'],
            ['fredcavazza' , 'https://fredcavazza.net/feed/'],
            ['alsacreations' , 'https://www.alsacreations.com/rss/actualites.xml'],
            ['linuxfr' , 'https://linuxfr.org/news.atom'],
            ['zdnet' , 'https://www.zdnet.fr/feeds/rss/actualites/'],
            ['developpez' , 'https://www.developpez.com/index/rss'],
            ['journaldugeek' , 'https://www.journaldugeek.com/feed/'],
            ['nodejs' , 'https://nodejs.org/en/feed/blog.xml'],
            ['logrocket' , 'https://blog.logrocket.com/feed/'],
            ['stitcher' , 'https://stitcher.io/rss'],
            ['symfony/blog' , 'https://feeds.feedburner.com/symfony/blog'],
            ['hackernews' , 'https://hnrss.org/newest?q=web+development'],
            ['sitepoint' , 'https://www.sitepoint.com/sitepoint.rss'],
            ['dev.to' , 'https://dev.to/feed'],
            ['css-tricks' , 'https://css-tricks.com/feed/'],
            ['smashingmagazine' , 'https://www.smashingmagazine.com/feed/'],
            ['stackoverflow' , 'https://stackoverflow.blog/feed'],
            
        ];

        
        foreach ($feeds as [$name, $url]) {
            $feed = new FeedSource();
            $feed->setName($name);
            $feed->setUrl($url);
            $manager->persist($feed);
        }
        $manager->flush();
    }

}
