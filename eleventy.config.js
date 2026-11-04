import { isoLocal, fmt } from "./lib/dates.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.ignores.add("src/assets/**");

  eleventyConfig.addFilter("jsonld", (obj) => JSON.stringify(obj).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("isoLocal", isoLocal);
  eleventyConfig.addFilter("dayShort", (d) => fmt(d, { weekday: "short", month: "short", day: "numeric" }));
  eleventyConfig.addFilter("dayLong", (d) => fmt(d, { weekday: "long", month: "long", day: "numeric", year: "numeric" }));
  eleventyConfig.addFilter("ended", (d) => new Date(isoLocal(d, "23:59")) < new Date());
  eleventyConfig.addFilter("mapsUrl", (v) =>
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent([v.name, v.street, `${v.city}, ${v.region} ${v.postal}`].filter(Boolean).join(", ")));
  eleventyConfig.addFilter("hostName", (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""));

  return {
    dir: { input: "src", output: "public", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
