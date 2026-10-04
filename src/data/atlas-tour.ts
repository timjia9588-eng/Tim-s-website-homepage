import { places, projects } from "./projects";
import { publications } from "./story";

// The atlas follows actual sites. Research is anchored at the lab, not at its photographed case studies.
export const atlasTour = [
  { place: "melissa", project: "phillips" },
  { place: "ithaca", project: "weaving" },
  { place: "cambridge", paper: "places-of-agency" },
  { place: "new-orleans", project: "gentilly" },
  { place: "dominican-republic", project: "bajo-la-sombra" },
  { place: "guangzhou", project: "bamboo" },
  { place: "salamanca", project: "salamanca" },
  { place: "boston", project: "parking" },
  { place: "melissa", project: "melissa" },
];

export const atlasPlaces = places.filter((place) => place.projectIds.length);

export function atlasSpotlight(
  placeId: string,
  stop: (typeof atlasTour)[number],
) {
  const place = places.find((place) => place.id === placeId)!;
  const paper =
    place.id === "cambridge"
      ? publications.find((paper) => paper.id === stop.paper) || publications[0]
      : undefined;
  if (paper)
    return {
      title: paper.shortTitle,
      src: paper.image.src,
      alt: paper.image.alt,
      href: `#paper/${paper.id}`,
      context: "Research · Harvard Project Zero",
      fit: "cover",
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
    fit: ["parking", "bamboo", "carbon", "wetland-utopia"].includes(project.id)
      ? "contain"
      : "cover",
    context:
      project.category === "Professional"
        ? "Professional practice"
        : project.category === "Research"
          ? "Research"
          : "Design exploration",
  };
}
