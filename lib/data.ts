// Types, chargement des JSON et helpers partagés par le jeu et la liste.
export type Hissatsu = {
  name: string;
  names: Record<string, string>;
  type: string;
  element: string; // un ou plusieurs éléments séparés par un espace
  users: number;
  debut: string;
  tp: number | null;
  characteristic: string[] | null;
  exclusive: boolean;
  image: string;
  user: string[];
  user2: string[] | null;
  description: Record<string, string>;
  teams: string[];
};

export type Char = { sprite: string; teams?: string[] };
export type TeamFr = string | { fr?: string; alias?: string[] };
export type Data = {
  list: Hissatsu[];
  chars: Record<string, Char>;
  emblems: Record<string, string>;
  teamsFr: Record<string, TeamFr>;
  icons: Record<string, Record<string, string>>;
};

export type Lang = "fr" | "en" | "jp";
export const LANGS: Record<Lang, string> = { fr: "FR", en: "EN", jp: "JP" };
export const GAMES = ["IE", "IE2", "IE3", "GO", "CS", "GX", "VR"];
export const TYPES = ["Shoot", "Dribble", "Block", "Catch"];
export const ELEMENTS = ["Fire", "Wind", "Forest", "Mountain", "Void"];

const FR: Record<string, string> = {
  Shoot: "Tir", Dribble: "Dribble", Block: "Défense", Catch: "Arrêt",
  Fire: "Feu", Wind: "Air", Forest: "Bois", Mountain: "Montagne", Void: "Néant",
  cBlock: "Blocage", Long: "Longue distance", Punch: "Poing", Counter: "Contre", Chain: "Enchaînement",
  none: "Aucune", noTeam: "Pas d'équipe", noUser: "Aucun", search: "Nom de la technique, du joueur ou de l'équipe",
  searchAll: "Rechercher une technique, un joueur, une équipe", guess: "Deviner", replay: "Rejouer",
  share: "Partager", copied: "Copié ✓", techniques: "Techniques", game: "Jeu", daily: "Daily", dailyAnime: "Daily anime", endless: "Infini",
  try: "essai", tries: "essais", reveal: "Révéler une case", description: "Description",
  hideDescription: "Masquer la description", hints: "Indices", noUser2: "Pas de second utilisateur",
  gamesPicker: "Jeux inclus dans le tirage et la recherche :", found: "Trouvé en",
};
const EN: Record<string, string> = {
  Shoot: "Shoot", Dribble: "Dribble", Block: "Block", Catch: "Catch",
  Fire: "Fire", Wind: "Wind", Forest: "Forest", Mountain: "Mountain", Void: "Void",
  cBlock: "Block", Long: "Long shot", Punch: "Punch", Counter: "Counter", Chain: "Chain",
  none: "None", noTeam: "No team", noUser: "None", search: "Hissatsu, player or team name",
  searchAll: "Search a technique, a player, a team", guess: "Guess", replay: "Play again",
  share: "Share", copied: "Copied ✓", techniques: "Techniques", game: "Game", daily: "Daily", dailyAnime: "Daily anime", endless: "Endless",
  try: "try", tries: "tries", reveal: "Reveal a cell", description: "Description",
  hideDescription: "Hide description", hints: "Hints", noUser2: "No second user",
  gamesPicker: "Games included in the draw and the search:", found: "Found in",
};
const LABELS: Record<Lang, Record<string, string>> = { fr: FR, en: EN, jp: EN };

export const t = (lang: Lang, key: string) => LABELS[lang][key] ?? key;
export const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export const COLUMNS: Record<Lang, string[]> = {
  fr: ["Technique", "Type", "Élément", "Carac.", "Joueurs", "Utilisateurs", "2nds", "Équipe", "Exclusif", "Jeu", "PT"],
  en: ["Technique", "Type", "Element", "Trait", "Players", "Users", "2nd", "Team", "Game only", "Game", "TP"],
  jp: ["Technique", "Type", "Element", "Trait", "Players", "Users", "2nd", "Team", "Game only", "Game", "TP"],
};

export async function loadData(): Promise<Data> {
  const files = ["hissatsus.json", "zukan.json", "emblemes.json", "equipes_fr.json", "icones.json", "persos_extra.json"];
  const [list, zukan, emblems, teamsFr, icons, extra] = (await Promise.all(
    files.map((f) => fetch(`/data/${f}`).then((r) => (r.ok ? r.json() : {})))
  )) as [Hissatsu[], Record<string, Char>, Record<string, string>, Record<string, TeamFr>,
    Data["icons"], Record<string, Char>];
  return { list, chars: { ...zukan, ...extra }, emblems, teamsFr, icons };
}

export const label = (h: Hissatsu, lang: Lang) => h.names[lang] || h.names.en;
export const desc = (h: Hissatsu, lang: Lang) => h.description[lang] || h.description.en;

export function teamName(n: string, lang: Lang, teamsFr: Data["teamsFr"]) {
  const e = teamsFr[n];
  if (lang !== "fr" || !e) return n;
  return (typeof e === "string" ? e : e.fr) || n;
}
const teamWords = (n: string, teamsFr: Data["teamsFr"]) => {
  const e = teamsFr[n];
  return typeof e === "string" ? [n, e] : [n, e?.fr ?? "", ...(e?.alias ?? [])];
};
// Recherche : tous les noms de la technique, ses joueurs, ses équipes (EN, FR, alias)
export const searchText = (h: Hissatsu, teamsFr: Data["teamsFr"]) =>
  fold([...Object.values(h.names), ...h.user, ...(h.user2 ?? []), ...h.teams.flatMap((n) => teamWords(n, teamsFr))].join(" "));

// En français, la variante "_fr" de l'icône est utilisée si le fichier existe
export function iconSrc(icons: Data["icons"], field: string, value: string, lang: Lang) {
  const src = icons[field]?.[value];
  if (!src) return null;
  return { src: lang === "fr" ? src.replace(/(\.\w+)$/, "_fr$1") : src, fallback: src };
}

// --- comparaison d'un essai avec la cible ---------------------------------
export type CellState = "ok" | "part" | "no";
export type Cell =
  | { kind: "icons"; field: string; values: string[]; labels: string[]; state: CellState; fallback?: string; arrow?: string }
  | { kind: "sprites"; names: string[]; state: CellState }
  | { kind: "emblems"; names: string[]; state: CellState }
  | { kind: "text"; text: string; state: CellState; arrow?: string; big?: boolean; unit?: "pt" | "t" };

// Familles d'équipes : Revolutionary Raimon, Raimon Kings, Zeus (Ares) et Inazuma National War God valent
// leur équipe d'origine ; Royal Academy Redux reste distincte.
const family = (n: string) =>
  n.replace(/\s*\([^)]*\)/g, "").replace(/^Revolutionary /i, "").replace(/ (Kings|War God)$/i, "").trim();

function overlap(a: string[], b: string[]): CellState {
  const shared = a.filter((x) => b.includes(x)).length;
  return a.length === shared && b.length === shared ? "ok" : shared ? "part" : "no";
}
const num = (a: number | null, b: number | null, text?: string): Cell => ({
  kind: "text",
  text: text ?? (a === null ? "—" : String(a)),
  state: a === b ? "ok" : "no",
  arrow: a === null || b === null || a === b ? undefined : a < b ? "↑" : "↓",
});

export function compare(g: Hissatsu, target: Hissatsu, lang: Lang): Cell[] {
  const els = (h: Hissatsu) => h.element.split(" ");
  const u2 = (h: Hissatsu) => h.user2 ?? [];
  const chars = (h: Hissatsu) => h.characteristic ?? [];
  return [
    { kind: "icons", field: "type", values: [g.type], labels: [t(lang, g.type)], state: g.type === target.type ? "ok" : "no" },
    { kind: "icons", field: "element", values: els(g), labels: els(g).map((e) => t(lang, e)), state: overlap(els(g), els(target)) },
    { kind: "icons", field: "characteristic", values: chars(g), labels: chars(g).map((c) => t(lang, c === "Block" ? "cBlock" : c)),
      state: overlap(chars(g), chars(target)), fallback: t(lang, "none") },
    num(g.users, target.users),
    { kind: "sprites", names: g.user, state: overlap(g.user, target.user) },
    { kind: "sprites", names: u2(g), state: overlap(u2(g), u2(target)) },
    { kind: "emblems", names: g.teams, state: overlap(g.teams.map(family), target.teams.map(family)) },
    { kind: "text", text: g.exclusive ? "✔" : "✘", state: g.exclusive === target.exclusive ? "ok" : "no", big: true },
    { ...(num(GAMES.indexOf(g.debut), GAMES.indexOf(target.debut)) as { arrow?: string; state: CellState }),
      kind: "icons", field: "game", values: [g.debut], labels: [g.debut] } as Cell,
    // Victory Road compte en Tension (T), les autres jeux en PT
    { ...num(g.tp, target.tp), unit: g.debut === "VR" ? "t" : "pt" } as Cell,
  ];
}

export const EMOJI: Record<CellState, string> = { ok: "🟩", part: "🟧", no: "🟥" };
