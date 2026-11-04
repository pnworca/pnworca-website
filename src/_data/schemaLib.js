// Shared JSON-LD builders. Every value comes from the data files; nothing is invented here.
export default {
  breadcrumbs(site, items) {
    return {
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it[0],
        item: site.url + it[1],
      })),
    };
  },
  faq(items) {
    return {
      "@type": "FAQPage",
      mainEntity: items.map((q) => ({
        "@type": "Question",
        name: q[0],
        acceptedAnswer: { "@type": "Answer", text: q[1] },
      })),
    };
  },
};
