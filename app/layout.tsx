import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hissatsudle",
  description: "Devine la technique d'Inazuma Eleven du jour.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <footer>Projet de fan, sans lien avec Level-5. Données issues du wiki Inazuma Eleven (CC BY-SA) et du zukan officiel.</footer>
      </body>
    </html>
  );
}
