import ContentPage from "@/components/Page";

export default function Page() {
  return (
    <ContentPage
      titles={{ fr: "Remerciements", en: "Credits" }}
      content={{
        fr: (
          <>
            <p>
              Merci au <a href="https://inazuma-eleven.fandom.com" target="_blank" rel="noopener">wiki Inazuma Eleven</a> et à ses
              contributeurs, dont les données sont publiées sous licence CC BY-SA.
            </p>
            <p>
              Merci au <a href="https://zukan.inazuma.jp" target="_blank" rel="noopener">zukan officiel</a> de Level-5 pour les
              noms et les visuels des personnages.
            </p>
            <p>Merci à Inazumadle pour l&apos;inspiration, et à Level-5 pour la licence.</p>
          </>
        ),
        en: (
          <>
            <p>
              Thanks to the <a href="https://inazuma-eleven.fandom.com" target="_blank" rel="noopener">Inazuma Eleven wiki</a> and
              its contributors, whose data is published under the CC BY-SA licence.
            </p>
            <p>
              Thanks to Level-5&apos;s <a href="https://zukan.inazuma.jp" target="_blank" rel="noopener">official zukan</a> for
              character names and artwork.
            </p>
            <p>Thanks to Inazumadle for the inspiration, and to Level-5 for the series.</p>
          </>
        ),
      }}
    />
  );
}
