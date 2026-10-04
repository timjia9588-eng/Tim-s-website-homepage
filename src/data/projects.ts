import type { Project, ProjectImage, Place } from "../types";
import visualData from "./visuals.json";
const visuals = visualData as Record<string, ProjectImage[]>;
const uac = "https://urbanalchemycollective.com";
const quarrySource = `${uac}/projects/phillips-quarry-park/`;
const melissaSource = `${uac}/projects/melissa-parks-recreation-trails-and-open-space-master-plan/`;

export const projects: Project[] = [
  {
    id: "phillips",
    title: "Phillips Quarry Park",
    subtitle: "A quarry, a lake, a new public landscape.",
    category: "Professional",
    location: "Melissa, Texas",
    organization: "Urban Alchemy Collective",
    year: "2025–present",
    role: "Landscape Designer",
    place: "melissa",
    themes: ["Landscapes", "Systems"],
    connection:
      "From reading geology and water to creating paths, shade and places to gather: an ecological system becomes an everyday public landscape.",
    cover: "/images/phillips/cover.webp",
    coverAlt:
      "Phillips Quarry Park concept rendering with quarry lake, boardwalk, and recreation areas",
    description: [
      "A former quarry in Melissa is being reimagined as a public park that brings people closer to its water, limestone cliffs, and existing vegetation. The published vision connects accessible trails and gathering spaces with opportunities for nature and adventure.",
      "As a Landscape Designer at Urban Alchemy Collective, my work supports design development and construction documentation, illustrative plans and renderings, and research into site conditions, planting, materials, and products. Phillips Quarry Park is one of my selected projects at the firm.",
    ],
    collaborators: "Urban Alchemy Collective; WGI Engineering; HVJ Associates",
    images: visuals["phillips"] || [],
    source: quarrySource,
    tags: ["Public parks", "Adaptive reuse", "Design development"],
  },
  {
    id: "parking",
    title: "PARK-ing Parking",
    subtitle: "An industrial waterfront, made resilient.",
    category: "Studio",
    location: "Charlestown, Massachusetts",
    organization: "Harvard Graduate School of Design",
    year: "2024",
    role: "Individual studio project",
    place: "boston",
    themes: ["Systems", "Landscapes"],
    connection:
      "Ecological observation becomes a design method: test how a waterfront can change with rising water rather than assume a fixed edge.",
    cover: "/images/parking/cover.webp",
    preview: {
      src: "/images/parking/plan.webp",
      alt: "Complete waterfront master plan, connecting wetlands and public access",
    },
    coverAlt:
      "Axonometric study of Boston Autoport and a proposed naturalized waterfront",
    description: [
      "PARK-ing Parking reimagines the northern edge of Charlestown. The Boston Autoport’s impermeable industrial landscape is exposed to sea-level rise and largely inaccessible to the public.",
      "Wetland depressions, swamp pockets, and a gradually naturalized shoreline form a landscape that can change with rising water. Cut-and-fill studies and phased scenarios test how industrial land can become an adaptive ecological and public system.",
    ],
    collaborators:
      "STU-1212 Landscape Architecture IV · Professor Belinda Tato",
    images: visuals["parking"] || [],
    tags: ["Coastal resilience", "Wetlands", "Landscape systems"],
  },
  {
    id: "melissa",
    title: "Melissa in Motion",
    subtitle: "Connecting a growing city through public space.",
    category: "Professional",
    location: "Melissa, Texas",
    organization: "Urban Alchemy Collective",
    year: "2025–2026",
    role: "Landscape Designer",
    place: "melissa",
    themes: ["Networks", "Landscapes"],
    connection:
      "The question of belonging, explored in my learning-place research, also matters at the scale of a city’s park network.",
    cover: "/images/melissa/cover.webp",
    coverAlt:
      "Community park concept with playground, gathering space, paths, and trees",
    description: [
      "The City of Melissa’s parks, recreation, trails, and open space planning connects individual park experiences with a broader network of public landscapes. The firm’s published work includes community, nature, and neighborhood park concepts.",
      "City of Melissa Parks is listed among my selected projects at Urban Alchemy Collective. My practice at the firm includes drawings, illustrative plans, diagrams, renderings, material and planting research, consultant coordination, and design revisions.",
    ],
    images: visuals["melissa"] || [],
    source: melissaSource,
    links: [
      {
        label: "City adoption announcement",
        url: "https://www.cityofmelissa.com/m/newsflash/home/detail/177",
      },
      {
        label: "Official public master plan",
        url: "https://www.cityofmelissa.com/DocumentCenter/View/3567/Melissa-Parks-Recreation-and-Open-Space-Master-Plan",
      },
      {
        label: "City of Melissa Instagram",
        url: "https://www.instagram.com/cityofmelissagov/",
      },
    ],
    tags: ["Parks & recreation", "Open space", "Citywide planning"],
  },
  {
    id: "salamanca",
    title: "Reconnecting & Regrowing",
    subtitle: "Land has memory. Landscapes can recover.",
    category: "Studio",
    location: "Salamanca, New York",
    organization: "Cornell University / Harvard GSD",
    year: "2021 / 2024",
    role: "Individual design project",
    place: "salamanca",
    themes: ["Systems", "Networks"],
    connection:
      "Restoration can reconnect both fragmented habitats and the communities that live beside them.",
    cover: "/images/salamanca/cover.webp",
    coverAlt:
      "Wetland restoration perspective with pedestrian bridge and wildlife corridor",
    description: [
      "First developed at Cornell in 2021 and reimagined in Harvard GSD’s Climate Justice course in 2024, this proposal reconnects a former railway landscape in Salamanca with the Allegheny River and its surrounding communities. Site history, water, contaminated soils, and fragmented access become the starting points for design.",
      "Phytotechnology, wetland restoration, community gardens, and a connected trail system support ecological recovery. Bridges and viewing platforms respond to changing water levels, creating space for people and wildlife within a landscape that keeps evolving.",
    ],
    collaborators:
      "Cornell: LA 2020 Medium of the Landscape II, Mitchell J. Glass. Harvard GSD: SES 5409 Climate Justice, Abby Spinak.",
    images: visuals["salamanca"] || [],
    tags: ["Phytotechnology", "Restoration", "Community landscape"],
  },
  {
    id: "gentilly",
    title: "Gentilly Resilience District",
    subtitle: "Learning to live with water.",
    category: "Professional",
    location: "New Orleans, Louisiana",
    organization: "Waggonner & Ball",
    year: "2023",
    role: "Design Intern",
    place: "new-orleans",
    themes: ["Systems", "Landscapes"],
    connection:
      "Regional water systems connect environmental research with the decisions that shape a neighborhood’s public space.",
    cover: "/images/gentilly/cover.webp",
    coverAlt:
      "My Pontchartrain lakefront landscape illustration from the Waggonner & Ball internship",
    description: [
      "Working with Waggonner & Ball’s Living with Water approach, I supported flood-resilience studies and early landscape proposals in New Orleans. At the Pontchartrain lakefront, the work explored how public space can accommodate water and change over time.",
      "My contributions included concept drawings, hand drawings, Rhino modeling, Photoshop renderings, site surveys, and presentation support. The illustration shown here is my own portfolio work from this internship.",
    ],
    collaborators:
      "Waggonner & Ball team; Collin Moosbrugger; John Kleinschmidt. Internship coordination included Moffatt & Nichol.",
    images: visuals["gentilly"] || [],
    source:
      "https://www.wbae.com/project/gentilly-resilience-district-planning",
    note: "The project link provides background on the firm’s broader district work. Only my portfolio illustration is displayed here.",
    tags: ["Flood adaptation", "Public space", "Concept design"],
  },
  {
    id: "weaving",
    title: "Weaving the Future",
    subtitle: "A cultural landscape for learning and belonging.",
    category: "Studio",
    location: "Ithaca, New York",
    organization: "Cornell University",
    year: "2021",
    role: "Individual studio project",
    place: "ithaca",
    themes: ["Networks", "Landscapes"],
    connection:
      "This campus study asks how space supports belonging — a question I later explored through Project Zero research.",
    cover: "/images/weaving/cover.webp",
    coverAlt:
      "Proposed entrance landscape for Cornell’s Africana Studies and Research Center",
    description: [
      "A landscape renovation for Cornell’s Africana Studies and Research Center connects cultural memory with everyday campus life. The design responds to the center’s history, visibility, accessibility, and relationship to neighboring residential areas.",
      "Patterns inspired by weaving and reflected light organize places to study, meet, and hold outdoor classes. Planting, platforms, ramps, and a commemorative wall make the landscape a setting for both individual use and shared experience.",
    ],
    collaborators:
      "LA 2010 Medium of the Landscape I · Professor Valerie Aymer",
    images: visuals["weaving"] || [],
    tags: ["Learning environments", "Cultural memory", "Accessibility"],
  },
  {
    id: "carbon",
    title: "Territorial Sequestration",
    subtitle: "Reading a region through its carbon landscapes.",
    category: "Research",
    location: "Ithaca & Tompkins County, New York",
    organization: "Cornell University",
    year: "2022",
    role: "GIS research & workshop contribution",
    place: "ithaca",
    themes: ["Systems"],
    connection:
      "Regional mapping makes hidden ecological processes legible before design decisions are made.",
    cover: "/images/carbon/cover.webp",
    coverAlt: "Forest biomass and land-cover mapping for Tompkins County",
    description: [
      "Landscapes for Climate Mitigation in Ithaca and Beyond examined how public and private lands can store carbon. I studied forest composition, land cover, and forest conditions across Tompkins County, presenting the regional analysis to a workshop of designers and scientists.",
      "GIS mapping connects biomass and carbon data with topography and forest types. The research considers parks, farms, conservation areas, urban forests, trail corridors, floodplains, and wetlands as part of a regional climate-governance framework.",
    ],
    collaborators:
      "Department of Landscape Architecture · Advised by Jamie Vanucchi",
    images: visuals["carbon"] || [],
    tags: ["GIS", "Carbon storage", "Regional ecology"],
  },
  {
    id: "wetland-utopia",
    title: "Great Tour to Wetland Utopia",
    subtitle: "Tracing water, migration, and restoration.",
    category: "Studio",
    location: "Nansha, Guangzhou, China",
    organization: "Cornell University",
    year: "2020 / 2022",
    role: "Individual design project",
    place: "guangzhou",
    themes: ["Systems"],
    connection:
      "A journey through the delta connects hydrology, habitat and human movement across a region.",
    cover: "/images/wetland-utopia/cover.webp",
    coverAlt: "Pearl River Delta hydrology and river-channel analysis",
    description: [
      "A regional landscape proposal for Nansha investigates the connections between the Pearl River’s hydrology, historical migration, industrial land, and wetland habitats. A boat-tour route becomes a way to encounter and understand these changing landscapes.",
      "Land-use and vessel-route studies guide restoration strategies for farmland, barren islands, forest strips, and wetland edges. Sections and before-and-after diagrams explore water infiltration, soil conditions, habitat, and circulation.",
    ],
    collaborators:
      "LA 1410 Grounding in Landscape Architecture I · Professor Kathryn Gleason",
    images: visuals["wetland-utopia"] || [],
    tags: ["Wetland restoration", "Hydrology", "Regional design"],
  },
  {
    id: "salinity",
    title: "Salinity & Symbiosis",
    subtitle: "The living networks beneath a landscape.",
    category: "Research",
    location: "Cornell University · field sites in Poland",
    organization: "Cornell University",
    year: "2022–2023",
    role: "Honors thesis & research assistant",
    place: "ithaca",
    themes: ["Systems"],
    connection:
      "Studying life beneath the surface sharpened my attention to the relationships that sustain a landscape.",
    cover: "/images/salinity/cover.webp",
    coverAlt:
      "Branching fungal filaments and mycelium in a complete minirhizotron scan",
    preview: {
      src: "/images/salinity/preview.webp",
      alt: "Close-up of branching white fungal filaments in soil; the complete scan is inside the research page",
    },
    description: [
      "My honors research examined ectomycorrhizal rhizomorphs and mycelium along a soil-salinity gradient. Minirhizotron imagery was used to follow the occurrence, abundance, and turnover of fungal structures in non-saline and saline soils.",
      "The work involved visual identification, sample preparation, data management, and analysis. It was presented at the 8th International Symposium on Physiological Processes in Roots of Woody Plants and informs my interest in ecological relationships beneath the visible landscape.",
    ],
    collaborators:
      "Dominika Thiem; Marcin Gołębiewski; Katarzyna Hrynkiewicz; Marc Goebel",
    images: visuals["salinity"] || [],
    tags: ["Mycorrhizal networks", "Environmental science", "Honors research"],
  },
  {
    id: "bamboo",
    title: "Bamboo Garden",
    subtitle: "A quiet space for tea and conversation.",
    category: "Personal",
    location: "Guangzhou, China",
    organization: "Private commission",
    year: "Built 2021",
    role: "Individual design & construction drawings",
    place: "guangzhou",
    themes: ["Landscapes"],
    connection:
      "At the scale of a courtyard, existing planting, construction details and daily rituals come together.",
    cover: "/images/bamboo/cover.webp",
    preview: {
      src: "/images/bamboo/drawing.webp",
      alt: "Complete hand-drawn bamboo garden plan, relating planting, a deck and a stone path",
    },
    coverAlt: "Completed bamboo garden with stone path and seating",
    description: [
      "A villa courtyard was converted into a setting for a tea club. Existing bamboo was retained for privacy and atmosphere, and two garden directions were developed with the client.",
      "The selected design draws on Japanese dry-garden traditions and the spatial character of gravel and stone. I developed the design and construction drawings; the garden was completed in December 2021 after six months of construction.",
    ],
    collaborators:
      "Also presented for LA4100 Computer Applications in Landscape Architecture · Professor Valerie Aymer",
    images: visuals["bamboo"] || [],
    tags: ["Built work", "Garden design", "Construction drawings"],
  },
  {
    id: "xiaozhou",
    title: "Xiaozhou Village",
    subtitle: "Ecology, cultural heritage, and local life.",
    category: "Research",
    location: "Guangzhou, China",
    organization: "Tsinghua University",
    year: "2021",
    role: "Individual field research & term paper",
    place: "guangzhou",
    themes: ["Networks", "Systems"],
    connection:
      "Fieldwork connects environmental conditions with the different people who depend on a place.",
    cover: "/images/xiaozhou/cover.webp",
    coverAlt:
      "Diagram of overlapping community and heritage needs in Xiaozhou Village",
    description: [
      "Field surveys and interviews in Xiaozhou Village explored how environmental conditions affect cultural heritage, tourism, and daily life. Water pollution, waste, and competing demands on public space were considered together.",
      "The research proposes environmental improvements and a zoning framework that connects heritage preservation with the needs of residents, artists, and visitors. The term paper was selected as an Excellent Paper for the course.",
    ],
    collaborators:
      "Tsinghua University School of Architecture · Advised by Dr. Jian Liu",
    images: visuals["xiaozhou"] || [],
    tags: ["Field research", "Heritage", "Environmental planning"],
  },
  {
    id: "alumni",
    title: "Retrofit & Reconnect",
    subtitle: "Planting for seasons, soils, and everyday views.",
    category: "Personal",
    location: "Ithaca, New York",
    organization: "Cornell University",
    year: "2021",
    role: "Individual planting design",
    place: "ithaca",
    themes: ["Landscapes", "Systems"],
    connection:
      "Planting is both a living system and an everyday experience, changing through seasons and years.",
    cover: "/images/alumni/cover.webp",
    coverAlt:
      "Section perspective of layered planting along Cornell’s Alumni Slope",
    description: [
      "A planting design for Alumni Slope uses height, layering, and seasonal change to screen a parking area and enrich a campus edge.",
      "Species selection responds to light, road salt, soil conditions, ecological function, and seasonal color. Planting plans and a detailed species key connect the design’s visual character with establishment requirements.",
    ],
    collaborators:
      "LA4910 Creating the Urban Eden · Professor Nina Lauren Bassuk",
    images: visuals["alumni"] || [],
    tags: ["Planting design", "Seasonality", "Campus landscape"],
  },
  {
    id: "kyle",
    title: "Kyle Sportsplex",
    subtitle: "Design experience in public recreation.",
    category: "Professional",
    location: "Kyle, Texas",
    organization: "Urban Alchemy Collective",
    year: "2025–present",
    role: "Landscape Designer",
    place: "kyle",
    themes: ["Landscapes", "Networks"],
    connection:
      "Recreation infrastructure is also a social network: it makes space for people to meet, move and participate.",
    description: [
      "Kyle Sportsplex is one of my selected projects at Urban Alchemy Collective. My work at the firm includes public parks, sports facilities, and urban landscapes, from design development through construction documentation.",
      "Responsibilities include AutoCAD drawings, illustrative graphics and renderings, research into planting and materials, and coordination supporting design revisions and quality review.",
    ],
    images: visuals["kyle"] || [],
    tags: ["Sports facilities", "Documentation", "Public recreation"],
  },
  {
    id: "carrollton",
    title: "Carrollton Courthouse",
    subtitle: "Concept design for senior housing.",
    category: "Professional",
    location: "New Orleans, Louisiana",
    organization: "Waggonner & Ball",
    year: "2023",
    role: "Design Intern",
    place: "new-orleans",
    themes: ["Landscapes"],
    connection:
      "Adaptive reuse asks how an existing place can support another stage of community life.",
    description: [
      "I contributed to concept design for Carrollton Courthouse Senior Housing during my internship at Waggonner & Ball.",
      "My internship work combined hand drawing, Rhino and Photoshop visualization, site research, presentations, and coordination. This entry records project experience from my resume.",
    ],
    images: visuals["carrollton"] || [],
    source: "https://www.wbae.com/project/the-carrollton",
    note: "Project participation is recorded in my resume. The firm’s public project page provides background; no claim of authorship of the completed building or published images is made here.",
    tags: ["Senior housing", "Concept design", "Adaptive reuse"],
  },
  {
    id: "learning-places",
    title: "Designing Learning Places",
    subtitle: "How place supports agency, curiosity, and belonging.",
    category: "Research",
    location: "Cambridge, Massachusetts",
    organization: "Project Zero · Harvard Graduate School of Education",
    year: "2023–2024",
    role: "Research Assistant & publication co-author",
    place: "cambridge",
    themes: ["Networks"],
    connection:
      "Places are part of how we learn. This research connects my ecological background with questions of agency and belonging.",
    description: [
      "At Project Zero’s Designing Learning Places Lab, I synthesized research across education, environmental psychology, architecture, geography, and urban design.",
      "The work examines how spatial affordances, materials, and objects shape youth agency, belonging, curiosity, and well-being. I co-authored The Place of Learning: Why Where We Learn Matters and Places of Agency: How Where We Learn Supports Student Empowerment, Choice, and Freedom, published in 2024.",
    ],
    images: visuals["learning-places"] || [],
    source:
      "https://pz.harvard.edu/resources/place-learning-why-where-we-learn-matters",
    links: [
      {
        label: "Places of Agency · Project Zero",
        url: "https://pz.harvard.edu/resources/places-agency-how-where-we-learn-supports-student-empowerment-choice-and-freedom",
      },
    ],
    tags: [
      "Learning environments",
      "Youth agency",
      "Interdisciplinary research",
    ],
  },
  {
    id: "nepal",
    title: "Sustainable School Templates",
    subtitle: "Designing places to learn in Nepal.",
    category: "Research",
    location: "Nepal",
    organization: "Cornell University Sustainable Design",
    year: "2022–2023",
    role: "Landscape architecture team leader",
    place: "nepal",
    themes: ["Networks", "Landscapes"],
    connection:
      "School landscapes bring learning environments and collaborative design into the same conversation.",
    description: [
      "I led the landscape architecture team in Cornell’s Sustainable Design initiative, collaborating with an NGO on environmentally sustainable school templates for Nepal.",
      "The project served a program supporting more than 3,000 children. The work connects landscape design, education, and collaboration across disciplines.",
    ],
    images: visuals["nepal"] || [],
    tags: ["Education", "Sustainable design", "Team leadership"],
  },
  {
    id: "sketchbook",
    title: "A Traveling Sketchbook",
    subtitle: "Looking closely. Drawing slowly.",
    category: "Personal",
    location: "Cities & landscapes",
    organization: "Personal work",
    year: "Selected drawings",
    role: "Hand drawing",
    place: "travel",
    themes: ["Landscapes"],
    connection:
      "Drawing is a way of slowing down and noticing the details that make one place different from another.",
    cover: "/images/sketchbook/cover.webp",
    coverAlt: "Hand-drawn Fallingwater study in markers and colored pencils",
    description: [
      "Travel and drawing are ways for me to pay attention to place. Working with pencil, fine-point pen, markers, and colored pencils, I record the buildings and landscapes I encounter.",
      "The sketchbook includes Fallingwater, New York, London, Buckingham Palace, Florence Cathedral, and scenes from Spain.",
    ],
    images: visuals["sketchbook"] || [],
    tags: ["Observation", "Hand drawing", "Travel"],
  },
  {
    id: "bajo-la-sombra",
    detailCover: "/images/bajo-la-sombra/board.webp",
    title: "Bajo la Sombra",
    subtitle: "Shade as a foundation for play and community.",
    category: "Personal",
    location: "Dominican Republic",
    organization: "LEA Park & Play × Kids Around the World",
    year: "2026",
    role: "Individual competition entry",
    place: "dominican-republic",
    themes: ["Landscapes", "Networks"],
    connection:
      "The question of agency becomes tangible in a playground: shade, familiar materials and open-ended spaces let children make the place their own.",
    cover: "/images/bajo-la-sombra/cover.webp",
    coverAlt:
      "Playground proposal organized around trees, shade and flexible play",
    description: [
      "In a hot climate, shade makes room for play, rest and everyday neighborhood life. Bajo la Sombra organizes a playground around existing trees, shared gathering spaces and flexible activities for children.",
      "Bamboo, tensioned shade fabric, reused tires, compacted earth and planting support a proposal grounded in local materials and collective care.",
    ],
    images: visuals["bajo-la-sombra"] || [],
    source: "https://leaparkandplay.com/katw/",
    note: "Third place — confirmed to me by the organizer. The public results announcement is pending. The linked page documents the competition, rather than the award result.",
    tags: ["Play environments", "Shade", "Community care"],
  },
  {
    id: "waste-research",
    title: "Construction Waste & Climate Action",
    subtitle: "Connecting technical evidence with environmental decisions.",
    category: "Research",
    location: "Ithaca, New York / China-focused research",
    organization: "Cornell University · Natural Resources",
    year: "2022",
    role: "Research Coordinator",
    place: "ithaca",
    themes: ["Systems"],
    connection:
      "Environmental decisions depend on evidence. This work extended my interest in ecological systems to the material flows of construction.",
    description: [
      "With Xin Yu, I researched construction and demolition waste technologies and contributed to technical reports for China Champions for Climate Action.",
      "The work involved gathering and organizing technical evidence across approaches to waste management and climate action.",
    ],
    collaborators: "Xin Yu · Cornell Department of Natural Resources",
    images: [],
    tags: ["Material flows", "Technical research", "Climate action"],
  },
];

const placeEntries: Omit<Place, "projectIds">[] = [
  {
    id: "ithaca",
    label: "Ithaca",
    lat: 42.44,
    lon: -76.5,
    description:
      "Cornell · Environmental science, landscape studies and teaching · 2020–2023",
    narrative:
      "Here I learned to read landscapes as living systems — from fungal structures in soil to forests across a region. Design and teaching expanded that attention to the places people share.",
    themes: ["Systems", "Networks"],
  },
  {
    id: "cambridge",
    label: "Cambridge",
    lat: 42.37,
    lon: -71.11,
    description: "Harvard GSD / Harvard Project Zero · 2023–2025",
    narrative:
      "At Harvard, landscape design met a new question: how does the place where we learn shape curiosity, agency and belonging?",
    themes: ["Networks"],
  },
  {
    id: "boston",
    label: "Charlestown",
    lat: 42.38,
    lon: -71.055,
    description: "Boston waterfront · Harvard GSD studio · 2024",
    narrative:
      "An industrial shoreline became a test of how ecological systems and public access can adapt together over time.",
    themes: ["Systems"],
  },
  {
    id: "salamanca",
    label: "Salamanca",
    lat: 42.16,
    lon: -78.71,
    description: "New York · Cornell / Harvard design study · 2021 / 2024",
    narrative:
      "A former railway landscape offered a way to reconnect river ecology, community memory and access.",
    themes: ["Systems", "Networks"],
  },
  {
    id: "new-orleans",
    label: "New Orleans",
    lat: 29.95,
    lon: -90.07,
    description: "Waggonner & Ball · Design internship · 2023",
    narrative:
      "Living with water brought regional environmental questions into the daily spaces of a city.",
    themes: ["Systems", "Landscapes"],
  },
  {
    id: "melissa",
    label: "Melissa",
    lat: 33.286,
    lon: -96.573,
    description: "Texas · Urban Alchemy Collective project sites",
    narrative:
      "Public parks connect geology, growth and community priorities. These projects bring systems thinking into paths, planting and places to gather.",
    themes: ["Landscapes", "Networks"],
  },
  {
    id: "kyle",
    label: "Kyle",
    lat: 29.99,
    lon: -97.88,
    description: "Texas · Urban Alchemy Collective project site",
    narrative: "Recreation is a way for a growing community to come together.",
    themes: ["Landscapes", "Networks"],
  },
  {
    id: "san-antonio",
    label: "San Antonio",
    lat: 29.42,
    lon: -98.49,
    description: "Urban Alchemy Collective · Landscape Designer · 2025–present",
    narrative:
      "My current practice connects research and design with the technical work of making public landscapes. This is my practice base; project sites appear at their own locations in the atlas.",
    themes: ["Landscapes"],
  },
  {
    id: "aspen",
    label: "Aspen",
    lat: 39.19,
    lon: -106.81,
    description: "Design Workshop · Design internship · 2024",
    narrative:
      "Working through construction details and materials taught me how broad design ideas depend on precise decisions.",
    themes: ["Landscapes"],
  },
  {
    id: "beijing",
    label: "Beijing",
    lat: 39.9,
    lon: 116.4,
    description: "Tsinghua University · Study away · 2020–2021",
    narrative:
      "Study at Tsinghua connected environmental planning with questions of cultural heritage and everyday urban life. My field research took place in Guangzhou.",
    themes: ["Networks"],
  },
  {
    id: "guangzhou",
    label: "Guangzhou",
    lat: 23.12,
    lon: 113.26,
    description: "China · Field research, regional studies and built garden",
    narrative:
      "From delta waterways to a village and a small courtyard, these works explore the relationships between ecological change and daily life.",
    themes: ["Systems", "Landscapes"],
  },
  {
    id: "nepal",
    label: "Nepal",
    lat: 28.39,
    lon: 84.12,
    description: "Cornell Sustainable Design · School templates · 2022–2023",
    narrative:
      "An interdisciplinary collaboration brought landscape and education together in sustainable school templates.",
    themes: ["Networks"],
  },
  {
    id: "dominican-republic",
    label: "Dominican Republic",
    lat: 18.73,
    lon: -70.16,
    description: "LEA Park & Play × Kids Around the World · Competition · 2026",
    narrative:
      "Shade, existing trees and adaptable play create a proposal for a shared neighborhood place. The marker indicates the country; a specific site city is not identified.",
    themes: ["Landscapes", "Networks"],
  },
];

// A project belongs to its geographic site, not the office or school where it was developed.
export const places: Place[] = placeEntries.map((place) => ({
  ...place,
  projectIds: projects
    .filter((project) => project.place === place.id)
    .map((project) => project.id),
}));
