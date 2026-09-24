import ContentPage from "@/components/Page";

export default function Page() {
  return (
    <ContentPage
      titles={{ fr: "Confidentialité", en: "Privacy" }}
      content={{
        fr: (
          <>
            <p>Hissatsudle ne collecte aucune donnée personnelle et n&apos;utilise ni compte, ni traceur publicitaire.</p>
            <p>
              Les seules informations conservées le sont dans le stockage local de ton navigateur, sur ton appareil : la langue
              choisie, les jeux sélectionnés en mode infini et la partie du jour en cours. Rien n&apos;est envoyé à un serveur, et
              vider les données du site les efface définitivement.
            </p>
            <p>
              Les images sont chargées depuis des sources externes (wiki Inazuma Eleven, zukan officiel), qui peuvent recevoir
              l&apos;adresse IP de ton navigateur, comme pour n&apos;importe quelle image affichée sur le web.
            </p>
          </>
        ),
        en: (
          <>
            <p>Hissatsudle collects no personal data and uses no accounts and no advertising trackers.</p>
            <p>
              The only information kept lives in your browser&apos;s local storage, on your own device: the chosen language, the
              games selected in endless mode and the current daily game. Nothing is sent to a server, and clearing the site data
              deletes it for good.
            </p>
            <p>
              Images are loaded from external sources (the Inazuma Eleven wiki, the official zukan), which may receive your
              browser&apos;s IP address, as with any image displayed on the web.
            </p>
          </>
        ),
      }}
    />
  );
}
