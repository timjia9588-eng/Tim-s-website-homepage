import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "../types";
import { useDialog } from "../hooks/useDialog";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";
export default function ProjectDetail({
  project,
  next,
  related,
  onClose,
}: {
  project: Project;
  next: Project;
  related: Project[];
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
          credit:
            project.category === "Professional"
              ? project.organization
              : "Tianzhen (Tim) Jia",
        },
        ...project.images,
      ]
    : project.images;
  const galleryImages = project.images.filter(
    (image) => image.src !== project.cover,
  );
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
              onClick={() =>
                setLightbox(
                  viewerImages.findIndex(
                    (image) => image.src === project.cover,
                  ),
                )
              }
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
                View the public project source ↗
              </a>
            ) : null}
            {project.links?.map((link) => (
              <a
                className="source-link"
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label} ↗
              </a>
            ))}
            {project.note ? (
              <p className="detail-note">{project.note}</p>
            ) : null}
          </div>
        </div>
        {galleryImages.length ? (
          <section
            className="detail-gallery page-width"
            aria-label="Project documentation"
          >
            <div className="gallery-header">
              <h2>Inside the project.</h2>
              <span>
                {galleryImages.length}{" "}
                {galleryImages.length === 1 ? "image" : "images"} · Select to
                enlarge
              </span>
            </div>
            {galleryImages.map((image, i) => (
              <Reveal key={image.src}>
                <figure>
                  <button
                    className="gallery-image"
                    onClick={() =>
                      setLightbox(
                        viewerImages.findIndex(
                          (item) => item.src === image.src,
                        ),
                      )
                    }
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
        <section
          className="detail-connections page-width"
          aria-label="Connections across my work"
        >
          <p className="eyebrow">{project.themes.join(" / ")}</p>
          <h2>How this connects.</h2>
          <p>{project.connection}</p>
          <div>
            {related.map((p) => (
              <a key={p.id} href={`#project/${p.id}`}>
                <small>{p.category}</small>
                <span>{p.title} ↗</span>
              </a>
            ))}
          </div>
        </section>
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
