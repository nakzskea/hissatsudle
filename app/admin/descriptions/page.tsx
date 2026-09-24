"use client";
import { useEffect, useState } from "react";
import Banner, { HomeLink } from "@/components/Banner";
import type { Hissatsu } from "@/lib/data";
import { useData, useLang } from "@/lib/useData";

export default function Descriptions() {
  const data = useData();
  const [lang, setLang] = useLang();
  const [list, setList] = useState<Hissatsu[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => { if (data) setList(data.list); }, [data]);

  const missing = list.filter((h) => !h.description.fr);

  async function save(next: Hissatsu[]) {
    setList([...next]);
    const res = await fetch("/api/save", { method: "POST", body: JSON.stringify(next) });
    setStatus(res.ok ? "Enregistré ✓" : `Erreur : ${await res.text()}`);
  }

  if (!data) return <p className="loading">…</p>;

  return (
    <>
      <Banner title="Descriptions FR" lang={lang} setLang={setLang} left={<HomeLink>← Jeu</HomeLink>} />
      <main>
        <section className="panel">
          {missing.length} technique{missing.length > 1 ? "s" : ""} sans description française. {status}
        </section>
        <div className="admin" style={{ marginTop: "1rem" }}>
          {missing.map((h) => (
            <article className="card" key={h.name}>
              <img src={h.image} alt="" loading="lazy" />
              <div>
                <h2>{h.names.fr ?? h.names.en}</h2>
                <p className="en">{h.description.en}</p>
                <textarea
                  defaultValue=""
                  placeholder="Description française…"
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (!v) return;
                    h.description.fr = v; // la technique est enregistrée en quittant le champ
                    save(list);
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
