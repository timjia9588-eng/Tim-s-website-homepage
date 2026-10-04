import { useEffect, useState } from "react";
import { projects } from "../data/projects";
import { chapters, publications, type Publication } from "../data/story";
import SiteHeader from "./SiteHeader";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import FeaturedProjects from "./FeaturedProjects";
import Portal from "./Portal";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { easyEase, revealTransition } from "../motion";

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
  return (
    <article className={`paper-card ${featured ? "paper-card--featured" : ""}`}>
      <a
        href={`#paper/${paper.id}`}
        aria-label={`Read introduction to ${paper.shortTitle}`}
      >
        <p className="paper-card-lab">Harvard Project Zero · Working paper</p>
        <h3>{paper.shortTitle}</h3>
        <p>{paper.question}</p>
      </a>
    </article>
  );
}
function Work() {
  const reduced = useReducedMotion();
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
        <Reveal className="work-heading">
          <div>
            <h2>Work, in perspective.</h2>
          </div>
        </Reveal>
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
                {filter === f.id && (
                  <motion.span
                    className="work-filter-indicator"
                    layoutId="work-filter-indicator"
                    transition={{ duration: reduced ? 0 : 0.7, ease: easyEase }}
                  />
                )}
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
            <input
              type="search"
              placeholder="Search the work"
              aria-label="Find a project, place or paper"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="work-result-line">
          <p aria-live="polite">{work.length} projects & papers</p>
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
          <AnimatePresence mode="popLayout">
            {work.map((entry, i) => (
              <motion.div
                key={entry.id}
                className="work-entry"
                layout="position"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                exit={{
                  opacity: 0,
                  transition: { duration: reduced ? 0 : 0.3, ease: easyEase },
                }}
                transition={{
                  ...revealTransition,
                  duration: reduced ? 0 : 1.05,
                  delay: reduced ? 0 : (i % 2) * 0.08,
                  layout: { duration: reduced ? 0 : 0.95, ease: easyEase },
                }}
              >
                {entry.type === "project" ? (
                  <ProjectCard project={entry.project} />
                ) : (
                  <PaperCard paper={entry.paper} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
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
        <Reveal className="research-heading">
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
        </Reveal>
        <div className="research-paper-grid">
          {publications.map((p) => (
            <Reveal key={p.id}>
              <PaperCard paper={p} featured />
            </Reveal>
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
        <Reveal className="about-practice-intro">
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
        </Reveal>
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
      <SiteHeader continuous />
      <main className="portfolio-journey">
        <Portal />
        <section className="portfolio-hero" id="top">
          <Reveal className="portfolio-hero-intro page-width portfolio-intro-fallback">
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
            </div>
          </Reveal>
          <div className="page-width">
            <Reveal>
              <FeaturedProjects />
            </Reveal>
          </div>
        </section>
        <Work />
        <Research />
        <About />
      </main>
      <footer className="portfolio-footer">
        <div className="page-width">
          <div>
            <a className="wordmark" href="#globe">
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
