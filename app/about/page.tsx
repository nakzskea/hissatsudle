import ContentPage from "@/components/Page";

export default function Page() {
  return (
    <ContentPage
      titles={{ fr: "À propos", en: "About" }}
      content={{
        fr: (
          <>
            <p>
              Hissatsudle est un jeu de devinettes quotidien autour des techniques spéciales d&apos;Inazuma Eleven, inspiré
              d&apos;Inazumadle et des autres jeux en « -dle ».
            </p>
            <p>
              Projet personnel développé par Milan Remy. Le code est disponible sur{" "}
              <a href="https://github.com/nakzskea" target="_blank" rel="noopener">GitHub</a>.
            </p>
            <p>Une remarque, une erreur dans les données ? Écris-moi, ça se corrige vite.</p>
          </>
        ),
        en: (
          <>
            <p>
              Hissatsudle is a daily guessing game about Inazuma Eleven special moves, inspired by Inazumadle and the other
              “-dle” games.
            </p>
            <p>
              A personal project by Milan Remy. The code is available on{" "}
              <a href="https://github.com/nakzskea" target="_blank" rel="noopener">GitHub</a>.
            </p>
            <p>Found a mistake in the data? Let me know, it gets fixed quickly.</p>
          </>
        ),
      }}
    />
  );
}
