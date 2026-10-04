import { places, projects } from "./projects";
import { publications } from "./story";
import { participationAt, participationPlaces } from "./participation";

// The atlas follows project and field-study sites. Working papers stay at their
// research lab; photographed case-study buildings are not authored project sites.
export const atlasTour = [
  { place: "melissa", project: "phillips" },
  { place: "ithaca", project: "weaving" },
  { place: "cambridge", paper: "places-of-agency" },
  { place: "poland", project: "salinity" },
  { place: "new-orleans", project: "gentilly" },
  { place: "dominican-republic", project: "bajo-la-sombra" },
  { place: "guangzhou", project: "bamboo" },
  { place: "guangzhou", project: "xiaozhou" },
  { place: "salamanca", project: "salamanca" },
  { place: "boston", project: "parking" },
  { place: "portland", project: "envision-resilience" },
  { place: "melissa", project: "melissa" },
];

export const atlasPlaces = places.filter(
  (place) => place.projectIds.length || participationPlaces.has(place.id),
);

export function atlasSpotlight(
  placeId: string,
  stop: (typeof atlasTour)[number],
) {
  const place = places.find((place) => place.id === placeId)!;
  const participation = participationAt(place.id);
  if (participation.length)
    return {
      title: `${participation[0].firm} · Project experience`,
      src: undefined,
      alt: undefined,
      href: undefined,
      context: `${participation[0].role} · ${participation[0].year}`,
      fit: "cover",
      paper: undefined,
      participation,
    };
  const paper =
    place.id === "cambridge"
      ? publications.find((paper) => paper.id === stop.paper) || publications[0]
      : undefined;
  if (paper)
    return {
      title: paper.shortTitle,
      src: undefined,
      alt: undefined,
      href: `#paper/${paper.id}`,
      context: "Research · Harvard Project Zero",
      fit: "cover",
      paper,
      participation: undefined,
    };
  const project =
    projects.find(
      (project) => project.id === stop.project && project.place === place.id,
    ) ||
    projects.find((project) => project.place === place.id && project.cover) ||
    projects.find((project) => project.place === place.id)!;
  return {
    title: project.title,
    src: project.preview?.src || project.cover,
    alt: project.preview?.alt || project.coverAlt,
    href: `#project/${project.id}`,
    fit: "cover",
    paper: undefined,
    participation: undefined,
    context:
      project.category === "Professional"
        ? "Professional practice"
        : project.category === "Research"
          ? "Research"
          : "Design exploration",
  };
}
