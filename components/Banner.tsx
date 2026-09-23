"use client";
import Link from "next/link";
import { LANGS, type Lang } from "@/lib/data";

export default function Banner({
  title,
  lang,
  setLang,
  left,
  right,
}: {
  title: React.ReactNode;
  lang: Lang;
  setLang: (l: Lang) => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="banner">
      <nav className="modes">{left}</nav>
      <h1 className="logo">{title}</h1>
      <nav className="links">
        {right}
        <div className="langs">
          {(Object.keys(LANGS) as Lang[]).map((l) => (
            <button key={l} className={l === lang ? "on" : ""} onClick={() => setLang(l)}>
              {LANGS[l]}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export const HomeLink = ({ children }: { children: React.ReactNode }) => (
  <Link className="badge" href="/">
    <span>{children}</span>
  </Link>
);
