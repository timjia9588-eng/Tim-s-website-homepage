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
import AtlasContours from "./AtlasContours";
const Globe = lazy(() => import("./Globe"));

export default function Portal() {
  const [selected, setSelected] = useState("melissa");
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const globeScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.78, 0.6]);
  const globeOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [1, 0.85, 0],
  );
  const atmosphere = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1, 0]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.85],
    [1, 1, 0],
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
      <div className="atlas-scene">
        <motion.div
          className="atlas-atmosphere"
          aria-hidden="true"
          style={reduced ? undefined : { opacity: atmosphere }}
        />
        <AtlasContours />
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
        <motion.div
          className="atlas-intro"
          style={reduced ? undefined : { opacity: contentOpacity }}
        >
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
        </motion.div>
        <motion.aside
          className="atlas-browser"
          aria-label="Browse projects by place"
          style={reduced ? undefined : { opacity: contentOpacity }}
        >
          <div className="atlas-place-selector">
            <PlacePicker selected={selected} onSelect={setSelected} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              className="atlas-place-content"
              key={selected}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="atlas-place-context">{place.description}</p>
              <p className="atlas-place-story">{place.narrative}</p>
              <div className="atlas-project-list">
                {work.map((p, index) => (
                  <a
                    href={`#project/${p.id}`}
                    key={p.id}
                    className={
                      index ? "atlas-related-project" : "atlas-spotlight"
                    }
                  >
                    {index === 0 && <ProjectPreview project={p} />}
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
                      <span>{index ? "→" : "View project →"}</span>
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
        </motion.aside>
        <div className="atlas-bottom">
          <a
            className="atlas-scroll-link"
            href="#top"
            aria-label="Continue to selected work"
          >
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="atlas-shore" aria-hidden="true" />
      </div>
    </section>
  );
}
