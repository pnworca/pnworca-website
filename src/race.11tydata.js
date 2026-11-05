import { isoLocal, fmt } from "../lib/dates.js";

const crumbs = (r) => [
  ["Home", "/"],
  ["Race Calendar", "/events/"],
  [`${r.category} Races`, `/event-category/${r.categorySlug}/`],
  [`${r.name} ${r.year}`, `/events/${r.slug}/`],
];

export default {
  eleventyComputed: {
    title: (d) => `${d.race.name} ${d.race.year} | PNWORCA Race Calendar`,
    description: (d) => {
      const r = d.race;
      let t = `${r.name}, ${fmt(r.date, { month: "long", day: "numeric", year: "numeric" })}`;
      if (r.where) t += `, ${r.where}`;
      t += ".";
      if (r.host) t += ` Hosted by ${r.host}.`;
      return t + " Race details on the PNWORCA race calendar.";
    },
    crumbs: (d) => crumbs(d.race),
    related: (d) => {
      const others = d.races.filter((r) => r.slug !== d.race.slug);
      const same = others.filter((r) => r.categorySlug === d.race.categorySlug);
      return { sameType: same.length > 0, list: (same.length ? same : others).slice(0, 3) };
    },
    schema: (d) => {
      const r = d.race, s = d.site, L = d.schemaLib;
      const ev = {
        "@type": "SportsEvent",
        "@id": `${s.url}/events/${r.slug}/#event`,
        name: `${r.name} ${r.year}`,
        url: `${s.url}/events/${r.slug}/`,
        startDate: r.start ? isoLocal(r.date, r.start) : r.date,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        sport: "Outrigger canoe racing",
        organizer: [{ "@id": `${s.url}/#org` }],
      };
      if (r.end) ev.endDate = isoLocal(r.date, r.end);
      if (r.summary) ev.description = r.summary;
      if (r.venue) {
        const a = { "@type": "PostalAddress", addressLocality: r.venue.city, addressRegion: r.venue.region, addressCountry: r.venue.country || "US" };
        if (r.venue.street) a.streetAddress = r.venue.street;
        if (r.venue.postal) a.postalCode = r.venue.postal;
        ev.location = { "@type": "Place", name: r.venue.name, address: a };
      }
      else if (r.where) ev.location = { "@type": "Place", name: r.where };
      if (r.host) ev.organizer.unshift(r.hostSlug ? { "@type": "SportsOrganization", name: r.host, url: `${s.url}/directory/${r.hostSlug}/` } : { "@type": "SportsOrganization", name: r.host });
      if (r.cost != null && r.register) ev.offers = { "@type": "Offer", price: String(r.cost), priceCurrency: "USD", url: r.register};
      const graph = [ev, L.breadcrumbs(s, crumbs(r))];
      if (r.faq && r.faq.length) graph.push(L.faq(r.faq));
      return { "@context": "https://schema.org", "@graph": graph };
    },
  },
};
