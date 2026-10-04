import { projects } from "../data/projects";
import { publications, practice, teaching } from "../data/story";
import SiteHeader from "./SiteHeader";

function ResumeContent() {
  const research = projects.filter(
    (p) => p.category === "Research" && p.id !== "xiaozhou",
  );
  return (
    <section className="resume-section section-space" id="resume">
      <div className="page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Resume</p>
            <h1>
              A practice shaped
              <br />
              <span>by curiosity.</span>
            </h1>
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
                  <a href={`#paper/${p.id}`}>{p.title} ↗</a>
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
              <p><a href="#project/envision-resilience">Envision Resilience</a></p>
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

export default function ResumePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ResumeContent />
      </main>
      <footer className="resume-footer page-width">
        <a className="text-link" href="#work">
          Back to all work →
        </a>
        <a href="mailto:tj263@cornell.edu">tj263@cornell.edu</a>
      </footer>
    </>
  );
}
