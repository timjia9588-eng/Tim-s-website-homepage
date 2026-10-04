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
import { contentTransition, easyEase, scrollEase } from "../motion";
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
  // One measured timeline keeps the pinned WebGL scene and its hand-off in sync.
  const progress = useTransform(() => scrollYProgress.get());
  const globeY = useTransform(progress, [0, 0.18, 1], [0, 0, -120], {
    ease: scrollEase,
  });
  const globeScale = useTransform(progress, [0, 0.18, 1], [1, 1, 0.68], {
    ease: scrollEase,
  });
  const globeOpacity = useTransform(
    progress,
    [0, 0.3, 0.82, 1],
    [1, 1, 0.12, 0],
  );
  const background = useTransform(
    progress,
    [0, 0.3, 0.72, 1],
    ["#18382b", "#18382b", "#bbc8b7", "#f7f6f2"],
  );
  const atmosphereOpacity = useTransform(progress, [0, 0.3, 0.9], [1, 1, 0], {
    ease: scrollEase,
  });
  const browserOpacity = useTransform(progress, [0, 0.16, 0.5], [1, 1, 0], {
    ease: scrollEase,
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.5 ? "opening" : "handoff";
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
      <h1 className="sr-only">
        Tim Jia — Landscape design and research across places
      </h1>
      <motion.div
        className="atlas-scene"
        style={{ backgroundColor: pinned ? background : "#18382b" }}
      >
        <motion.div
          className="atlas-atmosphere"
          aria-hidden="true"
          style={{ opacity: pinned ? atmosphereOpacity : 1 }}
        />
        <AtlasContours />
        <motion.div
          className="atlas-globe"
          style={
            pinned
              ? { y: globeY, scale: globeScale, opacity: globeOpacity }
              : undefined
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
        <motion.aside
          className="atlas-browser"
          aria-label="Browse projects by place"
          style={pinned ? { opacity: browserOpacity } : undefined}
          inert={pinned && phase !== "opening"}
          aria-hidden={pinned && phase !== "opening" ? true : undefined}
        >
          <PlacePicker selected={selected} onSelect={setSelected} />
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
              <div className="atlas-project-list">
                {work.map((p, index) => (
                  <a
                    href={`#project/${p.id}`}
                    key={p.id}
                    aria-label={p.title}
                    className={
                      index
                        ? "atlas-related-project"
                        : `atlas-spotlight ${p.cover ? "atlas-spotlight--image" : ""}`
                    }
                  >
                    {index === 0 && <ProjectPreview project={p} />}
                    <div className="atlas-project-copy">
                      <h2>{p.title}</h2>
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
                      <h2>{p.shortTitle}</h2>
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
                  Professional experience
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      </motion.div>
    </section>
  );
}
