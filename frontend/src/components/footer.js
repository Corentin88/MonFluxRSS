"use client";

/**
 * Composant Footer
 * Affiche le pied de page du site avec le copyright et le crédit de développement
 * @returns {JSX.Element} Le rendu du composant Footer
 */
import Image from 'next/image';

export default function Footer({ className = '' }) {
  return (
    // Balise footer sémantique HTML5 avec classes dynamiques
    <footer className={`w-full ${className}`}>
      {/* Conteneur principal du footer avec fond gris foncé et texte blanc */}
      <div className="bg-orange-500 py-6 text-gray-800 w-full">
        {/* Conteneur avec largeur maximale et padding horizontal */}
        <div className="container mx-auto px-4">
          {/* Contenu du footer centré */}
          <div className="flex flex-col items-center justify-between md:flex-row">
            {/* Bloc de copyright */}
            <div className="mb-4 md:mb-0">
              &copy; Corentin Lanaud {new Date().getFullYear()} Agrégateur RSS. Tous droits réservés.
            </div>
            
            {/* Bloc du crédit de développement */}
            <div className="flex items-center">
              <span className="mr-2">Développé avec</span>
              <div className="flex items-center">
                <Image 
                  src="/image/next.svg" 
                  alt="Next.js" 
                  width={0}
                  height={0}
                  style={{ width: 'auto', height: '15px' }}
                  className="mx-1"
                />
                <span className="mx-1">,</span>
                <Image 
                  src="/image/Symfony.svg" 
                  alt="Symfony" 
                  width={0}
                  height={0}
                  style={{ width: 'auto', height: '30px' }}
                  className="mx-1"
                />
                <span className="mx-1">et</span>
                <span className="text-gray-800 font-semibold">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
