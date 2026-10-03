import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "../data/projects";
import { chapters, publications, practice, teaching } from "../data/story";
import type { Theme } from "../types";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";

type Section = "practice" | "studies" | "research";
const sections: { id: Section; label: string; title: string; text: string }[] =
  [
    {
      id: "practice",
      label: "Professional practice",
      title: "Ideas, carried into practice.",
      text: "Collaborative work with professional teams. Each project names my role and links to publicly available project material.",
    },
    {
      id: "studies",
      label: "Studies & personal work",
      title: "A space to test possibilities.",
      text: "School studios, independent design, a built garden and a traveling sketchbook. These works make room for experimentation across scales.",
    },
    {
      id: "research",
      label: "Research & publications",
      title: "Questions that travel across disciplines.",
      text: "From forests and fungal networks to learning environments, my research asks how relationships shape the places we inhabit.",
    },
  ];
const getSection = (): Section =>
  window.location.hash === "#studies"
    ? "studies"
    : window.location.hash === "#research"
      ? "research"
      : "practice";

function Header() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const close = () => setMenu(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);
  const links = [
    { label: "Story", href: "#story" },
    { label: "Work", href: "#work" },
    { label: "Research", href: "#research" },
    { label: "Globe", href: "#globe" },
  ];
  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <a className="wordmark" href="#simple" aria-label="Tim Jia home">
          tim jia<span className="wordmark-period">.</span>
        </a>
        <div className="desktop-links">
          {links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a className="nav-resume" href="#resume">
          Resume ↗
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenu((v) => !v)}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>
      </nav>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {links.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="hero" id="top">
      <div className="hero-intro page-width">
        <p className="eyebrow">
          Tianzhen (Tim) Jia · Landscape designer & researcher
        </p>
        <motion.h1
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Places begin
          <br />
          <span>with relationships.</span>
        </motion.h1>
        <p className="hero-description">
          I study what sustains a place, how it connects us,
          <br className="desktop-break" /> and how design can make those
          connections tangible.
        </p>
        <div className="hero-links">
          <a className="button-primary" href="#story">
            Follow the story
          </a>
          <a className="text-link" href="#work">
            Browse the work
          </a>
        </div>
      </div>
      <motion.div
        className="hero-frame"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <a
          className="hero-image-link"
          href="#project/phillips"
          aria-label="View Phillips Quarry Park"
        >
          <img
            src="/images/phillips/cover.webp"
            alt="Public park proposal around a quarry lake in Melissa, Texas"
            fetchPriority="high"
          />
          <div className="hero-image-shade" />
          <div className="hero-image-caption">
            <div>
              <span>Professional practice · Urban Alchemy Collective</span>
              <h2>Phillips Quarry Park</h2>
              <p>Melissa, Texas</p>
            </div>
            <span className="hero-open" aria-hidden="true">
              +
            </span>
          </div>
        </a>
      </motion.div>
      <div className="hero-footnote">
        <span>From ecological systems to everyday landscapes</span>
        <a
          href="https://urbanalchemycollective.com/projects/phillips-quarry-park/"
          target="_blank"
          rel="noreferrer"
        >
          Image © Urban Alchemy Collective · Original source ↗
        </a>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="story-section section-space" id="story">
      <div className="page-width">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">One practice, three connected questions</p>
            <h2>
              Systems. Networks.
              <br />
              <span>Landscapes.</span>
            </h2>
          </div>
          <p>
            Ways of thinking that connect my work,
            <br /> across research, school and practice.
          </p>
        </Reveal>
        <div className="story-chapters">
          {chapters.map((c, i) => (
            <Reveal key={c.theme} className="story-chapter" delay={i * 0.08}>
              <div className="chapter-number">
                0{i + 1} / {c.theme}
              </div>
              <p className="chapter-question">{c.question}</p>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <div className="chapter-route">
                {c.projects.map((id) => {
                  const p = projects.find((p) => p.id === id)!;
                  return (
                    <a key={id} href={`#project/${id}`}>
                      <span>{p.title}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="story-transition">
          These questions overlap. The sections below make it easier to see
          where the work was developed and the role I played.
        </p>
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section className="publications" aria-labelledby="publications-title">
      <div className="archive-heading">
        <h3 id="publications-title">Writing on learning & place.</h3>
        <p>Two working papers from Harvard Project Zero · Co-author, 2024</p>
      </div>
      {publications.map((p, i) => (
        <article className="publication" key={p.title}>
          <span className="publication-number">0{i + 1}</span>
          <div>
            <p className="eyebrow">
              {p.kind} · {p.date}
            </p>
            <h4>
              <a href={p.url} target="_blank" rel="noreferrer">
                {p.title} ↗
              </a>
            </h4>
            <p>{p.summary}</p>
            <p className="publication-authors">{p.authors}</p>
            <div className="publication-links">
              <a href={p.url} target="_blank" rel="noreferrer">
                Publication page ↗
              </a>
              <a href={p.pdf} target="_blank" rel="noreferrer">
                Read paper ↗
              </a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function Work() {
  const [section, setSection] = useState<Section>(getSection);
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const update = () => {
      if (
        ["#practice", "#studies", "#research", "#work"].includes(
          window.location.hash,
        )
      ) {
        setSection(getSection());
        setTheme(null);
      }
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const selected = sections.find((s) => s.id === section)!;
  const work = projects.filter(
    (p) =>
      (section === "practice"
        ? p.category === "Professional"
        : section === "research"
          ? p.category === "Research"
          : p.category === "Studio" || p.category === "Personal") &&
      (!theme || p.themes.includes(theme)),
  );
  const images = work.filter((p) => p.cover),
    records = work.filter((p) => !p.cover);
  return (
    <section className="work-section section-space" id="work">
      <div className="page-width">
        <div
          className="collection-tabs"
          role="tablist"
          aria-label="Browse by work context"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              id={`tab-${s.id}`}
              role="tab"
              aria-selected={section === s.id}
              aria-controls="collection-panel"
              tabIndex={section === s.id ? 0 : -1}
              onClick={() => {
                setSection(s.id);
                setTheme(null);
                window.history.replaceState(null, "", `#${s.id}`);
              }}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const index = sections.findIndex((x) => x.id === s.id);
                  const next =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : (index + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                  setSection(sections[next].id);
                  setTheme(null);
                  window.history.replaceState(
                    null,
                    "",
                    `#${sections[next].id}`,
                  );
                  document.getElementById(`tab-${sections[next].id}`)?.focus();
                }
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div
          id="collection-panel"
          role="tabpanel"
          aria-labelledby={`tab-${section}`}
          tabIndex={0}
        >
          <div className="collection-intro">
            <p className="eyebrow">{selected.label}</p>
            <h2>{selected.title}</h2>
            <p>{selected.text}</p>
          </div>
          {section === "research" && <Publications />}
          <div className="work-controls">
            <div
              className="filter-group"
              role="group"
              aria-label="Filter by narrative theme"
            >
              <button
                aria-pressed={!theme}
                className={!theme ? "active" : ""}
                onClick={() => setTheme(null)}
              >
                All themes
              </button>
              {chapters.map((c) => (
                <button
                  key={c.theme}
                  aria-pressed={theme === c.theme}
                  className={theme === c.theme ? "active" : ""}
                  onClick={() => setTheme(c.theme)}
                >
                  {c.theme}
                </button>
              ))}
            </div>
            <span className="work-count" aria-live="polite">
              {work.length} projects
            </span>
          </div>
          <div className="project-grid" key={`${section}-${theme}`}>
            {images.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
          {!!records.length && (
            <div className="experience-archive">
              <div className="archive-heading">
                <h3>
                  {section === "research"
                    ? "Research & collaborations."
                    : "Further project experience."}
                </h3>
              </div>
              <div className="archive-grid">
                {records.map((p) => (
                  <a
                    href={`#project/${p.id}`}
                    key={p.id}
                    className="archive-item"
                  >
                    <span className="eyebrow">{p.organization}</span>
                    <h4>{p.title}</h4>
                    <p>{p.role}</p>
                    <span className="archive-year">{p.year}</span>
                    <span className="archive-plus" aria-hidden="true">
                      +
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Resume() {
  const research = projects.filter(
    (p) => p.category === "Research" && p.id !== "xiaozhou",
  );
  return (
    <section className="resume-section section-space" id="resume">
      <div className="page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Resume / About</p>
            <h2>
              A practice shaped
              <br />
              <span>by curiosity.</span>
            </h2>
          </div>
          <p>
            Landscape architecture, environmental
            <br />
            science and learning environments.
          </p>
        </div>
        <div className="resume-intro">
          <p>
            I’m Tianzhen (Tim) Jia, a landscape designer and researcher based in
            San Antonio. My work connects ecological systems, public space and
            the ways people learn from place.
          </p>
          <a href="mailto:tj263@cornell.edu">tj263@cornell.edu ↗</a>
        </div>
        <div className="resume-block">
          <h3>Education</h3>
          <div className="resume-entries">
            <article>
              <span>2023–2025</span>
              <h4>Harvard Graduate School of Design</h4>
              <p>Master in Landscape Architecture I AP</p>
            </article>
            <article>
              <span>2020–2023</span>
              <h4>Cornell University</h4>
              <p>
                BS, Environment & Sustainability · Minor in Landscape Studies
              </p>
              <p>Summa Cum Laude · Distinction in Research</p>
            </article>
            <article>
              <span>2020–2021</span>
              <h4>Tsinghua University</h4>
              <p>Study-away coursework · School of Architecture</p>
            </article>
          </div>
        </div>
        <div className="resume-block">
          <h3>Professional experience</h3>
          <div className="resume-entries">
            {practice.map((p) => (
              <article key={p.name}>
                <span>{p.date}</span>
                <h4>{p.name}</h4>
                <p className="resume-role">
                  {p.role} · {p.place}
                </p>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="resume-block">
          <h3>Research & leadership</h3>
          <div className="resume-entries">
            {research.map((p) => (
              <article key={p.id}>
                <span>{p.year}</span>
                <h4>
                  <a href={`#project/${p.id}`}>{p.title} ↗</a>
                </h4>
                <p className="resume-role">
                  {p.role} · {p.organization}
                </p>
                <p>{p.description[0]}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="resume-block">
          <h3>Publications</h3>
          <div className="resume-entries">
            {publications.map((p) => (
              <article key={p.title}>
                <span>{p.date}</span>
                <h4>
                  <a href={p.url} target="_blank" rel="noreferrer">
                    {p.title} ↗
                  </a>
                </h4>
                <p>{p.kind}</p>
                <p className="publication-authors">{p.authors}</p>
              </article>
            ))}
            <article>
              <span>2023</span>
              <h4>
                Production and Persistence of ECM Rhizomorphs and Mycelium Along
                a Soil Salinity Gradient
              </h4>
              <p>
                Undergraduate honors thesis & conference presentation · Cornell
                University
              </p>
              <p>
                8th International Symposium on Physiological Processes in Roots
                of Woody Plants
              </p>
            </article>
          </div>
        </div>
        <div className="resume-block">
          <h3>Teaching & service</h3>
          <div className="resume-entries">
            {teaching.map((t) => (
              <article key={t.name}>
                <span>{t.date}</span>
                <h4>{t.name}</h4>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="resume-block">
          <h3>Recognition & methods</h3>
          <div className="resume-entries">
            <article>
              <span>2025</span>
              <h4>BSLA Honor Award · Student Work</h4>
              <p>Envision Resilience</p>
            </article>
            <article>
              <span>2026</span>
              <h4>Bajo la Sombra · Third place</h4>
              <p>
                Organizer notification received; public announcement pending.
              </p>
            </article>
            <article>
              <h4>Design, research & communication</h4>
              <p>
                AutoCAD · Land F/X · Revit · Rhino · SketchUp · D5 · ArcGIS ·
                QGIS · Adobe Creative Suite
              </p>
              <p>
                Literature synthesis · GIS analysis · Field research ·
                Environmental science · English & Mandarin
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Story />
        <Work />
        <Resume />
      </main>
      <footer id="contact">
        <div className="page-width">
          <div className="contact-intro">
            <p className="eyebrow">Let’s connect</p>
            <h2>
              Keep the conversation
              <br />
              <span>growing.</span>
            </h2>
            <a className="contact-email" href="mailto:tj263@cornell.edu">
              tj263@cornell.edu
            </a>
            <p>San Antonio, Texas · English & Mandarin</p>
          </div>
          <div className="footer-bottom">
            <a className="wordmark" href="#simple">
              tim jia.
            </a>
            <span>© {new Date().getFullYear()} Tianzhen (Tim) Jia</span>
            <a
              href="https://github.com/timjia9588-eng/Tim-s-website-homepage"
              target="_blank"
              rel="noreferrer"
            >
              Site source
            </a>
            <a href="#globe">Return to the globe ↗</a>
          </div>
          <p className="footer-credit">
            Professional projects were developed with the credited teams.
            Published project imagery is credited and linked to its original
            source.
          </p>
        </div>
      </footer>
    </>
  );
}
