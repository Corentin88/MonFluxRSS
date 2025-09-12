<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Contrôleur de sécurité
 * 
 * Ce contrôleur gère les fonctionnalités d'authentification de l'application.
 * Note: L'authentification est principalement gérée par le système json_login de Symfony.
 */
class SecurityController
{
    /**
     * Point d'entrée pour l'authentification
     * 
     * Cette méthode ne sera jamais exécutée directement car l'authentification
     * est gérée automatiquement par le composant json_login de Symfony.
     * Elle est définie uniquement pour fournir une route d'accès au processus d'authentification.
     * 
     * @throws \Exception Toujours levée car cette méthode ne devrait jamais être appelée directement
     * @return Response Cette méthode ne retourne jamais de réponse valide
     */
    public function login(): Response
    {
        // Cette méthode ne sera jamais appelée, car json_login s'occupe de l'authentification
        throw new \Exception('Cette méthode ne devrait pas être appelée directement.');
    }
}
