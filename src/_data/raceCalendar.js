// Race pages, club pages and the home page read this list.
// Race details live in races.json. Season dates live in raceDates.json:
// to update the calendar, edit a date there, or set "status" to "final".
import { readFileSync } from "node:fs";

const load = (name) => JSON.parse(readFileSync(new URL(`./${name}`, import.meta.url), "utf8"));

export default function () {
  const races = load("races.json");
  const { season, status, dates = {} } = load("raceDates.json");
  return races
    .map((r) => {
      const date = dates[r.slug];
      if (!date) return r;
      return { ...r, detailsYear: r.year, date, year: season, dateStatus: status };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
