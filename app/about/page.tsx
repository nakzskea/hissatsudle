import ContentPage from "@/components/Page";

export default function Page() {
  return (
    <ContentPage
      titles={{ fr: "À propos", en: "About" }}
      content={{
        fr: (
          <>
            <p>
              Bonjour ! Je suis Milan, développeur full-stack et fan d&apos;Inazuma Eleven. J&apos;ai créé HissatsuDle pour m&apos;amuser et partager ma passion avec d&apos;autres fans.
            </p>
            <p>
              L&apos;idée m&apos;est venue après avoir joué à <a href="https://www.inazumadle.com/" target="_blank" rel="noopener">InazumaDle</a>, un jeu de devinettes sur les joueurs d&apos;Inazuma Eleven. J&apos;ai voulu créer ma propre version, centré sur les techniques spéciales (hissatsu) de la licence !
            </p>
            <p>
              Ce jeu prend également comme inspiration le jeu <a href="https://www.gamedle.wtf/" target="_blank" rel="noopener">Gamedle</a> pour le concept des indices.
            </p>
            <p>
              Les images des techniques proviennent des jeux ou de l&apos;anime Inazuma Eleven. Les icônes des équipes, des personnages, des caractéristiques, des types et des éléments sont issues du wiki Inazuma Eleven (<a href="https://inazuma-eleven.fandom.com/fr/wiki/Wiki_Inazuma_Eleven" target="_blank" rel="noopener">français</a> et <a href="https://inazuma-eleven.fandom.com/wiki/Inazuma_Eleven_Wiki" target="_blank" rel="noopener">anglais</a>) et du <a href="https://zukan.inazuma.jp" target="_blank" rel="noopener">Zukan officiel</a> des personnages.
            </p>
            <p>
              Les données des 879 techniques ont été scrappées et compilées par mes soins, à partir des sources mentionnées ci-dessus et certaines ajoutées à la main directement. La base de techniques peut donc contenir des erreurs ! Si tu constates une erreur dans les données, n&apos;hésite pas à me le signaler par mail : <a href="mailto:mremy.dev@gmail.com" target="_blank" rel="noopener">mremy.dev@gmail.com</a>, je suis plutot réactif !
            </p>
            <p>
              Les techniques des anime Arès et Orion sont classés dans la catégorie &quot;Victory Road&quot; (VR) car elles sont apparues en premier dans ce jeu.
            </p>
            <p>
              Le champ &quot;2nds&quot; indique les seconds utilisateurs de la technique. C&apos;est un indice en plus, mais il est basé principalement sur ma mémoire et mon interprétation, il peut donc être incomplet ou incorrect.
            </p>
            <p>
              Projet personnel développé par <a href="https://mremy-dev.fr" target="_blank" rel="noopener">Milan Remy</a>. Le code est disponible sur <a href="https://github.com/nakzskea/hissatsudle" target="_blank" rel="noopener">GitHub</a>.
            </p>
          </>
        ),
        en: (
          <>
            <p>
              Hi! I&apos;m Milan, a full-stack developer and an Inazuma Eleven fan. I built HissatsuDle for fun, to share what I love about the series with other fans.
            </p>
            <p>
              The idea came after playing <a href="https://www.inazumadle.com/" target="_blank" rel="noopener">InazumaDle</a>, a guessing game about Inazuma Eleven players. I wanted my own version, built around the series&apos; special moves (hissatsu)!
            </p>
            <p>
              The game also takes inspiration from <a href="https://www.gamedle.wtf/" target="_blank" rel="noopener">Gamedle</a> for how the hints work.
            </p>
            <p>
              Technique pictures come from the Inazuma Eleven games or anime. Team, character, characteristic, type and element icons come from the Inazuma Eleven wiki (<a href="https://inazuma-eleven.fandom.com/fr/wiki/Wiki_Inazuma_Eleven" target="_blank" rel="noopener">French</a> and <a href="https://inazuma-eleven.fandom.com/wiki/Inazuma_Eleven_Wiki" target="_blank" rel="noopener">English</a>) and from the official character <a href="https://zukan.inazuma.jp" target="_blank" rel="noopener">Zukan</a>.
            </p>
            <p>
              The data for all 879 techniques was scraped and put together by me, from the sources above, with some entries added by hand. The database may therefore contain mistakes! If you spot one, feel free to email me at <a href="mailto:mremy.dev@gmail.com" target="_blank" rel="noopener">mremy.dev@gmail.com</a>, I usually reply quickly!
            </p>
            <p>
              Techniques from the Ares and Orion anime are listed under &quot;Victory Road&quot; (VR), since that is the game they first appeared in.
            </p>
            <p>
              The &quot;2nd&quot; column lists a technique&apos;s secondary users. It is an extra hint, but it mostly relies on my own memory and interpretation, so it may be incomplete or wrong.
            </p>
            <p>
              A personal project by <a href="https://mremy-dev.fr" target="_blank" rel="noopener">Milan Remy</a>. The code is available on <a href="https://github.com/nakzskea/hissatsudle" target="_blank" rel="noopener">GitHub</a>.
            </p>
          </>
        ),
      }}
    />
  );
}
