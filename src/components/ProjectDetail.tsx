import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project, ProjectImage } from "../types";
import dimensions from "../data/image-sizes.json";
import { useDialog } from "../hooks/useDialog";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";
import { contentTransition } from "../motion";
const imageSizes = dimensions as Record<
  string,
  { width: number; height: number }
>;
function GalleryFigure({
  image,
  number,
  onEnlarge,
}: {
  image: ProjectImage;
  number: number;
  onEnlarge: () => void;
}) {
  const size = imageSizes[image.src];
  return (
    <figure>
      <button
        className="gallery-image"
        onClick={onEnlarge}
        aria-label={`Enlarge ${image.caption}`}
      >
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          {...size}
          style={{
            width: size?.width,
            aspectRatio: size ? `${size.width} / ${size.height}` : undefined,
          }}
        />
        <span className="image-enlarge" aria-hidden="true">
          +
        </span>
      </button>
      <figcaption>
        <div className="figure-caption-text">
          <p>
            <span className="figure-index">
              {String(number).padStart(2, "0")}
            </span>
            {image.caption}
          </p>
          {image.description && (
            <p className="figure-description">{image.description}</p>
          )}
        </div>
        <span className="figure-credit">
          {image.credit}
          {image.source && (
            <>
              {" "}
              ·{" "}
              <a href={image.source} target="_blank" rel="noreferrer">
                Original source
              </a>
            </>
          )}
        </span>
      </figcaption>
      {image.legend && (
        <details className="figure-legend">
          <summary>Planting key · {image.legend.length} species</summary>
          <dl>
            {image.legend.map((entry) => (
              <div key={entry.key}>
                <dt>{entry.key}</dt>
                <dd>{entry.name}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </figure>
  );
}
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
    (image) => image.src !== (project.detailCover || project.cover),
  );
  const galleryGroups = galleryImages.reduce<
    {
      name?: string;
      description?: string;
      images: ProjectImage[];
      start: number;
    }[]
  >((groups, image, index) => {
    const previous = groups.at(-1);
    if (image.group && previous?.name === image.group)
      previous.images.push(image);
    else
      groups.push({
        name: image.group,
        description: image.groupDescription,
        images: [image],
        start: index,
      });
    return groups;
  }, []);
  const detailCover = project.detailCover || project.cover;
  const detailCoverSize = detailCover ? imageSizes[detailCover] : undefined;
  const detailCoverAlt =
    project.images.find((image) => image.src === detailCover)?.alt ||
    project.coverAlt;
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
        className={`project-dialog ${project.detailCover ? "project-dialog--board" : ""}`}
        initial={{ opacity: 0, y: reduced ? 0 : 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : 16 }}
        transition={{ ...contentTransition, duration: reduced ? 0 : 0.95 }}
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
        {detailCover ? (
          <div className="detail-cover page-width">
            <button
              onClick={() =>
                setLightbox(
                  viewerImages.findIndex((image) => image.src === detailCover),
                )
              }
              aria-label={`Enlarge ${project.title} image`}
            >
              <img
                src={detailCover}
                alt={detailCoverAlt}
                fetchPriority="high"
                {...detailCoverSize}
                style={{ width: detailCoverSize?.width }}
              />
              <span className="image-enlarge" aria-hidden="true">
                +
              </span>
            </button>
            {project.detailCover && (
              <p className="presentation-note">
                Complete competition board · Select to enlarge, then use Zoom in
                for details
              </p>
            )}
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
            {galleryGroups.map((group) => (
              <div
                key={group.images[0].src}
                className={group.name ? "gallery-group" : undefined}
              >
                {group.name && (
                  <div className="gallery-group-intro">
                    <h3>{group.name}</h3>
                    {group.description && <p>{group.description}</p>}
                  </div>
                )}
                <div
                  className={
                    group.name
                      ? `gallery-comparison ${group.images.length > 4 ? "gallery-comparison--three" : ""}`
                      : undefined
                  }
                >
                  {group.images.map((image, i) => (
                    <Reveal key={image.src}>
                      <GalleryFigure
                        image={image}
                        number={group.start + i + 1}
                        onEnlarge={() =>
                          setLightbox(
                            viewerImages.findIndex(
                              (item) => item.src === image.src,
                            ),
                          )
                        }
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}
        <section
          className="detail-connections page-width"
          aria-label="Connections across my work"
        >
          <p className="eyebrow">Related work</p>
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
