import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { places, projects } from "../data/projects";
import { chapters } from "../data/story";
import type { Theme } from "../types";
const Globe = lazy(() => import("./Globe"));

export default function Portal() {
  const [selected, setSelected] = useState("");
  const [theme, setTheme] = useState<Theme | null>(null);
  const [menu, setMenu] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const placesToggle = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const place = places.find((p) => p.id === selected);
  const work = projects.filter((p) => place?.projectIds.includes(p.id));
  const chapter = chapters.find((c) => c.theme === theme);
  const select = (id: string) => {
    trigger.current = document.activeElement as HTMLElement;
    setSelected(id);
    setMenu(false);
  };
  const close = () => {
    setSelected("");
    (trigger.current?.isConnected
      ? trigger.current
      : placesToggle.current
    )?.focus();
  };
  useEffect(() => {
    if (selected) closeButton.current?.focus();
  }, [selected]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !document.querySelector('[aria-modal="true"]')
      ) {
        setMenu(false);
        setSelected("");
        (trigger.current?.isConnected
          ? trigger.current
          : placesToggle.current
        )?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  return (
    <main id="globe" className="globe-portal immersive-portal">
      <div className="portal-globe">
        <Suspense
          fallback={
            <div className="globe-loading">Tracing a world of connections…</div>
          }
        >
          <Globe selected={selected} onSelect={select} theme={theme} />
        </Suspense>
      </div>
      <header className="portal-header">
        <div className="portal-identity">
          <a href="#globe">TIM JIA</a>
          <p>Landscape designer & researcher</p>
          <div
            className="portal-lenses"
            role="group"
            aria-label="Explore narrative themes"
          >
            {chapters.map((c) => (
              <button
                key={c.theme}
                aria-pressed={theme === c.theme}
                onClick={() =>
                  setTheme((v) => (v === c.theme ? null : c.theme))
                }
              >
                {c.theme}
              </button>
            ))}
          </div>
        </div>
        <nav aria-label="Globe navigation">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#resume">Resume ↗</a>
          <button
            ref={placesToggle}
            className="places-toggle"
            aria-expanded={menu}
            aria-controls="places-menu"
            onClick={() => setMenu((v) => !v)}
          >
            Places {menu ? "−" : "+"}
          </button>
        </nav>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="places-menu"
            id="places-menu"
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <label htmlFor="place-select">Follow a place</label>
            <select
              id="place-select"
              value={selected}
              onChange={(e) => select(e.target.value)}
            >
              <option value="" disabled>
                Select a place
              </option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="place-menu-list">
              {places.map((p) => (
                <button key={p.id} onClick={() => select(p.id)}>
                  {p.label}
                  <span>↗</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {place && (
          <motion.aside
            className="place-panel"
            aria-labelledby="place-title"
            initial={{ opacity: 0, x: reduced ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : 20 }}
          >
            <button
              ref={closeButton}
              className="place-panel-close"
              onClick={close}
              aria-label="Close place details"
            >
              ×
            </button>
            <p className="eyebrow">A place in my practice</p>
            <h1 id="place-title">{place.label}</h1>
            <p className="place-context">{place.description}</p>
            <p className="place-narrative">{place.narrative}</p>
            <div className="place-projects">
              {work.map((p) => (
                <a href={`#project/${p.id}`} key={p.id}>
                  <div>
                    <small>
                      {p.category === "Professional"
                        ? "Professional practice"
                        : p.category === "Research"
                          ? "Research"
                          : "Studies & personal"}
                    </small>
                    <span>{p.title}</span>
                  </div>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            {!work.length && (
              <a className="portal-text-link" href="#resume">
                Read the experience in my resume ↗
              </a>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
      <div
        className={`portal-narrative ${place ? "has-panel" : ""}`}
        aria-live="polite"
      >
        <p className="portal-question">
          {chapter?.question || "What connects us to place?"}
        </p>
        <p>
          {theme === "Systems"
            ? "Reading the living processes beneath the surface."
            : theme === "Networks"
              ? "Following relationships between people, learning and place."
              : theme === "Landscapes"
                ? "Making those relationships tangible in everyday life."
                : "An exploration of systems, networks and landscapes."}
        </p>
        <a href="#story">Follow the story ↗</a>
      </div>
      <div className="portal-bottom">
        <a className="simplistic-link" href="#simple">
          Simplistic version ↗
        </a>
        <span className="portal-interaction-hint">
          Drag to rotate · Hover to pause · Select a place
        </span>
        <span className="portal-signature">Tianzhen (Tim) Jia</span>
      </div>
    </main>
  );
}
