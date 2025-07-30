<?php

namespace App\Service\Filters;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

/**
 * OrSearchFilter is a custom filter for API Platform that allows searching on multiple properties.
 */
final class OrSearchFilter extends AbstractFilter
{
    /**
     * Applies the filter to the query builder.
     *
     * @param string $property The property being filtered.
     * @param mixed $value The value to filter by.
     * @param QueryBuilder $queryBuilder The query builder to apply the filter to.
     * @param QueryNameGeneratorInterface $queryNameGenerator The query name generator.
     * @param string $resourceClass The resource class.
     * @param Operation|null $operation The operation.
     * @param array $context The context.
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
        if ($property !== 'q' || $value === null) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $parameterName = $queryNameGenerator->generateParameterName($property);

        $queryBuilder
            ->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->like("$alias.title", ":$parameterName"),
                $queryBuilder->expr()->like("$alias.description", ":$parameterName")
            ))
            ->setParameter($parameterName, '%' . $value . '%');
    }

    /**
     * Returns the filter description.
     *
     * @param string $resourceClass The resource class.
     *
     * @return array The filter description.
     */
    public function getDescription(string $resourceClass): array
    {
        return [
            'q' => [
                'property' => null,
                'type' => 'string',
                'required' => false,
                'description' => 'Recherche globale sur title OU description',
            ],
        ];
    }
}
