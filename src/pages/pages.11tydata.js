// Long-form pages. Each page is a Markdown file in this folder: edit the text,
// keep the front matter (title, permalink, section, order). Section names are in _data/sections.json.

const plain = (md) =>
  md.replace(/^---[\s\S]*?---/, "")
    .replace(/^#.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function crumbs(d) {
  const sec = d.sections[d.section];
  const items = [["Home", "/"]];
  if (sec && sec.url !== d.page.url) items.push([sec.title, sec.url]);
  items.push([d.title, d.page.url]);
  return items;
}

export default {
  templateEngineOverride: "md",
  eleventyComputed: {
    metaTitle: (d) => `${d.title} | PNWORCA`,
    description: (d) => {
      if (d.description) return d.description;
      const paras = (d.page.rawInput || "").replace(/^---[\s\S]*?---/, "").split(/\n\s*\n/).map(plain);
      const t = paras.find((x) => x.length >= 60) || paras.join(" ");
      const cut = t.slice(0, 160);
      const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
      return end > 60 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "") + "…";
    },
    crumbs,
    siblings: (d) =>
      d.collections.all
        .filter((p) => p.data.section === d.section && p.data.layout === "layouts/page.njk")
        .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
        .map((p) => ({ title: p.data.title, url: p.url })),
    schema: (d) => ({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebPage", "@id": `${d.site.url}${d.page.url}#page`, name: d.title, url: `${d.site.url}${d.page.url}`, isPartOf: { "@id": `${d.site.url}/#website` } },
        d.schemaLib.breadcrumbs(d.site, crumbs(d)),
      ],
    }),
  },
};
