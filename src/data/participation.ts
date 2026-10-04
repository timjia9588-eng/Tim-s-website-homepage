// Resume-based experience without public portfolio imagery. These records are
// intentionally separate from gallery projects and from the automatic atlas tour.
export interface Participation {
  id: string;
  title: string;
  firm: string;
  year: string;
  role: string;
  place: string;
  publicContext?: { label: string; url: string };
}

export const participations: Participation[] = [
  {
    id: "spring-wadi",
    title: "Project Spring Wadi",
    firm: "EDSA",
    year: "2022",
    role: "Design Intern",
    place: "saudi-arabia",
  },
  {
    id: "laheq",
    title: "Laheq — The Ring",
    firm: "EDSA",
    year: "2022",
    role: "Design Intern",
    place: "saudi-arabia",
    publicContext: {
      label: "Laheq public announcement",
      url: "https://www.redseaglobal.com/en/media-center/news/red-sea-global-unveils-laheq-an-extraordinary-luxury-integrated-resort-island/",
    },
  },
  {
    id: "romantic-bay",
    title: "Romantic Bay",
    firm: "EDSA",
    year: "2022",
    role: "Design Intern",
    place: "saudi-arabia",
  },
  {
    id: "placer",
    title: "132/150 Placer",
    firm: "Design Workshop",
    year: "2024",
    role: "Design Intern",
    place: "aspen",
  },
  {
    id: "taproot-farm",
    title: "Taproot Farm",
    firm: "Design Workshop",
    year: "2024",
    role: "Design Intern",
    place: "aspen",
  },
];

export const participationPlaces = new Set(participations.map((work) => work.place));
export const participationAt = (place: string) =>
  participations.filter((work) => work.place === place);
