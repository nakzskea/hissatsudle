"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Banner, { HomeLink } from "@/components/Banner";
import { Emblem, Icon, Sprite } from "@/components/Cells";
import { ELEMENTS, GAMES, TYPES, desc, fold, label, searchText, t } from "@/lib/data";
import { useData, useLang } from "@/lib/useData";

export default function Techniques() {
  const data = useData();
  const [lang, setLang] = useLang();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [element, setElement] = useState("");
  const [game, setGame] = useState("");
  const [shown, setShown] = useState(40); // affichage progressif
  const sentinel = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    if (!data) return [];
    const needle = fold(q);
    return data.list.filter(
      (h) =>
        (!needle || searchText(h, data.teamsFr).includes(needle)) &&
        (!type || h.type === type) &&
        (!element || h.element.split(" ").includes(element)) &&
        (!game || h.debut === game)
    );
  }, [data, q, type, element, game]);

  // Charge 40 cartes de plus dès que le bas de la liste approche
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && setShown((n) => n + 40));
    io.observe(el);
    return () => io.disconnect();
  }, [data]);

  useEffect(() => setShown(40), [q, type, element, game]);

  if (!data) return <p className="loading">…</p>;

  return (
    <>
      <Banner title={t(lang, "techniques")} lang={lang} setLang={setLang} left={<HomeLink>← {t(lang, "game")}</HomeLink>} />
      <main>
        <section className="panel filters">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, "searchAll")} />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Type</option>
            {TYPES.map((v) => (
              <option key={v} value={v}>{t(lang, v)}</option>
            ))}
          </select>
          <select value={element} onChange={(e) => setElement(e.target.value)}>
            <option value="">{lang === "fr" ? "Élément" : "Element"}</option>
            {ELEMENTS.map((v) => (
              <option key={v} value={v}>{t(lang, v)}</option>
            ))}
          </select>
          <select value={game} onChange={(e) => setGame(e.target.value)}>
            <option value="">{t(lang, "game")}</option>
            {GAMES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <span className="count">{rows.length}</span>
        </section>

        <div className="rows">
          {rows.slice(0, shown).map((h) => (
            <article className="tech" key={h.name}>
              <img className="shot" src={h.image} alt="" loading="lazy" />
              <div className="body">
                <h2>{label(h, lang)}</h2>
                <p className="desc">{desc(h, lang)}</p>
                <div className="meta">
                  <Icon icons={data.icons} field="type" value={h.type} label={t(lang, h.type)} lang={lang} />
                  {h.element.split(" ").map((e) => (
                    <Icon key={e} icons={data.icons} field="element" value={e} label={t(lang, e)} lang={lang} />
                  ))}
                  {(h.characteristic ?? []).map((c) => (
                    <Icon key={c} icons={data.icons} field="characteristic" value={c} label={t(lang, c === "Block" ? "cBlock" : c)} lang={lang} />
                  ))}
                  <Icon icons={data.icons} field="game" value={h.debut} label={h.debut} lang={lang} />
                  <span className="tp">{h.tp ?? "—"} PT</span>
                  {h.teams.map((n) => (
                    <Emblem key={n} name={n} data={data} lang={lang} />
                  ))}
                </div>
                <div className="users">
                  {[...h.user, ...(h.user2 ?? [])].map((n, i) => (
                    <Sprite key={`${n}-${i}`} name={n} chars={data.chars} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div ref={sentinel} />
      </main>
    </>
  );
}
