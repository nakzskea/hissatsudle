import ContentPage from "@/components/Page";

export default function Page() {
  return (
    <ContentPage
      titles={{ fr: "Confidentialité", en: "Privacy" }}
      content={{
        fr: (
          <>
            <p>HissatsuDle ne collecte aucune donnée personnelle et n&apos;utilise ni compte, ni traceur publicitaire.</p>
            <p>
              Les seules informations conservées le sont dans le stockage local de ton navigateur, sur ton appareil : la langue
              choisie, les jeux sélectionnés en mode infini et la partie du jour en cours. Rien n&apos;est envoyé à un serveur, et
              vider les données du site les efface définitivement.
            </p>
            <p>
              Les images sont chargées depuis des sources externes (wiki Inazuma Eleven, zukan officiel, etc.).
            </p>
            <p>
              Si vous avez des questions sur la confidentialité, n&apos;hésitez pas à me contacter par mail : <a href="mailto:mremy.dev@gmail.com" target="_blank" rel="noopener">mremy.dev@gmail.com</a>
            </p>
          </>
        ),
        en: (
          <>
            <p>HissatsuDle collects no personal data and uses no accounts and no advertising trackers.</p>
            <p>
              The only information kept lives in your browser&apos;s local storage, on your own device: the chosen language, the
              games selected in endless mode and the current daily game. Nothing is sent to a server, and clearing the site data
              deletes it for good.
            </p>
            <p>
              Images are loaded from external sources (the Inazuma Eleven wiki, the official zukan, etc.).
            </p>
            <p>
              If you have any questions about privacy, feel free to contact me by email: <a href="mailto:mremy.dev@gmail.com" target="_blank" rel="noopener">mremy.dev@gmail.com</a>
            </p>
          </>
        ),
      }}
    />
  );
}
