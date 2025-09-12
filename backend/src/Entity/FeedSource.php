<?php

namespace App\Entity;

use App\Repository\FeedSourceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

/**
 * Entité représentant une source de flux RSS
 * 
 * Cette entité permet de gérer les différentes sources de flux RSS qui seront importées
 * dans l'application. Elle est exposée via une API REST avec des restrictions d'accès.
 */
#[ORM\Entity(repositoryClass: FeedSourceRepository::class)]
#[ApiResource(
    formats: ['jsonld', 'json'],
    operations: [
        new GetCollection(security: "is_granted('PUBLIC_ACCESS')"),
        new Get(security: "is_granted('ROLE_ADMIN')"),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ],
    normalizationContext: ['groups' => ['feedsource:read']],
    denormalizationContext: ['groups' => ['feedsource:write']],
    filters: ['search_filter'],
)]
#[ApiFilter(SearchFilter::class, properties: ['type' => 'exact'])]
class FeedSource
{
    /**
     * Identifiant unique de la source
     */
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Nom de la source (affiché dans l'interface)
     */
    #[ORM\Column(length: 255)]
    #[Groups(["feedsource:read","feedsource:write","article:read"])]
    private ?string $name = null;

    /**
     * URL du flux RSS
     */
    #[ORM\Column(length: 255, unique: true)]
    #[Groups(["feedsource:read","feedsource:write","article:read"])]
    private ?string $url = null;

    /**
     * Catégorie de la source
     * 
     * Peut être : 'veille techno', 'jeux video', 'cuisine' ou 'science et spatial'
     */
    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['feedsource:read', 'feedsource:write','article:read'])]
    #[Assert\Choice(choices: ['veille techno', 'jeux video', 'cuisine', 'science et spatial'])]
    private ?string $type = null;

    /**
     * Date de création de la source
     */
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * Liste des articles associés à cette source
     * 
     * @var Collection<int, Article>
     */
    #[ORM\OneToMany(targetEntity: Article::class, mappedBy: 'feedSource')]
    private Collection $articles;

    /**
     * Constructeur initialisant la date de création et la collection d'articles
     */
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->articles = new ArrayCollection();
    }

    /**
     * Récupère l'identifiant unique de la source
     * 
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Récupère le nom de la source
     * 
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * Définit le nom de la source
     * 
     * @param string $name
     * @return static
     */
    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Récupère l'URL du flux RSS
     * 
     * @return string|null
     */
    public function getUrl(): ?string
    {
        return $this->url;
    }

    /**
     * Définit l'URL du flux RSS
     * 
     * @param string $url
     * @return static
     */
    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    /**
     * Récupère la catégorie de la source
     * 
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * Définit la catégorie de la source
     * 
     * @param string $type
     * @return static
     */
    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Récupère la date de création de la source
     * 
     * @return \DateTimeImmutable|null
     */
    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * Définit la date de création de la source
     * 
     * @param \DateTimeImmutable $createdAt
     * @return static
     */
    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Récupère la liste des articles associés à cette source
     * 
     * @return Collection<int, Article>
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    /**
     * Ajoute un article à la liste des articles associés à cette source
     * 
     * @param Article $article
     * @return static
     */
    public function addArticle(Article $article): static
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setFeedSource($this);
        }

        return $this;
    }

    /**
     * Supprime un article de la liste des articles associés à cette source
     * 
     * @param Article $article
     * @return static
     */
    public function removeArticle(Article $article): static
    {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getFeedSource() === $this) {
                $article->setFeedSource(null);
            }
        }

        return $this;
    }
}
