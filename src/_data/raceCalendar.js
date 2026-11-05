// Race pages, club pages and the home page read this list.
// Race details live in races.json. Season dates live in raceDates.json:
// to update the calendar, edit a date there, or set "status" to "final".
import { readFileSync } from "node:fs";

const load = (name) => JSON.parse(readFileSync(new URL(`./${name}`, import.meta.url), "utf8"));

// The small label shown above a race name: its series ("Winter Series #3")
// when the race has its own name, otherwise its race type.
const TYPE_LABEL = {
  "Winter Series": "Small boat race",
  "Long Distance": "Long distance race",
  "Sprint": "Sprint regatta",
  "Small Boat": "Small boat race",
};
const callout = (r) => (r.series && r.series !== r.name ? r.series : TYPE_LABEL[r.category] || r.category);

export default function () {
  const races = load("races.json");
  const { season, status, dates = {} } = load("raceDates.json");
  return races
    .map((r) => {
      const date = dates[r.slug];
      if (!date) return { ...r, callout: callout(r) };
      return { ...r, callout: callout(r), detailsYear: r.year, date, year: season, dateStatus: status };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
