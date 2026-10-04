import type { Project } from "../types";
import ProjectPreview from "./ProjectPreview";
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`project-card ${project.cover ? "project-card--image" : "project-card--record"}`}
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
          </div>
          <h3>{project.title}</h3>
          {!project.cover && <p>{project.subtitle}</p>}
          <div className="card-meta">
            <span>{project.location}</span>
          </div>
        </div>
      </a>
    </article>
  );
}
