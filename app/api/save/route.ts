import { writeFile } from "node:fs/promises";

// Écriture des données depuis les pages d'admin. Réservé au développement local.
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response("dev uniquement", { status: 403 });
  const data = await req.json();
  if (!Array.isArray(data) || data.length < 100) return new Response("données suspectes", { status: 400 });
  await writeFile("public/data/hissatsus.json", JSON.stringify(data, null, 1), "utf8");
  return new Response("ok");
}
