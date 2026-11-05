// Leadership pages. People, roles and bios live in src/_data/people.json:
// edit a role or bio there, add "photo": "/assets/img/people/<file>.webp" when a photo is ready.

function crumbs(d) {
  const c = [["Home", "/"], ["Leadership", "/people/"]];
  if (d.person) c.push([d.person.name, `/people/${d.person.slug}/`]);
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
      if (d.person) {
        const p = d.person;
        const person = { "@type": "Person", name: p.name, jobTitle: `PNWORCA ${p.role}`, url: `${s.url}/people/${p.slug}/`, worksFor: { "@id": `${s.url}/#org` } };
        if (p.club) person.memberOf = { "@type": "SportsOrganization", name: p.club };
        graph.unshift({ "@type": "ProfilePage", "@id": `${s.url}/people/${p.slug}/#page`, url: `${s.url}/people/${p.slug}/`, mainEntity: person });
      } else {
        graph.unshift({ "@type": "CollectionPage", "@id": `${s.url}/people/#page`, name: d.metaTitle, url: `${s.url}/people/` });
      }
      return { "@context": "https://schema.org", "@graph": graph };
    },
  },
};
