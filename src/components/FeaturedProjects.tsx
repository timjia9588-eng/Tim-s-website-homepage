import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "framer-motion";
import { preload } from "react-dom";
import { projects } from "../data/projects";
import type { Category, Project } from "../types";

const featured = [
  "weaving",
  "phillips",
  "salamanca",
  "bajo-la-sombra",
  "melissa",
  "gentilly",
  "bamboo",
  "alumni",
  "sketchbook",
].map((id) => projects.find((p) => p.id === id)!);
const duration = 7500;
const context: Record<Category, string> = {
  Professional: "Professional practice",
  Studio: "Academic design",
  Personal: "Independent work",
  Research: "Research",
};

function FeaturedSlide({
  project,
  reduced,
  first,
}: {
  project: Project;
  reduced: boolean;
  first: boolean;
}) {
  const present = useIsPresent();
  return (
    <motion.a
      className="featured-slide"
      href={`#project/${project.id}`}
      aria-label={`View ${project.title}`}
      aria-hidden={!present}
      tabIndex={present ? 0 : -1}
      style={{ pointerEvents: present ? "auto" : "none" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 1 }}
    >
      <img
        src={project.cover}
        alt={project.coverAlt}
        fetchPriority={first ? "high" : "auto"}
      />
      <div className="featured-shade" />
      <div className="featured-caption">
        <p>
          {context[project.category]} · {project.location}
        </p>
        <h2>{project.title}</h2>
        <span>View project →</span>
      </div>
    </motion.a>
  );
}

export default function FeaturedProjects() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const ref = useRef<HTMLDivElement>(null);
  const autoActive =
    playing && !keyboardFocused && !reduced && visible && pageVisible;
  useEffect(() => {
    preload(featured[(index + 1) % featured.length].cover!, {
      as: "image",
      fetchPriority: "low",
    });
  }, [index]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    const change = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", change);
    };
  }, []);
  useEffect(() => {
    if (!autoActive) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % featured.length),
      duration,
    );
    return () => window.clearTimeout(timer);
  }, [index, autoActive]);
  const p = featured[index];
  const coverImage = p.images.find((image) => image.src === p.cover);
  return (
    <div
      ref={ref}
      className="featured-projects"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      data-moving={autoActive}
      onFocusCapture={(e) =>
        setKeyboardFocused(e.target.matches(":focus-visible"))
      }
      onKeyDownCapture={() => setKeyboardFocused(true)}
      onPointerDownCapture={() => setKeyboardFocused(false)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget))
          setKeyboardFocused(false);
      }}
    >
      <div className="featured-stage" aria-live={autoActive ? "off" : "polite"}>
        <AnimatePresence initial={false}>
          <FeaturedSlide
            key={p.id}
            project={p}
            reduced={Boolean(reduced)}
            first={index === 0}
          />
        </AnimatePresence>
        <div className="featured-progress" aria-hidden="true">
          {autoActive && (
            <motion.div
              key={index}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </div>
      </div>
      <div className="featured-controls">
        <span className="featured-label">
          Selected perspectives
          <small>
            {reduced
              ? "Choose a project"
              : keyboardFocused
                ? "Paused for reading"
                : playing
                  ? "Auto play · 9 projects"
                  : "Paused"}
          </small>
        </span>
        <div className="slide-selectors">
          {featured.map((f, i) => (
            <button
              key={f.id}
              aria-label={`Show ${f.title}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div className="slideshow-actions">
          <button
            aria-label="Previous featured project"
            onClick={() =>
              setIndex((i) => (i - 1 + featured.length) % featured.length)
            }
          >
            Previous
          </button>
          <button
            aria-label="Next featured project"
            onClick={() => setIndex((i) => (i + 1) % featured.length)}
          >
            Next
          </button>
          {!reduced && (
            <button
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              {playing ? "Pause" : "Play"}
            </button>
          )}
        </div>
      </div>
      <p className="featured-credit">
        {p.category === "Professional" ? (
          <>
            <span>Image · {coverImage?.credit || p.organization}</span>
            <a
              href={coverImage?.source || p.source}
              target="_blank"
              rel="noreferrer"
            >
              {coverImage?.source ? "Original source ↗" : "Project context ↗"}
            </a>
          </>
        ) : (
          <span>Design & illustration · Tianzhen (Tim) Jia</span>
        )}
      </p>
    </div>
  );
}
