<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController
{
    public function login(): Response
    {
        // Ce contrôleur ne sera jamais appelé, car json_login s'occupe de l'authentification
        throw new \Exception('Cette méthode ne devrait pas être appelée directement.');
    }
}
