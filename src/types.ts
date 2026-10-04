export type Category = "Professional" | "Studio" | "Research" | "Personal";
export type Theme = "Systems" | "Networks" | "Landscapes";

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
  source?: string;
  credit?: string;
  description?: string;
  group?: string;
  groupDescription?: string;
  legend?: { key: string; name: string }[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  location: string;
  organization: string;
  year: string;
  role: string;
  description: string[];
  cover?: string;
  coverAlt?: string;
  detailCover?: string;
  images: ProjectImage[];
  source?: string;
  collaborators?: string;
  note?: string;
  tags: string[];
  place: string;
  themes: Theme[];
  connection: string;
  links?: { label: string; url: string }[];
}

export interface Place {
  id: string;
  label: string;
  lat: number;
  lon: number;
  description: string;
  narrative: string;
  projectIds: string[];
  themes: Theme[];
}
