import { useEffect, useState } from "react";
import { projects } from "../data/projects";
import { chapters, publications, type Publication } from "../data/story";
import SiteHeader from "./SiteHeader";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import FeaturedProjects from "./FeaturedProjects";
import Portal from "./Portal";
import ScrollScene from "./ScrollScene";
import { motion, useReducedMotion } from "framer-motion";

type Filter = "all" | "practice" | "studies" | "research";
const filters: { id: Filter; label: string; hash: string }[] = [
  { id: "all", label: "All work", hash: "#work" },
  { id: "practice", label: "Professional practice", hash: "#practice" },
  { id: "studies", label: "Academic & independent", hash: "#studies" },
  { id: "research", label: "Research & writing", hash: "#research-work" },
];
const initialFilter = (): Filter =>
  window.location.hash === "#practice"
    ? "practice"
    : window.location.hash === "#studies"
      ? "studies"
      : window.location.hash === "#research-work"
        ? "research"
        : "all";
const order = [
  "weaving",
  "phillips",
  "bajo-la-sombra",
  "parking",
  "salamanca",
  "melissa",
  "place-of-learning",
  "gentilly",
  "bamboo",
  "carbon",
  "places-of-agency",
  "wetland-utopia",
  "alumni",
  "sketchbook",
  "salinity",
  "xiaozhou",
  "learning-places",
  "nepal",
  "waste-research",
  "kyle",
  "carrollton",
];
const entries = [
  ...projects.map((project) => ({
    id: project.id,
    type: "project" as const,
    project,
    category:
      project.category === "Professional"
        ? "practice"
        : project.category === "Research"
          ? "research"
          : "studies",
    search:
      `${project.title} ${project.subtitle} ${project.location} ${project.organization} ${project.tags.join(" ")}`.toLowerCase(),
  })),
  ...publications.map((paper) => ({
    id: paper.id,
    type: "paper" as const,
    paper,
    category: "research",
    search:
      `${paper.title} ${paper.question} Harvard Project Zero education learning Cambridge`.toLowerCase(),
  })),
].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

function PaperCard({
  paper,
  featured = false,
}: {
  paper: Publication;
  featured?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className={`paper-card ${featured ? "paper-card--featured" : ""}`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={`#paper/${paper.id}`}
        aria-label={`Read introduction to ${paper.shortTitle}`}
      >
        <div className="paper-card-top">
          <span className="context-label">Research / Working paper</span>
          <span>{paper.date}</span>
        </div>
        <p className="paper-card-lab">Harvard Project Zero</p>
        <h3>{paper.shortTitle}</h3>
        <p>{paper.question}</p>
        <div className="paper-card-bottom">
          <span>Co-author</span>
          <strong>Explore the research →</strong>
        </div>
      </a>
    </motion.article>
  );
}
function Work() {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const update = () => {
      if (
        ["#work", "#practice", "#studies", "#research-work"].includes(
          window.location.hash,
        )
      ) {
        setFilter(initialFilter());
        setQuery("");
      }
    };
    const all = () => {
      setFilter("all");
      setQuery("");
    };
    window.addEventListener("hashchange", update);
    window.addEventListener("show-all-work", all);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("show-all-work", all);
    };
  }, []);
  const work = entries.filter(
    (p) =>
      (filter === "all" || p.category === filter) &&
      p.search.includes(query.trim().toLowerCase()),
  );
  return (
    <section className="work-section section-space" id="work">
      <div className="page-width">
        <ScrollScene className="work-heading">
          <div>
            <h2>Work, in perspective.</h2>
          </div>
          <p>
            Different settings. Connected questions.
            <br />
            Explore the work that shapes my practice.
          </p>
        </ScrollScene>
        <div className="work-browser">
          <div
            className="work-filters"
            role="group"
            aria-label="Show work by category"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                aria-pressed={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  window.history.replaceState(null, "", f.hash);
                }}
              >
                {f.label}
                <span>
                  {f.id === "all"
                    ? entries.length
                    : entries.filter((p) => p.category === f.id).length}
                </span>
              </button>
            ))}
          </div>
          <label className="work-search">
            <span>Find a project, place or paper</span>
            <input
              type="search"
              placeholder="Search the work"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="work-result-line">
          <p aria-live="polite">
            Showing {work.length} of {entries.length} projects & papers
          </p>
          {(filter !== "all" || query) && (
            <button
              onClick={() => {
                setFilter("all");
                setQuery("");
                window.history.replaceState(null, "", "#work");
              }}
            >
              Show everything
            </button>
          )}
        </div>
        <div className="project-grid">
          {work.map((entry, i) =>
            entry.type === "project" ? (
              <ProjectCard key={entry.id} project={entry.project} index={i} />
            ) : (
              <PaperCard key={entry.id} paper={entry.paper} />
            ),
          )}
        </div>
        {!work.length && (
          <div className="work-empty">
            <h3>No matching work.</h3>
            <p>Try a different project name, location or subject.</p>
            <button
              className="button-primary"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              View all work
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
function Research() {
  return (
    <section className="research-feature section-space" id="research">
      <div className="page-width">
        <ScrollScene className="research-heading">
          <div>
            <p className="eyebrow">Research & writing</p>
            <h2>
              Places teach us.
              <br />
              <em>What can we learn?</em>
            </h2>
          </div>
          <p>
            My research connects the living systems beneath a landscape with the
            ways people learn, belong and act within it. At Harvard Project
            Zero, that inquiry became two collaborative working papers.
          </p>
        </ScrollScene>
        <div className="research-paper-grid">
          {publications.map((p) => (
            <PaperCard key={p.id} paper={p} featured />
          ))}
        </div>
        <a className="text-link" href="#research-work">
          View all research projects & papers →
        </a>
      </div>
    </section>
  );
}
function About() {
  const labels = [
    "Ecology & climate",
    "Learning & belonging",
    "Public space & play",
  ];
  return (
    <section className="about-practice section-space" id="about">
      <div className="page-width">
        <ScrollScene className="about-practice-intro">
          <div>
            <p className="eyebrow">About my practice</p>
            <h2>
              Looking closely.
              <br />
              <em>Thinking across scales.</em>
            </h2>
          </div>
          <div>
            <p>
              I’m Tianzhen (Tim) Jia, a landscape designer and researcher in San
              Antonio. My path through Cornell, Harvard and professional
              practice connects environmental science with the spaces people
              inhabit every day.
            </p>
            <a
              className="text-link"
              href="#resume"
              target="_blank"
              rel="noreferrer"
            >
              Read my resume →
            </a>
          </div>
        </ScrollScene>
        <div className="practice-notes">
          {chapters.map((c, i) => (
            <Reveal key={c.theme}>
              <span>0{i + 1}</span>
              <h3>{labels[i]}</h3>
              <p>{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export default function Portfolio() {
  return (
    <>
      <main>
        <Portal />
        <div className="atlas-transition" aria-hidden="true" />
        <SiteHeader />
        <section className="portfolio-hero" id="top">
          <ScrollScene className="portfolio-hero-intro page-width">
            <div>
              <h2 className="portfolio-headline">
                Places for people.
                <br />
                <em>Room for possibility.</em>
              </h2>
            </div>
            <div className="portfolio-hero-copy">
              <p>
                I study what sustains a place, how it connects us, and how
                design makes those connections tangible.
              </p>
              <a className="text-link" href="#work">
                Explore all work →
              </a>
            </div>
          </ScrollScene>
          <div className="page-width">
            <ScrollScene expand>
              <FeaturedProjects />
            </ScrollScene>
          </div>
        </section>
        <Work />
        <Research />
        <About />
      </main>
      <footer className="portfolio-footer">
        <div className="page-width">
          <div>
            <a className="wordmark" href="#simple">
              tim jia.
            </a>
            <p>Landscape design, research & the possibilities of place.</p>
          </div>
          <a href="mailto:tj263@cornell.edu">
            Let’s connect ↗<span>tj263@cornell.edu</span>
          </a>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Tianzhen (Tim) Jia</span>
            <a href="#resume" target="_blank" rel="noreferrer">
              Resume ↗
            </a>
            <a href="#globe">Explore the globe →</a>
            <a
              href="https://github.com/timjia9588-eng/Tim-s-website-homepage"
              target="_blank"
              rel="noreferrer"
            >
              Site source
            </a>
          </div>
          <p className="footer-credit">
            Professional work was developed with the credited teams. Image
            credits and original sources are included in each project.
          </p>
        </div>
      </footer>
    </>
  );
}
