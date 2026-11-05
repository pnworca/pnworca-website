// Race types for /event-category/<slug>/ pages, built from races.json.
import { readFileSync } from "node:fs";

const races = JSON.parse(readFileSync(new URL("./races.json", import.meta.url), "utf8"));

export default function () {
  const types = [];
  for (const r of races) {
    if (!types.find((t) => t.slug === r.categorySlug)) types.push({ slug: r.categorySlug, name: r.category });
  }
  return types;
}
