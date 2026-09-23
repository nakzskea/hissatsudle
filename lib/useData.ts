"use client";
import { useEffect, useState } from "react";
import { type Data, type Lang, loadData } from "./data";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, set] = useState<Lang>("fr");
  useEffect(() => set((localStorage.getItem("lang") as Lang) || "fr"), []);
  return [lang, (l) => { localStorage.setItem("lang", l); set(l); }];
}

export function useData() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => { loadData().then(setData); }, []);
  return data;
}
