"use client";
import type { Cell, Data, Lang } from "@/lib/data";
import { iconSrc, teamName } from "@/lib/data";

// Icône officielle avec repli sur le fichier de base si la variante FR n'existe pas
export function Icon({ icons, field, value, label, lang, className = "icon" }:
  { icons: Data["icons"]; field: string; value: string; label: string; lang: Lang; className?: string }) {
  const src = iconSrc(icons, field, value, lang);
  if (!src) return <span className="txt">{label}</span>;
  return (
    <img
      className={className}
      src={src.src}
      alt={label}
      title={label}
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== src.fallback) img.src = src.fallback;
      }}
    />
  );
}

export function Sprite({ name, chars }: { name: string; chars: Data["chars"] }) {
  const src = chars[name]?.sprite;
  return src ? <img className="sprite" src={src} alt={name} title={name} loading="lazy" /> : <span className="txt">{name}</span>;
}

export function Emblem({ name, data, lang }: { name: string; data: Data; lang: Lang }) {
  const label = teamName(name, lang, data.teamsFr);
  const src = data.emblems[name];
  return src ? <img className="emblem" src={src} alt={label} title={label} loading="lazy" /> : <span className="txt">{label}</span>;
}

export function CellView({ cell, data, lang, empty }: { cell: Cell; data: Data; lang: Lang; empty: string }) {
  if (cell.kind === "icons")
    return cell.values.length ? (
      <>
        {cell.values.map((v, i) => (
          <Icon key={v} icons={data.icons} field={cell.field} value={v} label={cell.labels[i]} lang={lang} />
        ))}
        {cell.arrow && <span className="arrow">{cell.arrow}</span>}
      </>
    ) : (
      <span className="txt">{cell.fallback ?? empty}</span>
    );
  if (cell.kind === "sprites")
    return cell.names.length ? (
      <>{cell.names.map((n) => <Sprite key={n} name={n} chars={data.chars} />)}</>
    ) : (
      <span className="txt">{empty}</span>
    );
  if (cell.kind === "emblems")
    return cell.names.length ? (
      <>{cell.names.map((n) => <Emblem key={n} name={n} data={data} lang={lang} />)}</>
    ) : (
      <span className="txt">{empty}</span>
    );
  return (
    <>
      <span className={cell.big ? "big" : ""}>{cell.text}</span>
      {cell.arrow && <span className="arrow">{cell.arrow}</span>}
    </>
  );
}
