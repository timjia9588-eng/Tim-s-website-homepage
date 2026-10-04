import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDialog } from "../hooks/useDialog";
import type { ProjectImage } from "../types";
import { contentTransition } from "../motion";
export default function Lightbox({
  images,
  initial,
  onClose,
}: {
  images: ProjectImage[];
  initial: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initial);
  const [zoom, setZoom] = useState(false);
  const ref = useDialog(onClose, "project-dialog");
  const reduced = useReducedMotion();
  const image = images[index];
  const move = (direction: number) => {
    setIndex((i) => (i + direction + images.length) % images.length);
    setZoom(false);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => (i + 1) % images.length);
        setZoom(false);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => (i - 1 + images.length) % images.length);
        setZoom(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [images.length]);
  return createPortal(
    <motion.div
      ref={ref}
      data-dialog
      role="dialog"
      aria-modal="true"
      aria-label="Project image viewer"
      tabIndex={-1}
      className="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="lightbox-toolbar">
        <span aria-live="polite">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
        <div>
          <button onClick={() => setZoom((v) => !v)} aria-pressed={zoom}>
            {zoom ? "Fit image" : "Zoom in"}
          </button>
          <button
            data-autofocus
            onClick={onClose}
            aria-label="Close image viewer"
            className="icon-button"
          >
            ×
          </button>
        </div>
      </div>
      <div className={`lightbox-stage ${zoom ? "is-zoomed" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={image.src}
            src={image.src}
            alt={image.alt}
            initial={{ opacity: 0, x: reduced ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...contentTransition, duration: reduced ? 0 : 0.65 }}
            onDoubleClick={() => setZoom((v) => !v)}
          />
        </AnimatePresence>
      </div>
      <div className="lightbox-footer">
        <button
          className="icon-button"
          onClick={() => move(-1)}
          aria-label="Previous image"
          disabled={images.length < 2}
        >
          ‹
        </button>
        <div>
          <p>{image.caption}</p>
          {image.description && (
            <p className="lightbox-description">{image.description}</p>
          )}
          <span>
            {image.credit}
            {image.source ? (
              <>
                {" "}
                ·{" "}
                <a href={image.source} target="_blank" rel="noreferrer">
                  Original source
                </a>
              </>
            ) : null}
          </span>
        </div>
        <button
          className="icon-button"
          onClick={() => move(1)}
          aria-label="Next image"
          disabled={images.length < 2}
        >
          ›
        </button>
      </div>
    </motion.div>,
    document.body,
  );
}
