// Directive indiquant que ce composant doit s'exécuter côté client
"use client";

// Importation des composants nécessaires depuis les bibliothèques externes
// @headlessui/react fournit des composants UI accessibles et sans style
import {
  Disclosure, // Pour les éléments dépliables/rétractables
  DisclosureButton, // Bouton pour contrôler l'affichage
  DisclosurePanel, // Contenu à afficher/masquer
  Menu, // Pour les menus déroulants
  MenuButton, // Bouton pour ouvrir le menu
  MenuItem, // Élément individuel du menu
  MenuItems, // Conteneur des éléments du menu
} from "@headlessui/react";
// Importation des icônes depuis la bibliothèque Heroicons
// Ces icônes sont utilisées pour le menu burger, les notifications et la croix de fermeture
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Importation des hooks React nécessaires
import { useEffect, useState } from "react";

// Importation du contexte d'authentification personnalisé
import { useAuth } from "@/context/AuthContext";

// Importation du routeur Next.js pour la navigation
import { useRouter } from "next/navigation";

// Importation du service d'API
import api from "@/services/api";

/**
 * Fonction utilitaire pour gérer les noms de classes conditionnels
 * Combine plusieurs classes en une seule chaîne en ignorant les valeurs falsy
 * @param {...string} classes - Classes CSS à combiner
 * @returns {string} Chaîne de classes CSS combinées
 */
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Composant principal Header
 * Affiche la barre de navigation principale du site
 * @param {Object} props - Propriétés du composant
 * @param {boolean} [props.isScrolled=false] - Indique si l'utilisateur a fait défiler la page
 * @returns {JSX.Element} Le rendu du composant Header
 */
export default function Header({ isScrolled = false }) {
  // Utilisation du hook d'authentification personnalisé
  const { isLogged, login, logout } = useAuth();

  // Initialisation du routeur Next.js
  const router = useRouter();

  // Ajout d'un état pour gérer le chargement
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  /**
   * Tableau contenant les éléments de navigation principaux
   * Chaque objet représente un élément du menu avec :
   * - name: le texte affiché dans le menu
   * - href: l'ancre vers laquelle le lien pointe
   * - current: booléen indiquant si l'élément est actif
   */
  const navigation = [
    { name: "Tous les articles", href: "/", current: false }, // ancre qui scrolle vers la liste
    { name: "Sources", href: "/sources", current: false }, // tableau / cartes des flux
    { name: "Installation", href: "/installation", current: false },
  ];

  // Ajout conditionnel du lien d'administration si l'utilisateur est connecté
  const nav = isLogged
    ? [...navigation, { name: "Ajouter un flux", href: "/ajoutFlux" }]
    : navigation;

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      setUpdateMessage("Mise à jour en cours...");

      // Utilisation du service d'API pour la mise à jour des articles
      const data = await api.post("/api/update-articles");
      
      setUpdateMessage(data.message || "Mise à jour réussie !");

      // Réinitialiser le message après 5 secondes
      setTimeout(() => setUpdateMessage(""), 5000);

      // Actualiser la page pour afficher les nouveaux articles
      window.location.reload();
    } catch (err) {
      setUpdateMessage(err.message || "Erreur lors de la mise à jour");
      // Pas besoin de gérer la déconnexion ici, c'est déjà fait par l'intercepteur
    } finally {
      setIsUpdating(false);
    }
  };

  // Rendu du composant Header
  return (
    <header>
      {/* 
        Barre de navigation responsive avec fond qui change selon le défilement
        - Fixe en haut de l'écran
        - Hauteur de 5rem (h-20)
        - Transition fluide des couleurs selon le défilement
      */}
      <Disclosure
        as="nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-in-out h-20  ${
          isScrolled
            ? "bg-gray-800 shadow-md md:flex md:items-center"
            : "bg-orange-500 md:bg-orange-500 "
        }`}
      >
        {({ open, close }) => (
          <>
            {/* Composant pour gérer la fermeture du menu mobile avec la touche Échap */}
            <MobileMenuHandler open={open} close={close} />

            {/* Conteneur avec largeur maximale et espacement horizontal */}
            <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
              {/* Conteneur flexible pour le contenu de la barre de navigation */}
              <div className="relative flex h-16 items-center justify-between">
                {/* Bouton du menu mobile (visible uniquement sur petits écrans) */}
                <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                  {/* Bouton qui s'affiche en version mobile pour ouvrir/fermer le menu */}
                  <DisclosureButton
                    className={`
                      group relative inline-flex items-center justify-center 
                      rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset
                      transition-colors duration-200
                      ${
                        isScrolled
                          ? "text-blue-900 hover:bg-blue-900 hover:text-white focus:ring-blue-900"
                          : "text-gray-800 hover:text-white hover:bg-gray-400 focus:ring-gray-900"
                      }
                    `}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Ouvrir le menu principal</span>
                    {/* Icône du menu burger (visible quand le menu est fermé) */}
                    <Bars3Icon
                      aria-hidden="true"
                      className="block size-8 group-data-open:hidden"
                    />
                    {/* Icône X (visible quand le menu est ouvert) */}
                    <XMarkIcon
                      aria-hidden="true"
                      className="hidden size-8 group-data-open:block"
                    />
                  </DisclosureButton>
                </div>

                {/* Section principale de la navigation */}
                <div className="flex flex-1 items-center justify-between">
                  {/* Logo / Nom du site */}
                  <div className="flex-1 md:flex-none text-center md:text-left">
                    <div
                      className={`text-2xl md:text-3xl font-bold md:ml-4 ${
                        isScrolled ? "text-blue-900" : "text-gray-800"
                      }`}
                      style={{ fontFamily: "var(--font-jetbrains)" }}
                    >
                      Mon Flux RSS
                    </div>
                  </div>

                  {/* Liens de navigation (cachés sur mobile) */}
                  <div className="hidden md:ml-6 md:block">
                    <div className="flex items-center space-x-4 md:space-x-2">
                      {nav.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          aria-current={item.current ? "page" : undefined}
                          className={classNames(
                            "rounded-md px-3 py-2 text-lg font-medium transition-colors duration-300",
                            item.current
                              ? "bg-gray-900 text-white border-2"
                              : isScrolled
                              ? "text-blue-900 hover:bg-blue-900 hover:text-black"
                              : "text-gray-800 hover:bg-gray-400 hover:text-white"
                          )}
                        >
                          {item.name}
                        </a>
                      ))}
                      {/* Bouton de connexion/déconnexion */}
                      {isLogged ? (
                        <>
                          <button
                            onClick={() => {
                              logout();
                              router.push("/");
                            }}
                            className="px-4 py-2 text-center rounded-lg hover:bg-gray-400 hover:text-white"
                          >
                            Déconnexion
                          </button>
                          <button
                            onClick={handleUpdate}
                            disabled={isUpdating}
                            className={`ml-2 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center ${
                              isUpdating
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                            title="Mettre à jour les articles"
                          >
                            {isUpdating ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Mise à jour...
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                                Mettre à jour
                              </>
                            )}
                          </button>
                          {updateMessage && (
                            <div className="ml-2 px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm">
                              {updateMessage}
                            </div>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => router.push("/login")}
                          className="px-4 py-2 text-center rounded-lg hover:bg-gray-400 hover:text-white"
                        >
                          Se connecter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay semi-transparent pour fermer le menu en cliquant en dehors */}
            {open && (
              <div
                className="fixed inset-0 z-10 md:hidden"
                onClick={close}
                aria-hidden="true"
              />
            )}

            {/* Panneau du menu mobile (visible uniquement sur petits écrans) */}
            <DisclosurePanel
              className={`md:hidden absolute w-full left-0 top-16 right-0 z-20 transition-all duration-1000 ease-out ${
                isScrolled ? "bg-white" : "bg-orange-500"
              }`}
            >
              <div className="space-y-1 px-2 pt-2 pb-3 flex flex-col">
                {nav.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      "rounded-md px-3 py-2 text-lg font-medium transition-colors duration-300",
                      item.current
                        ? "bg-gray-900 text-white border-2"
                        : isScrolled
                        ? "text-blue-900 hover:bg-blue-900 hover:text-white"
                        : "text-gray-800 hover:bg-gray-400 hover:text-white"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
                {/* Bouton de connexion/déconnexion pour la version mobile */}
                {isLogged ? (
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="px-4 py-2 text-center rounded-lg hover:bg-gray-400 hover:text-white"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="px-4 py-2 text-center rounded-lg hover:bg-gray-400 hover:text-white"
                  >
                    Se connecter
                  </button>
                )}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
      {/* Espace réservé pour compenser la hauteur fixe du header et éviter que le contenu ne soit masqué */}
      <div className="h-20"></div>
    </header>
  );
}

/**
 * Composant utilitaire pour gérer la fermeture du menu mobile avec la touche Échap
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.open - Indique si le menu mobile est ouvert
 * @param {Function} props.close - Fonction pour fermer le menu
 * @returns {null} Ne rend rien (composant utilitaire)
 */
function MobileMenuHandler({ open, close }) {
  // Effet pour gérer la touche Échap
  useEffect(() => {
    /**
     * Gère l'événement de pression de touche
     * @param {KeyboardEvent} event - L'événement de pression de touche
     */
    function handleKeyDown(event) {
      // Si la touche Échap est pressée et que le menu est ouvert
      if (event.key === "Escape" && open) {
        close(); // Ferme le menu
      }
    }

    // Ajoute l'écouteur d'événement au chargement du composant
    window.addEventListener("keydown", handleKeyDown);

    // Nettoie l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]); // Dépendances de l'effet

  // Ce composant ne rend rien d'UI, il gère uniquement le comportement
  return null;
}
