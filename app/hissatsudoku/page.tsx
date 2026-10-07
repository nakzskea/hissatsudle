"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Banner from "@/components/Banner";
import { Crit } from "@/components/Cells";
import Confetti from "@/components/Confetti";
import { type Grid, type Hissatsu, critTest, dailyIndex, fold, label, t, today } from "@/lib/data";
import { useData, useLang } from "@/lib/useData";

const TRIES = 10;

export default function Grille() {
  const data = useData();
  const [lang, setLang] = useLang();
  const [grids, setGrids] = useState<Grid[]>([]);
  const [picks, setPicks] = useState<(string | null)[]>(Array(9).fill(null));
  const [tries, setTries] = useState(0);
  const [active, setActive] = useState<number | null>(null); // case en cours de saisie
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/grilles.json").then((r) => r.json()).then(setGrids);
  }, []);

  const grid = grids.length ? grids[dailyIndex(grids.length, "grid")] : null;

  // Reprise de la grille du jour
  useEffect(() => {
    const saved = localStorage.getItem(`grid:${today()}`);
    if (saved) {
      const s = JSON.parse(saved);
      setPicks(s.picks);
      setTries(s.tries);
    }
  }, []);
  const save = (p: (string | null)[], n: number) =>
    localStorage.setItem(`grid:${today()}`, JSON.stringify({ picks: p, tries: n }));

  const filled = picks.filter(Boolean).length;
  const perfect = filled === 9;
  const done = perfect || tries >= TRIES;

  const matches = useMemo(() => {
    const q = fold(query.trim());
    if (!data || q.length < 3 || active === null) return [];
    return data.list
      .filter((h) => !picks.includes(h.name) && fold([h.name, ...Object.values(h.names)].join(" ")).includes(q))
      .slice(0, 40);
  }, [data, query, active, picks]);

  // Partie finie : toutes les techniques qui auraient marché dans la case cliquée
  const solutions = useMemo(() => {
    if (active === null || !grid || !data) return [];
    const mine = picks[active];
    return data.list
      .filter((h) => critTest(h, grid.rows[Math.floor(active / 3)]) && critTest(h, grid.cols[active % 3]))
      .sort((a, b) => Number(b.name === mine) - Number(a.name === mine));
  }, [active, grid, data, picks]);

  function play(h: Hissatsu) {
    if (active === null || !grid || done) return;
    const ok = critTest(h, grid.rows[Math.floor(active / 3)]) && critTest(h, grid.cols[active % 3]);
    const next = [...picks];
    if (ok) next[active] = h.name;
    else {
      setWrong(active);
      setTimeout(() => setWrong(null), 600);
    }
    const n = tries + 1;
    setPicks(next);
    setTries(n);
    save(next, n);
    close();
  }
  const close = () => {
    setActive(null);
    setQuery("");
  };

  function share() {
    const art = [0, 3, 6].map((i) => picks.slice(i, i + 3).map((p) => (p ? "🟩" : "⬜")).join("")).join("\n");
    navigator.clipboard.writeText(
      `HissatsuDoku grid (${today()}) - ${filled}/9 in ${tries} guesses!\n${art}`
    );
    setCopied(true);
  }

  if (!data || !grid) return <p className="loading">…</p>;

  const byName = (n: string) => data.list.find((h) => h.name === n);

  return (
    <>
      {perfect && <Confetti />}
      <Banner
        title={<>Hissatsu<b>Doku</b></>}
        lang={lang}
        setLang={setLang}
        left={
          <Link className="badge" href="/">
            <span>HissatsuDle</span>
          </Link>
        }
        right={
          <Link className="badge" href="/techniques">
            <span>{t(lang, "techniques")}</span>
          </Link>
        }
      />

      <main>
        <div className="grid-score">
          <p>{Math.max(0, TRIES - tries)} {t(lang, "triesLeft")}</p>
          <p>{filled}/9</p>
        </div>

        <div className="grid3">
          <div />
          {grid.cols.map((c) => (
            <div className="grid-head" key={c}>
              <Crit crit={c} data={data} lang={lang} />
            </div>
          ))}
          {grid.rows.map((r, y) => (
            <Fragment key={r}>
              <div className="grid-head">
                <Crit crit={r} data={data} lang={lang} />
              </div>
              {grid.cols.map((c, x) => {
                const i = y * 3 + x;
                const h = picks[i] ? byName(picks[i]!) : null;
                return (
                  <button
                    key={c}
                    className={`grid-cell ${h ? "ok" : ""} ${wrong === i ? "wrong" : ""}`}
                    disabled={!done && !!h}
                    onClick={() => setActive(i)}
                    title={h ? label(h, lang) : ""}
                  >
                    {h && <img src={h.image} alt={label(h, lang)} />}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>

        {done && (
          <section className="panel end grid-end">
            <p className="win">{t(lang, perfect ? "gridWin" : "gridOver")}</p>
            <p>
              {filled}/9 · {tries} {t(lang, tries > 1 ? "tries" : "try")}
            </p>
            <div className="row-btn">
              <button onClick={share}>{copied ? t(lang, "copied") : t(lang, "share")}</button>
            </div>
          </section>
        )}
      </main>

      {active !== null && (
        <div className="modal" onClick={close}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <>
                <p className="sol-count">{solutions.length} {t(lang, "answers")}</p>
                <ul className="suggestions">
                  {solutions.map((h) => (
                    <li key={h.name}>
                      <button type="button" className={active !== null && picks[active] === h.name ? "found" : ""} disabled>
                        <img src={h.image} alt="" loading="lazy" />
                        {label(h, lang)}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="sol-count">{solutions.length} {t(lang, "answers")}</p>
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
                    onKeyDown={(e) => e.key === "Escape" && close()}
                    placeholder={t(lang, "searchTech")}
                    autoComplete="off"
                    autoFocus
                  />
                  <button className="go">{t(lang, "guess")}</button>
                </form>
                <ul className="suggestions" hidden={!matches.length}>
                  {matches.map((h) => (
                    <li key={h.name}>
                      <button type="button" onClick={() => play(h)}>
                        <img src={h.image} alt="" loading="lazy" />
                        {label(h, lang)}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
