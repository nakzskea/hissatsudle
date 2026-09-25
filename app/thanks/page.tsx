import ContentPage from "@/components/Page";

export default function Page() {
  return (
    <ContentPage
      titles={{ fr: "Remerciements", en: "Credits" }}
      content={{
        fr: (
          <>
            <p>
              Merci à Mario, développeur du site <a href="https://www.inazumadle.com/" target="_blank" rel="noopener">InazumaDle</a>, pour l&apos;inspiration et les échanges que j&apos;ai pu avoir avec lui.
            </p>
            <p>
              Merci à ma copine, Hélène, pour les illustrations du site et pour m&apos;avoir aidé à tester le jeu. Vous pouvez la retrouver sur son <a href="https://www.dmum-falc.fr" target="_blank" rel="noopener">site web</a> si vous avez besoin d&apos;une illustratrice !
            </p>
            <p>
              Merci au wiki Inazuma Eleven (<a href="https://inazuma-eleven.fandom.com/fr/wiki/Wiki_Inazuma_Eleven" target="_blank" rel="noopener">français</a> et <a href="https://inazuma-eleven.fandom.com/wiki/Inazuma_Eleven_Wiki" target="_blank" rel="noopener">anglais</a>) et à ses
              contributeurs, dont les données sont publiées sous licence CC BY-SA.
            </p>
            <p>
              Merci au <a href="https://zukan.inazuma.jp" target="_blank" rel="noopener">zukan officiel</a> de Level-5 pour les
              noms et les visuels des personnages.
            </p>
            <p>Et finalement, merci à tous ceux qui ont joué et qui joueront à ce jeu !</p>
          </>
        ),
        en: (
          <>
            <p>
              Thanks to Mario, the developer behind <a href="https://www.inazumadle.com/" target="_blank" rel="noopener">InazumaDle</a>, for the inspiration and for the chats we had along the way.
            </p>
            <p>
              Thanks to my girlfriend, Hélène, for the site&apos;s illustrations and for helping me test the game. You can find her on her <a href="https://www.dmum-falc.fr" target="_blank" rel="noopener">website</a> if you ever need an illustrator!
            </p>
            <p>
              Thanks to the Inazuma Eleven wiki (<a href="https://inazuma-eleven.fandom.com/fr/wiki/Wiki_Inazuma_Eleven" target="_blank" rel="noopener">French</a> and <a href="https://inazuma-eleven.fandom.com/wiki/Inazuma_Eleven_Wiki" target="_blank" rel="noopener">English</a>) and its
              contributors, whose data is published under the CC BY-SA licence.
            </p>
            <p>
              Thanks to Level-5&apos;s <a href="https://zukan.inazuma.jp" target="_blank" rel="noopener">official zukan</a> for
              character names and artwork.
            </p>
            <p>And finally, thanks to everyone who has played this game, and to everyone who will!</p>
          </>
        ),
      }}
    />
  );
}
