import { isoLocal, fmt } from "./lib/dates.js";
import { checkLinks } from "./lib/linkcheck.js";
import { readFileSync } from "node:fs";

// Sizes and smaller copies of site images, written by scripts/responsive-images.mjs.
const images = JSON.parse(readFileSync("src/_data/images.json", "utf8"));

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  // Self-hosted fonts (Fontsource packages): Latin and Latin Extended subsets only.
  for (const f of ["roboto-condensed-latin{,-ext}-{700,800}-normal.woff2", "source-sans-3-latin{,-ext}-{400,600,700}-normal.woff2"]) {
    const pkg = f.startsWith("roboto") ? "roboto-condensed" : "source-sans-3";
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/${pkg}/files/${f}`]: "assets/fonts" });
  }
  eleventyConfig.ignores.add("src/assets/**");

  // site.css is small, so it goes inline in <head> instead of a blocking request.
  eleventyConfig.addShortcode("inlineCss", () => readFileSync("src/assets/css/site.css", "utf8"));
  // srcset for an image listed in images.json, smallest copy first, original last.
  eleventyConfig.addFilter("srcset", (src) => {
    const i = images[src];
    if (!i) return "";
    return [...i.variants.map((v) => `${v.src} ${v.w}w`), `${src} ${i.w}w`].join(", ");
  });
  // 1x and 2x for small logos: the 160px copy, then the original.
  eleventyConfig.addFilter("logoSrcset", (src) => {
    const i = images[src];
    const v = i && i.variants.find((x) => Math.max(x.w, x.h) === 160);
    return v ? `${v.src} 1x, ${src} 2x` : "";
  });
  eleventyConfig.addFilter("smallest", (src) => {
    const i = images[src];
    return i && i.variants.length ? i.variants[0].src : src;
  });
  eleventyConfig.addFilter("imgW", (src) => (images[src] ? images[src].w : ""));
  eleventyConfig.addFilter("imgH", (src) => (images[src] ? images[src].h : ""));

  eleventyConfig.addFilter("jsonld", (obj) => JSON.stringify(obj).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("isoLocal", isoLocal);
  eleventyConfig.addFilter("dayShort", (d) => fmt(d, { weekday: "short", month: "short", day: "numeric" }));
  eleventyConfig.addFilter("dayLong", (d) => fmt(d, { weekday: "long", month: "long", day: "numeric", year: "numeric" }));
  eleventyConfig.addFilter("dayNum", (d) => fmt(d, { day: "numeric" }));
  eleventyConfig.addFilter("monthYear", (d) => fmt(d, { month: "long", year: "numeric" }));
  eleventyConfig.addFilter("monShort", (d) => fmt(d, { month: "short" }).toUpperCase());
  eleventyConfig.addFilter("ended", (d) => new Date(isoLocal(d, "23:59")) < new Date());
  eleventyConfig.addFilter("mapsUrl", (v) =>
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent([v.name, v.street, [v.city, [v.region, v.postal].filter(Boolean).join(" ")].filter(Boolean).join(", ")].filter(Boolean).join(", ")));
  eleventyConfig.addFilter("hostName", (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""));

  // Calendar files need CRLF line endings (RFC 5545).
  eleventyConfig.addTransform("ics-crlf", (content, outputPath) =>
    outputPath && outputPath.endsWith(".ics") ? content.replace(/\r?\n/g, "\r\n") : content);

  eleventyConfig.on("eleventy.after", ({ dir }) => checkLinks(dir.output.replace(/\/$/, "")));

  return {
    dir: { input: "src", output: "public", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
