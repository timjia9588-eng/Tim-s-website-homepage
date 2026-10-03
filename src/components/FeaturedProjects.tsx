import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { preload } from "react-dom";
import { projects } from "../data/projects";
const featured = ["weaving", "salamanca", "phillips", "melissa"].map(
  (id) => projects.find((p) => p.id === id)!,
);

export default function FeaturedProjects() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const interacting = hovered || focused;
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const ref = useRef<HTMLDivElement>(null);
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
    if (!playing || interacting || reduced || !visible || !pageVisible) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % featured.length),
      6500,
    );
    return () => window.clearTimeout(timer);
  }, [index, playing, interacting, reduced, visible, pageVisible]);
  const p = featured[index];
  return (
    <div
      ref={ref}
      className="featured-projects"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="featured-stage">
        <AnimatePresence initial={false}>
          <motion.a
            key={p.id}
            className="featured-slide"
            href={`#project/${p.id}`}
            aria-label={`View ${p.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.8 }}
          >
            <img
              src={p.cover}
              alt={p.coverAlt}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
            <div className="featured-shade" />
            <div className="featured-caption">
              <p>
                {p.category === "Professional"
                  ? "Professional practice"
                  : "Academic design"}{" "}
                · {p.location}
              </p>
              <h2>{p.title}</h2>
              <span>View project →</span>
            </div>
          </motion.a>
        </AnimatePresence>
      </div>
      <div className="featured-controls">
        <span className="featured-label">Selected perspectives</span>
        <div className="slide-selectors">
          {featured.map((f, i) => (
            <button
              key={f.id}
              aria-label={`Show ${f.title}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              0{i + 1}
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
            <span>Image © {p.organization}</span>
            <a href={p.source} target="_blank" rel="noreferrer">
              Original source ↗
            </a>
          </>
        ) : (
          <span>Design & illustration · Tianzhen (Tim) Jia</span>
        )}
      </p>
    </div>
  );
}
