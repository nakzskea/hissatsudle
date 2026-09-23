"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Banner from "@/components/Banner";
import { CellView } from "@/components/Cells";
import { COLUMNS, EMOJI, type Cell, type Hissatsu, compare, desc, fold, label, searchText, t } from "@/lib/data";
import { useData, useLang } from "@/lib/useData";

const HINT_AFTER = 5;
const today = () => new Date().toLocaleDateString("fr-CA");

function dailyIndex(len: number) {
  let hash = 0;
  for (const c of today()) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return hash % len;
}

const ITEM_W: Record<string, number> = { icons: 1.75, sprites: 3.05, emblems: 2.35, text: 2.2, game: 5.4 };

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
  const [mode, setMode] = useState<"daily" | "endless">("daily");
  const [target, setTarget] = useState<Hissatsu | null>(null);
  const [guesses, setGuesses] = useState<Hissatsu[]>([]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false); // liste déroulante visible
  const animated = useRef(new Set<string>());

  const done = !!target && guesses[0] === target;

  // Cible du jour (identique pour tout le monde) ou tirage au hasard, avec reprise du daily en cours
  useEffect(() => {
    if (!data) return;
    if (mode === "daily") {
      const tgt = data.list[dailyIndex(data.list.length)];
      const saved: string[] = JSON.parse(localStorage.getItem(`daily:${today()}`) || "[]");
      setTarget(tgt);
      setGuesses(saved.map((n) => data.list.find((h) => h.name === n)!).filter(Boolean));
    } else {
      setTarget(data.list[Math.floor(Math.random() * data.list.length)]);
      setGuesses([]);
    }
    setQuery("");
    setCopied(false);
  }, [data, mode]);

  // Liste complète, filtrée au fil de la saisie : nom de la technique d'abord, puis joueurs et équipes
  const matches = useMemo(() => {
    if (!data) return [];
    const q = fold(query.trim());
    if (q.length < 3) return []; // la liste n'apparaît qu'à partir de 3 lettres
    const hits = data.list.filter((h) => !guesses.includes(h) && searchText(h, data.teamsFr).includes(q));
    hits.sort((a, b) => Number(fold(label(b, lang)).includes(q)) - Number(fold(label(a, lang)).includes(q)));
    return hits;
  }, [data, query, guesses, lang]);

  function play(h: Hissatsu) {
    if (done || guesses.includes(h)) return;
    const next = [h, ...guesses];
    setGuesses(next);
    setQuery("");
    setOpen(false);
    if (mode === "daily") localStorage.setItem(`daily:${today()}`, JSON.stringify(next.map((x) => x.name)));
  }

  function share() {
    if (!target) return;
    const grid = [...guesses].reverse().map((g) => compare(g, target, lang).map((c) => EMOJI[c.state]).join("")).join("\n");
    navigator.clipboard.writeText(`Hissatsudle ${mode === "daily" ? today() : "∞"} — ${guesses.length}\n${grid}`);
    setCopied(true);
  }

  if (!data || !target) return <p className="loading">…</p>;
  const rows = guesses.map((g) => compare(g, target, lang));
  const grid = { gridTemplateColumns: columns(rows) };
  const misses = guesses.length - (done ? 1 : 0);
  const empty = t(lang, "noUser");

  return (
    <>
      <Banner
        title={<>Hissatsu<b>dle</b></>}
        lang={lang}
        setLang={setLang}
        left={
          <>
            <button className={`badge ${mode === "daily" ? "on" : ""}`} onClick={() => setMode("daily")}>
              <span>{t(lang, "daily")}</span>
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
          <p className="hint">
            {done ? "" : misses >= HINT_AFTER ? <em>{desc(target, lang)}</em> : `Indice après ${HINT_AFTER - misses} essai${HINT_AFTER - misses > 1 ? "s" : ""}`}
          </p>
          {!done && (
            <div className="tips">
              {!target.user.length && <span className="tip">{t(lang, "noUser")}</span>}
              {!(target.user2 ?? []).length && <span className="tip">Pas de second utilisateur</span>}
              {!target.teams.length && <span className="tip">{t(lang, "noTeam")}</span>}
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
                {guesses.length} essai{guesses.length > 1 ? "s" : ""}
              </p>
              <img className="art" src={target.image} alt="" />
              <div className="row-btn">
                <button onClick={share}>{copied ? t(lang, "copied") : t(lang, "share")}</button>
                {mode === "endless" && (
                  <button
                    onClick={() => {
                      setTarget(data.list[Math.floor(Math.random() * data.list.length)]);
                      setGuesses([]);
                      setCopied(false);
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
          {guesses.map((g, gi) => {
            const fresh = gi === 0 && !animated.current.has(g.name);
            if (fresh) animated.current.add(g.name); // seule la ligne qui vient d'arriver s'anime
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
