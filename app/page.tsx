"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Banner from "@/components/Banner";
import { CellView, Icon } from "@/components/Cells";
import { COLUMNS, EMOJI, GAMES, type Cell, type Hissatsu, compare, desc, fold, label, searchText, t } from "@/lib/data";
import { useData, useLang } from "@/lib/useData";

const REVEAL_AFTER = 3; // révéler une catégorie au hasard
const DESC_AFTER = 5; // dévoiler la description
const today = () => new Date().toLocaleDateString("fr-CA");

// Même technique pour tout le monde : hash de la date, avec un grain propre à chaque mode daily
function dailyIndex(len: number, salt: string) {
  let hash = 0;
  for (const c of today() + salt) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return hash % len;
}

const ITEM_W: Record<string, number> = { icons: 1.75, sprites: 4.35, emblems: 3.5, text: 2.2, game: 5.4 };

// Chaque colonne prend la largeur de sa case la plus remplie (4 sprites = colonne plus large)
function columns(rows: Cell[][]) {
  if (!rows.length) return "14rem repeat(10, 5.4rem)";
  const widths = rows[0].map((_, i) => {
    const c0 = rows[0][i];
    const kind = c0.kind === "icons" && c0.field === "game" ? "game" : c0.kind;
    const max = Math.max(1, ...rows.map((r) => {
      const c = r[i];
      return c.kind === "icons" ? c.values.length : c.kind === "sprites" || c.kind === "emblems" ? c.names.length : 1;
    }));
    return `${Math.max(5.4, 1 + max * ITEM_W[kind]).toFixed(2)}rem`; // 5.4rem = place pour l'en-tête
  });
  return `14rem ${widths.join(" ")}`;
}

export default function Game() {
  const data = useData();
  const [lang, setLang] = useLang();
  const [mode, setMode] = useState<"daily" | "anime" | "endless">("daily");
  const [target, setTarget] = useState<Hissatsu | null>(null);
  const [guesses, setGuesses] = useState<Hissatsu[]>([]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false); // liste déroulante visible
  const [games, setGames] = useState<string[]>(GAMES); // mode infini : jeux inclus dans le tirage
  const [gamesOpen, setGamesOpen] = useState(false);
  const [animeOnly, setAnimeOnly] = useState(false); // exclure les techniques exclusives aux jeux
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]); // colonnes déjà dévoilées
  const [animating, setAnimating] = useState(""); // nom de la technique dont la ligne s'anime

  const done = !!target && guesses[0] === target;

  // En infini, le tirage et la recherche se limitent aux jeux cochés
  const pool = useMemo(() => {
    if (!data) return [];
    if (mode === "daily") return data.list;
    if (mode === "anime") return data.list.filter((h) => !h.exclusive); // techniques vues dans l'anime
    return data.list.filter((h) => games.includes(h.debut) && (!animeOnly || !h.exclusive));
  }, [data, mode, games, animeOnly]);
  const random = () => pool[Math.floor(Math.random() * pool.length)];

  // Cible du jour (identique pour tout le monde) ou tirage au hasard, avec reprise du daily en cours
  useEffect(() => {
    if (!data || !pool.length) return;
    if (mode !== "endless") {
      const tgt = pool[dailyIndex(pool.length, mode)];
      const saved: string[] = JSON.parse(localStorage.getItem(`daily:${mode}:${today()}`) || "[]");
      setTarget(tgt);
      setGuesses(saved.map((n) => data.list.find((h) => h.name === n)!).filter(Boolean));
    } else {
      setTarget(pool[Math.floor(Math.random() * pool.length)]);
      setGuesses([]);
    }
    setQuery("");
    setCopied(false);
    setRevealed([]);
    setShowHint(false);
  }, [data, mode, pool]);

  useEffect(() => {
    const saved = localStorage.getItem("games");
    if (saved) setGames(JSON.parse(saved));
    setAnimeOnly(localStorage.getItem("animeOnly") === "1");
  }, []);
  function toggleGame(g: string) {
    const next = games.includes(g) ? games.filter((x) => x !== g) : [...games, g];
    if (!next.length) return; // au moins un jeu
    setGames(next);
    localStorage.setItem("games", JSON.stringify(next));
  }

  // Liste complète, filtrée au fil de la saisie : nom de la technique d'abord, puis joueurs et équipes
  const matches = useMemo(() => {
    if (!data) return [];
    const q = fold(query.trim());
    if (q.length < 3) return []; // la liste n'apparaît qu'à partir de 3 lettres
    const hits = pool.filter((h) => !guesses.includes(h) && searchText(h, data.teamsFr).includes(q));
    hits.sort((a, b) => Number(fold(label(b, lang)).includes(q)) - Number(fold(label(a, lang)).includes(q)));
    return hits;
  }, [data, pool, query, guesses, lang]);

  function play(h: Hissatsu) {
    if (done || guesses.includes(h)) return;
    const next = [h, ...guesses];
    setGuesses(next);
    setAnimating(h.name);
    setQuery("");
    setOpen(false);
    if (mode !== "endless") localStorage.setItem(`daily:${mode}:${today()}`, JSON.stringify(next.map((x) => x.name)));
  }

  const rows = target ? guesses.map((g) => compare(g, target, lang)) : [];

  // Dévoile une seule case, tirée parmi celles qu'aucun essai n'a encore mises au vert
  function reveal() {
    const known = rows.length ? rows[0].map((_, i) => rows.some((r) => r[i].state === "ok")) : Array(10).fill(false);
    const left = [...Array(10).keys()].filter((i) => !known[i]);
    if (!left.length || revealed.length) return;
    setRevealed([left[Math.floor(Math.random() * left.length)]]);
  }

  function share() {
    if (!target) return;
    const grid = [...guesses].reverse().map((g) => compare(g, target, lang).map((c) => EMOJI[c.state]).join("")).join("\n");
    navigator.clipboard.writeText(`I found today's HissatsuDle${mode === "endless" ? " - ∞ mode" :`${mode === "anime" ? " - anime mode" : ""}`} (Date : ${today()}) in ${guesses.length} guesses!\n${grid}`);
    setCopied(true);
  }

  if (!data || !target) return <p className="loading">…</p>;
  const grid = { gridTemplateColumns: columns(rows) };
  const misses = guesses.length - (done ? 1 : 0);
  const empty = t(lang, "noUser");

  return (
    <>
      <Banner
        title={<>Hissatsu<b>Dle</b></>}
        lang={lang}
        setLang={setLang}
        left={
          <>
            <button className={`badge ${mode === "daily" ? "on" : ""}`} onClick={() => setMode("daily")}>
              <span>{t(lang, "daily")}</span>
            </button>
            <button className={`badge ${mode === "anime" ? "on" : ""}`} onClick={() => setMode("anime")}>
              <span>{t(lang, "dailyAnime")}</span>
            </button>
            <button className={`badge ${mode === "endless" ? "on" : ""}`} onClick={() => setMode("endless")}>
              <span>{t(lang, "endless")}</span>
            </button>
          </>
        }
        right={
          <Link className="badge" href="/techniques">
            <span>{t(lang, "techniques")}</span>
          </Link>
        }
      />

      <main>
        <section className="panel">
          <div className="hint-row">
            <p className="hint">
              {done ? "" : showHint ? <em>{desc(target, lang)}</em> : `${misses} ${t(lang, misses > 1 ? "tries" : "try")}`}
            </p>
            {!done && (
              <>
                <button
                  className={`badge ${misses >= REVEAL_AFTER && !revealed.length ? "on" : ""}`}
                  disabled={misses < REVEAL_AFTER || revealed.length > 0}
                  onClick={reveal}
                >
                  <span>{t(lang, "reveal")} {misses < REVEAL_AFTER ? `(${REVEAL_AFTER - misses})` : ""}</span>
                </button>
                <button
                  className={`badge ${misses >= DESC_AFTER ? "on" : ""}`}
                  disabled={misses < DESC_AFTER}
                  onClick={() => setShowHint(!showHint)}
                >
                  <span>
                    {showHint
                      ? t(lang, "hideDescription")
                      : `${t(lang, "description")} ${misses < DESC_AFTER ? `(${DESC_AFTER - misses})` : ""}`}
                  </span>
                </button>
              </>
            )}
            {!done && mode === "endless" && (
              <button className="badge on" onClick={() => setGamesOpen(!gamesOpen)}>
                <span>{t(lang, "game")} {games.length < GAMES.length ? `(${games.length})` : ""} ▾</span>
              </button>
            )}
          </div>

          {mode === "endless" && gamesOpen && (
            <div className="games-picker">
              <p>{t(lang, "gamesPicker")}</p>
              <label className="anime-only">
                <input
                  type="checkbox"
                  checked={animeOnly}
                  onChange={(e) => {
                    setAnimeOnly(e.target.checked);
                    localStorage.setItem("animeOnly", e.target.checked ? "1" : "0");
                  }}
                />
                {lang === "fr" ? "Anime uniquement (sans les exclusivités jeu)" : "Anime only (no game-exclusive moves)"}
              </label>
              <div className="games">
                {GAMES.map((g) => (
                  <button key={g} className={games.includes(g) ? "" : "off"} onClick={() => toggleGame(g)} title={g}>
                    <Icon icons={data.icons} field="game" value={g} label={g} lang={lang} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {!done && (
            <form
              className="guess"
              onSubmit={(e) => {
                e.preventDefault();
                const exact = matches.find((h) => fold(label(h, lang)) === fold(query.trim()));
                if (exact ?? matches[0]) play(exact ?? matches[0]);
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)} // laisse le temps au clic sur une suggestion
                placeholder={t(lang, "search")}
                autoComplete="off"
              />
              <button className="go">{t(lang, "guess")}</button>
            </form>
          )}

          <ul className="suggestions" hidden={!open || done || !matches.length}>
            {matches.map((h) => (
              <li key={h.name}>
                <button type="button" onClick={() => play(h)}>
                  <img src={h.image} alt="" loading="lazy" />
                  {label(h, lang)}
                </button>
              </li>
            ))}
          </ul>

          {done && (
            <div className="end">
              <p className="win">{label(target, lang)}</p>
              <p>
                {t(lang, "found")} {guesses.length} {t(lang, guesses.length > 1 ? "tries" : "try")}
              </p>
              <img className="art" src={target.image} alt="" />
              <div className="row-btn">
                <button onClick={share}>{copied ? t(lang, "copied") : t(lang, "share")}</button>
                {mode === "endless" && (
                  <button
                    onClick={() => {
                      setTarget(random());
                      setGuesses([]);
                      setCopied(false);
                      setRevealed([]);
                      setShowHint(false);
                      setAnimating("");
                    }}
                  >
                    {t(lang, "replay")}
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <div className="scroller">
          <div className="head" style={grid}>
            {COLUMNS[lang].map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
          {revealed.length > 0 && (
            <div className="row hints" style={grid}>
              <div className="cell name">
                <span>{t(lang, "hints")}</span>
              </div>
              {compare(target, target, lang).map((cell, ci) =>
                revealed.includes(ci) ? (
                  <div key={ci} className="cell ok">
                    <CellView cell={cell} data={data} lang={lang} empty={empty} />
                  </div>
                ) : (
                  <div key={ci} className="cell hidden-cell">
                    ?
                  </div>
                )
              )}
            </div>
          )}
          {guesses.map((g, gi) => {
            const fresh = gi === 0 && g.name === animating; // seule la ligne qui vient d'arriver s'anime
            return (
              <div className="row" key={g.name} style={grid}>
                <div className={`cell name${fresh ? " fresh" : ""}`} style={{ ["--i" as string]: -1 }}>
                  <img src={g.image} alt="" loading="lazy" />
                  <span>{label(g, lang)}</span>
                </div>
                {rows[gi].map((cell, ci) => (
                  <div key={ci} className={`cell ${cell.state}${fresh ? " fresh" : ""}`} style={{ ["--i" as string]: ci }}>
                    <CellView cell={cell} data={data} lang={lang} empty={empty} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
