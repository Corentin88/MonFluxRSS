// Indique que ce composant s'exécute côté client
"use client";
// Importation du composant LoginBox qui gère le formulaire de connexion
import LoginBox from "@/components/DataUsers/dataUser"

// Composant de la page de connexion
export default function LoginPage() {
//  console.log("render loginpage") // Ligne commentée pour le débogage

  // Rendu du composant
  return (
    <main className="pt-24 max-w-xl mx-auto px-4">
      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>
      
      {/* Intégration du composant LoginBox qui contient le formulaire de connexion */}
      <LoginBox />
    </main>
  )
}