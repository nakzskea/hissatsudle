"use client";
import Banner, { HomeLink } from "@/components/Banner";
import { useLang } from "@/lib/useData";

// Page de contenu simple, bilingue : { fr: …, en: … }
export default function ContentPage({ titles, content }: { titles: Record<string, string>; content: Record<string, React.ReactNode> }) {
  const [lang, setLang] = useLang();
  const key = lang === "fr" ? "fr" : "en";
  return (
    <>
      <Banner title={titles[key]} lang={lang} setLang={setLang} left={<HomeLink>← {key === "fr" ? "Jeu" : "Game"}</HomeLink>} />
      <main>
        <section className="panel prose">{content[key]}</section>
      </main>
    </>
  );
}
