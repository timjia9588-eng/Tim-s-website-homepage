export type Category = "Professional" | "Studio" | "Research" | "Personal";

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
  source?: string;
  credit?: string;
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
  images: ProjectImage[];
  source?: string;
  collaborators?: string;
  note?: string;
  tags: string[];
  place: string;
}

export interface Place {
  id: string;
  label: string;
  lat: number;
  lon: number;
  description: string;
}
