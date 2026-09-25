"use client";
import Link from "next/link";
import { useLang } from "@/lib/useData";

const TXT = {
  fr: { fan: "Projet de fan, sans lien avec Level-5.", privacy: "Confidentialité", about: "À propos", thanks: "Remerciements" },
  en: { fan: "Fan project, not affiliated with Level-5.", privacy: "Privacy", about: "About", thanks: "Credits" },
};

export default function Footer() {
  const [lang] = useLang();
  const t = TXT[lang === "fr" ? "fr" : "en"];
  return (
    <footer className="site-footer">
      <p className="brand">HissatsuDle - {new Date().getFullYear()}</p>
      <p>{t.fan}</p>
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
