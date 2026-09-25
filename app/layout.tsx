import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "./globals.css";
import localFont from "next/font/local";

const title = localFont({
  src: "./fonts/astral-jitter-complet.woff2",
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HissatsuDle",
  description: "Devine la technique d'Inazuma Eleven du jour.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={title.variable}>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
