<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * Repository pour l'entité User
 * 
 * Cette classe fournit des méthodes pour interagir avec la table des utilisateurs.
 * Elle implémente PasswordUpgraderInterface pour la gestion du hachage des mots de passe.
 * 
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    /**
     * Constructeur du repository
     * 
     * @param ManagerRegistry $registry Le gestionnaire d'entités Doctrine
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Met à jour le mot de passe de l'utilisateur avec un nouveau hachage
     * 
     * Cette méthode est utilisée pour mettre à jour automatiquement le hachage du mot de passe
     * de l'utilisateur au fil du temps (par exemple, si l'algorithme de hachage change).
     * 
     * @param PasswordAuthenticatedUserInterface $user L'utilisateur dont le mot de passe doit être mis à jour
     * @param string $newHashedPassword Le nouveau mot de passe déjà haché
     * 
     * @throws UnsupportedUserException Si l'utilisateur n'est pas une instance de la classe User
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Les instances de "%s" ne sont pas prises en charge.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /*
     * Exemple de méthode personnalisée pour trouver des utilisateurs par un champ spécifique
     * 
     * @param mixed $value La valeur à rechercher
     * @return User[] Retourne un tableau d'objets User
     */
    /*
    public function findByExampleField($value): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }
    */

    /*
     * Exemple de méthode pour trouver un utilisateur par un champ spécifique
     * 
     * @param mixed $value La valeur à rechercher
     * @return User|null Retourne un objet User ou null si non trouvé
     */
    /*
    public function findOneBySomeField($value): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult();
    }
    */
}
