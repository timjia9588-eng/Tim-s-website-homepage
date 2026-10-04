import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { places, projects } from "../data/projects";
import { publications } from "../data/story";
import PlacePicker from "./PlacePicker";
import ProjectPreview from "./ProjectPreview";
import AtlasContours from "./AtlasContours";
import {
  contentTransition,
  easyEase,
  revealTransition,
  scrollEase,
} from "../motion";
const Globe = lazy(() => import("./Globe"));

export default function Portal() {
  const [selected, setSelected] = useState("melissa");
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(
    () => window.matchMedia("(min-width: 701px)").matches,
  );
  const [phase, setPhase] = useState("opening");
  const phaseRef = useRef("opening");
  const pinned = wide && !reduced;
  useEffect(() => {
    const media = window.matchMedia("(min-width: 701px)");
    const update = () => setWide(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // Use one measured timeline for the pinned scene and its focus phases.
  // A computed value keeps sticky-layout visuals in sync with the JS reading position.
  const sceneProgress = useTransform(() => scrollYProgress.get());
  // The scene remains pinned. Only the foreground changes until the final hand-off.
  const globeY = useTransform(sceneProgress, [0, 0.5, 1], [0, 0, -190], {
    ease: scrollEase,
  });
  const globeScale = useTransform(sceneProgress, [0, 0.5, 1], [1, 1, 0.64], {
    ease: scrollEase,
  });
  const globeOpacity = useTransform(
    sceneProgress,
    [0, 0.36, 0.8, 1],
    [1, 1, 0.25, 0],
  );
  const paperOpacity = useTransform(sceneProgress, [0.55, 1], [0, 1], {
    ease: scrollEase,
  });
  const introOpacity = useTransform(sceneProgress, [0, 0.1, 0.26], [1, 1, 0]);
  const browserOpacity = useTransform(
    sceneProgress,
    [0, 0.12, 0.28],
    [1, 1, 0],
  );
  const bridgeOpacity = useTransform(sceneProgress, [0.32, 0.52], [0, 1], {
    ease: scrollEase,
  });
  const bridgeY = useTransform(sceneProgress, [0.32, 0.52], [24, 0], {
    ease: scrollEase,
  });
  const bridgeColor = useTransform(
    sceneProgress,
    [0.62, 0.94],
    ["#eeede7", "#242c27"],
  );
  const bridgeAccent = useTransform(
    sceneProgress,
    [0.62, 0.94],
    ["#c9d6ba", "#4d6657"],
  );
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.28 ? "opening" : value < 0.58 ? "story" : "handoff";
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      setPhase(next);
    }
  });
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
      data-phase={phase}
      data-pinned={pinned}
    >
      <div className="atlas-scene">
        <div className="atlas-atmosphere" aria-hidden="true" />
        <AtlasContours />
        <motion.div
          className="atlas-paper"
          aria-hidden="true"
          style={pinned ? { opacity: paperOpacity } : { opacity: 0 }}
        />
        <motion.div
          className="atlas-globe"
          style={
            !pinned
              ? undefined
              : { y: globeY, scale: globeScale, opacity: globeOpacity }
          }
          inert={pinned && phase !== "opening"}
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
          style={pinned ? { opacity: introOpacity } : undefined}
          inert={pinned && phase !== "opening"}
          aria-hidden={pinned && phase !== "opening" ? true : undefined}
        >
          <motion.p
            className="atlas-identity"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={revealTransition}
          >
            Tim Jia · Landscape designer & researcher
          </motion.p>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: reduced ? 0 : 0.12 }}
          >
            A practice
            <br />
            <em>across places.</em>
          </motion.h1>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: reduced ? 0 : 0.28 }}
            className="atlas-intro-actions"
          >
            <a className="atlas-primary" href="#work">
              Explore all work <span>→</span>
            </a>
            <a className="atlas-research-link" href="#research">
              Discover the research →
            </a>
          </motion.div>
        </motion.div>
        <motion.aside
          className="atlas-browser"
          aria-label="Browse projects by place"
          style={pinned ? { opacity: browserOpacity } : undefined}
          inert={pinned && phase !== "opening"}
          aria-hidden={pinned && phase !== "opening" ? true : undefined}
        >
          <div className="atlas-place-selector">
            <PlacePicker selected={selected} onSelect={setSelected} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              className="atlas-place-content"
              key={selected}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: reduced ? 0 : -8,
                transition: { duration: reduced ? 0 : 0.35, ease: easyEase },
              }}
              transition={{
                ...contentTransition,
                duration: reduced ? 0 : 0.95,
              }}
            >
              <p className="atlas-place-context">{place.description}</p>
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
        <motion.div
          className="atlas-bridge"
          aria-hidden={!pinned || phase === "opening" ? true : undefined}
          inert={!pinned || phase === "opening"}
          style={
            pinned
              ? { opacity: bridgeOpacity, y: bridgeY, color: bridgeColor }
              : { opacity: 0 }
          }
        >
          <h2>
            Places for people.
            <br />
            <motion.em style={{ color: bridgeAccent }}>
              Room for possibility.
            </motion.em>
          </h2>
          <p>
            I study what sustains a place, how it connects us, and how design
            makes those connections tangible.
          </p>
          <a className="text-link" href="#work">
            Explore all work <span aria-hidden="true">→</span>
          </a>
        </motion.div>
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
