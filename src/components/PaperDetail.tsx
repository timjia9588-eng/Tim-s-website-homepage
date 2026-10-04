import { motion, useReducedMotion } from "framer-motion";
import { useDialog } from "../hooks/useDialog";
import { projects } from "../data/projects";
import type { Publication } from "../data/story";
import { contentTransition } from "../motion";

export default function PaperDetail({
  paper,
  onClose,
}: {
  paper: Publication;
  onClose: () => void;
}) {
  const ref = useDialog(onClose, "page-content");
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      data-dialog
      role="dialog"
      aria-modal="true"
      aria-labelledby="paper-title"
      tabIndex={-1}
      className="project-dialog paper-dialog"
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ ...contentTransition, duration: reduced ? 0 : 0.95 }}
    >
      <header className="detail-nav">
        <button className="detail-back" onClick={onClose}>
          Back to overview
        </button>
        <span>Research / Harvard Project Zero</span>
        <button className="detail-close" data-autofocus onClick={onClose}>
          Close <span aria-hidden="true">×</span>
        </button>
      </header>
      <article className="paper-article page-width">
        <div className="paper-masthead">
          <p className="eyebrow">Working paper · {paper.date}</p>
          <h1 id="paper-title">{paper.shortTitle}</h1>
          <p className="paper-question">{paper.question}</p>
          <p className="paper-authors">{paper.authors}</p>
          <div className="paper-meta">
            <span>My role: co-author & research assistant</span>
            <span>Designing Learning Places Lab</span>
          </div>
        </div>
        <div className="paper-reading">
          <aside>
            <p className="eyebrow">In this article</p>
            {[
              { id: "paper-why", label: "Why this question" },
              { id: "paper-approach", label: "How we approached it" },
              { id: "paper-ideas", label: "Ideas to carry forward" },
              { id: "paper-design", label: "In my design practice" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: reduced ? "instant" : "smooth",
                  })
                }
              >
                {item.label}
              </button>
            ))}
          </aside>
          <div>
            <section id="paper-why">
              <p className="eyebrow">01 / The question</p>
              <h2>Why this research?</h2>
              <p>{paper.why}</p>
            </section>
            <section id="paper-approach">
              <p className="eyebrow">02 / The approach</p>
              <h2>Bringing disciplines together.</h2>
              <p>{paper.approach}</p>
            </section>
            <section id="paper-ideas">
              <p className="eyebrow">03 / Ideas to carry forward</p>
              <h2>Place is part of the experience.</h2>
              <div className="paper-insights">
                {paper.insights.map((idea, i) => (
                  <div key={idea.title}>
                    <span>0{i + 1}</span>
                    <h3>{idea.title}</h3>
                    <p>{idea.text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section id="paper-design">
              <p className="eyebrow">04 / A connection to my practice</p>
              <h2>From inquiry to design.</h2>
              <p>{paper.relevance}</p>
              <small>
                This is my reflection on the research and its connection to my
                design work.
              </small>
            </section>
            <section className="paper-original">
              <p className="eyebrow">Continue reading</p>
              <h2>The full working paper.</h2>
              <p>{paper.title}</p>
              <a
                className="button-primary"
                href={paper.pdf}
                target="_blank"
                rel="noreferrer"
              >
                Read the original paper ↗
              </a>
              <a
                className="text-link"
                href={paper.url}
                target="_blank"
                rel="noreferrer"
              >
                Project Zero publication page ↗
              </a>
            </section>
          </div>
        </div>
        <section className="paper-related">
          <p className="eyebrow">Related design explorations</p>
          <h2>The questions continue.</h2>
          <div>
            {paper.related.map((id) => {
              const p = projects.find((p) => p.id === id)!;
              return (
                <a key={id} href={`#project/${id}`}>
                  {p.cover && (
                    <img
                      src={p.cover.replace(".webp", "-small.webp")}
                      alt={p.coverAlt}
                      loading="lazy"
                    />
                  )}
                  <span>{p.title}</span>
                  <small>{p.subtitle}</small>
                </a>
              );
            })}
          </div>
        </section>
      </article>
    </motion.div>
  );
}
