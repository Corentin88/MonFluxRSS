<?php

namespace App\Service\Filters;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

/**
 * Filtre de recherche personnalisé pour effectuer des recherches sur plusieurs propriétés
 * 
 * Ce filtre permet d'effectuer une recherche sur les champs 'title' et 'description'
 * en utilisant l'opérateur logique OU.
 */
final class OrSearchFilter extends AbstractFilter
{
    /**
     * Applique le filtre de recherche à la requête
     * 
     * Cette méthode est appelée pour chaque propriété à filtrer. Elle recherche
     * le paramètre 'q' et applique une condition LIKE sur les champs 'title' et 'description'.
     *
     * @param string $property Nom de la propriété à filtrer
     * @param mixed $value Valeur de recherche
     * @param QueryBuilder $queryBuilder Constructeur de requête Doctrine
     * @param QueryNameGeneratorInterface $queryNameGenerator Générateur de noms de paramètres
     * @param string $resourceClass Classe de la ressource
     * @param Operation|null $operation Opération en cours
     * @param array $context Contexte de la requête
     *
     * @return void
     */
    protected function filterProperty(
        string $property,
        mixed $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = []
    ): void {
        // Ne traite que le paramètre 'q' avec une valeur non nulle
        if ($property !== 'q' || $value === null) {
            return;
        }

        // Récupère l'alias de la table principale
        $alias = $queryBuilder->getRootAliases()[0];
        // Génère un nom de paramètre unique pour éviter les collisions
        $parameterName = $queryNameGenerator->generateParameterName($property);

        // Ajoute une condition OU sur les champs title et description
        $queryBuilder
            ->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->like("$alias.title", ":$parameterName"),
                $queryBuilder->expr()->like("$alias.description", ":$parameterName")
            ))
            ->setParameter($parameterName, '%' . $value . '%');
    }

    /**
     * Retourne la description du filtre pour la documentation de l'API
     * 
     * @param string $resourceClass Classe de la ressource
     * @return array Description du filtre au format attendu par API Platform
     */
    public function getDescription(string $resourceClass): array
    {
        return [
            'q' => [
                'property' => null,
                'type' => 'string',
                'required' => false,
                'description' => 'Recherche globale sur les champs titre OU description',
            ],
        ];
    }
}
