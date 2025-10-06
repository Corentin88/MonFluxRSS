// Indique que ce composant s'exécute côté client
"use client";
// Importation des hooks et composants nécessaires
import { useEffect, useState } from "react";
import ListeFlux from "@/components/ListesFlux/ListeFlux";

// Composant principal pour afficher les sources de flux RSS
export default function Sources() {
    // État pour stocker les flux groupés par type
    const [flux, setFlux] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);
   // Écouter l'événement d'ajout de flux
   useEffect(() => {
    const handleFluxAdded = () => {
      console.log("Nouveau flux détecté, rafraîchissement...");
      setRefreshTrigger(prev => prev + 1);
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('fluxAdded', handleFluxAdded);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('fluxAdded', handleFluxAdded);
    };
  }, []);
    return (
      <>
        {/* En-tête de la page */}
        <div className="flex flex-col items-center justify-center w-full px-4">
          <h1 className="text-2xl font-bold mb-4">Les sources</h1>
          <p className="mb-4">Voici les sources de flux RSS que vous avez ajoutées.</p>
        </div>
  
        {/* Composant qui charge et affiche la liste des flux */}
        <ListeFlux onData={setFlux} refreshTrigger={refreshTrigger}/>
  
        {/* Section d'affichage des flux */}
        <div className="w-full px-4">
          {/* Vérification s'il y a des flux à afficher */}
          {Object.keys(flux).length === 0 ? (
            <p className="text-center text-gray-500">Aucun flux trouvé</p>
          ) : (
            /* Grille responsive pour l'affichage des flux */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Boucle sur chaque type de flux */}
              {Object.entries(flux).map(([type, nomsFlux]) => (
                /* Carte pour chaque catégorie de flux */
                <div key={type} className="bg-orange-50 rounded-lg shadow p-4 w-full">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 text-center">{type}</h2>
                  <table className="w-full">
                    <tbody>
                      {/* Boucle sur chaque flux de la catégorie */}
                      {nomsFlux.map((nom, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="flex items-start">
                              <span className="inline-block w-6 text-right pr-2 text-gray-500">
                                {index + 1}.
                              </span>
                              <span className="flex-1">
                                {nom}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }