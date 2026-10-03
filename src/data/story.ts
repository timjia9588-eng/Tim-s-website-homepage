import type { Theme } from "../types";

export const chapters: {
  theme: Theme;
  question: string;
  title: string;
  text: string;
  projects: string[];
}[] = [
  {
    theme: "Systems",
    question: "What sustains a place?",
    title: "Begin beneath the surface.",
    text: "At Cornell, studying forests, carbon and fungal networks taught me to look beyond what is visible. I carry that attention into design: reading water, soils and time before drawing a new landscape.",
    projects: ["salinity", "carbon", "parking", "gentilly"],
  },
  {
    theme: "Networks",
    question: "How do places connect us?",
    title: "Follow the relationships.",
    text: "Research at Harvard Project Zero expanded my questions from ecology to learning. A campus, a school or a park can shape agency and belonging. These relationships connect my research to the public spaces I help design.",
    projects: ["learning-places", "weaving", "nepal", "melissa"],
  },
  {
    theme: "Landscapes",
    question: "How does an idea become lived experience?",
    title: "Make room for everyday life.",
    text: "In practice and independent work, I translate those questions into paths, shade, planting and places to gather. From a quarry park to a neighborhood playground, the aim is a landscape people can inhabit and care for.",
    projects: ["phillips", "bajo-la-sombra", "bamboo", "alumni"],
  },
];

export const publications = [
  {
    title: "The Place of Learning: Why Where We Learn Matters",
    date: "February 2024",
    authors:
      "Daniel Wilson, Jessy Orozco Contraras, Tim Jia & Maureen Isimbi Kalimba",
    kind: "Project Zero working paper · Co-author",
    summary:
      "An interdisciplinary exploration of how physical environments shape learning, drawing connections across education, psychology and spatial design.",
    url: "https://pz.harvard.edu/resources/place-learning-why-where-we-learn-matters",
    pdf: "https://pz.harvard.edu/sites/default/files/2024-10/The%20Place%20of%20Learning.pdf",
  },
  {
    title:
      "Places of Agency: How Where We Learn Supports Student Empowerment, Choice, and Freedom",
    date: "March 2024",
    authors:
      "Daniel Wilson, Tianzhen Jia, Maureen Kalimba Isimbi & Jessica Orozco Contreras",
    kind: "Project Zero working paper · Co-author",
    summary:
      "Examines how the places students inhabit can offer opportunities for choice, participation and agency in their learning.",
    url: "https://pz.harvard.edu/resources/places-agency-how-where-we-learn-supports-student-empowerment-choice-and-freedom",
    pdf: "https://pz.harvard.edu/sites/default/files/2024-10/Places%20of%20Agency.pdf",
  },
];

export const connections: Record<string, string[]> = {
  phillips: ["carbon", "parking", "bajo-la-sombra"],
  melissa: ["learning-places", "weaving", "nepal"],
  gentilly: ["parking", "wetland-utopia", "carbon"],
  kyle: ["bajo-la-sombra", "learning-places", "melissa"],
  carrollton: ["learning-places", "bamboo"],
  parking: ["salinity", "gentilly", "salamanca"],
  salamanca: ["carbon", "wetland-utopia", "gentilly"],
  weaving: ["learning-places", "nepal", "melissa"],
  carbon: ["salinity", "parking", "phillips"],
  salinity: ["carbon", "parking", "alumni"],
  "wetland-utopia": ["parking", "gentilly", "xiaozhou"],
  bamboo: ["alumni", "bajo-la-sombra", "sketchbook"],
  alumni: ["salinity", "bamboo", "weaving"],
  xiaozhou: ["melissa", "weaving", "wetland-utopia"],
  nepal: ["learning-places", "bajo-la-sombra", "weaving"],
  "learning-places": ["weaving", "melissa", "bajo-la-sombra"],
  sketchbook: ["bamboo", "salamanca", "weaving"],
  "waste-research": ["carbon", "parking", "gentilly"],
  "bajo-la-sombra": ["learning-places", "nepal", "phillips"],
};

export const practice = [
  {
    name: "Urban Alchemy Collective",
    place: "San Antonio, Texas",
    role: "Landscape Designer",
    date: "September 2025–present",
    text: "Public parks, sports facilities and urban landscapes. Design development, construction documentation, illustrative graphics, planting and materials research, and interdisciplinary coordination.",
  },
  {
    name: "Design Workshop",
    place: "Aspen, Colorado",
    role: "Design Intern",
    date: "June–August 2024",
    text: "Design development and construction details, illustrative plans, material sourcing, supplier coordination and visual communication.",
  },
  {
    name: "Waggonner & Ball",
    place: "New Orleans, Louisiana",
    role: "Design Intern",
    date: "June–August 2023",
    text: "Flood resilience and landscape concept studies, hand drawing, Rhino modeling, visualization, site surveys and presentations.",
  },
  {
    name: "EDSA",
    place: "Fort Lauderdale / New York",
    role: "Design Intern",
    date: "June–August 2022",
    text: "Collaborative landscape design, research and visualization.",
  },
];
export const teaching = [
  {
    name: "Medium of the Landscape II",
    date: "December 2022–May 2023",
    text: "Teaching Assistant · Cornell · Mitchell Glass",
  },
  {
    name: "Field Biology",
    date: "August–December 2022",
    text: "Teaching Assistant · Cornell · Marc Goebel",
  },
  {
    name: "Landscape Architecture Student Mentoring",
    date: "August–December 2022",
    text: "Student Mentor · Cornell · Martin Hogue",
  },
  {
    name: "Boston Public Schools",
    date: "May–July 2019",
    text: "Central Office Assistant Intern · Family communication, translation and course visuals",
  },
  {
    name: "Guangzhou Volunteers",
    date: "July–August 2018",
    text: "Summer camp organizer and teacher · Fundraising and community education",
  },
];
