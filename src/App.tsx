import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { projects } from "./data/projects";
import { connections } from "./data/story";
import Portal from "./components/Portal";
import Portfolio from "./components/Portfolio";
import ProjectDetail from "./components/ProjectDetail";

const getProjectId = () =>
  window.location.hash.startsWith("#project/")
    ? decodeURIComponent(window.location.hash.slice(9))
    : null;
const getView = () =>
  !window.location.hash ||
  window.location.hash === "#globe" ||
  window.location.hash.startsWith("#project/")
    ? "globe"
    : "simple";
const sectionTarget = (hash: string) =>
  ["#practice", "#studies", "#research"].includes(hash)
    ? "work"
    : hash === "#about"
      ? "resume"
      : hash === "#simple"
        ? "top"
        : hash.slice(1);

export default function App() {
  const [projectId, setProjectId] = useState(getProjectId);
  const [view, setView] = useState(getView);
  const returnHash = useRef(
    window.location.hash.startsWith("#project/")
      ? "#globe"
      : window.location.hash || "#globe",
  );
  useEffect(() => {
    const update = () => {
      setProjectId(getProjectId());
      if (!window.location.hash.startsWith("#project/")) {
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
  useEffect(() => {
    document.title = active
      ? `${active.title} — Tim Jia`
      : "Tim Jia — Systems / Networks / Landscapes";
  }, [active]);
  const close = () => {
    window.history.replaceState(null, "", returnHash.current);
    setProjectId(null);
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
          if (link?.getAttribute("href")?.startsWith("#project/"))
            returnHash.current = window.location.hash || "#globe";
        }}
      >
        <a className="skip-link" href="#work">
          Skip to selected work
        </a>
        {view === "globe" ? <Portal /> : <Portfolio />}
      </div>
      <AnimatePresence>
        {active && (
          <ProjectDetail
            key="project-detail"
            project={active}
            related={related || []}
            next={projects[(projects.indexOf(active) + 1) % projects.length]}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </>
  );
}
