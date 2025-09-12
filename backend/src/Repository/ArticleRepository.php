<?php

namespace App\Repository;

use App\Entity\Article;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository pour l'entité Article
 * 
 * Cette classe étend ServiceEntityRepository pour fournir des méthodes personnalisées
 * pour la récupération des entités Article depuis la base de données.
 * 
 * @method Article|null find($id, $lockMode = null, $lockVersion = null)
 * @method Article|null findOneBy(array $criteria, array $orderBy = null)
 * @method Article[]    findAll()
 * @method Article[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArticleRepository extends ServiceEntityRepository
{
    /**
     * Constructeur du repository
     * 
     * @param ManagerRegistry $registry Le gestionnaire d'entités Doctrine
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Article::class);
    }

    /**
     * Récupère une liste paginée d'articles
     * 
     * @param int $page Le numéro de la page à récupérer (commence à 1)
     * @param int $limit Le nombre maximum d'articles par page (par défaut 30)
     * @return Article[] La liste des articles pour la page demandée
     */
    public function findPaginated(int $page = 1, int $limit = 30): array
    {
        $offset = ($page - 1) * $limit;

        return $this->createQueryBuilder('a')
            ->orderBy('a.publishedAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Compte le nombre total d'articles dans la base de données
     * 
     * @return int Le nombre total d'articles
     */
    public function countAll(): int
    {
        return $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    // Exemple de méthode personnalisée (commentée)
    // public function findOneBySomeField($value): ?Article
    // {
    //     return $this->createQueryBuilder('a')
    //         ->andWhere('a.exampleField = :val')
    //         ->setParameter('val', $value)
    //         ->getQuery()
    //         ->getOneOrNullResult();
    // }
}
