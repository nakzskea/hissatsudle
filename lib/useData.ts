"use client";
import { useEffect, useState } from "react";
import { type Data, type Lang, loadData } from "./data";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, set] = useState<Lang>("fr");
  useEffect(() => {
    set((localStorage.getItem("lang") as Lang) || "fr");
    const onChange = (e: Event) => set((e as CustomEvent<Lang>).detail);
    window.addEventListener("langchange", onChange); // tous les composants suivent le changement
    return () => window.removeEventListener("langchange", onChange);
  }, []);
  return [
    lang,
    (l) => {
      localStorage.setItem("lang", l);
      set(l);
      window.dispatchEvent(new CustomEvent("langchange", { detail: l }));
    },
  ];
}

export function useData() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => { loadData().then(setData); }, []);
  return data;
}
