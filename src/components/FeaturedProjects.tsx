import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { preload } from "react-dom";
import { projects } from "../data/projects";
import type { Category } from "../types";

// One perspective per project; large covers are chosen separately from galleries.
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
  key: id,
}));
const duration = 4500;
const context: Record<Category, string> = {
  Professional: "Professional practice",
  Studio: "Academic design",
  Personal: "Independent work",
  Research: "Research",
};
const wrap = (index: number) => (index + featured.length) % featured.length;

export default function FeaturedProjects() {
  const reduced = useReducedMotion();
  const [requested, setRequested] = useState({ index: 0, direction: 1 });
  const [slide, setSlide] = useState({
    index: 0,
    previous: null as number | null,
    direction: 1,
    serial: 0,
  });
  const [transitioning, setTransitioning] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const ref = useRef<HTMLDivElement>(null);
  const autoActive = !keyboardFocused && !reduced && visible && pageVisible;
  const index = slide.index;
  const step = (amount: number) =>
    setRequested((current) => ({
      index: wrap(current.index + amount),
      direction: amount,
    }));

  useEffect(() => {
    for (const offset of [-1, 1])
      preload(featured[wrap(index + offset)].image, {
        as: "image",
        fetchPriority: "low",
      });
  }, [index]);

  useEffect(() => {
    if (requested.index === index || transitioning) return;
    let cancelled = false;
    const image = new Image();
    image.src = featured[requested.index].image;
    // Retain the outgoing image until its replacement is decoded. No blank frames on a slow connection.
    image
      .decode()
      .then(() => {
        if (cancelled) return;
        setTransitioning(!reduced);
        setSlide((current) => ({
          index: requested.index,
          previous: reduced ? null : current.index,
          direction: requested.direction,
          serial: current.serial + 1,
        }));
      })
      .catch(() => {
        if (!cancelled) setRequested({ index, direction: 1 });
      });
    return () => {
      cancelled = true;
    };
  }, [requested, index, transitioning, reduced]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2] },
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
      () => setRequested({ index: wrap(index + 1), direction: 1 }),
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
      data-transitioning={transitioning}
      onFocusCapture={(event) =>
        setKeyboardFocused(event.target.matches(":focus-visible"))
      }
      onKeyDownCapture={(event) => {
        setKeyboardFocused(true);
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const next = event.key === "ArrowRight";
          step(next ? 1 : -1);
          ref.current
            ?.querySelector<HTMLButtonElement>(
              `.featured-arrow--${next ? "next" : "previous"}`,
            )
            ?.focus();
        }
      }}
      onPointerDownCapture={() => setKeyboardFocused(false)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setKeyboardFocused(false);
      }}
    >
      <div className="featured-stage" aria-live={autoActive ? "off" : "polite"}>
        {slide.previous !== null && (
          <div
            className="featured-visual featured-visual--outgoing"
            aria-hidden="true"
          >
            <img src={featured[slide.previous].image} alt="" />
          </div>
        )}
        <motion.div
          key={slide.serial}
          className="featured-visual featured-visual--incoming"
          aria-hidden="true"
          initial={
            reduced || slide.serial === 0
              ? false
              : {
                  clipPath:
                    slide.direction > 0
                      ? "inset(0% 100% 0% 0%)"
                      : "inset(0% 0% 0% 100%)",
                }
          }
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: reduced ? 0 : 0.9, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            setTransitioning(false);
            setSlide((current) =>
              current.serial === slide.serial
                ? { ...current, previous: null }
                : current,
            );
          }}
        >
          <img
            src={entry.image}
            alt=""
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </motion.div>
        <a
          className="featured-slide"
          href={`#project/${p.id}`}
          aria-label={`View ${p.title}`}
        >
          <div className="featured-shade" />
          <motion.div
            key={p.id}
            className="featured-caption"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reduced ? 0 : 0.4,
              delay: reduced ? 0 : 0.2,
            }}
          >
            <p>
              {context[p.category]} · {p.location}
            </p>
            <h2>{p.title}</h2>
            <span>View project →</span>
          </motion.div>
        </a>
        <div className="featured-arrows">
          <button
            className="featured-arrow featured-arrow--previous"
            aria-label="Previous featured project"
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m14 6-6 6 6 6" />
            </svg>
          </button>
          <button
            className="featured-arrow featured-arrow--next"
            aria-label="Next featured project"
            onClick={() => step(1)}
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
              onClick={() =>
                setRequested({ index: i, direction: i >= index ? 1 : -1 })
              }
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
