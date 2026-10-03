import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { projects, places } from "./data/projects";
import type { Category } from "./types";
import Reveal from "./components/Reveal";
import ProjectCard from "./components/ProjectCard";
import ProjectDetail from "./components/ProjectDetail";
const Globe = lazy(() => import("./components/Globe"));
const categories = [
  "All work",
  "Professional",
  "Studio",
  "Research",
  "Personal",
] as const;
type Filter = "All work" | Category;
const getProjectId = () =>
  window.location.hash.startsWith("#project/")
    ? decodeURIComponent(window.location.hash.slice(9))
    : null;
const getView = () =>
  ["#simple", "#top", "#work", "#about", "#contact"].includes(window.location.hash)
    ? "simple"
    : "globe";

function Header() {
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const close = () => setMenu(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);
  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <a className="wordmark" href="#top" aria-label="Tim Jia home">
          tim jia<span className="wordmark-period">.</span>
        </a>
        <div className="desktop-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#globe">Globe</a>
          <a href="#contact">Contact</a>
        </div>
        <a
          className="nav-resume"
          href="/downloads/Tim-Jia-Resume.docx"
          download
        >
          Resume <span>DOCX</span>
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
        {menu ? (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {["Work", "About", "Globe", "Contact"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setMenu(false)}
              >
                {label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 70]);
  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-intro page-width">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Tianzhen (Tim) Jia · Landscape designer & researcher
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Designing places.
          <br />
          <span>Connecting systems.</span>
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Landscape architecture, environmental science,
          <br className="desktop-break" /> and the ways we learn from place.
        </motion.p>
        <motion.div
          className="hero-links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <a className="button-primary" href="#work">
            Explore my work
          </a>
          <a className="text-link" href="#about">
            A little about me
          </a>
        </motion.div>
      </div>
      <motion.div
        className="hero-frame"
        initial={{ opacity: 0, y: reduced ? 0 : 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 1 }}
      >
        <a
          className="hero-image-link"
          href="#project/phillips"
          aria-label="View Phillips Quarry Park"
        >
          <motion.img
            style={{ y: imageY }}
            src="/images/phillips/cover.webp"
            alt="Phillips Quarry Park — a public landscape around a quarry lake"
            fetchPriority="high"
          />
          <div className="hero-image-shade" />
          <div className="hero-image-caption">
            <div>
              <span>Featured professional work · Urban Alchemy Collective</span>
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
        <span>Landscapes / Systems / Connections</span>
        <a
          href="https://urbanalchemycollective.com/projects/phillips-quarry-park/"
          target="_blank"
          rel="noreferrer"
        >
          Image © Urban Alchemy Collective · Original source
        </a>
      </div>
    </section>
  );
}

function Work() {
  const [filter, setFilter] = useState<Filter>("All work");
  const visible = projects.filter(
    (p) => (filter === "All work" || p.category === filter) && p.cover,
  );
  const experience = projects.filter(
    (p) => (filter === "All work" || p.category === filter) && !p.cover,
  );
  return (
    <section className="work-section section-space" id="work">
      <div className="page-width">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>
              Different scales.
              <br />
              <span>Connected thinking.</span>
            </h2>
          </div>
          <p>
            From the systems beneath our feet
            <br />
            to the places we share.
          </p>
        </Reveal>
        <div className="work-controls">
          <div
            className="filter-group"
            role="group"
            aria-label="Filter projects"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={filter === cat ? "active" : ""}
                aria-pressed={filter === cat}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="work-count" aria-live="polite">
            {visible.length + experience.length} projects
          </span>
        </div>
        <div className="project-grid" key={filter}>
          {visible.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
        {experience.length ? (
          <div className="experience-archive">
            <div className="archive-heading">
              <h3>More experience.</h3>
              <p>Projects, collaborations, and research from my practice.</p>
            </div>
            <div className="archive-grid">
              {experience.map((p) => (
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
        ) : null}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section section-space" id="about">
      <div className="page-width">
        <Reveal className="about-heading">
          <p className="eyebrow">A little about me</p>
          <h2>
            Curious about place.
            <br />
            <span>Grounded in ecology.</span>
          </h2>
        </Reveal>
        <div className="about-layout">
          <Reveal className="about-copy">
            <p className="about-lead">
              I’m Tim, a landscape designer whose work brings ecological
              systems, public space, and learning into the same conversation.
            </p>
            <p>
              I hold a Master in Landscape Architecture from Harvard GSD and a
              BS in Environment & Sustainability from Cornell. Today, I work at
              Urban Alchemy Collective in San Antonio, developing public parks,
              sports facilities, and urban landscapes.
            </p>
            <p>
              My background spans design studios, environmental research, and
              learning environments at Harvard Project Zero. Across these
              settings, I’m interested in how places support both living systems
              and the people who use them.
            </p>
            <div className="about-downloads">
              <a
                className="button-primary"
                href="/downloads/Tim-Jia-Resume.docx"
                download
              >
                Download resume <small>DOCX</small>
              </a>
              <a
                className="text-link"
                href="/downloads/Tim-Jia-Portfolio.pdf"
                download
              >
                Portfolio <span>PDF · 8 MB</span>
              </a>
            </div>
          </Reveal>
          <Reveal className="education-block" delay={0.1}>
            <div className="education-entry">
              <span className="education-year">2025</span>
              <h3>Harvard GSD</h3>
              <p>Master in Landscape Architecture I AP</p>
            </div>
            <div className="education-entry">
              <span className="education-year">2023</span>
              <h3>Cornell University</h3>
              <p>
                BS, Environment & Sustainability
                <br />
                Minor in Landscape Studies
              </p>
              <span className="education-honors">
                Summa Cum Laude · Distinction in Research
              </span>
            </div>
            <div className="about-award">
              <span className="eyebrow">Recognition</span>
              <p>
                BSLA 2025 Honor Award for Student Work
                <br />
                <span>Envision Resilience</span>
              </p>
            </div>
          </Reveal>
        </div>
        <Reveal className="skills-row">
          <div>
            <span>Design & documentation</span>
            <p>AutoCAD · Land F/X · Revit</p>
          </div>
          <div>
            <span>Visualization & modeling</span>
            <p>Rhino · SketchUp · D5 · Adobe Creative Suite</p>
          </div>
          <div>
            <span>Planning & analysis</span>
            <p>ArcGIS · QGIS · Environmental research</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Portal() {
  const [selected, setSelected] = useState("uac");
  const place = places.find((p) => p.id === selected)!;
  const work = projects.filter((p) => p.place === selected);
  return (
    <main id="globe" className="explore-section globe-portal">
      <header className="portal-header">
        <a className="wordmark" href="#globe" aria-label="Tim Jia globe home">tim jia.</a>
        <span>Landscape designer & researcher</span>
        <nav aria-label="Globe navigation">
          <a href="#about">About</a>
          <a href="/downloads/Tim-Jia-Resume.docx" download>Resume ↗</a>
        </nav>
      </header>
      <div className="page-width">
        <Reveal className="explore-heading">
          <p className="eyebrow">A practice across places</p>
          <h1>A world of connections.</h1>
          <p>Follow the places that have shaped my work.</p>
        </Reveal>
        <div className="explore-layout">
          <div className="globe-container">
              <Suspense
                fallback={
                  <div className="globe-loading">Preparing the globe…</div>
                }
              >
                <Globe selected={selected} onSelect={setSelected} />
              </Suspense>
            <p className="globe-hint">
              Drag to rotate · Scroll to zoom · Select a place
            </p>
          </div>
          <div className="explore-side">
            <label htmlFor="place-select">Explore a place</label>
            <select
              id="place-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {places.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h3>{place.label}</h3>
                <p className="place-description">{place.description}</p>
                <div className="place-projects">
                  {work.map((p) => (
                    <a key={p.id} href={`#project/${p.id}`}>
                      <span>{p.title}</span>
                      <span aria-hidden="true">+</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <a className="simplistic-link" href="#simple">Simplistic version <span aria-hidden="true">↗</span></a>
      <span className="portal-signature">Tianzhen (Tim) Jia · Harvard GSD / Cornell</span>
    </main>
  );
}

function Contact() {
  return (
    <footer id="contact">
      <div className="page-width">
        <Reveal className="contact-intro">
          <p className="eyebrow">Let’s connect</p>
          <h2>
            Good places begin
            <br />
            <span>with a conversation.</span>
          </h2>
          <a className="contact-email" href="mailto:tjia@gsd.harvard.edu">
            tjia@gsd.harvard.edu
          </a>
          <p>San Antonio, Texas · English & Mandarin</p>
        </Reveal>
        <div className="footer-bottom">
          <a className="wordmark" href="#top">
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
          <a href="#top">Back to top</a>
        </div>
        <p className="footer-credit">
          Professional projects were developed with the credited firms and
          collaborators. Public firm imagery is linked to its original source.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [projectId, setProjectId] = useState(getProjectId);
  const [view, setView] = useState(getView);
  useEffect(() => {
    const update = () => {
      setProjectId(getProjectId());
      if (!window.location.hash.startsWith("#project/")) setView(getView());
    };
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [view]);
  const active = projects.find((p) => p.id === projectId);
  useEffect(() => {
    document.title = active
      ? `${active.title} — Tim Jia`
      : "Tim Jia — Landscape Designer & Researcher";
  }, [active]);
  const close = () => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + (view === "globe" ? "#globe" : "#work"),
    );
    setProjectId(null);
  };
  return (
    <>
      <div id="page-content">
        <a className="skip-link" href="#work">
          Skip to selected work
        </a>
        {view === "globe" ? <Portal /> : <>
          <Header />
          <main>
            <Hero />
            <Work />
            <About />
          </main>
          <Contact />
        </>}
      </div>
      <AnimatePresence>
        {active ? (
          <ProjectDetail
            key="project-detail"
            project={active}
            next={projects[(projects.indexOf(active) + 1) % projects.length]}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
