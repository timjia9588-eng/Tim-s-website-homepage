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
assert.equal(assignments.length, 19);
assert.equal(places.length, 13);
assert.equal(new Set(places).size, 13);
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
  gentilly: "new-orleans",
  nepal: "nepal",
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
assert.equal(tour.length, 9);
assert.equal(new Set(tour.map((stop) => stop.id)).size, tour.length);
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
console.log(
  "PASS: early entry policy for 8 URL forms; 19 canonical project locations; 9 unique tour stops match actual sites; research is anchored at its lab; office/study contexts have no duplicate project cards.",
);
