"use client";
import Banner from "@/components/Banner";
import { useLang } from "@/lib/useData";
import Link from "next/link";

// Page de contenu simple, bilingue : { fr: …, en: … }
export default function ContentPage({ titles, content }: { titles: Record<string, string>; content: Record<string, React.ReactNode> }) {
  const [lang, setLang] = useLang();
  const key = lang === "fr" ? "fr" : "en";
  return (
    <>
      <Banner 
      title={titles[key]} 
      lang={lang} 
      setLang={setLang}         
      left={
          <Link className="badge back" href="/" aria-label={key === "fr" ? "Jeu" : "Game"}>
            <img src="/icones/back.png" alt="" />
          </Link>
        } />
      <main>
        <section className="panel prose">{content[key]}</section>
      </main>
    </>
  );
}
