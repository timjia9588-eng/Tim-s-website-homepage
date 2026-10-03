import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "../types";
import { useDialog } from "../hooks/useDialog";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";
export default function ProjectDetail({
  project,
  next,
  onClose,
}: {
  project: Project;
  next: Project;
  onClose: () => void;
}) {
  const ref = useDialog(onClose, "page-content");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const extraCover = Boolean(
    project.cover &&
    !project.images.some((image) => image.src === project.cover),
  );
  const viewerImages = extraCover
    ? [
        {
          src: project.cover!,
          alt: project.coverAlt!,
          caption: project.title,
          source: project.source,
          credit: project.source
            ? "Urban Alchemy Collective"
            : "Tianzhen (Tim) Jia",
        },
        ...project.images,
      ]
    : project.images;
  useEffect(() => {
    setLightbox(null);
    ref.current?.scrollTo({ top: 0 });
  }, [project.id, ref]);
  return (
    <>
      <motion.div
        ref={ref}
        id="project-dialog"
        data-dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        tabIndex={-1}
        className="project-dialog"
        initial={{ opacity: 0, y: reduced ? 0 : 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : 40 }}
        transition={{ duration: 0.5 }}
      >
        <header className="detail-nav">
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            Tim Jia <span>/ Selected work</span>
          </a>
          <button className="detail-close" data-autofocus onClick={onClose}>
            Close <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="detail-intro page-width">
          <p className="eyebrow">
            {project.category} / {project.organization}
          </p>
          <h1 id="detail-title">{project.title}</h1>
          <p className="detail-subtitle">{project.subtitle}</p>
          <div className="detail-facts">
            <div>
              <span>Location</span>
              <p>{project.location}</p>
            </div>
            <div>
              <span>Year</span>
              <p>{project.year}</p>
            </div>
            <div>
              <span>My role</span>
              <p>{project.role}</p>
            </div>
          </div>
        </div>
        {project.cover ? (
          <div className="detail-cover page-width">
            <button
              onClick={() => setLightbox(0)}
              aria-label={`Enlarge ${project.title} image`}
            >
              <img
                src={project.cover}
                alt={project.coverAlt}
                fetchPriority="high"
              />
              <span className="image-enlarge" aria-hidden="true">
                +
              </span>
            </button>
          </div>
        ) : null}
        <div className="detail-story page-width">
          <div>
            <p className="eyebrow">The project</p>
            <h2>{project.tags.slice(0, 2).join(". ")}.</h2>
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="detail-story-copy">
            {project.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {project.collaborators ? (
              <p className="detail-credit">
                <strong>Team & context</strong>
                <br />
                {project.collaborators}
              </p>
            ) : null}
            {project.source ? (
              <a
                href={project.source}
                className="source-link"
                target="_blank"
                rel="noreferrer"
              >
                View the firm’s original project page
              </a>
            ) : null}
            {project.note ? (
              <p className="detail-note">{project.note}</p>
            ) : null}
          </div>
        </div>
        {project.images.length ? (
          <section
            className="detail-gallery page-width"
            aria-label="Project documentation"
          >
            <div className="gallery-header">
              <h2>Inside the project.</h2>
              <span>
                {project.images.length}{" "}
                {project.images.length === 1 ? "image" : "images"} · Select to
                enlarge
              </span>
            </div>
            {project.images.map((image, i) => (
              <Reveal key={image.src}>
                <figure>
                  <button
                    className="gallery-image"
                    onClick={() => setLightbox(i + (extraCover ? 1 : 0))}
                    aria-label={`Enlarge ${image.caption}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="image-enlarge" aria-hidden="true">
                      +
                    </span>
                  </button>
                  <figcaption>
                    <div>
                      <span className="figure-index">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {image.caption}
                    </div>
                    <span>
                      {image.credit}
                      {image.source ? (
                        <>
                          {" "}
                          ·{" "}
                          <a
                            href={image.source}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Original source
                          </a>
                        </>
                      ) : null}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </section>
        ) : null}
        <div className="next-project">
          <p className="eyebrow">Continue exploring</p>
          <a href={`#project/${next.id}`}>
            <h2>{next.title}</h2>
            <span>View next project</span>
          </a>
        </div>
      </motion.div>
      <AnimatePresence>
        {lightbox !== null ? (
          <Lightbox
            key={project.id}
            images={viewerImages}
            initial={lightbox}
            onClose={() => setLightbox(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
