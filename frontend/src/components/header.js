"use client";
// Importation des composants nécessaires depuis les bibliothèques externes
// @headlessui/react fournit des composants UI accessibles et sans style
import {
  Disclosure,          // Pour les éléments dépliables/rétractables
  DisclosureButton,    // Bouton pour contrôler l'affichage
  DisclosurePanel,     // Contenu à afficher/masquer
  Menu,                // Pour les menus déroulants
  MenuButton,          // Bouton pour ouvrir le menu
  MenuItem,            // Élément individuel du menu
  MenuItems,           // Conteneur des éléments du menu
} from "@headlessui/react";
// @heroicons/react fournit des icônes SVG
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

/**
 * Tableau contenant les éléments de navigation principaux
 * Chaque objet représente un élément du menu avec :
 * - name: le texte affiché dans le menu
 * - href: l'ancre vers laquelle le lien pointe
 * - current: booléen indiquant si l'élément est actif
 */
const navigation = [
  { name: "Présentation", href: "#presentation", current: false },
  { name: "Qualités", href: "#quality", current: false },
  { name: "Projets", href: "#portfolio", current: false },
  { name: "Parcours", href: "#timeline", current: false },
  { name: "CV", href: "#cvLien", current: false },
  { name: "Contact", href: "#contact", current: false },
];

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
  return (
    // Conteneur principal du header
    <header>
      {/* 
        Barre de navigation responsive avec fond qui change selon le défilement
        - Fixe en haut de l'écran
        - Hauteur de 5rem (h-20)
        - Transition fluide des couleurs
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
                          : "text-gray-800 hover:text-white hover:bg-gray-500 focus:ring-gray-900"
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
                      {navigation.map((item) => (
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
                                : "text-gray-800 hover:bg-gray-500 hover:text-white"
                          )}
                        >
                          {item.name}
                        </a>
                      ))}
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
                {navigation.map((item) => (
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
                          : "text-gray-800 hover:bg-gray-500 hover:text-white"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </header>
  );
}

/**
 * Composant pour gérer la fermeture du menu mobile
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.open - État d'ouverture du menu
 * @param {Function} props.close - Fonction pour fermer le menu
 * @returns {null} Ne rend rien (composant utilitaire)
 */
function MobileMenuHandler({ open, close }) {
  useEffect(() => {
    /**
     * Gère l'appui sur la touche Échap pour fermer le menu
     * @param {KeyboardEvent} event - Événement clavier
     */
    const handleEscape = (event) => {
      if (event.key === "Escape" && open) {
        close();
      }
    };

    // Ajouter l'écouteur d'événement seulement si le menu est ouvert
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    // Nettoyage : retirer l'écouteur d'événement lors du démontage du composant
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, close]);

  // Ce composant ne rend rien dans le DOM
  return null;
}
