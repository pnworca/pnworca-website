import { isoLocal, fmt } from "./lib/dates.js";
import { checkLinks } from "./lib/linkcheck.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.ignores.add("src/assets/**");

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
