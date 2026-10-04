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
      onKeyDownCapture={(event) => {
        setKeyboardFocused(true);
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          setIndex(
            (i) =>
              (i + (event.key === "ArrowRight" ? 1 : -1) + featured.length) %
              featured.length,
          );
          // Keep focus on a stable progress control when the image link changes.
          ref.current
            ?.querySelector<HTMLButtonElement>(
              ".featured-timeline button[aria-current]",
            )
            ?.focus();
        }
      }}
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
        <div
          className="featured-timeline"
          aria-label="Choose a featured project"
        >
          {featured.map((project, i) => (
            <button
              key={project.id}
              aria-label={`Show ${project.title}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
            >
              <span className="featured-track">
                {i === index && (
                  <motion.span
                    key={`${index}-${autoActive}`}
                    className="featured-track-fill"
                    initial={{ scaleX: autoActive ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: autoActive ? duration / 1000 : 0,
                      ease: "linear",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="featured-status">
          <span aria-label={`Project ${index + 1} of ${featured.length}`}>
            {String(index + 1).padStart(2, "0")}{" "}
            <span>/ {String(featured.length).padStart(2, "0")}</span>
          </span>
          {!reduced && (
            <button
              className="featured-play"
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                {playing ? (
                  <path d="M7 5v10M13 5v10" />
                ) : (
                  <path d="m7 5 8 5-8 5Z" />
                )}
              </svg>
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
