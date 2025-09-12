<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Service\Filters\OrSearchFilter;

/**
 * Entité représentant un article dans l'application
 * 
 * Cette entité est utilisée pour stocker les articles importés depuis différents flux RSS.
 * Elle est exposée via une API REST grâce à ApiPlatform.
 */
#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ApiResource(normalizationContext: ["groups" => ["article:read"]], order: ["publishedAt" => "DESC"])]
#[ApiFilter(OrSearchFilter::class)]
#[ApiFilter(SearchFilter::class, properties: ['feedSource.type' => 'exact'])]
class Article
{
    /**
     * Identifiant unique de l'article
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Titre de l'article
     */
    #[ORM\Column(length: 255)]
    #[Groups(["article:read"])]
    private ?string $title = null;

    /**
     * Contenu ou résumé de l'article
     */
    #[ORM\Column(type: Types::TEXT)]
    #[Groups(["article:read"])]
    private ?string $description = null;

    /**
     * URL vers l'article original
     */
    #[ORM\Column(length: 255)]
    #[Groups(["article:read"])]
    private ?string $link = null;

    /**
     * Date de publication de l'article
     */
    #[ORM\Column]
    #[Groups(["article:read"])]
    private ?\DateTimeImmutable $publishedAt = null;

    /**
     * Identifiant unique de l'article dans le flux source
     */
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["article:read"])]
    private ?string $guid = null;

    /**
     * Source du flux RSS d'où provient l'article
     */
    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["article:read"])]
    private ?FeedSource $feedSource = null;

    /**
     * Récupère l'identifiant de l'article
     * 
     * @return int|null L'identifiant de l'article
     */
    #[Groups(["article:read"])]
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Récupère le titre de l'article
     * 
     * @return string|null Le titre de l'article
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * Définit le titre de l'article
     * 
     * @param string $title Le titre de l'article
     * 
     * @return static L'instance de l'article
     */
    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Récupère le contenu ou résumé de l'article
     * 
     * @return string|null Le contenu ou résumé de l'article
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * Définit le contenu ou résumé de l'article
     * 
     * @param string $description Le contenu ou résumé de l'article
     * 
     * @return static L'instance de l'article
     */
    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Récupère l'URL vers l'article original
     * 
     * @return string|null L'URL vers l'article original
     */
    public function getLink(): ?string
    {
        return $this->link;
    }

    /**
     * Définit l'URL vers l'article original
     * 
     * @param string $link L'URL vers l'article original
     * 
     * @return static L'instance de l'article
     */
    public function setLink(string $link): static
    {
        $this->link = $link;

        return $this;
    }

    /**
     * Récupère la date de publication de l'article
     * 
     * @return \DateTimeImmutable|null La date de publication de l'article
     */
    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    /**
     * Définit la date de publication de l'article
     * 
     * @param \DateTimeImmutable $publishedAt La date de publication de l'article
     * 
     * @return static L'instance de l'article
     */
    public function setPublishedAt(\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    /**
     * Récupère l'identifiant unique de l'article dans le flux source
     * 
     * @return string|null L'identifiant unique de l'article dans le flux source
     */
    public function getGuid(): ?string
    {
        return $this->guid;
    }

    /**
     * Définit l'identifiant unique de l'article dans le flux source
     * 
     * @param string|null $guid L'identifiant unique de l'article dans le flux source
     * 
     * @return static L'instance de l'article
     */
    public function setGuid(?string $guid): static
    {
        $this->guid = $guid;

        return $this;
    }

    /**
     * Récupère la source du flux RSS d'où provient l'article
     * 
     * @return FeedSource|null La source du flux RSS d'où provient l'article
     */
    public function getFeedSource(): ?FeedSource
    {
        return $this->feedSource;
    }

    /**
     * Définit la source du flux RSS d'où provient l'article
     * 
     * @param FeedSource|null $feedSource La source du flux RSS d'où provient l'article
     * 
     * @return static L'instance de l'article
     */
    public function setFeedSource(?FeedSource $feedSource): static
    {
        $this->feedSource = $feedSource;

        return $this;
    }
}
