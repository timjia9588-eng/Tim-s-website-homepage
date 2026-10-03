import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "../types";
import imageSizes from "../data/image-sizes.json";
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduced = useReducedMotion();
  const size = imageSizes[project.cover as keyof typeof imageSizes];
  const smallWidth = size
    ? Math.round(size.width * Math.min(1, 800 / size.width, 800 / size.height))
    : 0;
  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 2) * 0.06 }}
    >
      <a
        href={`#project/${project.id}`}
        className="project-card-link"
        aria-label={`View ${project.title}`}
      >
        <div
          className={`card-image ${project.id === "parking" || project.id === "salinity" ? "card-image--drawing" : ""}`}
        >
          <img
            src={project.cover}
            srcSet={
              size && size.width > 800
                ? `${project.cover?.replace(".webp", "-small.webp")} ${smallWidth}w, ${project.cover} ${size.width}w`
                : undefined
            }
            sizes="(max-width: 700px) 92vw, (max-width: 1200px) 46vw, 570px"
            width={size?.width}
            height={size?.height}
            alt={project.coverAlt}
            loading="lazy"
            decoding="async"
          />
          <span className="card-category">{project.category}</span>
          <span className="card-open" aria-hidden="true">
            +
          </span>
        </div>
        <div className="card-copy">
          <div className="card-eyebrow">{project.organization}</div>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
          <div className="card-meta">
            <span>{project.location}</span>
            <span>{project.year}</span>
          </div>
        </div>
      </a>
    </motion.article>
  );
}
