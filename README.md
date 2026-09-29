# HissatsuDle

Jeu de devinettes quotidien sur les *hissatsu* (techniques spéciales) d'Inazuma Eleven, dans l'esprit
d'[InazumaDle](https://www.inazumadle.com/) et de [Gamedle](https://www.gamedle.wtf/).
879 techniques issues des 7 jeux principaux : Inazuma Eleven, Inazuma Eleven 2, Inazuma Eleven 3, Inazuma Eleven : GO, Inazuma Eleven : Chrono Stones, Inazuma Eleven : Galaxy et Inazuma Eleven : Victory Road.

Projet de fan, sans aucun lien avec Level-5.

## Modes

| Mode | Page | Principe |
|---|---|---|
| Daily | `/` | Une technique par jour, la même pour tout le monde |
| Daily anime | `/` | Idem, sans les techniques exclusives aux jeux |
| Infini | `/` | Tirage aléatoire, avec filtre par jeu et option « anime uniquement » |
| HissatsuDoku | `/hissatsudoku` | Grille 3×3 façon métrodoku : 10 essais pour remplir les 9 cases |
| Techniques | `/techniques` | La base complète de techniques, en lecture seule |

Chaque essai compare 10 critères (type, élément, caractéristique, nombre d'utilisateurs, joueurs,
seconds joueurs, équipe, exclusivité, jeu, coût en PT/T).  
Indices : une case révélée au bout de 3 essais, la description au bout de 5.

Interface en français, anglais et techniques en japonais.

## Stack

Next.js (App Router) + TypeScript, sans base de données ni backend : tout est statique et les données
sont lues depuis `public/data/`. Déployé sur Vercel.

```bash
npm install
npm run dev
```

## Données

Les JSON de `public/data/` sont la **source de vérité**. Ils ont été constitués une fois par scraping
(wiki Inazuma Eleven FR/EN, zukan officiel) puis corrigés à la main avec comme modèle les jeux officiels ou ma mémoire. Les scripts de génération ont été retirés du dépôt.

| Fichier | Contenu |
|---|---|
| `hissatsus.json` | Les 879 techniques : noms FR/EN/JP, type, élément, caractéristique, utilisateurs, équipes, jeu, coût, description, image |
| `zukan.json` | Les personnages et leurs sprites |
| `persos_extra.json` | Les personnages absents du zukan, ajoutés à la main |
| `emblemes.json` | Les emblèmes d'équipe |
| `equipes_fr.json` | Noms d'équipe en français et alias de recherche |
| `icones.json` | Icônes officielles par type, élément, caractéristique et jeu (variantes `_fr`) |
| `grilles.json` | 500 grilles 3×3 précalculées pour HissatsuDoku, dont chaque case a au moins 3 réponses valides |

## Structure

```
app/          pages (jeu, hissatsudoku, techniques, about, privacy, thanks)
components/   Banner, Cells, Confetti, Footer, Page
lib/          data.ts (types, libellés, comparaison), useData.ts (chargement, langue)
public/data/  les JSON ci-dessus
public/icones/ icônes et logos
```

## Crédits

- Inazuma Eleven est une licence [Level-5](https://www.level5.co.jp/).
- Données et icônes : [wiki Inazuma Eleven](https://inazuma-eleven.fandom.com/fr/wiki/Wiki_Inazuma_Eleven) (CC BY-SA),
  [zukan officiel](https://zukan.inazuma.jp)
- Illustrations : Hélène - [dmum-falc.fr](https://www.dmum-falc.fr).
- Image de fond : [Wowan14](https://www.deviantart.com/wowan14) sur DeviantArt.
- Police Fredoka et police des jeux Inazuma Eleven GO, modifiée pour être utilisée par le site.

Une erreur dans les données ? [mremy.dev@gmail.com](mailto:mremy.dev@gmail.com)

Développé par [Milan Remy](https://mremy-dev.fr).

## TODO :
ajouter un lien vers le site lorsqu'il sera en ligne dans le bouton partager les résultats / changer en fonction de la langue aussi

### icones : 
- logo du site (ballon avec un H?)
- chibi hurley et tori qui se tiennent la main (fond transparent) : a mettre dans remerciements
- chibi de mon personnage pour a propos
- chibi zanark pour la page de confidentialité

### facultatif :
- logo du site : HissatsuDle en police inazuma (ajouter des petits personnages?)
- fond inazuma type écran titre strikers
