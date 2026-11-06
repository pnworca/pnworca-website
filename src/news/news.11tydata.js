// News list and articles. Articles live in src/_data/news.json (moved from WordPress);
// each keeps its WordPress address (/<slug>/).

function crumbs(d) {
  const c = [["Home", "/"], ["News", "/news/"]];
  if (d.post) c.push([d.post.title, `/${d.post.slug}/`]);
  return c;
}

export default {
  layout: "layouts/list.njk",
  eleventyComputed: {
    metaTitle: (d) => `${d.title} | PNWORCA`,
    crumbs,
    schema: (d) => {
      const s = d.site;
      const graph = [d.schemaLib.breadcrumbs(s, crumbs(d))];
      if (d.post) {
        const p = d.post;
        const a = { "@type": "NewsArticle", headline: p.title, datePublished: p.date, url: `${s.url}/${p.slug}/`, publisher: { "@id": `${s.url}/#org` }, author: { "@id": `${s.url}/#org` } };
        if (p.image) a.image = p.image;
        if (p.excerpt) a.description = p.excerpt;
        graph.unshift(a);
      } else {
        graph.unshift({ "@type": "CollectionPage", "@id": `${s.url}/news/#page`, name: d.metaTitle, url: `${s.url}/news/` });
      }
      return { "@context": "https://schema.org", "@graph": graph };
    },
  },
};
