// Importation des styles globaux et des composants
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/context/AuthContext";

// Métadonnées de l'application (utilisées pour le SEO et l'onglet du navigateur)
export const metadata = {
  title: "Mon Flux RSS",
  description: "Générez et gérez vos flux RSS personnalisés",
};

// Composant de mise en page racine qui enveloppe toute l'application
export default function RootLayout({ children }) {
  return (
    // Définition de la langue du document HTML
    <html lang="fr">
      {/* Corps du document avec une hauteur minimale et une disposition en colonne */}
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        {/* Fournisseur de contexte d'authentification pour toute l'application */}
        <AuthProvider>
          {/* En-tête de l'application */}
          <Header />
          
          {/* Contenu principal avec une largeur maximale et un espacement latéral */}
          <main className="flex-grow max-w-4xl mx-auto w-full px-4">
            {children} {/* Contenu des pages enfants */}
          </main>
          
          {/* Pied de page positionné en bas de la page */}
          <Footer className="mt-auto" />
        </AuthProvider>
      </body>
    </html>
  );
}
