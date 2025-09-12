<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Console\Helper\QuestionHelper;

/**
 * Commande de console pour créer un compte administrateur
 * 
 * Cette commande permet de créer manuellement un utilisateur avec les droits administrateur
 * en spécifiant son email et son mot de passe via l'interface en ligne de commande.
 */
#[AsCommand(
    name: 'app:create-admin',
    description: 'Créer un compte administrateur.',
)]
class CreateAdminCommand extends Command
{
    /**
     * Constructeur de la commande
     * 
     * @param EntityManagerInterface $em Gestionnaire d'entités pour la persistance des données
     * @param UserPasswordHasherInterface $passwordHasher Service de hachage des mots de passe
     */
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    /**
     * Exécute la commande pour créer un administrateur
     * 
     * Demande à l'utilisateur de saisir un email et un mot de passe,
     * puis crée un nouvel utilisateur avec le rôle administrateur.
     * 
     * @param InputInterface $input Interface d'entrée de la console
     * @param OutputInterface $output Interface de sortie de la console
     * @return int Code de retour de la commande (0 = succès, 1 = échec)
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Initialisation de l'interface utilisateur stylisée
        $io = new SymfonyStyle($input, $output);
        
        // Récupération de l'aide pour poser des questions en console
        /** @var QuestionHelper $helper */
        $helper = $this->getHelper('question');

        // Demande de l'email de l'administrateur
        $questionEmail = new Question('Email de l\'admin : ');
        $email = $helper->ask($input, $output, $questionEmail);

        // Demande du mot de passe (masqué à la saisie pour des raisons de sécurité)
        $questionPassword = new Question('Mot de passe : ');
        $questionPassword->setHidden(true);
        $password = $helper->ask($input, $output, $questionPassword);

        // Création d'une nouvelle instance d'utilisateur
        $user = new User();
        $user->setEmail($email);
        // Attribution du rôle administrateur
        $user->setRoles(['ROLE_ADMIN']);

        // Hachage sécurisé du mot de passe avant stockage
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        // Persistance de l'utilisateur en base de données
        $this->em->persist($user);
        $this->em->flush();

        // Affichage d'un message de succès
        $io->success("L'administrateur a été créé avec succès.");

        // Retourne le code de succès de la commande
        return Command::SUCCESS;
    }
}
