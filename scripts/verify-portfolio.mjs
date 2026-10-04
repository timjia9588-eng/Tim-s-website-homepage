import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const repo = new URL("../", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, repo), "utf8");
const script = read("index.html").match(/<script>([\s\S]*?)<\/script>/)[1];
for (const hash of [
  "",
  "#globe",
  "#top",
  "#simple",
  "#work",
  "#project/phillips",
  "#paper/place-of-learning",
  "#resume",
]) {
  const location = { pathname: "/", search: "", hash };
  let scroll = null;
  const history = {
    scrollRestoration: "auto",
    replaceState(_state, _title, url) {
      location.hash = url.slice(url.indexOf("#"));
    },
  };
  vm.runInNewContext(script, {
    history,
    location,
    scrollTo(options) {
      scroll = options.top;
    },
  });
  assert.equal(history.scrollRestoration, "manual");
  const home = ["", "#globe", "#top", "#simple"].includes(hash);
  assert.equal(scroll, home ? 0 : null);
  assert.equal(
    location.hash,
    ["#top", "#simple"].includes(hash) ? "#globe" : hash,
  );
}
const source = read("src/data/projects.ts");
const [projectText, placesText] = source.split("const placeEntries");
const assignments = [
  ...projectText.matchAll(/\bid: "([^"]+)"[\s\S]*?\bplace: "([^"]+)"/g),
].map(([, id, place]) => ({ id, place }));
const places = [
  ...placesText.split("export const places")[0].matchAll(/\bid: "([^"]+)"/g),
].map((match) => match[1]);
assert.equal(assignments.length, 20);
assert.equal(places.length, 16);
assert.equal(new Set(places).size, 16);
for (const { id, place } of assignments)
  assert.ok(
    places.includes(place) || (id === "sketchbook" && place === "travel"),
    `${id}: ${place}`,
  );
for (const [id, place] of Object.entries({
  phillips: "melissa",
  melissa: "melissa",
  kyle: "kyle",
  xiaozhou: "guangzhou",
  salinity: "poland",
  gentilly: "new-orleans",
  nepal: "nepal",
  "envision-resilience": "portland",
}))
  assert.equal(assignments.find((project) => project.id === id).place, place);
assert.equal(
  assignments.filter((project) =>
    ["san-antonio", "beijing"].includes(project.place),
  ).length,
  0,
);
assert.ok(placesText.includes("project.place === place.id"));
const tour = [
  ...read("src/data/atlas-tour.ts").matchAll(
    /\{ place: "([^"]+)", (project|paper): "([^"]+)" \}/g,
  ),
].map(([, place, kind, id]) => ({ place, kind, id }));
assert.equal(tour.length, 12);
assert.equal(new Set(tour.map((stop) => stop.id)).size, tour.length);
for (const [id, place] of [["salinity", "poland"], ["xiaozhou", "guangzhou"]])
  assert.ok(tour.some((stop) => stop.id === id && stop.place === place), `${id} must be visible in the public atlas tour at ${place}`);
for (const stop of tour) {
  assert.ok(places.includes(stop.place), `Tour site: ${stop.place}`);
  if (stop.kind === "project")
    assert.equal(
      assignments.find((project) => project.id === stop.id)?.place,
      stop.place,
      `Tour project: ${stop.id}`,
    );
  else
    assert.equal(
      stop.place,
      "cambridge",
      "The lab's research belongs at Cambridge; photographed case studies are not project sites.",
    );
}
const records = [
  ...read("src/data/participation.ts").matchAll(/id: "([^"]+)"[\s\S]*?title: "([^"]+)"[\s\S]*?firm: "([^"]+)"[\s\S]*?year: "([^"]+)"[\s\S]*?place: "([^"]+)"/g),
].map(([, id, title, firm, year, place]) => ({ id, title, firm, year, place }));
assert.equal(records.length, 5);
assert.equal(new Set(records.map((record) => record.id)).size, 5);
for (const record of records) {
  assert.ok(places.includes(record.place));
  assert.equal(record.place, record.firm === "EDSA" ? "saudi-arabia" : "aspen");
  assert.equal(record.year, record.firm === "EDSA" ? "2022" : "2024");
  assert.ok(!tour.some((stop) => stop.place === record.place || stop.id === record.id), "Participation records must never appear in the automatic tour");
  assert.ok(!assignments.some((project) => project.id === record.id), "Experience-only records are separate from the image gallery");
}
assert.ok(!read("src/data/participation.ts").includes("/images/"));
const visuals = JSON.parse(read("src/data/visuals.json"))["envision-resilience"];
assert.equal(visuals.length, 5);
for (const image of visuals) {
  assert.ok(image.credit.includes("studio team"));
  assert.equal(image.source, "https://www.bslafieldbook.com/envision-resilience");
}
console.log(
  "PASS: 8 entry URLs; 20 canonical project sites; 12 unique public tour stops including Poland field research and Xiaozhou in Guangzhou; 5 image-free professional records at Aspen/Saudi Arabia excluded from the tour; 5 credited public Portland figures.",
);
