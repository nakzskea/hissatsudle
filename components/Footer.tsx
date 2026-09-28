"use client";
import Link from "next/link";
import { useLang } from "@/lib/useData";
const BG_URL = "https://www.deviantart.com/wowan14/art/Inazuma-Eleven---016---Riverbank-EveningV-2-869648895";

const TXT = {
  fr: { fan: "Projet de fan, sans lien avec Level-5.", privacy: "Confidentialité", about: "À propos", thanks: "Remerciements", bg: "Fond réalisé par Wowan14 sur DeviantArt" },
  en: { fan: "Fan project, not affiliated with Level-5.", privacy: "Privacy", about: "About", thanks: "Credits", bg: "Background made by Wowan14 on DeviantArt" },
};

export default function Footer() {
  const [lang] = useLang();
  const t = TXT[lang === "fr" ? "fr" : "en"];
  return (
    <footer className="site-footer">
      <p className="brand">HissatsuDle - 2026</p>
      <p>{t.fan}</p>
      <p>
        <a href={BG_URL} target="_blank" rel="noopener noreferrer">{t.bg}</a>
      </p>
      <nav>
        <Link href="/privacy">{t.privacy}</Link>
        <span>•</span>
        <Link href="/about">{t.about}</Link>
        <span>•</span>
        <Link href="/thanks">{t.thanks}</Link>
      </nav>
    </footer>
  );
}
