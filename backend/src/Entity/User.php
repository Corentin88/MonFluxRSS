<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Entité représentant un utilisateur de l'application
 * 
 * Cette entité implémente les interfaces UserInterface et PasswordAuthenticatedUserInterface
 * pour gérer l'authentification avec Symfony Security.
 */
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * Identifiant unique de l'utilisateur
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Adresse email de l'utilisateur (utilisée comme identifiant de connexion)
     */
    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * Rôles de l'utilisateur
     * 
     * @var list<string> Tableau des rôles de l'utilisateur
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * Mot de passe hashé de l'utilisateur
     * 
     * @var string Le mot de passe hashé
     */
    #[ORM\Column]
    private ?string $password = null;

    /**
     * Récupère l'identifiant unique de l'utilisateur
     * 
     * @return int|null L'identifiant de l'utilisateur
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Récupère l'adresse email de l'utilisateur
     * 
     * @return string|null L'email de l'utilisateur
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * Définit l'adresse email de l'utilisateur
     * 
     * @param string $email La nouvelle adresse email
     * @return static L'instance de l'utilisateur
     */
    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Retourne l'identifiant unique de l'utilisateur (son email)
     * 
     * @see UserInterface
     * @return string L'email de l'utilisateur
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * Retourne les rôles de l'utilisateur
     * 
     * @see UserInterface
     * @return string[] La liste des rôles de l'utilisateur
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // Garantit que chaque utilisateur a au moins le rôle ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * Définit les rôles de l'utilisateur
     * 
     * @param list<string> $roles Tableau des rôles à attribuer
     * @return static L'instance de l'utilisateur
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * Retourne le mot de passe hashé de l'utilisateur
     * 
     * @see PasswordAuthenticatedUserInterface
     * @return string|null Le mot de passe hashé
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * Définit le mot de passe hashé de l'utilisateur
     * 
     * @param string $password Le mot de passe hashé
     * @return static L'instance de l'utilisateur
     */
    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * S'assure que la session ne contient pas de hachages de mot de passe réels
     * en les hachant avec CRC32C (supporté depuis Symfony 7.3)
     * 
     * @return array Les données sérialisées de l'utilisateur
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0".self::class."\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    /**
     * Efface les données sensibles de l'utilisateur
     * 
     * @deprecated Cette méthode est dépréciée et sera supprimée dans Symfony 8
     */
    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, à supprimer lors de la mise à jour vers Symfony 8
    }
}
