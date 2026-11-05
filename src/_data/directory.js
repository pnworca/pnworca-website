// Club directory grouping for the home page, /directory/ and the state pages.
// Built from clubs.json, so a club added or edited there shows up everywhere.
// States and areas appear in the order of their first club in clubs.json.
import { readFileSync } from "node:fs";

const clubs = JSON.parse(readFileSync(new URL("./clubs.json", import.meta.url), "utf8"));
const NO_AREA = "Location not listed";

export default function () {
  const states = [];
  for (const c of clubs) {
    let s = states.find((x) => x.id === c.stateId);
    if (!s) states.push((s = { id: c.stateId, name: c.state, abbr: c.stateAbbr, count: 0, areas: [] }));
    const areaName = c.area || NO_AREA;
    let a = s.areas.find((x) => x.name === areaName);
    if (!a) s.areas.push((a = { name: areaName, clubs: [] }));
    a.clubs.push({ name: c.name, city: c.city || "", logo: c.logo || "", href: `/directory/${c.slug}/` });
    s.count++;
  }
  // Keep the "not listed" group last in each state.
  for (const s of states) s.areas.sort((x, y) => (x.name === NO_AREA) - (y.name === NO_AREA));
  return { total: clubs.length, states };
}
