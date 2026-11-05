// Runs after every build. Fails the build if a page links to a page or file
// on this site that does not exist, so a broken link never reaches the live site.
// Links still waiting on a page are listed in KNOWN_MISSING; remove each one
// once its page is built. "#" placeholder links are listed as a warning.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const KNOWN_MISSING = new Set([
  "/contact/", // waiting on the forms
  "/documents/pnworca-logo-files/", // WordPress page, moves with the PDFs
]);
// WordPress uploads (PDFs, Word files). They move into the repo before DNS cutover.
const KNOWN_MISSING_PREFIX = ["/wp-content/uploads/"];

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? htmlFiles(p) : e.name.endsWith(".html") ? [p] : [];
  });
}

function exists(out, path) {
  const p = join(out, decodeURIComponent(path));
  if (existsSync(p) && statSync(p).isFile()) return true;
  return existsSync(join(p, "index.html"));
}

export function checkLinks(out) {
  const broken = [];
  const placeholders = new Map();
  for (const file of htmlFiles(out)) {
    const page = "/" + file.slice(out.length + 1).replace(/index\.html$/, "");
    const html = readFileSync(file, "utf8");
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const url = m[1];
      if (url.startsWith("#")) {
        if (url.length > 1 && !ids.has(url.slice(1))) placeholders.set(url, (placeholders.get(url) || 0) + 1);
        continue;
      }
      if (!url.startsWith("/") || url.startsWith("//")) continue;
      const path = url.split(/[?#]/)[0];
      if (KNOWN_MISSING.has(path) || KNOWN_MISSING_PREFIX.some((p) => path.startsWith(p)) || exists(out, path)) continue;
      broken.push(`${page} -> ${url}`);
    }
  }
  if (placeholders.size) {
    console.warn("[links] Placeholder # links still to build: " + [...placeholders].map(([u, n]) => `${u} (${n})`).join(", "));
  }
  if (broken.length) {
    throw new Error(`[links] ${broken.length} broken internal links:\n  ` + [...new Set(broken)].join("\n  "));
  }
  console.log("[links] All internal links resolve.");
}
