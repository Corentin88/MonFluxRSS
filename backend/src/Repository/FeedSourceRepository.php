<?php

namespace App\Repository;

use App\Entity\FeedSource;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository pour l'entité FeedSource
 * 
 * Cette classe fournit des méthodes pour interagir avec la table des sources de flux RSS.
 * Elle hérite de ServiceEntityRepository qui fournit des méthodes CRUD de base.
 * 
 * @method FeedSource|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedSource|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedSource[]    findAll()
 * @method FeedSource[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedSourceRepository extends ServiceEntityRepository
{
    /**
     * Constructeur du repository
     * 
     * @param ManagerRegistry $registry Le gestionnaire d'entités Doctrine
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedSource::class);
    }

    /*
     * Exemple de méthode personnalisée pour trouver des sources par un champ spécifique
     * 
     * @param mixed $value La valeur à rechercher
     * @return FeedSource[] Retourne un tableau d'objets FeedSource
     */
    /*
    public function findByExampleField($value): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }
    */

    /*
     * Exemple de méthode pour trouver une source par un champ spécifique
     * 
     * @param mixed $value La valeur à rechercher
     * @return FeedSource|null Retourne un objet FeedSource ou null si non trouvé
     */
    /*
    public function findOneBySomeField($value): ?FeedSource
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult();
    }
    */
}
