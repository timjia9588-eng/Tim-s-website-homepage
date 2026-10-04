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

// Large covers are chosen separately from the complete project galleries.
const featured = [
  ["weaving", "/images/weaving/cover.webp", "Entrance"],
  ["phillips", "/images/phillips/cover.webp", "Quarry landscape"],
  ["salamanca", "/images/salamanca/cover.webp", "Restored wetland"],
  ["melissa", "/images/melissa/cover.webp", "Community park"],
  ["gentilly", "/images/gentilly/cover.webp", "Living with water"],
  ["alumni", "/images/alumni/cover.webp", "Planting layers"],
].map(([id, image, perspective]) => ({
  project: projects.find((p) => p.id === id)!,
  image,
  perspective,
  key: `${id}-${perspective}`,
}));
const duration = 4500;
const context: Record<Category, string> = {
  Professional: "Professional practice",
  Studio: "Academic design",
  Personal: "Independent work",
  Research: "Research",
};

function FeaturedSlide({
  project,
  image,
  reduced,
  first,
}: {
  project: Project;
  image: string;
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
      transition={{ duration: reduced ? 0 : 0.8 }}
    >
      <img
        src={image}
        alt={
          project.images.find((figure) => figure.src === image)?.alt ||
          project.coverAlt
        }
        fetchPriority={first ? "high" : "auto"}
      />
      <div className="featured-shade" />
      <motion.div
        className="featured-caption"
        initial={{ opacity: 0, y: reduced ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.12 }}
      >
        <p>
          {context[project.category]} · {project.location}
        </p>
        <h2>{project.title}</h2>
        <span>View project →</span>
      </motion.div>
    </motion.a>
  );
}

export default function FeaturedProjects() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const ref = useRef<HTMLDivElement>(null);
  const autoActive = !keyboardFocused && !reduced && visible && pageVisible;
  useEffect(() => {
    preload(featured[(index + 1) % featured.length].image, {
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
  const entry = featured[index];
  const p = entry.project;
  const coverImage = p.images.find((image) => image.src === entry.image);
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
            key={entry.key}
            project={p}
            image={entry.image}
            reduced={Boolean(reduced)}
            first={index === 0}
          />
        </AnimatePresence>
        <div className="featured-arrows">
          <button
            className="featured-arrow featured-arrow--previous"
            aria-label="Previous featured project"
            onClick={() =>
              setIndex((i) => (i - 1 + featured.length) % featured.length)
            }
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
          <button
            className="featured-arrow featured-arrow--next"
            aria-label="Next featured project"
            onClick={() => setIndex((i) => (i + 1) % featured.length)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m10 6 6 6-6 6" />
            </svg>
          </button>
        </div>
        <div
          className="featured-timeline"
          aria-label="Choose a featured project"
        >
          {featured.map(({ project, key, perspective }, i) => (
            <button
              key={key}
              aria-label={`Show ${project.title} — ${perspective}`}
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
          <span aria-label={`Perspective ${index + 1} of ${featured.length}`}>
            {String(index + 1).padStart(2, "0")}{" "}
            <span>/ {String(featured.length).padStart(2, "0")}</span>
          </span>
        </div>
      </div>
      <p
        className="featured-credit"
        aria-hidden={p.category !== "Professional" || undefined}
      >
        {p.category === "Professional" && (
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
        )}
      </p>
    </div>
  );
}
