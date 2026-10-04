import type { Project } from "../types";
import dimensions from "../data/image-sizes.json";

const sizes = dimensions as Record<string, { width: number; height: number }>;

/** A reading-size preview; complete research figures stay on the project page. */
export default function ProjectPreview({ project }: { project: Project }) {
  if (project.id === "xiaozhou") {
    return (
      <div
        className="project-preview project-preview--relationships"
        role="img"
        aria-label="Xiaozhou research: overlapping needs of tourism, everyday life and heritage protection, based on Tim's original diagram"
      >
        <svg viewBox="0 0 640 400" aria-hidden="true">
          <circle cx="320" cy="144" r="115" />
          <circle cx="232" cy="256" r="115" />
          <circle cx="408" cy="256" r="115" />
        </svg>
        <span className="relationship-tourism">Tourism</span>
        <span className="relationship-living">Everyday life</span>
        <span className="relationship-heritage">Heritage</span>
      </div>
    );
  }
  const src = project.preview?.src || project.cover;
  if (!src) return null;
  const size = sizes[src];
  const smallWidth = size
    ? Math.round(size.width * Math.min(1, 800 / size.width, 800 / size.height))
    : 0;
  // The document studies keep their full geographic extent in the preview.
  const drawing = ["parking", "carbon", "wetland-utopia", "bamboo"].includes(
    project.id,
  );
  return (
    <div
      className={`project-preview ${drawing ? "project-preview--drawing" : ""}`}
    >
      <img
        src={src}
        srcSet={
          size && smallWidth < size.width
            ? `${src.replace(".webp", "-small.webp")} ${smallWidth}w, ${src} ${size.width}w`
            : undefined
        }
        sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) 44vw, 430px"
        width={size?.width}
        height={size?.height}
        alt={project.preview?.alt || project.coverAlt}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
