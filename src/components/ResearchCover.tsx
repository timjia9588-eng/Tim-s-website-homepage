import type { Publication } from "../data/story";

/** Editorial covers identify writing without implying authorship of a photographed building. */
export default function ResearchCover({
  paper,
  compact = false,
}: {
  paper: Publication;
  compact?: boolean;
}) {
  return (
    <div
      className={`research-cover research-cover--${paper.id} ${compact ? "research-cover--compact" : ""}`}
    >
      <div className="research-cover-top">
        <span>{compact ? "Working paper" : "Research / Working paper"}</span>
        {!compact && <span>{paper.date}</span>}
      </div>
      <div className="research-cover-body">
        <h3>{paper.shortTitle}</h3>
        <p>{paper.question}</p>
      </div>
      <div className="research-cover-bottom">
        <span>Harvard Project Zero</span>
        {!compact && <span>Co-author</span>}
      </div>
    </div>
  );
}
