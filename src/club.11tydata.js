const place = (c) => (c.city ? `${c.city}, ${c.state}` : c.state);

function crumbs(c) {
  return [
    ["Home", "/"],
    ["Member Clubs", "/directory/"],
    [c.state, `/directory-category/${c.stateId}/`],
    [c.name, `/directory/${c.slug}/`],
  ];
}

// FAQ answers come only from fields the club has on file.
function faq(c) {
  const q = [];
  if (c.address) q.push([`Where is ${c.name} based?`, `${c.address.street}, ${c.address.city}, ${c.address.region} ${c.address.postal}.`]);
  else if (c.city) q.push([`Where is ${c.name} based?`, `${c.city}, ${c.state}.`]);
  if (c.email || c.website || c.phone) {
    const how = [c.email && `email ${c.email}`, c.phone && `call ${c.phone}`, c.website && `visit ${c.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}`].filter(Boolean).join(" or ");
    q.push([`How do I contact ${c.name}?`, how.charAt(0).toUpperCase() + how.slice(1) + "."]);
  }
  q.push([`Is ${c.name} a PNWORCA member club?`, `Yes. ${c.name} is a member club of the Pacific Northwest Outrigger Racing Canoe Association.`]);
  return q;
}

export default {
  eleventyComputed: {
    title: (d) => `${d.club.name} | PNWORCA Member Club`,
    description: (d) =>
      `${d.club.name} is a PNWORCA member outrigger canoe club in ${place(d.club)}. Club details, contact information and nearby member clubs.`,
    crumbs: (d) => crumbs(d.club),
    faqItems: (d) => faq(d.club),
    nearby: (d) => {
      const others = d.clubs.filter((c) => c.slug !== d.club.slug);
      const same = d.club.area ? others.filter((c) => c.area === d.club.area) : [];
      const rest = others.filter((c) => c.stateId === d.club.stateId && !same.includes(c));
      return same.concat(rest).slice(0, 5);
    },
    schema: (d) => {
      const c = d.club, s = d.site, L = d.schemaLib;
      const org = {
        "@type": "SportsOrganization",
        "@id": `${s.url}/directory/${c.slug}/#club`,
        name: c.name,
        url: c.website || `${s.url}/directory/${c.slug}/`,
        sport: "Outrigger canoe racing",
        memberOf: { "@id": `${s.url}/#org` },
      };
      if (c.logo) org.logo = s.url + c.logo;
      if (c.email) org.email = c.email;
      if (c.phone) org.telephone = c.phone;
      if (c.social) org.sameAs = Object.values(c.social);
      if (c.address) org.address = { "@type": "PostalAddress", streetAddress: c.address.street, addressLocality: c.address.city, addressRegion: c.address.region, postalCode: c.address.postal, addressCountry: "US" };
      else if (c.city) org.address = { "@type": "PostalAddress", addressLocality: c.city, addressRegion: c.stateAbbr, addressCountry: "US" };
      else org.address = { "@type": "PostalAddress", addressRegion: c.stateAbbr, addressCountry: "US" };
      if (c.area) org.areaServed = c.area;
      return { "@context": "https://schema.org", "@graph": [org, L.breadcrumbs(s, crumbs(c)), L.faq(faq(c))] };
    },
  },
};
