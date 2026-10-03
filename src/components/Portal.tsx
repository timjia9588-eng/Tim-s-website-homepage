import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { places, projects } from "../data/projects";
import { publications } from "../data/story";
const Globe = lazy(() => import("./Globe"));

export default function Portal() {
  const [selected, setSelected] = useState("melissa");
  const reduced = useReducedMotion();
  const place = places.find((p) => p.id === selected)!;
  const work = place.projectIds.flatMap((id) => {
    const p = projects.find((p) => p.id === id);
    return p ? [p] : [];
  });
  const placeIndex = places.indexOf(place);
  const chooseNext = (direction: number) =>
    setSelected(
      places[(placeIndex + direction + places.length) % places.length].id,
    );
  return (
    <main id="globe" className="globe-portal atlas-portal">
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
      <div className="atlas-globe">
        <Suspense
          fallback={
            <div className="globe-loading">Bringing the world into view…</div>
          }
        >
          <Globe selected={selected} onSelect={setSelected} theme={null} />
        </Suspense>
      </div>
      <div className="atlas-intro">
        <p className="eyebrow">An atlas of design & inquiry</p>
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
          <label htmlFor="atlas-place-select">Explore a place</label>
          <select
            id="atlas-place-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <div className="atlas-place-step">
            <button onClick={() => chooseNext(-1)} aria-label="Previous place">
              Previous
            </button>
            <span>
              {String(placeIndex + 1).padStart(2, "0")} / {places.length}
            </span>
            <button onClick={() => chooseNext(1)} aria-label="Next place">
              Next
            </button>
          </div>
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
                  {p.cover && (
                    <img
                      src={p.cover.replace(".webp", "-small.webp")}
                      alt={p.coverAlt}
                      loading="lazy"
                    />
                  )}
                  <div>
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
        <a className="simplistic-link" href="#simple">
          Simplistic version <span>→</span>
        </a>
        <p>Drag to explore · Hover to pause · Choose a place</p>
        <span>Tianzhen (Tim) Jia</span>
      </div>
    </main>
  );
}
