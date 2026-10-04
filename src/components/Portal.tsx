import { lazy, Suspense, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { places, projects } from "../data/projects";
import { publications } from "../data/story";
import PlacePicker from "./PlacePicker";
import ProjectPreview from "./ProjectPreview";
const Globe = lazy(() => import("./Globe"));

export default function Portal() {
  const [selected, setSelected] = useState("melissa");
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const globeScale = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [1, 0.66, 0.55],
  );
  const globeOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [1, 0.7, 0.15],
  );
  const place = places.find((p) => p.id === selected)!;
  const work = place.projectIds.flatMap((id) => {
    const p = projects.find((p) => p.id === id);
    return p ? [p] : [];
  });
  return (
    <section
      ref={section}
      id="globe"
      className="globe-portal atlas-portal"
      aria-label="An atlas of design and inquiry"
    >
      <header className="atlas-header">
        <a href="#globe" className="atlas-wordmark">
          tim jia<span>.</span>
          <small>Landscape designer & researcher</small>
        </a>
        <nav aria-label="Globe navigation">
          <a className="atlas-nav-work" href="#work">
            All work <span>{projects.length + publications.length}</span>
          </a>
          <a href="#research">Research</a>
          <a
            href="#resume"
            target="_blank"
            rel="noreferrer"
            aria-label="Resume (opens in a new tab)"
          >
            Resume ↗
          </a>
        </nav>
      </header>
      <motion.div
        className="atlas-globe"
        style={
          reduced
            ? undefined
            : { y: globeY, scale: globeScale, opacity: globeOpacity }
        }
      >
        <Suspense
          fallback={
            <div className="globe-loading">Bringing the world into view…</div>
          }
        >
          <Globe selected={selected} onSelect={setSelected} theme={null} />
        </Suspense>
      </motion.div>
      <div className="atlas-intro">
        <h1>
          A practice
          <br />
          <em>across places.</em>
        </h1>
        <p>
          Reading landscapes.
          <br />
          Following relationships.
          <br />
          Making room for everyday life.
        </p>
        <a className="atlas-primary" href="#work">
          Explore all work <span>→</span>
        </a>
        <a className="atlas-research-link" href="#research">
          Discover the research →
        </a>
      </div>
      <aside className="atlas-browser" aria-label="Browse projects by place">
        <div className="atlas-place-selector">
          <PlacePicker selected={selected} onSelect={setSelected} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            className="atlas-place-content"
            key={selected}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="atlas-place-context">{place.description}</p>
            <p className="atlas-place-story">{place.narrative}</p>
            <div className="atlas-project-list">
              {work.map((p) => (
                <a href={`#project/${p.id}`} key={p.id}>
                  <ProjectPreview project={p} />
                  <div className="atlas-project-copy">
                    <small>
                      {p.category === "Professional"
                        ? "Professional practice"
                        : p.category === "Research"
                          ? "Research"
                          : p.category === "Studio"
                            ? "Academic design"
                            : "Independent work"}
                    </small>
                    <h2>{p.title}</h2>
                    <span>View project →</span>
                  </div>
                </a>
              ))}
              {place.id === "cambridge" &&
                publications.map((p) => (
                  <a
                    className="atlas-paper-link"
                    key={p.id}
                    href={`#paper/${p.id}`}
                  >
                    <div>
                      <small>Harvard Project Zero / Working paper</small>
                      <h2>{p.shortTitle}</h2>
                      <span>Explore the research →</span>
                    </div>
                  </a>
                ))}
            </div>
            {!work.length && (
              <a
                className="atlas-experience-link"
                href="#resume"
                target="_blank"
                rel="noreferrer"
              >
                Read about this experience →
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </aside>
      <div className="atlas-bottom">
        <a className="atlas-scroll-link" href="#top">
          Scroll to the work <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
