<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

/**
 * Classe de fixtures pour le chargement des données initiales
 * 
 * Cette classe permet de peupler la base de données avec des données de test
 * lors du développement ou des tests. Elle est exécutée avec la commande :
 * php bin/console doctrine:fixtures:load
 */
class AppFixtures extends Fixture
{
    /**
     * Charge les données de test dans la base de données
     * 
     * Cette méthode est appelée lors du chargement des fixtures.
     * Elle permet de créer et persister des entités de test.
     * 
     * Exemple d'utilisation :
     * $product = new Product();
     * $product->setName('Nom du produit');
     * $manager->persist($product);
     * 
     * @param ObjectManager $manager Gestionnaire d'entités Doctrine
     * @return void
     */
    public function load(ObjectManager $manager): void
    {
        // Exemple de création d'une entité Product
        // $product = new Product();
        // $product->setName('Nom du produit');
        // $manager->persist($product);

        // Exécute les requêtes SQL pour persister les entités
        $manager->flush();
    }
}
