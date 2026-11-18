import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "./globals.css";
import localFont from "next/font/local";
import type { Viewport } from "next";

const title = localFont({
  src: "./fonts/astral-jitter-complet.woff2",
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HissatsuDle",
  description: "Devine la technique d'Inazuma Eleven du jour.",
  appleWebApp: { capable: true, title: "HissatsuDle", statusBarStyle: "black-translucent" },
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

export const viewport: Viewport = { themeColor: "#1a4aa8", viewportFit: "cover" };
