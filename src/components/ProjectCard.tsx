import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "../types";
import ProjectPreview from "./ProjectPreview";
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className="project-card"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={
        reduced ? undefined : { y: -4, transition: { duration: 0.3, delay: 0 } }
      }
      viewport={{ once: true }}
      transition={{
        duration: reduced ? 0 : 0.75,
        delay: reduced ? 0 : (index % 2) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <a
        href={`#project/${project.id}`}
        className="project-card-link"
        aria-label={`View ${project.title}`}
      >
        <ProjectPreview project={project} />
        <div className="card-copy">
          <div className="card-eyebrow">
            <span className="context-label">
              {project.category === "Studio"
                ? "Academic design"
                : project.category === "Personal"
                  ? "Independent work"
                  : project.category === "Professional"
                    ? "Professional practice"
                    : "Research"}
            </span>
            <span>{project.organization}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
          {!project.cover && (
            <p className="record-summary">{project.description[0]}</p>
          )}
          <div className="card-meta">
            <span>{project.location}</span>
            <span>{project.year}</span>
          </div>
          <span className="card-read">
            {project.category === "Research"
              ? "Explore the research"
              : "View project"}{" "}
            <span className="link-arrow" aria-hidden="true">
              →
            </span>
          </span>
        </div>
      </a>
    </motion.article>
  );
}
