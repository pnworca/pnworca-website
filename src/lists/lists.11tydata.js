// Club directory, state pages, race calendar and race-type pages.
// Everything listed comes from clubs.json, races.json and raceDates.json.

const listSchema = (d, urls) => ({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "CollectionPage", "@id": `${d.site.url}${d.page.url}#page`, name: d.metaTitle, url: `${d.site.url}${d.page.url}`, isPartOf: { "@id": `${d.site.url}/#website` } },
    d.schemaLib.breadcrumbs(d.site, crumbs(d)),
    { "@type": "ItemList", itemListElement: urls.map((u, i) => ({ "@type": "ListItem", position: i + 1, url: d.site.url + u })) },
  ],
});

function crumbs(d) {
  const c = [["Home", "/"]];
  if (d.listKind === "clubs" || d.listKind === "state") c.push(["Member Clubs", "/directory/"]);
  if (d.listKind === "state") c.push([d.st.name, `/directory-category/${d.st.id}/`]);
  if (d.listKind === "races" || d.listKind === "type") c.push(["Race Calendar", "/events/"]);
  if (d.listKind === "type") c.push([`${d.rt.name} Races`, `/event-category/${d.rt.slug}/`]);
  return c;
}

const andList = (a) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);

export default {
  layout: "layouts/list.njk",
  eleventyComputed: {
    metaTitle: (d) => `${d.title} | PNWORCA`,
    crumbs,
    seasonRaces: (d) => d.raceCalendar.filter((r) => r.year === d.raceDates.season),
    stateNames: (d) => andList(d.directory.states.map((s) => s.name)),
    schema: (d) => {
      if (d.listKind === "clubs") return listSchema(d, d.directory.states.flatMap((s) => s.areas.flatMap((a) => a.clubs.map((c) => c.href))));
      if (d.listKind === "state") return listSchema(d, d.st.areas.flatMap((a) => a.clubs.map((c) => c.href)));
      if (d.listKind === "races") return listSchema(d, d.raceCalendar.map((r) => `/events/${r.slug}/`));
      if (d.listKind === "type") return listSchema(d, d.raceCalendar.filter((r) => r.categorySlug === d.rt.slug).map((r) => `/events/${r.slug}/`));
      return null;
    },
  },
};
