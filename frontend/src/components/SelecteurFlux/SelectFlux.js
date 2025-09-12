"use client";
// Importation des hooks nécessaires depuis React
import { useState, useEffect } from 'react';

/**
 * Composant SelectFlux - Affiche et gère la sélection des types de flux
 * @param {string} value - La valeur actuellement sélectionnée
 * @param {Function} onChange - Callback appelé lors du changement de sélection
 * @returns {JSX.Element} Un sélecteur de type de flux avec affichage des flux correspondants
 */
export default function SelectFlux({ value, onChange }) {
    // Définition des types de flux disponibles
    const types = ['veille techno', 'jeux video', 'cuisine', 'science et spatial'];
    
    // État pour stocker la liste des flux récupérés depuis l'API
    const [feeds, setFeeds] = useState([]);
  
    // Effet pour charger les flux correspondant au type sélectionné
    useEffect(() => {
      // Appel à l'API pour récupérer les flux du type sélectionné
      fetch(`http://localhost:8000/api/feed_sources?type=${encodeURIComponent(value)}`)
        .then(res => res.json())
        // Mise à jour de l'état avec les données reçues (format Hydra ou standard)
        .then(data => setFeeds(data['hydra:member'] || []));
    }, [value]); // Déclenché à chaque changement de la valeur sélectionnée
  
    return (
      <div className="mt-4">
        {/* Conteneur des boutons de sélection de type */}
        <div className="w-max-[550px] px-4 py-2 mx-auto flex flex-col space-x-2 align-center justify-center bg-orange-50 rounded-sm sm:flex-row sm:w-[550px]">
          {types.map(type => (
            <button
              key={type}
              // Style conditionnel : mise en évidence du bouton sélectionné
              className={`px-4 py-2 ${
                value === type 
                  ? 'border-b-4 border-orange-500 font-bold bg-orange-50 rounded-sm' 
                  : 'hover:bg-orange-200 rounded-sm hover:scale-105 transition-all duration-200 '
              }`}
              // Appel de la fonction onChange avec le type sélectionné
              onClick={() => onChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
  
        {/* Affichage des flux correspondant au type sélectionné */}
        <div className="mt-10">
          {feeds.map(feed => (
            <div key={feed.id}>
              <h2>{feed.name}</h2>
              <p>{feed.url}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }