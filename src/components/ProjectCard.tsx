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
            →
          </span>
        </div>
      </a>
    </motion.article>
  );
}
