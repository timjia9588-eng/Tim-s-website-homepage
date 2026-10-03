import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { projects } from "./data/projects";
import { connections, publications } from "./data/story";
import Portal from "./components/Portal";
import Portfolio from "./components/Portfolio";
import ProjectDetail from "./components/ProjectDetail";
import PaperDetail from "./components/PaperDetail";
import ResumePage from "./components/ResumePage";

const getProjectId = () =>
  window.location.hash.startsWith("#project/")
    ? decodeURIComponent(window.location.hash.slice(9))
    : null;
const getView = () =>
  window.location.hash === "#resume"
    ? "resume"
    : !window.location.hash || window.location.hash === "#globe"
      ? "globe"
      : "simple";
const sectionTarget = (hash: string) =>
  ["#practice", "#studies", "#research-work"].includes(hash)
    ? "work"
    : hash === "#story"
      ? "about"
      : hash === "#simple"
        ? "top"
        : hash.slice(1);

export default function App() {
  const [projectId, setProjectId] = useState(getProjectId);
  const [paperId, setPaperId] = useState(() =>
    window.location.hash.startsWith("#paper/")
      ? window.location.hash.slice(7)
      : null,
  );
  const [view, setView] = useState(getView);
  const returnHash = useRef(
    window.location.hash.startsWith("#project/")
      ? "#work"
      : window.location.hash.startsWith("#paper/")
        ? "#research"
        : window.location.hash || "#globe",
  );
  useEffect(() => {
    const update = () => {
      setProjectId(getProjectId());
      setPaperId(
        window.location.hash.startsWith("#paper/")
          ? window.location.hash.slice(7)
          : null,
      );
      if (
        !window.location.hash.startsWith("#project/") &&
        !window.location.hash.startsWith("#paper/")
      ) {
        returnHash.current = window.location.hash || "#globe";
        setView(getView());
        requestAnimationFrame(() =>
          document
            .getElementById(sectionTarget(window.location.hash))
            ?.scrollIntoView(),
        );
      }
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(
        sectionTarget(window.location.hash),
      );
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [view]);
  const active = projects.find((p) => p.id === projectId);
  const activePaper = publications.find((p) => p.id === paperId);
  useEffect(() => {
    document.title = active
      ? `${active.title} — Tim Jia`
      : activePaper
        ? `${activePaper.shortTitle} — Tim Jia`
        : view === "resume"
          ? "Resume — Tim Jia"
          : "Tim Jia — Landscape design & research";
  }, [active, activePaper, view]);
  const close = () => {
    window.history.replaceState(null, "", returnHash.current);
    setProjectId(null);
    setPaperId(null);
  };
  const related = active
    ? (connections[active.id] || []).flatMap((id) => {
        const project = projects.find((p) => p.id === id);
        return project ? [project] : [];
      })
    : [];
  return (
    <>
      <div
        id="page-content"
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest("a");
          if (link?.getAttribute("href") === "#simple")
            document.getElementById("top")?.scrollIntoView();
          if (link?.getAttribute("href") === "#work")
            window.dispatchEvent(new Event("show-all-work"));
          if (
            link?.getAttribute("href")?.startsWith("#project/") ||
            link?.getAttribute("href")?.startsWith("#paper/")
          )
            returnHash.current = window.location.hash || "#globe";
        }}
      >
        <a className="skip-link" href="#work">
          Skip to selected work
        </a>
        {view === "globe" ? (
          <Portal />
        ) : view === "resume" ? (
          <ResumePage />
        ) : (
          <Portfolio />
        )}
      </div>
      <AnimatePresence mode="wait">
        {active && (
          <ProjectDetail
            key="project-detail"
            project={active}
            related={related || []}
            next={projects[(projects.indexOf(active) + 1) % projects.length]}
            onClose={close}
          />
        )}
        {activePaper && (
          <PaperDetail key="paper-detail" paper={activePaper} onClose={close} />
        )}
      </AnimatePresence>
    </>
  );
}
